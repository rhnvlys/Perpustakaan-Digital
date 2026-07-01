const db = require('../config/database');
const { success, error } = require('../utils/response');

exports.getLoans = async (req, res, next) => {
    try {
        let query = `
            SELECT 
                loans.id, 
                loans.book_id, 
                loans.user_id, 
                loans.status, 
                loans.borrowed_at, 
                loans.due_at, 
                loans.returned_at,
                loans.fine, 
                loans.created_at,
                books.title as book_title,
                users.name as user_name
            FROM loans 
            JOIN books ON loans.book_id = books.id
            JOIN users ON loans.user_id = users.id
        `;
        let params = [];
        if (req.user.role !== 'admin') {
            query += ' WHERE loans.user_id = ?';
            params.push(req.user.id);
        }
        query += ' ORDER BY loans.created_at DESC';
        const [rows] = await db.query(query, params);
        const normalized = rows.map(row => ({
            id: row.id,
            bookId: row.book_id,
            bookTitle: row.book_title,
            borrower: row.user_name,
            status: row.status,
            borrowedAt: row.borrowed_at,
            dueAt: row.due_at,
            returnedAt: row.returned_at,
            fine: row.fine
        }));
        return success(res, normalized);
    } catch (err) {
        next(err);
    }
};

exports.getLoanById = async (req, res, next) => {
    try {
        let query = `
            SELECT 
                loans.id, 
                loans.book_id, 
                loans.user_id, 
                loans.status, 
                loans.borrowed_at, 
                loans.due_at, 
                loans.returned_at,
                loans.fine, 
                loans.created_at,
                books.title as book_title,
                users.name as user_name
            FROM loans 
            JOIN books ON loans.book_id = books.id
            JOIN users ON loans.user_id = users.id
            WHERE loans.id = ?
        `;
        const [rows] = await db.query(query, [req.params.id]);
        if (rows.length === 0) return error(res, 'Pinjaman tidak ditemukan', 404);
        
        if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id) {
            return error(res, 'Bukan pinjaman Anda', 403);
        }
        const row = rows[0];
        const normalized = {
            id: row.id,
            bookId: row.book_id,
            bookTitle: row.book_title,
            borrower: row.user_name,
            status: row.status,
            borrowedAt: row.borrowed_at,
            dueAt: row.due_at,
            returnedAt: row.returned_at,
            fine: row.fine
        };
        return success(res, normalized);
    } catch (err) {
        next(err);
    }
};

exports.requestLoan = async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;
        
        const [books] = await db.query('SELECT available FROM books WHERE id = ?', [bookId]);
        if (books.length === 0) return error(res, 'Buku tidak ditemukan', 404);
        if (books[0].available <= 0) return error(res, 'Buku tidak tersedia', 409);
        
        const [activeReq] = await db.query('SELECT id FROM loans WHERE book_id = ? AND user_id = ? AND status = "waiting"', [bookId, userId]);
        if (activeReq.length > 0) return error(res, 'Pengajuan sudah ada dan menunggu persetujuan', 409);
        
        const id = 'req-' + Date.now();
        await db.query('INSERT INTO loans (id, book_id, user_id, status) VALUES (?, ?, ?, "waiting")', [id, bookId, userId]);
        
        return success(res, { id }, 'Pengajuan peminjaman berhasil dibuat', 201);
    } catch (err) {
        next(err);
    }
};

exports.approveLoan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [loans] = await db.query('SELECT * FROM loans WHERE id = ?', [id]);
        if (loans.length === 0) return error(res, 'Pengajuan tidak ditemukan', 404);
        
        const loan = loans[0];
        if (loan.status !== 'waiting') return error(res, 'Status bukan waiting', 400);
        
        const borrowedAt = new Date();
        const dueAt = new Date();
        dueAt.setDate(dueAt.getDate() + 14);
        
        await db.query('UPDATE loans SET status = "active", borrowed_at = ?, due_at = ? WHERE id = ?', [borrowedAt, dueAt, id]);
        await db.query('UPDATE books SET available = available - 1 WHERE id = ?', [loan.book_id]);
        
        return success(res, null, 'Peminjaman disetujui');
    } catch(err) {
        next(err);
    }
};

exports.rejectLoan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [loans] = await db.query('SELECT * FROM loans WHERE id = ?', [id]);
        if (loans.length === 0) return error(res, 'Pengajuan tidak ditemukan', 404);
        
        const loan = loans[0];
        if (loan.status !== 'waiting') return error(res, 'Status bukan waiting', 400);
        
        await db.query('UPDATE loans SET status = "rejected" WHERE id = ?', [id]);
        return success(res, null, 'Pengajuan ditolak');
    } catch (err) {
        next(err);
    }
};

exports.returnBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [loans] = await db.query('SELECT * FROM loans WHERE id = ?', [id]);
        if (loans.length === 0) return error(res, 'Pinjaman tidak ditemukan', 404);
        
        const loan = loans[0];
        if (req.user.role !== 'admin' && loan.user_id !== req.user.id) {
            return error(res, 'Bukan pinjaman Anda', 403);
        }
        if (loan.status === 'returned') return error(res, 'Sudah dikembalikan', 400);
        
        await db.query('UPDATE loans SET status = "returned" WHERE id = ?', [id]);
        await db.query('UPDATE books SET available = available + 1 WHERE id = ?', [loan.book_id]);
        
        return success(res, null, 'Buku berhasil dikembalikan');
    } catch(err) {
        next(err);
    }
};

exports.extendLoan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [loans] = await db.query('SELECT * FROM loans WHERE id = ?', [id]);
        if (loans.length === 0) return error(res, 'Pinjaman tidak ditemukan', 404);
        
        const loan = loans[0];
        if (req.user.role !== 'admin' && loan.user_id !== req.user.id) {
            return error(res, 'Bukan pinjaman Anda', 403);
        }
        
        const newDue = new Date(loan.due_at || new Date());
        newDue.setDate(newDue.getDate() + 7);
        
        await db.query('UPDATE loans SET due_at = ? WHERE id = ?', [newDue, id]);
        return success(res, null, 'Diperpanjang 7 hari');
    } catch(err) {
        next(err);
    }
};
