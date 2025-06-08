// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js'; 
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
export async function register(req, res) {
  try {
    const { email, password, role, name, institution_id } = req.body;

    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role, name, institution_id) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, role, name, institution_id || null] // null for students/admins
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
}

// Login user
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = userRows[0];

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, institution_id: user.institution_id },
      JWT_SECRET,
      // { expiresIn: '2h' }
    );

    res.json({ message: 'Login successful', token : token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
}

// const token = jwt.sign(
//   { userId: user.id, email: user.email, role: user.role, institution_id: user.institution_id },
//   JWT_SECRET,
//   // { expiresIn: '1h' }
// );