import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createTables, seedDatabase } from './config/schema.js';

// Import routes
import authRoutes from './routes/auth.js';
import businessRoutes from './routes/businesses.js';
import reviewRoutes from './routes/reviews.js';
import favoriteRoutes from './routes/favorites.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
(async () => {
  await createTables();
  await seedDatabase();
})();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Black Light API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (protected)'
      },
      businesses: {
        getAll: 'GET /api/businesses',
        getFeatured: 'GET /api/businesses/featured',
        getById: 'GET /api/businesses/:id',
        create: 'POST /api/businesses (protected)',
        update: 'PUT /api/businesses/:id (protected)',
        delete: 'DELETE /api/businesses/:id (protected)'
      },
      reviews: {
        getByBusiness: 'GET /api/reviews/business/:businessId',
        create: 'POST /api/reviews (protected)',
        delete: 'DELETE /api/reviews/:id (protected)'
      },
      favorites: {
        getAll: 'GET /api/favorites (protected)',
        add: 'POST /api/favorites (protected)',
        remove: 'DELETE /api/favorites/:businessId (protected)'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
});
