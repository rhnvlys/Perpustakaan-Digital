const db = require('../config/database');
const { success } = require('../utils/response');

exports.getDashboard = async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            const [[{ totalBooks }]] = await db.query('SELECT COALESCE(SUM(total), 0) as totalBooks FROM books');
            const [[{ totalStudents }]] = await db.query('SELECT COUNT(*) as totalStudents FROM users WHERE role = "student"');
            const [[{ activeLoans }]] = await db.query('SELECT COUNT(*) as activeLoans FROM loans WHERE status = "active"');
            const [[{ waitingLoans }]] = await db.query('SELECT COUNT(*) as waitingLoans FROM loans WHERE status = "waiting"');
            const [[{ returnedLoans }]] = await db.query('SELECT COUNT(*) as returnedLoans FROM loans WHERE status = "returned"');
            const [[{ lateLoans }]] = await db.query('SELECT COUNT(*) as lateLoans FROM loans WHERE status = "late"');
            
            return success(res, {
                totalBooks: Number(totalBooks),
                totalStudents: Number(totalStudents),
                activeLoans: Number(activeLoans),
                waitingLoans: Number(waitingLoans),
                returnedLoans: Number(returnedLoans),
                lateLoans: Number(lateLoans)
            });
        } else {
            const userId = req.user.id;
            const [[{ activeLoans }]] = await db.query('SELECT COUNT(*) as activeLoans FROM loans WHERE user_id = ? AND status = "active"', [userId]);
            const [[{ waitingLoans }]] = await db.query('SELECT COUNT(*) as waitingLoans FROM loans WHERE user_id = ? AND status = "waiting"', [userId]);
            const [[{ returnedLoans }]] = await db.query('SELECT COUNT(*) as returnedLoans FROM loans WHERE user_id = ? AND status = "returned"', [userId]);
            const [[{ unreadNotifications }]] = await db.query('SELECT COUNT(*) as unreadNotifications FROM notifications WHERE user_id = ? AND is_read = FALSE', [userId]);
            
            return success(res, {
                activeLoans: Number(activeLoans),
                waitingLoans: Number(waitingLoans),
                returnedLoans: Number(returnedLoans),
                unreadNotifications: Number(unreadNotifications)
            });
        }
    } catch (err) {
        next(err);
    }
};
