const db = require('../config/database');
const { success } = require('../utils/response');

exports.getNotifications = async (req, res, next) => {
    try {
        let query = 'SELECT * FROM notifications';
        let params = [];
        if (req.user.role !== 'admin') {
            query += ' WHERE user_id = ?';
            params.push(req.user.id);
        }
        query += ' ORDER BY created_at DESC LIMIT 20';
        
        const [rows] = await db.query(query, params);
        return success(res, rows);
    } catch(err) {
        next(err);
    }
};
