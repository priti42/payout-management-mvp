const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const err = new Error('JWT_SECRET is not defined in environment variables');
      err.statusCode = 500;
      throw err;
    }

    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 401;
    next(err);
  }
};

const requireRole = (...allowedRoles) => (req, res, next) => {
  const roles = allowedRoles.flat();
  if (!req.user) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    return next(err);
  }
  if (!roles.includes(req.user.role)) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    return next(err);
  }
  return next();
};

module.exports = { verifyJWT, requireRole };
