import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import BusinessDetail from './pages/BusinessDetail';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import AdminPage from './pages/AdminPage';
import ForgotPassword from './pages/ForgotPassword';
import './App.css';

function AppContent() {
  const location = useLocation();
  
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/business/:id" element={<BusinessDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
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
