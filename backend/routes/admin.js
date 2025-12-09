import express from 'express';
import pool from '../config/db.js';
import { authenticateAdmin } from '../middleware/admin.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, is_admin, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.name as user_name, u.email as user_email, b.name as business_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN businesses b ON r.business_id = b.id
      ORDER BY r.created_at DESC
    `);
    res.json({ reviews: result.rows });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete review
router.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM reviews WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all businesses (admin view)
router.get('/businesses', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM businesses ORDER BY created_at DESC'
    );
    res.json({ businesses: result.rows });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update business
router.put('/businesses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      description,
      address,
      city,
      state,
      zip_code,
      phone,
      email,
      website,
      hours,
      latitude,
      longitude,
      image_url
    } = req.body;

    const result = await pool.query(
      `UPDATE businesses 
       SET name = $1, category = $2, description = $3, address = $4, 
           city = $5, state = $6, zip_code = $7, phone = $8, 
           email = $9, website = $10, hours = $11, latitude = $12, 
           longitude = $13, image_url = $14, updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING *`,
      [name, category, description, address, city, state, zip_code, phone, 
       email, website, hours, latitude, longitude, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json({ 
      message: 'Business updated successfully',
      business: result.rows[0]
    });
  } catch (error) {
    console.error('Update business error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete business
router.delete('/businesses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM businesses WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
