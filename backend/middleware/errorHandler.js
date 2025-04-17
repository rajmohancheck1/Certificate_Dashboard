const logger = require('../utils/logger');
const config = require('../config/config');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with request details
  logger.error({
    error: err,
    requestInfo: {
      method: req.method,
      url: req.url,
      body: config.nodeEnv === 'development' ? req.body : undefined,
      user: req.user ? req.user.id : 'unauthenticated'
    }
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new Error(message);
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message);
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new Error('Invalid token');
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error = new Error('Token expired');
    error.statusCode = 401;
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: config.nodeEnv === 'production' ? 'Something went wrong' : error.message
  });
};

module.exports = errorHandler;