const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { success, error } = require('../utils/response');
const { validate, Joi } = require('../middleware/validate');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  nim: Joi.string().max(20).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

async function register(req, res, next) {
  try {
    const { name, email, password, nim } = req.body;

    const [existingUser] = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return error(res, 'Email sudah terdaftar.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await query('SELECT UUID() as id');
    const id = userId[0][0].id;

    await query(
      'INSERT INTO users (id, name, email, password, role, nim) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email.toLowerCase(), hashedPassword, 'student', nim]
    );

    const token = jwt.sign(
      { id, name, email: email.toLowerCase(), role: 'student', nim },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    success(
      res,
      {
        user: { id, name, email: email.toLowerCase(), role: 'student', nim },
        token
      },
      'Registrasi berhasil.',
      201
    );
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const [users] = await query('SELECT id, name, email, password, role, nim FROM users WHERE email = ?', [email.toLowerCase()]);
    if (users.length === 0) {
      return error(res, 'Email atau password salah.', 401);
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return error(res, 'Email atau password salah.', 401);
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, nim: user.nim },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    success(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        nim: user.nim
      },
      token
    }, 'Login berhasil.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register: [validate(registerSchema), register],
  login: [validate(loginSchema), login]
};