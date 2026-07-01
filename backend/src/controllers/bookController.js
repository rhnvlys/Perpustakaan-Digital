const { query } = require('../config/database');
const { success, error, pagination } = require('../utils/response');

async function list(req, res, next) {
  try {
    const { search, category, available, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push('(title LIKE ? OR author LIKE ? OR isbn LIKE ? OR category LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (category && category !== 'Semua') {
      whereConditions.push('category = ?');
      params.push(category);
    }

    if (available === 'true') {
      whereConditions.push('available > 0');
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const [books] = await query(`SELECT SQL_CALC_FOUND_ROWS * FROM books ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), offset]);
    const [[{ total }]] = await query('SELECT FOUND_ROWS() as total');

    success(res, pagination(books, total, parseInt(page), parseInt(limit)));
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;

    const [books] = await query('SELECT * FROM books WHERE id = ?', [id]);
    if (books.length === 0) {
      return error(res, 'Buku tidak ditemukan.', 404);
    }

    const book = books[0];

    const [activeLoans] = await query('SELECT COUNT(*) as count FROM loans WHERE book_id = ? AND status IN (?, ?, ?)', [id, 'waiting', 'active', 'late']);
    book.activeLoans = activeLoans[0].count;

    success(res, book);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, author, category, isbn, publisher, year, total, available, description, image } = req.body;

    if (!title || !author) {
      return error(res, 'Judul dan penulis wajib diisi.', 422);
    }

    const [userId] = await query('SELECT UUID() as id');
    const id = userId[0].id;

    await query(
      'INSERT INTO books (id, title, author, category, isbn, publisher, year, total, available, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, author, category || 'Fiksi', isbn || '', publisher || 'Perpustakaan Digital', year || new Date().getFullYear().toString(), parseInt(total) || 1, parseInt(available) || parseInt(total) || 1, description || '', image || `https://picsum.photos/seed/${encodeURIComponent(title)}/360/280`]
    );

    success(res, { id, title, author, category, isbn, publisher, year, total, available, description, image }, 'Buku berhasil ditambahkan.', 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { title, author, category, isbn, publisher, year, total, available, description, image } = req.body;

    const [books] = await query('SELECT id FROM books WHERE id = ?', [id]);
    if (books.length === 0) {
      return error(res, 'Buku tidak ditemukan.', 404);
    }

    await query(
      'UPDATE books SET title = ?, author = ?, category = ?, isbn = ?, publisher = ?, year = ?, total = ?, available = ?, description = ?, image = ? WHERE id = ?',
      [title, author, category, isbn, publisher, year, total, available, description, image, id]
    );

    success(res, { id, title, author, category, isbn, publisher, year, total, available, description, image }, 'Buku berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
}

async function destroy(req, res, next) {
  try {
    const { id } = req.params;

    const [books] = await query('SELECT id FROM books WHERE id = ?', [id]);
    if (books.length === 0) {
      return error(res, 'Buku tidak ditemukan.', 404);
    }

    const [activeLoans] = await query('SELECT COUNT(*) as count FROM loans WHERE book_id = ? AND status IN (?, ?, ?)', [id, 'waiting', 'active', 'late']);
    if (activeLoans[0].count > 0) {
      return error(res, 'Buku masih memiliki pinjaman aktif.', 409);
    }

    await query('DELETE FROM books WHERE id = ?', [id]);

    success(res, { id }, 'Buku berhasil dihapus.');
  } catch (err) {
    next(err);
  }
}

async function categories(req, res, next) {
  try {
    const [categories] = await query('SELECT DISTINCT category FROM books ORDER BY category');
    success(res, categories.map(c => c.category));
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, destroy, categories };