export function notFound(req, res, next) {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  const status = error.name === 'ValidationError' ? 400 : error.status || 500;
  res.status(status).json({ message: error.message || 'Server error' });
}
