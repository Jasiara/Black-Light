import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import BusinessDetail from './pages/BusinessDetail';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import AdminPage from './pages/AdminPage';
import ForgotPassword from './pages/ForgotPassword';
import BusinessDashboard from './pages/BusinessDashboard';
import './App.css';

function AppContent() {
  const location = useLocation();
  
  // Hide navbar on admin and business dashboard pages
  const hideNavbar = location.pathname.startsWith('/admin') || location.pathname.startsWith('/business');
  
  return (
    <div className="app">
      {!hideNavbar && <Navbar />}
      <main>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/business/:id" element={<BusinessDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/business-dashboard" element={<BusinessDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
