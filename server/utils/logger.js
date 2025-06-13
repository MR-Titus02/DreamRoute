import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { fileURLToPath } from 'url';
import path from 'path';
import pool from '../config/db.js'; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../logs');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}] ${info.message}`
  )
);

// Configure transports (where logs are stored)
const transports = [
  // Log to console
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    ),
  }),

  // Log errors to a rotating file
  new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    format: logFormat,
  }),

  // Log all messages to a separate rotating file
  new DailyRotateFile({
    filename: path.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    format: logFormat,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: 'info', // Minimum level to log
  transports,
});

export default logger;



export async function logUserAction(user_id, action, details = '') {
  try {
    await pool.query(
      'INSERT INTO user_actions (user_id, action, details) VALUES (?, ?, ?)',
      [user_id, action, details]
    );
  } catch (err) {
    console.error('Error logging user action:', err);
  }
}