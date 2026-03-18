import pool from '../config/db.js';

const clearBusinesses = async () => {
  try {
    console.log('Clearing businesses table...');
    await pool.query('DELETE FROM favorites WHERE business_id IN (SELECT id FROM businesses)');
    await pool.query('DELETE FROM reviews WHERE business_id IN (SELECT id FROM businesses)');
    await pool.query('DELETE FROM businesses');
    console.log('✓ Businesses table cleared successfully');
    console.log('Database is ready to be reseeded on next server restart');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearBusinesses();
