const db = require('../config/database');
const { success, error } = require('../utils/response');

exports.getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [userId]
        );
        return success(res, rows);
    } catch(err) {
        next(err);
    }
};

exports.readNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [notifications] = await db.query('SELECT * FROM notifications WHERE id = ?', [id]);
        if (notifications.length === 0) return error(res, 'Notifikasi tidak ditemukan', 404);

        if (notifications[0].user_id !== userId) {
            return error(res, 'Akses ditolak. Ini bukan notifikasi Anda.', 403);
        }

        await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
        return success(res, null, 'Notifikasi ditandai telah dibaca');
    } catch(err) {
        next(err);
    }
};

exports.readAllNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
        return success(res, null, 'Semua notifikasi ditandai telah dibaca');
    } catch(err) {
        next(err);
    }
};
