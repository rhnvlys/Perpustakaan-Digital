const { query } = require('../config/database');
const { success } = require('../utils/response');

async function list(req, res, next) {
  try {
    let whereClause = '';
    let params = [];

    if (req.user.role === 'student') {
      whereClause = 'WHERE user_id = ?';
      params.push(req.user.id);
    }

    const [notifications] = await query(`
      SELECT * FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
    `, params);

    success(res, notifications.map(notif => ({
      id: notif.id,
      userId: notif.user_id,
      title: notif.title,
      isRead: notif.is_read,
      createdAt: notif.created_at
    })));
  } catch (err) {
    next(err);
  }
}

module.exports = { list };