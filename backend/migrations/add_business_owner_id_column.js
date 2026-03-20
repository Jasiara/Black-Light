import pool from '../config/db.js';

const addBusinessOwnerIdColumn = async () => {
  try {
    console.log('Adding business_owner_id column to businesses table...');
    
    // Add business_owner_id column if it doesn't exist
    await pool.query(`
      ALTER TABLE businesses 
      ADD COLUMN IF NOT EXISTS business_owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    `);
    
    console.log('✓ business_owner_id column added successfully');
  } catch (error) {
    console.error('Error adding business_owner_id column:', error);
  }
};

export default addBusinessOwnerIdColumn;
