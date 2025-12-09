## MVP-DEMO VIDEO LINK 

-[Click here!](https://uncg-my.sharepoint.com/:v:/g/personal/jnmayes_uncg_edu/IQAxddcvapO4Qrs1q4VG72pZAYSR8ud3WoM-AMugLbMf4Qk?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=q5Aflc)

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

# Deployed Application

🚀 **Deployed App URL:** [Coming Soon - Deploying to Vercel & Render]


## Reflection & Development Journey

### Design Choices

#### Frontend Framework (React.js)
I chose **React** for the frontend because:
- **Component-Based Architecture**: React's component model allowed me to create reusable UI elements like business cards, navigation bars, and review forms
- **State Management**: React's hooks (useState, useEffect, useContext) made it easy to manage user authentication state and dynamic data
- **Routing**: React Router provided seamless navigation between pages without full page reloads
- **Ecosystem**: Rich library support for mapping (React-Leaflet) and HTTP requests (Axios)
- **Learning Opportunity**: React is industry-standard and excellent for building single-page applications

#### Backend Structure (Node.js + Express)
I implemented a **RESTful API architecture** because:
- **Separation of Concerns**: Clear separation between frontend and backend allows independent development and deployment
- **Express.js**: Lightweight, flexible framework perfect for building REST APIs with clean route definitions
- **Middleware Pattern**: Easy to implement authentication, error handling, and request validation
- **JWT Authentication**: Stateless authentication using JSON Web Tokens provides security without server-side session storage
- **Scalability**: RESTful design allows the API to be consumed by multiple clients (web, mobile, etc.)

#### Database Schema (PostgreSQL)
I chose **PostgreSQL** with a relational schema because:
- **Data Relationships**: Natural fit for modeling relationships between users, businesses, reviews, and favorites
- **Foreign Keys & Cascading**: Automatic cleanup when users or businesses are deleted
- **JSON Support**: JSONB fields for flexible data like business hours
- **Free & Open Source**: No licensing costs, perfect for educational projects


### Challenges Faced

#### 1. **Google Maps API Cost**
**Problem**: Initially planned to use Google Maps API, but discovered it requires billing information even for development.

**Solution**: Switched to **OpenStreetMap with Leaflet** - completely free and open-source. Required:
- Learning Leaflet API documentation
- Installing React-Leaflet bindings
- Finding accurate latitude/longitude for Greensboro businesses
- Configuring map tiles and markers

#### 2. **JSON Parsing Errors**
**Problem**: Application crashed with "JSON.parse: [object Object] is not valid JSON" when displaying business hours.

**Solution**: 
- Discovered PostgreSQL returns JSONB fields as objects, not strings
- Added type checking before parsing: `typeof hours === 'string' ? JSON.parse(hours) : hours`
- Wrapped in try-catch blocks for safe error handling

#### 3. **Browser Back Button Navigation**
**Problem**: Using browser back button showed blank white screen instead of previous page.

**Solution**: Added `key={location.pathname}` prop to Routes component to force React to remount components on URL changes.

#### 4. **Port Conflicts (EADDRINUSE)**
**Problem**: Backend failed to start with "port 5000 already in use" error on Windows.

**Solution**: Changed backend port from 5000 to 3001 in server configuration and updated frontend API URL accordingly.

#### 5. **Role-Based Access Control**
**Problem**: Needed to implement admin features without breaking existing user functionality.

**Solution**:
- Added `is_admin` boolean column to users table
- Included admin status in JWT token payload
- Created separate admin middleware for route protection
- Built admin-only routes and dashboard component
- Conditional rendering in frontend based on user role

#### 6. **Password Security**
**Problem**: Needed to enforce strong passwords without making registration too difficult.

**Solution**: Implemented validation requiring:
- Minimum 8 characters
- At least one number
- Validated on both client (immediate feedback) and server (security)

### Learning Outcomes

#### Full-Stack Development
1. **API Design**: Learned to design RESTful endpoints with proper HTTP methods (GET, POST, PUT, DELETE) and status codes
2. **Authentication Flow**: Implemented complete JWT-based auth with registration, login, token storage, and protected routes
3. **Database Modeling**: Designed normalized relational schema with foreign keys and cascade deletes
4. **State Management**: Managed complex application state across components using Context API
5. **Error Handling**: Implemented comprehensive error handling on both frontend and backend

#### Technical Skills
1. **PostgreSQL**: Learned SQL queries, joins, migrations, and JSONB data types
2. **Express Middleware**: Built custom authentication and admin authorization middleware
3. **React Hooks**: Mastered useState, useEffect, useContext, useNavigate for modern React patterns
4. **Async JavaScript**: Handled promises, async/await, and error catching throughout the stack
5. **Environment Variables**: Configured different environments for development and production

#### Development Workflow
1. **Git Version Control**: Regular commits, branching, and GitHub integration
2. **API Testing**: Used Postman to test endpoints before frontend integration
3. **Debugging**: Used browser DevTools, console logging, and PostgreSQL query inspector
4. **Documentation**: Wrote clear README with setup instructions and API documentation

#### Problem-Solving
1. **Research Skills**: Learned to read documentation (Leaflet, React Router, PostgreSQL)
2. **Stack Overflow**: Found solutions to specific errors and adapted them to my project
3. **Alternative Solutions**: When Google Maps proved expensive, researched and implemented free alternatives
4. **Incremental Development**: Built features one at a time, testing before moving forward

### Future Work

Continuing to build upon this app I would add:

#### 1. **Advanced Search & Filtering**
- Filter by "Open Now" based on business hours and current time
- Multi-select category filters
- Radius-based search (find businesses within X miles)
- Sort by rating, distance, or recently added
- Search by business name or keywords

#### 2. **Business Owner Features**
- Allow business owners to claim their listings
- Owner dashboard to update information, hours, and photos
- Respond to reviews
- View analytics (page views, favorites, review trends)

#### 3. **Enhanced Media**
- Photo upload for businesses and reviews (AWS S3 or Cloudinary)
- Multiple photos per business in a gallery
- User profile pictures
- Image compression and optimization

#### 4. **Social Features**
- Share businesses on social media (Facebook, Twitter, WhatsApp)
- Email a business link to friends
- Follow other users
- Notification system for new reviews on favorited businesses

#### 5. **Rating Enhancements**
- Display average rating on business cards
- Rating distribution chart (how many 5-star, 4-star, etc.)
- "Helpful" votes on reviews
- Filter reviews by rating

#### 6. **Mobile Optimization**
- Progressive Web App (PWA) for offline access
- Native mobile apps (React Native)
- Touch-optimized map interactions
- Geolocation to find nearby businesses

#### 7. **Email Integration**
- Email verification for new accounts
- Password reset via email
- Weekly newsletter of featured businesses
- Review notifications for business owners

#### 8. **Analytics & Reporting**
- Admin dashboard with usage statistics
- Most popular businesses
- User engagement metrics
- Export reports to CSV/PDF

#### 9. **Accessibility**
- Screen reader support (ARIA labels)
- Keyboard navigation
- High contrast mode
- Text size controls

#### 10. **Performance Optimization**
- Pagination for large result sets
- Lazy loading images
- Database indexing for faster queries
- Caching frequently accessed data
- CDN for static assets

#### 11. **Additional Features**
- Business event calendar
- Special offers/promotions section
- Integration with Google Business API for automated updates
- Multiple language support (i18n)
- Dark mode theme
- Business verification badges

## License

MIT
