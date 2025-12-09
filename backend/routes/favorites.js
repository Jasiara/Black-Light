import express from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET user's favorites (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT b.*, f.created_at as favorited_at 
       FROM favorites f 
       JOIN businesses b ON f.business_id = b.id 
       WHERE f.user_id = $1 
       ORDER BY f.created_at DESC`,
      [user_id]
    );

    res.json({ favorites: result.rows });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add favorite (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { business_id } = req.body;
    const user_id = req.user.id;

    if (!business_id) {
      return res.status(400).json({ error: 'Business ID is required' });
    }

    // Check if business exists
    const businessCheck = await pool.query('SELECT * FROM businesses WHERE id = $1', [business_id]);
    if (businessCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Check if already favorited
    const favoriteCheck = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND business_id = $2',
      [user_id, business_id]
    );

    if (favoriteCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Business already in favorites' });
    }

    const result = await pool.query(
      'INSERT INTO favorites (user_id, business_id) VALUES ($1, $2) RETURNING *',
      [user_id, business_id]
    );

    res.status(201).json({
      message: 'Business added to favorites',
      favorite: result.rows[0]
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE remove favorite (protected)
router.delete('/:businessId', authenticateToken, async (req, res) => {
  try {
    const { businessId } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND business_id = $2 RETURNING *',
      [user_id, businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Business removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
