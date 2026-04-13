import pool from '../config/db.js';

const addBusinessPhotosTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS business_photos (
        id SERIAL PRIMARY KEY,
        business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
        image_url TEXT NOT NULL,
        caption VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('business_photos table ready');
  } catch (error) {
    console.error('Error creating business_photos table:', error.message);
  }
};

export default addBusinessPhotosTable;
