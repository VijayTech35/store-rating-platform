const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);

  if (err.code === '23505') {
    return res.status(409).json({ message: 'Duplicate entry. Resource already exists.' });
  }
  if (err.code === '23503') {
    return res.status(400).json({ message: 'Referenced resource does not exist.' });
  }
  if (err.code === '23514') {
    return res.status(400).json({ message: 'Validation constraint violated.' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
