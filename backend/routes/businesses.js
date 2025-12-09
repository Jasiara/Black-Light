import express from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all businesses with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, city, search, limit = 50 } = req.query;
    
    let query = 'SELECT * FROM businesses WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (city) {
      query += ` AND city ILIKE $${paramCount}`;
      params.push(`%${city}%`);
      paramCount++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json({ businesses: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET random featured businesses
router.get('/featured', async (req, res) => {
  try {
    const { limit = 3 } = req.query;
    const result = await pool.query(
      'SELECT * FROM businesses ORDER BY RANDOM() LIMIT $1',
      [limit]
    );
    res.json({ businesses: result.rows });
  } catch (error) {
    console.error('Get featured businesses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single business by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get business details
    const businessResult = await pool.query('SELECT * FROM businesses WHERE id = $1', [id]);
    
    if (businessResult.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Get reviews for this business
    const reviewsResult = await pool.query(
      `SELECT r.*, u.name as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.business_id = $1 
       ORDER BY r.created_at DESC`,
      [id]
    );

    const business = businessResult.rows[0];
    business.reviews = reviewsResult.rows;

    // Calculate average rating
    if (reviewsResult.rows.length > 0) {
      const avgRating = reviewsResult.rows.reduce((sum, review) => sum + review.rating, 0) / reviewsResult.rows.length;
      business.average_rating = avgRating.toFixed(1);
    } else {
      business.average_rating = null;
    }

    res.json({ business });
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create new business (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
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

    // Validate required fields
    if (!name || !category || !address || !city) {
      return res.status(400).json({ error: 'Name, category, address, and city are required' });
    }

    const result = await pool.query(
      `INSERT INTO businesses 
       (name, category, description, address, city, state, zip_code, phone, email, website, hours, latitude, longitude, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [name, category, description, address, city, state, zip_code, phone, email, website, 
       hours ? JSON.stringify(hours) : null, latitude, longitude, image_url]
    );

    res.status(201).json({
      message: 'Business created successfully',
      business: result.rows[0]
    });
  } catch (error) {
    console.error('Create business error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update business (protected)
router.put('/:id', authenticateToken, async (req, res) => {
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

    // Check if business exists
    const checkResult = await pool.query('SELECT * FROM businesses WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const result = await pool.query(
      `UPDATE businesses 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           description = COALESCE($3, description),
           address = COALESCE($4, address),
           city = COALESCE($5, city),
           state = COALESCE($6, state),
           zip_code = COALESCE($7, zip_code),
           phone = COALESCE($8, phone),
           email = COALESCE($9, email),
           website = COALESCE($10, website),
           hours = COALESCE($11, hours),
           latitude = COALESCE($12, latitude),
           longitude = COALESCE($13, longitude),
           image_url = COALESCE($14, image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING *`,
      [name, category, description, address, city, state, zip_code, phone, email, website,
       hours ? JSON.stringify(hours) : null, latitude, longitude, image_url, id]
    );

    res.json({
      message: 'Business updated successfully',
      business: result.rows[0]
    });
  } catch (error) {
    console.error('Update business error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE business (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if business exists
    const checkResult = await pool.query('SELECT * FROM businesses WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    await pool.query('DELETE FROM businesses WHERE id = $1', [id]);

    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
