import pool from '../config/db.js';

const addBusinessEventsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS business_events (
        id SERIAL PRIMARY KEY,
        business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
        event_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_business_events_business_id
        ON business_events(business_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_business_events_type_date
        ON business_events(business_id, event_type, created_at);
    `);
    console.log('business_events table ready');
  } catch (error) {
    console.error('Error creating business_events table:', error.message);
  }
};

export default addBusinessEventsTable;
