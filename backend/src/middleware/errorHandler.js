import { logJson } from '../utils/logger.js';

/**
 * Middleware global de manejo de errores. Registra el error en formato JSON y retorna 500.
 * Nunca expone detalles del error interno al cliente; solo retorna un código de correlación.
 * @param {Error} err - Objeto de error capturado.
 * @param {object} req - Petición HTTP de Express.
 * @param {object} res - Respuesta HTTP de Express.
 * @param {Function} _next - Siguiente middleware (no utilizado).
 */
export function errorHandler(err, req, res, _next) {
  const correlationId = req.correlationId || 'unknown';

  logJson('error', `${req.method} ${req.originalUrl}: ${err?.message || err}`, {
    correlationId,
    method: req.method,
    path: req.originalUrl
  });

  return res.status(500).json({
    message: 'Ocurrió un error. Reporte el código:',
    correlationId
  });
}
