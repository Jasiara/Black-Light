-- Seed data for Black Light
INSERT INTO users (name, email, password_hash, is_admin)
VALUES
  ('Admin User', 'admin@blacklight.example', '$2b$10$abcdefghijklmnopqrstuv', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO businesses (name, category, description, address, city, state, zip, phone, website, latitude, longitude, owner_email, approved)
VALUES
  ('Taste of Home Bakery', 'Food', 'Scratch-made bakery specializing in pastries and breads.', '123 Main St', 'Greensboro', 'NC', '27401', '336-555-0101', 'http://tasteofhome.example', 36.0726, -79.7920, 'owner1@example.com', TRUE),
  ('Crown & Brush Salon', 'Beauty', 'Hair and beauty salon focusing on natural styles.', '55 Elm Ave', 'Raleigh', 'NC', '27601', '919-555-0202', NULL, 35.7789, -78.6382, 'owner2@example.com', TRUE),
  ('Urban Threads', 'Retail', 'Independent clothing boutique offering local designers.', '200 Market St', 'Charlotte', 'NC', '28202', '704-555-0303', 'http://urbanthreads.example', 35.2271, -80.8431, 'owner3@example.com', TRUE),
  ('Community Books', 'Books', 'Local bookstore & community event space.', '8 Library Ln', 'Durham', 'NC', '27701', '919-555-0404', NULL, 35.9940, -78.8986, 'owner4@example.com', TRUE),
  ('Soul Bite', 'Food', 'Comfort food with Southern influences and vegan options.', '42 Elm St', 'Winston-Salem', 'NC', '27101', '336-555-0505', NULL, 36.0999, -80.2442, 'owner5@example.com', TRUE);