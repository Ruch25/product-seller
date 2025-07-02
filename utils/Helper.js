const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'key@123';

exports.generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};