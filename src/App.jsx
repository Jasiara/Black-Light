import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useState } from 'react';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import LandingOverlay from './components/LandingOverlay';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import BusinessDetail from './pages/BusinessDetail';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import AdminPage from './pages/AdminPage';
import ForgotPassword from './pages/ForgotPassword';
import AboutUs from './pages/AboutUs';
import BusinessDashboard from './pages/BusinessDashboard';
import './App.css';

function AppContent() {
  const location = useLocation();
  const [showLanding, setShowLanding] = useState(true);

  return (
    <div className="app">
      {showLanding && <LandingOverlay onComplete={() => setShowLanding(false)} />}
      <ScrollToTop />
      <Navbar />
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
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
