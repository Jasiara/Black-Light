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

// POST create new business (protected - business owner only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    let { name, category, description, address, city, state, zip_code, phone, email, website, hours, latitude, longitude, image_url, community_tags } = req.body;

    // Validate required fields
    if (!name || !category || !address || !city || !state || !zip_code || !latitude || !longitude) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Verify user is a business owner
    const userResult = await pool.query(
      'SELECT user_type FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userResult.rows[0].user_type !== 'business_owner') {
      return res.status(403).json({ error: 'Only business owners can create businesses' });
    }

    // Parse hours if it's a string
    let hoursData = null;
    if (hours) {
      if (typeof hours === 'string') {
        try {
          hoursData = JSON.parse(hours);
        } catch (e) {
          console.error('Failed to parse hours:', hours);
          hoursData = { 'Mon-Fri': '9am-5pm', 'Sat-Sun': 'Closed' };
        }
      } else {
        hoursData = hours;
      }
    }

    // Parse community tags
    let tagsData = [];
    if (community_tags) {
      if (Array.isArray(community_tags)) {
        tagsData = community_tags;
      } else if (typeof community_tags === 'string') {
        try {
          tagsData = JSON.parse(community_tags);
        } catch (e) {
          tagsData = [];
        }
      }
    }

    // Limit image_url to prevent data issues (max 500 chars for VARCHAR)
    if (image_url && image_url.length > 500) {
      console.warn('image_url exceeds 500 chars, truncating or removing');
      if (image_url.startsWith('data:')) {
        // Base64 image too large, don't store it
        image_url = null;
      } else {
        image_url = image_url.substring(0, 500);
      }
    }

    // Create business
    const result = await pool.query(
      `INSERT INTO businesses (business_owner_id, name, category, description, address, city, state, zip_code, phone, email, website, hours, latitude, longitude, image_url, community_tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id, name, category, description, address, city, state, zip_code, phone, email, website, hours, latitude, longitude, image_url, community_tags, created_at`,
      [req.user.id, name, category, description, address, city, state, zip_code, phone, email, website, hoursData ? JSON.stringify(hoursData) : null, latitude, longitude, image_url, JSON.stringify(tagsData)]
    );

    const business = result.rows[0];
    console.log('Business created successfully:', business);

    res.status(201).json({
      message: 'Business created successfully',
      business
    });
  } catch (error) {
    console.error('Create business error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// PUT update business community tags (protected - business owner only)
router.put('/:id/tags', authenticateToken, async (req, res) => {
  try {
    const businessId = req.params.id;
    let { community_tags } = req.body;

    // Verify business exists and user is the owner
    const businessResult = await pool.query(
      'SELECT business_owner_id FROM businesses WHERE id = $1',
      [businessId]
    );

    if (businessResult.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    if (businessResult.rows[0].business_owner_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own business' });
    }

    // Parse community tags
    let tagsData = [];
    if (community_tags) {
      if (Array.isArray(community_tags)) {
        tagsData = community_tags;
      } else if (typeof community_tags === 'string') {
        try {
          tagsData = JSON.parse(community_tags);
        } catch (e) {
          tagsData = [];
        }
      }
    }

    // Update business tags
    const result = await pool.query(
      'UPDATE businesses SET community_tags = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, community_tags, updated_at',
      [JSON.stringify(tagsData), businessId]
    );

    const business = result.rows[0];
    console.log('Business tags updated:', business);

    res.json({
      message: 'Business tags updated successfully',
      business
    });
  } catch (error) {
    console.error('Update tags error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET recommended businesses based on user interests (protected)
router.get('/recommended/for-you', authenticateToken, async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    // Get user with interests
    const userResult = await pool.query(
      'SELECT interests FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    let interests = userResult.rows[0].interests;
    console.log('Raw interests from DB:', interests);
    console.log('Interests type:', typeof interests);
    
    // Parse interests if it's a string (sometimes PostgreSQL returns strings)
    if (typeof interests === 'string') {
      try {
        interests = JSON.parse(interests);
      } catch (e) {
        console.log('Failed to parse interests as JSON, treating as array');
        interests = [];
      }
    }
    
    // Ensure interests is an array
    if (!Array.isArray(interests)) {
      interests = [];
    }
    
    console.log('Parsed interests:', interests);
    console.log('Interests array length:', interests.length);

    // If user has no interests, return empty array
    if (!interests || interests.length === 0) {
      console.log('No interests found, returning empty array');
      return res.json({ businesses: [], source: 'none' });
    }

    // First, let's see what categories exist in the database
    const categoriesResult = await pool.query('SELECT DISTINCT category FROM businesses');
    console.log('Available business categories in DB:', categoriesResult.rows.map(r => r.category));

    // Match businesses by category with user interests - EXACT MATCH ONLY
    console.log('Querying businesses with interests:', interests);
    const result = await pool.query(
      'SELECT * FROM businesses WHERE category = ANY($1) ORDER BY name LIMIT $2',
      [interests, limit]
    );
    
    console.log('Found matching businesses:', result.rows.length);
    console.log('Matching businesses:', result.rows.map(b => ({ id: b.id, name: b.name, category: b.category })));

    res.json({ businesses: result.rows, source: 'interests' });
  } catch (error) {
    console.error('Get recommended businesses error:', error);
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
