import express from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET reviews for a business
router.get('/business/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    
    const result = await pool.query(
      `SELECT r.*, u.name as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.business_id = $1 
       ORDER BY r.created_at DESC`,
      [businessId]
    );

    res.json({ reviews: result.rows });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create review (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { business_id, rating, comment } = req.body;
    const user_id = req.user.id;

    // Validate input
    if (!business_id || !rating) {
      return res.status(400).json({ error: 'Business ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if business exists
    const businessCheck = await pool.query('SELECT * FROM businesses WHERE id = $1', [business_id]);
    if (businessCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Check if user already reviewed this business
    const reviewCheck = await pool.query(
      'SELECT * FROM reviews WHERE business_id = $1 AND user_id = $2',
      [business_id, user_id]
    );

    if (reviewCheck.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this business' });
    }

    const result = await pool.query(
      'INSERT INTO reviews (business_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [business_id, user_id, rating, comment]
    );

    res.status(201).json({
      message: 'Review created successfully',
      review: result.rows[0]
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE review (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if review exists and belongs to user
    const reviewCheck = await pool.query(
      'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (reviewCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    await pool.query('DELETE FROM reviews WHERE id = $1', [id]);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
