import pool from '../config/db.js';

export const addCommunityTagsColumn = async () => {
  try {
    await pool.query(`
      ALTER TABLE businesses 
      ADD COLUMN IF NOT EXISTS community_tags JSONB DEFAULT '[]'::jsonb
    `);
    console.log('✓ community_tags column added successfully');
  } catch (error) {
    console.error('Error adding community_tags column:', error);
  }
};

export default addCommunityTagsColumn;
