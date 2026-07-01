const request = require('supertest');
const app = require('./src/app');
const { pool, query } = require('./src/config/database');

describe('Backend API Tests', () => {
  let adminToken;
  let studentToken;
  let bookId;
  let loanId;

  beforeAll(async () => {
    await query('DELETE FROM loans WHERE user_id IN (SELECT id FROM users WHERE email LIKE ?)', ['%@test%']);
    await query('DELETE FROM users WHERE email LIKE ?', ['%@test%']);
    await query('DELETE FROM books WHERE title LIKE ?', ['Test%']);
  });

  afterAll(async () => {
    await query('DELETE FROM loans WHERE user_id IN (SELECT id FROM users WHERE email LIKE ?)', ['%@test%']);
    await query('DELETE FROM users WHERE email LIKE ?', ['%@test%']);
    await query('DELETE FROM books WHERE title LIKE ?', ['Test%']);
    await pool.end();
  });

  test('health check', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
  });

  test('register success', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: 'student@test.com',
        password: 'student123',
        nim: '2024009999'
      });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('student@test.com');
    expect(response.body.data.token).toBeDefined();
    studentToken = response.body.data.token;
  });

  test('register duplicate email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student 2',
        email: 'student@test.com',
        password: 'student123',
        nim: '2024009998'
      });
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Email sudah terdaftar.');
  });

  test('login success', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@test.com',
        password: 'student123'
      });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
    studentToken = response.body.data.token;
  });

  test('login fail', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@test.com',
        password: 'wrongpassword'
      });
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('create book (admin only)', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@perpustakaan.com',
        password: 'admin123'
      });
    adminToken = response.body.data.token;

    const bookResponse = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Book',
        author: 'Test Author',
        category: 'Fiksi',
        isbn: '978-1-2345-6789-0',
        publisher: 'Test Publisher',
        year: '2024',
        total: 5,
        available: 5,
        description: 'Test book description'
      });
    expect(bookResponse.status).toBe(201);
    expect(bookResponse.body.success).toBe(true);
    expect(bookResponse.body.data.title).toBe('Test Book');
    bookId = bookResponse.body.data.id;
  });

  test('book list', async () => {
    const response = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.items).toBeInstanceOf(Array);
  });

  test('get book by id', async () => {
    const response = await request(app)
      .get(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(bookId);
  });

  test('request loan', async () => {
    const response = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ bookId });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('waiting');
    loanId = response.body.data.id;
  });

  test('approve loan (admin only)', async () => {
    const response = await request(app)
      .patch(`/api/loans/${loanId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.request.status).toBe('approved');
    expect(response.body.data.loan).toBeDefined();
  });

  test('return loan', async () => {
    const response = await request(app)
      .patch(`/api/loans/${loanId}/return`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('returned');
  });

  test('extend loan', async () => {
    await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ bookId });

    const loansResponse = await request(app)
      .get('/api/loans')
      .set('Authorization', `Bearer ${studentToken}`);
    const activeLoan = loansResponse.body.data.find(l => l.status === 'active');

    if (activeLoan) {
      const response = await request(app)
        .patch(`/api/loans/${activeLoan.id}/extend`)
        .set('Authorization', `Bearer ${studentToken}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    }
  });

  test('dashboard access', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.metrics).toBeDefined();
  });
});