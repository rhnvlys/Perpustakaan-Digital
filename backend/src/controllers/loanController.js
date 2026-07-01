const db = require('../config/database');
const { success, error } = require('../utils/response');

exports.getLoans = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, parseInt(limit, 10) || 10);
        const offset = (pageNum - 1) * limitNum;

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
            WHERE 1=1
        `;
        let countQuery = `
            SELECT COUNT(*) as total
            FROM loans 
            JOIN books ON loans.book_id = books.id
            JOIN users ON loans.user_id = users.id
            WHERE 1=1
        `;
        let params = [];
        let countParams = [];

        if (req.user.role !== 'admin') {
            query += ' AND loans.user_id = ?';
            countQuery += ' AND loans.user_id = ?';
            params.push(req.user.id);
            countParams.push(req.user.id);
        }

        if (status) {
            query += ' AND loans.status = ?';
            countQuery += ' AND loans.status = ?';
            params.push(status);
            countParams.push(status);
        }

        query += ' ORDER BY loans.created_at DESC LIMIT ? OFFSET ?';
        params.push(limitNum, offset);

        const [rows] = await db.query(query, params);
        const [countRows] = await db.query(countQuery, countParams);
        const total = countRows[0].total;

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

        return success(res, {
            loans: normalized,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum
            }
        });
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
        if (req.user.role !== 'student') {
            return error(res, 'Hanya Student yang dapat mengajukan peminjaman', 403);
        }

        const { bookId } = req.body;
        const userId = req.user.id;
        
        const [books] = await db.query('SELECT available FROM books WHERE id = ?', [bookId]);
        if (books.length === 0) return error(res, 'Buku tidak ditemukan', 404);
        if (books[0].available <= 0) return error(res, 'Buku tidak tersedia', 409);
        
        const [activeReq] = await db.query('SELECT id FROM loans WHERE book_id = ? AND user_id = ? AND (status = "waiting" OR status = "active" OR status = "late")', [bookId, userId]);
        if (activeReq.length > 0) return error(res, 'Anda masih memiliki peminjaman aktif atau menunggu untuk buku ini', 409);
        
        const id = 'req-' + Date.now();
        await db.query('INSERT INTO loans (id, book_id, user_id, status) VALUES (?, ?, ?, "waiting")', [id, bookId, userId]);
        
        return success(res, { id }, 'Pengajuan peminjaman berhasil dibuat', 201);
    } catch (err) {
        next(err);
    }
};

exports.approveLoan = async (req, res, next) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        const { id } = req.params;
        const [loans] = await connection.query('SELECT * FROM loans WHERE id = ? FOR UPDATE', [id]);
        if (loans.length === 0) {
            await connection.rollback();
            return error(res, 'Pengajuan tidak ditemukan', 404);
        }
        
        const loan = loans[0];
        if (loan.status !== 'waiting') {
            await connection.rollback();
            return error(res, 'Status bukan waiting', 400);
        }
        
        const [books] = await connection.query('SELECT available FROM books WHERE id = ? FOR UPDATE', [loan.book_id]);
        if (books.length === 0) {
            await connection.rollback();
            return error(res, 'Buku tidak ditemukan', 404);
        }
        
        if (books[0].available <= 0) {
            await connection.rollback();
            return error(res, 'Stok buku habis, tidak bisa disetujui', 409);
        }
        
        const borrowedAt = new Date();
        const dueAt = new Date();
        dueAt.setDate(dueAt.getDate() + 14);
        
        await connection.query('UPDATE loans SET status = "active", borrowed_at = ?, due_at = ? WHERE id = ?', [borrowedAt, dueAt, id]);
        await connection.query('UPDATE books SET available = available - 1 WHERE id = ?', [loan.book_id]);
        
        const notificationId = 'notif-' + Date.now();
        await connection.query(
            'INSERT INTO notifications (id, user_id, title) VALUES (?, ?, ?)',
            [notificationId, loan.user_id, 'Peminjaman buku Anda telah disetujui. Silakan ambil buku di perpustakaan.']
        );
        
        await connection.commit();
        return success(res, null, 'Peminjaman disetujui');
    } catch(err) {
        await connection.rollback();
        next(err);
    } finally {
        connection.release();
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
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const [loans] = await connection.query('SELECT * FROM loans WHERE id = ? FOR UPDATE', [id]);
        if (loans.length === 0) {
            await connection.rollback();
            return error(res, 'Pinjaman tidak ditemukan', 404);
        }

        const loan = loans[0];
        if (req.user.role !== 'admin' && loan.user_id !== req.user.id) {
            await connection.rollback();
            return error(res, 'Bukan pinjaman Anda', 403);
        }
        if (loan.status === 'returned') {
            await connection.rollback();
            return error(res, 'Buku sudah dikembalikan sebelumnya', 400);
        }

        if (loan.status !== 'active' && loan.status !== 'late') {
            await connection.rollback();
            return error(res, 'Pinjaman tidak sedang aktif', 400);
        }

        const returnedAt = new Date();
        await connection.query('UPDATE loans SET status = "returned", returned_at = ? WHERE id = ?', [returnedAt, id]);
        await connection.query('UPDATE books SET available = available + 1 WHERE id = ?', [loan.book_id]);

        const notificationId = 'notif-' + Date.now();
        await connection.query(
            'INSERT INTO notifications (id, user_id, title) VALUES (?, ?, ?)',
            [notificationId, loan.user_id, 'Pengembalian buku Anda telah dikonfirmasi. Terima kasih.']
        );

        await connection.commit();
        return success(res, null, 'Buku berhasil dikembalikan');
    } catch(err) {
        await connection.rollback();
        next(err);
    } finally {
        connection.release();
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
