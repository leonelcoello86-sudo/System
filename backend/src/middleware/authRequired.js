import jwt from 'jsonwebtoken';

/**
 * Middleware que verifica la presencia y validez del token JWT en el header Authorization.
 * Si el token es válido, decodifica el payload y lo asigna a req.user.
 * @param {object} req - Petición HTTP de Express.
 * @param {object} res - Respuesta HTTP de Express.
 * @param {Function} next - Siguiente middleware.
 */
export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Middleware que verifica que el usuario autenticado tenga rol de administrador.
 * Debe usarse después de authRequired.
 * @param {object} req - Petición HTTP (debe tener req.user.role).
 * @param {object} res - Respuesta HTTP de Express.
 * @param {Function} next - Siguiente middleware.
 */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
}

