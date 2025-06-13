import pool from '../config/db.js';
// utils/logger.js
import fs from 'fs';
import path from 'path';

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

const logPath = path.join(process.cwd(), 'logs'); // creates 'logs' folder in root

// Ensure the logs directory exists
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

export function logErrorToFile(errorMessage) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${errorMessage}\n`;

  fs.appendFile(path.join(logPath, 'error.log'), logLine, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
}
