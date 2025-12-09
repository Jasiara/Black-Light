# Black Light Setup Guide

## Step 1: Install PostgreSQL

### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the postgres user
4. PostgreSQL should now be running on port 5432

### Verify Installation:
```powershell
psql --version
```

## Step 2: Create Database

Open PowerShell and run:
```powershell
# Connect to PostgreSQL (enter your password when prompted)
psql -U postgres

# Create database
CREATE DATABASE blacklight;

# Exit psql
\q
```

## Step 3: Backend Setup

1. Navigate to backend folder:
```powershell
cd backend
```

2. Create .env file:
```powershell
Copy-Item .env.example .env
```

3. Edit the .env file with your settings:
```
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/blacklight
JWT_SECRET=my_super_secret_jwt_key_change_this_in_production
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NODE_ENV=development
```

4. Install dependencies:
```powershell
npm install
```

5. Start backend server:
```powershell
npm run dev
```

The backend should start on http://localhost:5000
Tables will be created automatically and sample data will be seeded!

## Step 4: Frontend Setup

1. Open a new PowerShell window and navigate to the project root:
```powershell
cd "c:\Users\jaini\OneDrive - UNCG\CSC 372 Projects\Black-Light"
```

2. Create .env file:
```powershell
Copy-Item .env.example .env
```

3. Edit the .env file:
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. Install dependencies:
```powershell
npm install
```

5. Start frontend:
```powershell
npm run dev
```

The frontend should start on http://localhost:5173

## Step 5: Testing with Postman

1. Open Postman
2. Click Import → Upload Files
3. Select `Black-Light-API.postman_collection.json`
4. The collection will be imported with all endpoints

### Test Authentication:
1. Register a new user: POST /api/auth/register
2. Copy the token from the response
3. Click on the collection → Variables
4. Set the `token` variable to your JWT token
5. Now all protected routes will work!

## Troubleshooting

### PostgreSQL Connection Error:
- Make sure PostgreSQL is running
- Check that your DATABASE_URL has the correct password
- Verify the database exists: `psql -U postgres -l`

### Port Already in Use:
- Backend: Change PORT in backend/.env
- Frontend: It will automatically use a different port

### CORS Errors:
- Make sure backend is running on port 5000
- Check that VITE_API_URL in frontend .env is correct

## Next Steps

1. Register a new account at http://localhost:5173/login
2. Browse featured businesses on the homepage
3. Search for businesses
4. View business details
5. Add reviews and favorites (when logged in)

## Optional: Get Google Maps API Key

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Maps JavaScript API
4. Create credentials (API key)
5. Add the API key to your .env files

## Production Deployment

See README.md for deployment instructions to Vercel (frontend) and Render (backend).
