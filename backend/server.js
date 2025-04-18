const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const connectDB = require('./utils/db');
const path = require('path');



// Create upload directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

}

// Create logs directory in production
if (config.nodeEnv === 'production' && !fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(mongoSanitize());
app.use(xss());

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app in production
if (config.nodeEnv === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/certificates', require('./routes/certificates'));

// Serve React app in production
if (config.nodeEnv === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handler
app.use(errorHandler);

const PORT = config.port;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  });
});