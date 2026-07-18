import { logError } from '../utils/logger.js';

/**
 * Middleware global de manejo de errores. Registra el error en consola y retorna 500.
 * En producción no expone detalles del error al cliente.
 * @param {Error} err - Objeto de error capturado.
 * @param {object} req - Petición HTTP de Express.
 * @param {object} res - Respuesta HTTP de Express.
 * @param {Function} _next - Siguiente middleware (no utilizado).
 */
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
