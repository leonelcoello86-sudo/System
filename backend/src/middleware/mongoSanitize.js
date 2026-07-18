/**
 * Elimina recursivamente del objeto las keys que inician con $ o contienen puntos,
 * para prevenir inyección NoSQL.
 * @param {object} obj - Objeto a sanitizar (se modifica in-place).
 * @returns {object} El mismo objeto sanitizado.
 */
function sanitizeObject(obj) {
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
  }
  return obj;
}

/**
 * Middleware que sanitiza req.body, req.query y req.params contra inyección NoSQL.
 * @param {object} req - Petición HTTP de Express.
 * @param {object} res - Respuesta HTTP de Express.
 * @param {Function} next - Siguiente middleware.
 */
export function mongoSanitize(req, res, next) {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
}
