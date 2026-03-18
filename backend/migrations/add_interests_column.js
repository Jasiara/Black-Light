import pool from '../config/db.js';

export const addInterestsColumn = async () => {
  try {
    // Add interests column if it doesn't exist
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]'::jsonb;
    `);
    console.log('Interests column added successfully');
  } catch (error) {
    console.error('Error adding interests column:', error);
    throw error;
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addInterestsColumn().then(() => {
    console.log('Migration completed');
    process.exit(0);
  }).catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}
