const { error } = require('../utils/response');

module.exports = (err, req, res, next) => {
    console.error(err.stack);
    return error(res, err.message || 'Internal Server Error', err.status || 500);
};