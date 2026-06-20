const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);

  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return res.status(409).json({ message: 'Duplicate entry. Resource already exists.' });
  }
  if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
    return res.status(400).json({ message: 'Referenced resource does not exist.' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
