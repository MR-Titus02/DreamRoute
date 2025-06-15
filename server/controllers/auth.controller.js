// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js'; 
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import { logUserAction } from '../utils/logger.js';
import { sendTemplateEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Register a new user
export async function register(req, res) {
  try {
    const { email, password, role, name } = req.body;

    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, role, name]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    await logUserAction(result.insertId, 'User registered', JSON.stringify(req.body));
    await sendTemplateEmail(email, 'register', { name });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
    await logUserAction(null, 'Registration failed', JSON.stringify(req.body));
  }
}

// Login user
// Main login function

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = userRows[0];

    if (!user) {
      await pool.query(
        'INSERT INTO login_logs (user_id, ip_address, user_agent, status) VALUES (?, ?, ?, ?)',
        [null, ip, userAgent, 'failure']
      );
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      await pool.query(
        'INSERT INTO login_logs (user_id, ip_address, user_agent, status) VALUES (?, ?, ?, ?)',
        [user.id, ip, userAgent, 'failure']
      );
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate Access Token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        institution_id: user.institution_id,
      },
      JWT_SECRET,
      { expiresIn: '1m' } // Short-lived token
    );

    // Generate Refresh Token
    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_TOKEN,
      { expiresIn: '7d' } // Long-lived token
    );

    // OPTIONAL: Store refresh token in database if you want to support backend logout
    await pool.query(
      'UPDATE users SET refresh_token = ? WHERE id = ?',
      [refreshToken, user.id]
    );

    await pool.query(
      'INSERT INTO login_logs (user_id, ip_address, user_agent, status) VALUES (?, ?, ?, ?)',
      [user.id, ip, userAgent, 'success']
    );

    // Send refresh token as HTTP-Only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Set to true in production (requires HTTPS)
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      token: accessToken,
    });
    await sendTemplateEmail(user.email, 'login', { name: user.name });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
    logger.error(`Login Error: ${error.message}`, { stack: error.stack });
  }
}




export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN);
    const userId = decoded.userId;

    // Check if token matches what's stored in DB
    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = userRows[0];

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        institution_id: user.institution_id,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ token: newAccessToken });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
    logger.error(`Refresh Token Error: ${error.message}`, { stack: error.stack });
  }
};




// Logout user

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(204); // No content
    }

    // Clear from DB
    await pool.query('UPDATE users SET refresh_token = NULL WHERE refresh_token = ?', [refreshToken]);

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
    await logUserAction(req.user.userId, 'Logout successful', JSON.stringify(req.body));
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Failed to log out' });
    await logUserAction(req.user.userId, 'Logout failed', JSON.stringify(req.body));
  }
};


//forget password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) return res.status(404).json({ message: 'No user found with that email.' });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    console.log('Reset Token:', resetToken); // For debugging, remove in production
    console.log('Reset Token Hash:', resetTokenHash); // For debugging, remove in production
    // Save token to DB
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetTokenHash, resetTokenExpires, user.id]
    );

    // Build reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    // await sendTemplateEmail({
    //   type: 'resetPassword',
    //   email: user.email,
    //   name: user.name,
    //   resetLink,
    // });

    await sendTemplateEmail(user.email, 'resetPassword', { name: user.name, resetLink });

    res.status(200).json({ message: 'Password reset link sent to email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};



//reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const [users] = await pool.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [hashedToken]
    );

    const user = users[0];
    if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });

    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password & remove reset token
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Password reset successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};