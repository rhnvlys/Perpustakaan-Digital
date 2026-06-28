const db = require('../config/database');
const { success } = require('../utils/response');

exports.getDashboard = async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            const [[{ totalBooks }]] = await db.query('SELECT SUM(total) as totalBooks FROM books');
            const [[{ availableBooks }]] = await db.query('SELECT SUM(available) as availableBooks FROM books');
            const [[{ activeLoans }]] = await db.query('SELECT COUNT(*) as activeLoans FROM loans WHERE status="active" OR status="late"');
            const [[{ waitingRequests }]] = await db.query('SELECT COUNT(*) as waitingRequests FROM loans WHERE status="waiting"');
            
            return success(res, {
                totalBooks: totalBooks || 0,
                availableBooks: availableBooks || 0,
                activeLoans: activeLoans || 0,
                waitingRequests: waitingRequests || 0
            });
        } else {
            const [[{ activeLoans }]] = await db.query('SELECT COUNT(*) as activeLoans FROM loans WHERE user_id=? AND (status="active" OR status="late")', [req.user.id]);
            const [[{ returnedBooks }]] = await db.query('SELECT COUNT(*) as returnedBooks FROM loans WHERE user_id=? AND status="returned"', [req.user.id]);
            
            return success(res, {
                activeLoans: activeLoans || 0,
                returnedBooks: returnedBooks || 0
            });
        }
    } catch (err) {
        next(err);
    }
};
