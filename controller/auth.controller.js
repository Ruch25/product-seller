const db = require('../models');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/Helper');
const fs = require('fs');
const path = require('path');


const logLoginAttempt = (email, role, success, reason = '') => {
  const log = `${new Date().toISOString()} - ${email} (${role}) - ${success ? 'SUCCESS' : 'FAIL'}${reason ? ` - ${reason}` : ''}\n`;
  fs.appendFileSync(path.join(__dirname, '../logs/login.log'), log);
};

const UserLogin = (expectedRole) => {
  return async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({ where: { email } });

      if (!user || user.role !== expectedRole) {
        logLoginAttempt(email, expectedRole, false, 'Invalid credentials or role');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        logLoginAttempt(email, expectedRole, false, 'Invalid password');
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      logLoginAttempt(email, expectedRole, true);

      const baseResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      const extra = user.role === 'admin'
        ? { accessLevel: 'all', }
        : { accessLevel: 'limited' };

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { ...baseResponse, ...extra }
      });

    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
};


// Export functions
module.exports = {
  UserLogin,
  adminLogin: UserLogin('admin'),
  sellerLogin: UserLogin('seller')
};