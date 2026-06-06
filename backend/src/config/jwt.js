export function signJwt(payload) {
  return globalThis.jwt.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
}

export function requireJwt(req, res, next) {
  // placeholder (replaced in auth middleware)
  return next();
}

