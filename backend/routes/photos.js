import express from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all photos for a business
router.get('/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const result = await pool.query(
      'SELECT * FROM business_photos WHERE business_id = $1 ORDER BY created_at DESC',
      [businessId]
    );
    res.json({ photos: result.rows });
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add a photo (owner only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { business_id, image_url, caption } = req.body;
    if (!business_id || !image_url) {
      return res.status(400).json({ error: 'business_id and image_url are required' });
    }

    // Verify the requester owns this business
    const ownerCheck = await pool.query(
      'SELECT id FROM businesses WHERE id = $1 AND business_owner_id = $2',
      [business_id, req.user.id]
    );
    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(
      'INSERT INTO business_photos (business_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [business_id, image_url, caption || null]
    );
    res.status(201).json({ photo: result.rows[0] });
  } catch (error) {
    console.error('Add photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a photo (owner only)
router.delete('/:photoId', authenticateToken, async (req, res) => {
  try {
    const { photoId } = req.params;

    // Verify ownership via join
    const ownerCheck = await pool.query(
      `SELECT bp.id FROM business_photos bp
       JOIN businesses b ON b.id = bp.business_id
       WHERE bp.id = $1 AND b.business_owner_id = $2`,
      [photoId, req.user.id]
    );
    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM business_photos WHERE id = $1', [photoId]);
    res.json({ message: 'Photo deleted' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
