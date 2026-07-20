import { randomUUID } from 'crypto';

/**
 * Middleware que asigna un identificador único (UUID v4) a cada petición HTTP.
 * El UUID se agrega a req.correlationId y al header de respuesta X-Correlation-ID.
 * @param {object} req - Petición HTTP de Express.
 * @param {object} res - Respuesta HTTP de Express.
 * @param {Function} next - Siguiente middleware.
 */
export function correlationId(req, res, next) {
  const id = req.headers['x-correlation-id'] || randomUUID();
  req.correlationId = id;
  res.setHeader('X-Correlation-ID', id);
  next();
}
