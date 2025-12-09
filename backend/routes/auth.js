import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate password requirements
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    if (!/\d/.test(password)) {
      return res.status(400).json({ error: 'Password must include at least one number' });
    }

    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit recovery PIN
    // NOTE: This is a placeholder until email integration is implemented
    // In production, this PIN should be sent via email instead of returned in response
    const recoveryPin = Math.floor(100000 + Math.random() * 900000).toString();

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (email, password, name, recovery_pin) VALUES ($1, $2, $3, $4) RETURNING id, email, name, is_admin, recovery_pin',
      [email, hashedPassword, name, recoveryPin]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin },
      token,
      recoveryPin: user.recovery_pin // TEMP: Remove when email system is implemented
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user (protected route)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, is_admin, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({ user: { ...user, isAdmin: user.is_admin } });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Forgot password - Reset password using recovery PIN
// NOTE: This is a placeholder implementation until email system is added
// In production, the PIN should be sent to the user's email instead of being stored persistently
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, recoveryPin, newPassword } = req.body;

    // Validate input
    if (!email || !recoveryPin || !newPassword) {
      return res.status(400).json({ error: 'Email, recovery PIN, and new password are required' });
    }

    // Validate new password requirements
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    if (!/\d/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must include at least one number' });
    }

    // Find user and verify PIN
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND recovery_pin = $2 AND is_admin = FALSE',
      [email, recoveryPin]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or recovery PIN' });
    }

    const user = result.rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.json({ 
      message: 'Password reset successfully',
      success: true
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
