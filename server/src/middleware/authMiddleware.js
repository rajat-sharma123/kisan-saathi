import jwt from 'jsonwebtoken';

export function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If optional auth or guest mode, attach a default guest user id
    req.userId = 'demo_user';
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kisan_saathi_innovix_jwt_secret_2026');
    req.userId = decoded.id;
    next();
  } catch (err) {
    req.userId = 'demo_user';
    next();
  }
}
