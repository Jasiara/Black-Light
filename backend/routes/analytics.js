import express from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST record an event (public — no auth needed so visits are tracked for all users)
router.post('/event', async (req, res) => {
  try {
    const { business_id, event_type } = req.body;
    const allowed = ['visit', 'website_click'];
    if (!business_id || !allowed.includes(event_type)) {
      return res.status(400).json({ error: 'Invalid event' });
    }
    await pool.query(
      'INSERT INTO business_events (business_id, event_type) VALUES ($1, $2)',
      [business_id, event_type]
    );
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Record event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET analytics summary for the owner's business (protected)
router.get('/summary/:businessId', authenticateToken, async (req, res) => {
  try {
    const { businessId } = req.params;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM businesses WHERE id = $1 AND business_owner_id = $2',
      [businessId, req.user.id]
    );
    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Total event counts by type
    const totals = await pool.query(
      `SELECT event_type, COUNT(*)::int AS count
       FROM business_events WHERE business_id = $1
       GROUP BY event_type`,
      [businessId]
    );

    // Favorites count
    const favResult = await pool.query(
      'SELECT COUNT(*)::int AS count FROM favorites WHERE business_id = $1',
      [businessId]
    );

    // Reviews count & avg rating
    const reviewResult = await pool.query(
      `SELECT COUNT(*)::int AS count, ROUND(AVG(rating)::numeric,1) AS avg_rating
       FROM reviews WHERE business_id = $1`,
      [businessId]
    );

    // Visits by day for the last 30 days
    const visitsByDay = await pool.query(
      `SELECT DATE(created_at) AS day, COUNT(*)::int AS count
       FROM business_events
       WHERE business_id = $1 AND event_type = 'visit'
         AND created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY day ASC`,
      [businessId]
    );

    // Visits this week vs last week
    const weekCompare = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE created_at >= date_trunc('week', NOW()))::int AS this_week,
         COUNT(*) FILTER (WHERE created_at >= date_trunc('week', NOW()) - INTERVAL '7 days'
                            AND created_at < date_trunc('week', NOW()))::int AS last_week
       FROM business_events
       WHERE business_id = $1 AND event_type = 'visit'`,
      [businessId]
    );

    const eventMap = {};
    totals.rows.forEach(r => { eventMap[r.event_type] = r.count; });

    res.json({
      visits: eventMap['visit'] || 0,
      website_clicks: eventMap['website_click'] || 0,
      favorites: favResult.rows[0].count,
      review_count: reviewResult.rows[0].count,
      avg_rating: reviewResult.rows[0].avg_rating,
      visits_by_day: visitsByDay.rows,
      this_week_visits: weekCompare.rows[0].this_week,
      last_week_visits: weekCompare.rows[0].last_week,
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
