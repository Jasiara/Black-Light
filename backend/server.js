require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// session (tokenless auth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true } // set secure:true when using https
}));

// DB pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Cloudinary config
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
}

// nodemailer transporter (for notifications)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Multer setup
const upload = multer({ dest: 'uploads/' });

/* ----------------- Helpers ----------------- */
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ error: 'Authentication required' });
}

function requireAdmin(req, res, next) {
  // simple admin check: session has isAdmin true OR ADMIN_SECRET header
  const adminSecret = req.headers['x-admin-secret'] || req.body.adminSecret;
  if ((req.session && req.session.user && req.session.user.is_admin) || (adminSecret && adminSecret === process.env.ADMIN_SECRET)) return next();
  return res.status(403).json({ error: 'Admin access required' });
}

/* ----------------- Auth Routes ----------------- */
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email, is_admin',
      [name, email, hash]
    );
    const user = result.rows[0];
    // create session
    req.session.user = { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin };
    res.json({ user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not register (email maybe taken)' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const result = await pool.query('SELECT id, name, email, password_hash, is_admin FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    req.session.user = { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin };
    res.json({ user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: req.session.user || null });
});

/* ----------------- Businesses ----------------- */

// Haversine helper (implemented in SQL below)
// GET /api/businesses - search/filter
app.get('/api/businesses', async (req, res) => {
  try {
    const { q, category, city, lat, lon, radius_km = 50, limit = 50, offset = 0 } = req.query;
    let values = [];
    let where = ['approved = TRUE'];
    if (q) {
      values.push('%' + q + '%');
      where.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length})`);
    }
    if (category) {
      values.push(category);
      where.push(`category = $${values.length}`);
    }
    if (city) {
      values.push(city);
      where.push(`city ILIKE $${values.length}`);
    }

    // base query
    let base = 'SELECT *, ';

    if (lat && lon) {
      // compute distance in km using Haversine
      base += `(
        6371 * acos(
          cos(radians($${values.length+1})) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($${values.length+2})) +
          sin(radians($${values.length+1})) * sin(radians(latitude))
        )
      ) as distance_km`;
      values.push(parseFloat(lat));
      values.push(parseFloat(lon));
    } else {
      base += 'NULL as distance_km';
    }

    base += ' FROM businesses';
    if (where.length) {
      base += ' WHERE ' + where.join(' AND ');
    }

    if (lat && lon) {
      values.push(parseFloat(radius_km));
      base += ` HAVING distance_km <= $${values.length}`;
    }

    values.push(limit);
    values.push(offset);
    base += ` ORDER BY ${(lat && lon) ? 'distance_km' : 'created_at'} ASC LIMIT $${values.length-1} OFFSET $${values.length}`;

    const result = await pool.query(
  `INSERT INTO businesses 
   (name, category, description, address, city, state, zip, phone, website, latitude, longitude, owner_email, image_url, approved)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14, FALSE) 
   RETURNING *`,
  [
    name,
    category,
    description,
    address,
    city,
    state,
    zip,
    phone,
    website,
    latitude || null,
    longitude || null,
    owner_email,
    image_url,
  ]
);


// Featured random businesses for homepage
app.get('/api/businesses/featured', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM businesses WHERE approved = TRUE ORDER BY RANDOM() LIMIT 6');
    res.json({ featured: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get business
app.get('/api/businesses/:id', async (req, res) => {
  const id = req.params.id;
  const result = await pool.query('SELECT * FROM businesses WHERE id=$1', [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ business: result.rows[0] });
});

// Create business (owner submits) - requires login
app.post('/api/businesses', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, address, city, state, zip, phone, website, latitude, longitude } = req.body;
    let image_url = null;
    if (req.file && process.env.CLOUDINARY_URL) {
      const resp = await cloudinary.uploader.upload(req.file.path, { folder: 'blacklight' });
      image_url = resp.secure_url;
    }
    const owner_email = req.session.user.email;
    const result = await pool.query(
      `INSERT INTO businesses (name, category, description, address, city, state, zip, phone, website, latitude, longitude, owner_email, image_url, approved)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, FALSE) RETURNING *`,
      [name, category, description, address, city, state, zip, phone, website, latitude || null, longitude || null, owner_email, image_url]
    );
    // notify admin via email about new submission (if SMTP configured)
    try {
      if (process.env.SMTP_HOST) {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.SMTP_USER,
          subject: 'New business submission - Black Light',
          text: `New business submitted: ${name} by ${owner_email}`
        });
      }
    } catch (mailErr) {
      console.error('Mail error', mailErr);
    }

    res.json({ business: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create business' });
  }
});

// Admin: approve business
app.post('/api/admin/approve/:id', requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('UPDATE businesses SET approved = TRUE WHERE id = $1', [id]);
    // notify owner if owner_email exists
    const ownerRes = await pool.query('SELECT owner_email, name FROM businesses WHERE id=$1', [id]);
    if (ownerRes.rows[0] && ownerRes.rows[0].owner_email && process.env.SMTP_HOST) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: ownerRes.rows[0].owner_email,
        subject: 'Your business is approved on Black Light',
        text: `Hi, your submission "${ownerRes.rows[0].name}" has been approved and is now visible.`
      });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not approve' });
  }
});

// Ratings
app.post('/api/businesses/:id/rate', requireAuth, async (req, res) => {
  try {
    const businessId = req.params.id;
    const userId = req.session.user.id;
    const { rating, review } = req.body;
    await pool.query(
      `INSERT INTO ratings (user_id, business_id, rating, review) VALUES ($1,$2,$3,$4)`,
      [userId, businessId, rating, review]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not rate' });
  }
});

// Admin: list pending businesses
app.get('/api/admin/pending', requireAdmin, async (req, res) => {
  const result = await pool.query('SELECT * FROM businesses WHERE approved = FALSE ORDER BY created_at DESC');
  res.json({ pending: result.rows });
});

/* ----------------- Static assets for production (optional) ----------------- */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));