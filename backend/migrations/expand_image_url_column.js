import pool from '../config/db.js';

const expandImageUrlColumn = async () => {
  try {
    await pool.query(`
      ALTER TABLE businesses
      ALTER COLUMN image_url TYPE TEXT;
    `);
    console.log('image_url column expanded to TEXT');
  } catch (error) {
    // Column may already be TEXT — safe to ignore
    if (error.message?.includes('already')) {
      console.log('image_url already TEXT, skipping');
    } else {
      console.error('Error expanding image_url column:', error.message);
    }
  }
};

export default expandImageUrlColumn;
