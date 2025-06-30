// middleware/errorMiddleware.js

const errorMiddleware = {
  // Handle unknown routes (404)
  notFound: (req, res, next) => {
    res.status(404).json({
      success: false,
      error: `Not Found - ${req.originalUrl}`,
    });
  },

  // Handle all other server errors
  errorHandler: (err, req, res, next) => {
    console.error('Server Error:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
};

module.exports = errorMiddleware;
