const Joi = require('joi');

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(422).json({
        success: false,
        message: 'Validasi gagal.',
        errors
      });
    }
    next();
  };
}

module.exports = { validate, Joi };