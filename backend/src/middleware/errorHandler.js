import { logError } from '../utils/logger.js';

export function errorHandler(err, req, res, _next) {
  logError(`${req.method} ${req.originalUrl}: ${err?.message || err}`);

  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }

  return res.status(500).json({
    message: 'Error interno del servidor',
    error: String(err?.message || err)
  });
}
