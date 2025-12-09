# Black Light - Black-Owned Business Directory

A full-stack web application that helps users discover and support Black-owned businesses in their area.

## Features

- 🔍 Search and filter businesses by category and location
- 🗺 Interactive map view with OpenStreetMap (completely free!)
- 🏪 Detailed business profiles with reviews
- ❤ User accounts with favorites and reviews
- ✨ Featured businesses on homepage
- 📱 Responsive design for mobile and desktop

## Tech Stack

### Frontend
- React.js with React Router
- Axios for API calls
- Leaflet + React-Leaflet for interactive maps (OpenStreetMap)

### Backend
- Node.js + Express
- PostgreSQL database
- JWT authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/blacklight
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Create PostgreSQL database:
```sql
CREATE DATABASE blacklight;
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000` and automatically create tables and seed sample data.

### Frontend Setup

1. In the root directory, install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Businesses
- `GET /api/businesses` - Get all businesses (with filters)
- `GET /api/businesses/featured` - Get random featured businesses
- `GET /api/businesses/:id` - Get business by ID
- `POST /api/businesses` - Create business (protected)
- `PUT /api/businesses/:id` - Update business (protected)
- `DELETE /api/businesses/:id` - Delete business (protected)

### Reviews
- `GET /api/reviews/business/:businessId` - Get reviews for business
- `POST /api/reviews` - Create review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

### Favorites
- `GET /api/favorites` - Get user's favorites (protected)
- `POST /api/favorites` - Add favorite (protected)
- `DELETE /api/favorites/:businessId` - Remove favorite (protected)

## Testing with Postman

1. Import the API endpoints into Postman
2. For protected routes, first login to get a JWT token:
   - POST to `/api/auth/login` with email and password
   - Copy the token from the response
   - Add to Authorization header: `Bearer YOUR_TOKEN`

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set environment variables
5. Deploy

## Project Structure

```
Black-Light/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── schema.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── businesses.js
│   │   ├── reviews.js
│   │   └── favorites.js
│   ├── server.js
│   └── package.json
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Search.jsx
│   │   ├── BusinessDetail.jsx
│   │   ├── Login.jsx
│   │   └── Favorites.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## License

MIT
