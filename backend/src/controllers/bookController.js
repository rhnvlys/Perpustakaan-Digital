const db = require('../config/database');
const { success, error } = require('../utils/response');

exports.getBooks = async (req, res, next) => {
    try {
        const { search = '', category = '', page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = req.query;
        const offset = (page - 1) * limit;
        
        let query = 'SELECT * FROM books WHERE (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
        let params = [`%${search}%`, `%${search}%`, `%${search}%`];
        
        if (category && category !== 'Semua') {
            query += ' AND category = ?';
            params.push(category);
        }
        
        const safeSort = ['title', 'author', 'created_at', 'available'].includes(sort) ? sort : 'created_at';
        const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        query += ` ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`;
        params.push(Number(limit), Number(offset));
        
        const [rows] = await db.query(query, params);
        
        let countQuery = 'SELECT COUNT(*) as total FROM books WHERE (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
        let countParams = [`%${search}%`, `%${search}%`, `%${search}%`];
        if (category && category !== 'Semua') {
            countQuery += ' AND category = ?';
            countParams.push(category);
        }
        const [countRows] = await db.query(countQuery, countParams);
        
        return success(res, {
            books: rows,
            pagination: {
                total: countRows[0].total,
                page: Number(page),
                limit: Number(limit)
            }
        }, 'Buku berhasil diambil');
    } catch (err) {
        next(err);
    }
};

exports.getBookById = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return error(res, 'Buku tidak ditemukan', 404);
        return success(res, rows[0]);
    } catch (err) {
        next(err);
    }
};

exports.createBook = async (req, res, next) => {
    try {
        const { title, author, category, isbn, publisher, year, total, description } = req.body;
        if (!title || !author) return error(res, 'Judul dan Penulis diperlukan', 400);
        
        const id = 'book-' + Date.now();
        await db.query(
            `INSERT INTO books (id, title, author, category, isbn, publisher, year, total, available, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, title, author, category, isbn, publisher, year, total, total, description]
        );
        return success(res, { id, title }, 'Buku berhasil ditambahkan', 201);
    } catch (err) {
        next(err);
    }
};

exports.updateBook = async (req, res, next) => {
    try {
        const { title, author, category, isbn, publisher, year, total, description } = req.body;
        const [books] = await db.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
        if (books.length === 0) return error(res, 'Buku tidak ditemukan', 404);

        await db.query(
            `UPDATE books SET title=?, author=?, category=?, isbn=?, publisher=?, year=?, total=?, description=? WHERE id=?`,
            [title || books[0].title, author || books[0].author, category || books[0].category, isbn || books[0].isbn, publisher || books[0].publisher, year || books[0].year, total || books[0].total, description || books[0].description, req.params.id]
        );
        return success(res, null, 'Buku berhasil diperbarui');
    } catch (err) {
        next(err);
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const [loans] = await db.query('SELECT * FROM loans WHERE book_id = ? AND status != "returned"', [req.params.id]);
        if (loans.length > 0) return error(res, 'Buku masih memiliki pinjaman aktif', 409);

        const [result] = await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return error(res, 'Buku tidak ditemukan', 404);
        
        return success(res, null, 'Buku berhasil dihapus');
    } catch (err) {
        next(err);
    }
};

exports.getCategories = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT DISTINCT category FROM books WHERE category IS NOT NULL');
        return success(res, rows.map(r => r.category));
    } catch(err) {
        next(err);
    }
};
