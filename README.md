Black Light - Fullstack starter project
=======================================

Structure:
- backend/   -> Express backend (session-based auth, image upload hooks, admin approval, ratings)
- frontend/  -> React frontend (search, featured, add business, admin view)
- database/  -> schema.sql and seed.sql to create DB and populate sample data

Quick start:
1. Create PostgreSQL database, e.g. `blacklightdb`
   createdb blacklightdb
2. Run schema and seed:
   psql -d blacklightdb -f database/schema.sql
   psql -d blacklightdb -f database/seed.sql
3. Configure backend:
   cd backend
   cp .env.example .env
   # edit .env with your values (DATABASE_URL, SESSION_SECRET, ADMIN_SECRET, SMTP and CLOUDINARY if used)
   npm install
   npm run dev
4. Configure frontend:
   cd frontend
   npm install
   cp .env.example .env
   npm start

Notes:
- Authentication is session/cookie based (no JWT).
- Admin approval: the Admin page uses an 'X-Admin-Secret' header or server-side sessions for admin users.
- Map integration: frontend includes placeholders; add Google Maps JS API and render markers in BusinessDetail or Results.
- Email notifications require SMTP settings in backend .env.