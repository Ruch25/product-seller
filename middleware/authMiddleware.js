const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'key@123';

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader ) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check user role (admin or seller)
const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Unauthorized role' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles
};
