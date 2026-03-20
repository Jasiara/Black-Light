import pool from '../config/db.js';

const addUserTypeColumn = async () => {
  try {
    console.log('Adding user_type column to users table...');
    
    // Add user_type column if it doesn't exist
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'customer'
    `);
    
    console.log('✓ user_type column added successfully');
  } catch (error) {
    console.error('Error adding user_type column:', error);
  }
};

export default addUserTypeColumn;
