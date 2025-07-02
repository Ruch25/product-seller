// middleware/requestLogger.js

const fs = require('fs');
const path = require('path');

// Create logs directory if not exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Hook into response finish to get status code
  res.on('finish', () => {
    const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | User: ${
      req.user?.email || 'Unauthenticated'
    } | Time: ${Date.now() - start}ms\n`;

    fs.appendFileSync(path.join(logDir, 'api.log'), log);
  });

  next();
};

module.exports = requestLogger;
