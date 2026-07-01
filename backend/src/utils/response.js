function success(res, data = null, message = 'Success', statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function error(res, message = 'Error', statusCode = 400, errors = null) {
  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}

function pagination(data, total, page, limit) {
  return {
    items: data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

module.exports = { success, error, pagination };