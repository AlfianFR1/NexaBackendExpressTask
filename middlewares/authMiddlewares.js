const { verifyToken } = require('../utils/encryption');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token wajib disertakan' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(403).json({ message: 'Token tidak valid' });

  req.user = decoded;
  next();
}

module.exports = authMiddleware;
