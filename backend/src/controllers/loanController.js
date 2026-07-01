const { query } = require('../config/database');
const { success, error } = require('../utils/response');

async function list(req, res, next) {
  try {
    const { status } = req.query;
    let whereClause = '';
    let params = [];

    if (req.user.role === 'student') {
      whereClause = 'WHERE l.user_id = ?';
      params.push(req.user.id);
    }

    if (status) {
      whereClause += (whereClause ? ' AND' : 'WHERE') + ' l.status = ?';
      params.push(status);
    }

    const [loans] = await query(`
      SELECT 
        l.id,
        l.book_id,
        l.user_id,
        l.status,
        l.requested_at,
        l.borrowed_at,
        l.due_at,
        l.returned_at,
        l.fine,
        b.title as book_title,
        b.image as book_image,
        u.name as borrower_name,
        u.email as borrower_email
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN users u ON l.user_id = u.id
      ${whereClause}
      ORDER BY l.requested_at DESC
    `, params);

    success(res, loans.map(loan => ({
      id: loan.id,
      bookId: loan.book_id,
      bookTitle: loan.book_title,
      bookImage: loan.book_image,
      borrowerId: loan.user_id,
      borrowerName: loan.borrower_name,
      status: loan.status,
      requestedAt: loan.requested_at,
      borrowedAt: loan.borrowed_at,
      dueAt: loan.due_at,
      returnedAt: loan.returned_at,
      fine: loan.fine
    })));
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;

    const [loans] = await query(`
      SELECT 
        l.*,
        b.title as book_title,
        b.image as book_image,
        u.name as borrower_name
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
    `, [id]);

    if (loans.length === 0) {
      return error(res, 'Pinjaman tidak ditemukan.', 404);
    }

    const loan = loans[0];
    success(res, {
      id: loan.id,
      bookId: loan.book_id,
      bookTitle: loan.book_title,
      bookImage: loan.book_image,
      borrowerId: loan.user_id,
      borrowerName: loan.borrower_name,
      status: loan.status,
      requestedAt: loan.requested_at,
      borrowedAt: loan.borrowed_at,
      dueAt: loan.due_at,
      returnedAt: loan.returned_at,
      fine: loan.fine
    });
  } catch (err) {
    next(err);
  }
}

async function request(req, res, next) {
  try {
    const { bookId } = req.body;

    const [books] = await query('SELECT id, title, available FROM books WHERE id = ?', [bookId]);
    if (books.length === 0) {
      return error(res, 'Buku tidak ditemukan.', 404);
    }

    const book = books[0];
    if (book.available <= 0) {
      return error(res, 'Buku belum tersedia untuk dipinjam.', 409);
    }

    const [duplicate] = await query('SELECT id FROM loans WHERE user_id = ? AND book_id = ? AND status = ?', [req.user.id, bookId, 'waiting']);
    if (duplicate.length > 0) {
      return error(res, 'Pengajuan untuk buku ini masih menunggu persetujuan.', 409);
    }

    const [userId] = await query('SELECT UUID() as id');
    const id = userId[0].id;

    await query(
      'INSERT INTO loans (id, book_id, user_id, status, requested_at) VALUES (?, ?, ?, ?, NOW())',
      [id, bookId, req.user.id, 'waiting']
    );

    success(res, {
      id,
      bookId,
      borrowerId: req.user.id,
      borrowerName: req.user.name,
      status: 'waiting',
      requestedAt: new Date().toISOString()
    }, 'Pengajuan peminjaman berhasil dikirim.', 201);
  } catch (err) {
    next(err);
  }
}

async function approve(req, res, next) {
  try {
    const { id } = req.params;

    const [loans] = await query('SELECT id, book_id, user_id, status FROM loans WHERE id = ?', [id]);
    if (loans.length === 0) {
      return error(res, 'Pengajuan tidak ditemukan.', 404);
    }

    const loan = loans[0];
    if (loan.status !== 'waiting') {
      return error(res, 'Pengajuan sudah diproses.', 409);
    }

    const [books] = await query('SELECT id, title, available FROM books WHERE id = ?', [loan.book_id]);
    if (books.length === 0 || books[0].available <= 0) {
      return error(res, 'Stok buku tidak tersedia.', 409);
    }

    const connection = await query('SELECT @@autocommit as autocommit');
    const conn = connection[0][0];
    if (conn.autocommit === 1) {
      await query('START TRANSACTION');
    }

    try {
      await query('UPDATE loans SET status = ?, requested_at = NOW() WHERE id = ?', ['approved', id]);

      const [newLoanId] = await query('SELECT UUID() as id');
      const newId = newLoanId[0].id;

      await query(
        'INSERT INTO loans (id, book_id, user_id, status, requested_at, borrowed_at, due_at) VALUES (?, ?, ?, ?, NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY))',
        [newId, loan.book_id, loan.user_id, 'active']
      );

      await query('UPDATE books SET available = available - 1 WHERE id = ?', [loan.book_id]);

      if (conn.autocommit === 1) {
        await query('COMMIT');
      }

      const [updatedLoan] = await query('SELECT * FROM loans WHERE id = ?', [newId]);

      success(res, {
        request: { id, status: 'approved' },
        loan: {
          id: updatedLoan[0].id,
          bookId: updatedLoan[0].book_id,
          borrowerId: updatedLoan[0].user_id,
          status: updatedLoan[0].status,
          requestedAt: updatedLoan[0].requested_at,
          borrowedAt: updatedLoan[0].borrowed_at,
          dueAt: updatedLoan[0].due_at,
          fine: updatedLoan[0].fine
        }
      }, 'Pengajuan disetujui.');
    } catch (err) {
      if (conn.autocommit === 1) {
        await query('ROLLBACK');
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

async function reject(req, res, next) {
  try {
    const { id } = req.params;

    const [loans] = await query('SELECT id, status FROM loans WHERE id = ?', [id]);
    if (loans.length === 0) {
      return error(res, 'Pengajuan tidak ditemukan.', 404);
    }

    const loan = loans[0];
    if (loan.status !== 'waiting') {
      return error(res, 'Pengajuan sudah diproses.', 409);
    }

    await query('UPDATE loans SET status = ? WHERE id = ?', ['rejected', id]);

    success(res, { id, status: 'rejected' }, 'Pengajuan ditolak.');
  } catch (err) {
    next(err);
  }
}

async function returnBook(req, res, next) {
  try {
    const { id } = req.params;

    const [loans] = await query('SELECT id, user_id, book_id, status FROM loans WHERE id = ?', [id]);
    if (loans.length === 0) {
      return error(res, 'Pinjaman tidak ditemukan.', 404);
    }

    const loan = loans[0];

    if (req.user.role === 'student' && loan.user_id !== req.user.id) {
      return error(res, 'Pinjaman bukan milik akun ini.', 403);
    }

    if (loan.status === 'returned') {
      return error(res, 'Buku sudah dikembalikan.', 409);
    }

    await query('UPDATE loans SET status = ?, returned_at = NOW(), fine = 0 WHERE id = ?', ['returned', id]);
    await query('UPDATE books SET available = available + 1 WHERE id = ?', [loan.book_id]);

    success(res, { id, status: 'returned', fine: 0 }, 'Pengembalian buku berhasil dikonfirmasi.');
  } catch (err) {
    next(err);
  }
}

async function extend(req, res, next) {
  try {
    const { id } = req.params;

    const [loans] = await query('SELECT id, user_id, status FROM loans WHERE id = ?', [id]);
    if (loans.length === 0) {
      return error(res, 'Pinjaman tidak ditemukan.', 404);
    }

    const loan = loans[0];

    if (req.user.role === 'student' && loan.user_id !== req.user.id) {
      return error(res, 'Pinjaman bukan milik akun ini.', 403);
    }

    if (loan.status === 'returned') {
      return error(res, 'Pinjaman yang sudah selesai tidak dapat diperpanjang.', 409);
    }

    await query('UPDATE loans SET status = ?, due_at = DATE_ADD(due_at, INTERVAL 7 DAY) WHERE id = ?', ['active', id]);

    const [updatedLoan] = await query('SELECT * FROM loans WHERE id = ?', [id]);

    success(res, {
      id: updatedLoan[0].id,
      status: updatedLoan[0].status,
      dueAt: updatedLoan[0].due_at
    }, 'Pinjaman berhasil diperpanjang 7 hari.');
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, request, approve, reject, returnBook, extend };