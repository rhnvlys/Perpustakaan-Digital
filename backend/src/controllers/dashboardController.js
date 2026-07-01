const { query } = require('../config/database');
const { success } = require('../utils/response');

async function index(req, res, next) {
  try {
    if (req.user.role === 'admin') {
      const [[totalBooks]] = await query('SELECT SUM(total) as total FROM books');
      const [[uniqueTitles]] = await query('SELECT COUNT(*) as count FROM books');
      const [[waitingRequests]] = await query('SELECT COUNT(*) as count FROM loans WHERE status = ?', ['waiting']);
      const [[activeLoans]] = await query('SELECT COUNT(*) as count FROM loans WHERE status IN (?, ?)', ['active', 'late']);
      const [[availableBooks]] = await query('SELECT SUM(available) as total FROM books');
      const [[lateLoans]] = await query('SELECT COUNT(*) as count FROM loans WHERE status = ?', ['late']);

      const [popularBooks] = await query(`
        SELECT 
          b.*,
          COUNT(l.id) as loan_count
        FROM books b
        LEFT JOIN loans l ON b.id = l.book_id AND l.status IN (?, ?, ?)
        GROUP BY b.id
        ORDER BY loan_count DESC
        LIMIT 4
      `, ['waiting', 'active', 'late']);

      const booksWithMeta = popularBooks.map(book => ({
        ...book,
        activeLoans: parseInt(book.loan_count || 0)
      }));

      success(res, {
        metrics: {
          totalBooks: parseInt(totalBooks.total) || 0,
          uniqueTitles: parseInt(uniqueTitles.count) || 0,
          waitingRequests: parseInt(waitingRequests.count) || 0,
          activeLoans: parseInt(activeLoans.count) || 0,
          availableBooks: parseInt(availableBooks.total) || 0,
          lateLoans: parseInt(lateLoans.count) || 0
        },
        popularBooks: booksWithMeta
      });
    } else {
      const [[activeLoans]] = await query('SELECT COUNT(*) as count FROM loans WHERE user_id = ? AND status IN (?, ?)', [req.user.id, 'active', 'late']);
      const [[lateLoans]] = await query('SELECT COUNT(*) as count FROM loans WHERE user_id = ? AND status = ?', [req.user.id, 'late']);
      const [[finishedBooks]] = await query('SELECT COUNT(*) as count FROM loans WHERE user_id = ? AND status = ?', [req.user.id, 'returned']);
      const [[availableBooks]] = await query('SELECT SUM(available) as total FROM books');

      const [myActiveLoans] = await query(`
        SELECT 
          l.*,
          b.title as book_title,
          b.image as book_image
        FROM loans l
        JOIN books b ON l.book_id = b.id
        WHERE l.user_id = ? AND l.status IN (?, ?)
        ORDER BY l.borrowed_at DESC
      `, [req.user.id, 'active', 'late']);

      const [latestBooks] = await query('SELECT * FROM books ORDER BY created_at DESC LIMIT 4');

      const activeLoansList = myActiveLoans.map(loan => ({
        id: loan.id,
        bookId: loan.book_id,
        bookTitle: loan.book_title,
        bookImage: loan.book_image,
        borrowerId: loan.user_id,
        status: loan.status,
        requestedAt: loan.requested_at,
        borrowedAt: loan.borrowed_at,
        dueAt: loan.due_at,
        returnedAt: loan.returned_at,
        fine: loan.fine
      }));

      const booksWithMeta = latestBooks.map(book => ({
        ...book,
        activeLoans: 0
      }));

      success(res, {
        metrics: {
          activeLoans: parseInt(activeLoans.count) || 0,
          lateLoans: parseInt(lateLoans.count) || 0,
          finishedBooks: parseInt(finishedBooks.count) || 0,
          availableBooks: parseInt(availableBooks.total) || 0
        },
        activeLoans: activeLoansList,
        latestBooks
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { index };