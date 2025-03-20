const winston = require('winston');
require('winston-daily-rotate-file');

// Create a daily rotating log transport
const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD', // Rotate daily
  zippedArchive: true,       // Archive old log files
  maxSize: '20m',            // Max size of a log file before rotating
  maxFiles: '14d'            // Keep logs for 14 days
});

// Create a logger instance with daily rotation
const logger = winston.createLogger({
  level: 'info',
  transports: [
    dailyRotateTransport, // Use the daily rotating transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

module.exports = logger
// Example logs
// logger.info('This is an info log.');
// logger.warn('This is a warning log.');
// logger.error('This is an error log.');

