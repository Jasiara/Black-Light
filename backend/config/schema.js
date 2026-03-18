import pool from '../config/db.js';

export const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        recovery_pin VARCHAR(6),
        interests JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Businesses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        address VARCHAR(500) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50),
        zip_code VARCHAR(20),
        phone VARCHAR(50),
        email VARCHAR(255),
        website VARCHAR(500),
        hours JSONB,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Favorites table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, business_id)
      );
    `);

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

export const seedDatabase = async () => {
  try {
    // Check if businesses already exist
    const result = await pool.query('SELECT COUNT(*) FROM businesses');
    if (result.rows[0].count > 0) {
      console.log('Database already seeded');
      return;
    }

    // Seed sample businesses
    const sampleBusinesses = [
      {
        name: 'Soul Food Kitchen',
        category: 'Food & Restaurants',
        description: 'Authentic Southern soul food with a modern twist',
        address: '220 S Elm Street',
        city: 'Greensboro',
        state: 'NC',
        zip_code: '27401',
        phone: '(336) 555-0101',
        email: 'info@soulfoodkitchen.com',
        website: 'https://soulfoodkitchen.com',
        hours: JSON.stringify({ 'Mon-Fri': '11am-9pm', 'Sat-Sun': '10am-10pm' }),
        latitude: 36.0726,
        longitude: -79.7912,
        image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'
      },
      {
        name: 'Natural Hair Studio',
        category: 'Beauty & Hair',
        description: 'Specializing in natural hair care and protective styles',
        address: '1624 Spring Garden Street',
        city: 'Greensboro',
        state: 'NC',
        zip_code: '27403',
        phone: '(336) 555-0102',
        email: 'contact@naturalhairstudio.com',
        hours: JSON.stringify({ 'Tue-Sat': '9am-6pm' }),
        latitude: 36.0805,
        longitude: -79.8146,
        image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'
      },
      {
        name: 'Black Books Boutique',
        category: 'Arts & Culture',
        description: 'Curated collection of books by Black authors',
        address: '345 S Battleground Avenue',
        city: 'Greensboro',
        state: 'NC',
        zip_code: '27401',
        phone: '(336) 555-0103',
        email: 'hello@blackbooksboutique.com',
        website: 'https://blackbooksboutique.com',
        hours: JSON.stringify({ 'Mon-Sat': '10am-7pm', 'Sun': '12pm-5pm' }),
        latitude: 36.0655,
        longitude: -79.7705,
        image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'
      },
      {
        name: 'Community Tech Solutions',
        category: 'Technology',
        description: 'IT support and web development for small businesses',
        address: '1200 W Market Street',
        city: 'Greensboro',
        state: 'NC',
        zip_code: '27407',
        phone: '(336) 555-0104',
        email: 'support@communitytechsolutions.com',
        website: 'https://communitytechsolutions.com',
        hours: JSON.stringify({ 'Mon-Fri': '9am-5pm' }),
        latitude: 36.0783,
        longitude: -79.8086,
        image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'
      },
      {
        name: 'Unity Coffee House',
        category: 'Food & Restaurants',
        description: 'Artisan coffee and pastries in a welcoming atmosphere',
        address: '1004 Gate City Boulevard',
        city: 'Greensboro',
        state: 'NC',
        zip_code: '27401',
        phone: '(336) 555-0105',
        email: 'info@unitycoffeehouse.com',
        hours: JSON.stringify({ 'Daily': '7am-8pm' }),
        latitude: 36.0603,
        longitude: -79.8168,
        image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400'
      },
      {
        name: 'The Fit Collective',
        category: 'Sports & Fitness',
        description: 'Community fitness center with group classes and personal training',
        address: '2500 Battleground Avenue',
        city: 'Greensboro',
        state: 'NC',
        zip_code: '27408',
        phone: '(336) 555-0106',
        email: 'info@thefitcollective.com',
        website: 'https://thefitcollective.com',
        hours: JSON.stringify({ 'Mon-Fri': '6am-9pm', 'Sat-Sun': '8am-6pm' }),
        latitude: 36.0550,
        longitude: -79.7650,
        image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'
      },
      {
        name: 'Threads & Style',
        category: 'Fashion & Clothing',
        description: 'Boutique featuring Black designers and sustainable fashion',
        address: '500 Elm Street',
        city: 'Greensboro',
        state: 'NC',
        zip_code: '27401',
        phone: '(336) 555-0107',
        email: 'hello@threadsandstyle.com',
        website: 'https://threadsandstyle.com',
        hours: JSON.stringify({ 'Mon-Sat': '10am-8pm', 'Sun': '12pm-6pm' }),
        latitude: 36.0744,
        longitude: -79.7895,
        image_url: 'https://images.unsplash.com/photo-1595777707802-21b287a26a83?w=400'
      },
      {
        name: 'Wellness Haven',
        category: 'Health & Wellness',
        description: 'Holistic health center offering massage, acupuncture, and wellness coaching',
        address: '1800 Spring Garden Street',
        city: 'Greensboro',
        state: 'NC',
        zip_code: '27403',
        phone: '(336) 555-0108',
        email: 'book@wellnesshaven.com',
        website: 'https://wellnesshaven.com',
        hours: JSON.stringify({ 'Tue-Sat': '9am-7pm' }),
        latitude: 36.0850,
        longitude: -79.8180,
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400'
      },
      {
        name: 'Harmony Music Studio',
        category: 'Music',
        description: 'Music lessons and recording studio for all skill levels',
        address: '1050 North Street',
        city: 'Greensboro',
        state: 'NC',
        zip_code: '27401',
        phone: '(336) 555-0109',
        email: 'hello@harmonymusicstudio.com',
        website: 'https://harmonymusicstudio.com',
        hours: JSON.stringify({ 'Mon-Fri': '2pm-9pm', 'Sat': '10am-5pm' }),
        latitude: 36.0900,
        longitude: -79.7800,
        image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400'
      },
      {
        name: 'Wanderlust Travel Agency',
        category: 'Travel & Tourism',
        description: 'Personalized travel planning with cultural tourism experiences',
        address: '800 W Main Street',
        city: 'Greensboro',
        state: 'NC',
        zip_code: '27407',
        phone: '(336) 555-0110',
        email: 'adventures@wanderlusttravel.com',
        website: 'https://wanderlusttravel.com',
        hours: JSON.stringify({ 'Mon-Fri': '9am-6pm', 'Sat': '10am-3pm' }),
        latitude: 36.0685,
        longitude: -79.8050,
        image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'
      },
      {
        name: 'Education First Tutoring',
        category: 'Education',
        description: 'Personalized tutoring and test preparation for students',
        address: '1350 N Elm Street',
        city: 'Greensboro',
        state: 'NC',
        zip_code: '27401',
        phone: '(336) 555-0111',
        email: 'info@educationfirst.com',
        hours: JSON.stringify({ 'Mon-Thu': '3pm-8pm', 'Sat': '10am-4pm' }),
        latitude: 36.0950,
        longitude: -79.7750,
        image_url: 'https://images.unsplash.com/photo-1427504494785-cdfa2d005d4a?w=400'
      }
    ];

    for (const business of sampleBusinesses) {
      await pool.query(
        `INSERT INTO businesses (name, category, description, address, city, state, zip_code, phone, email, website, hours, latitude, longitude, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          business.name,
          business.category,
          business.description,
          business.address,
          business.city,
          business.state,
          business.zip_code,
          business.phone,
          business.email,
          business.website,
          business.hours,
          business.latitude,
          business.longitude,
          business.image_url
        ]
      );
    }

    // Seed admin user
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('Admin123', 10);
    await pool.query(
      `INSERT INTO users (email, password, name, is_admin)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@blacklight.com', hashedPassword, 'Admin User', true]
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
