import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <svg className="nav-logo-stars" viewBox="0 0 48 36" fill="#ffd700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* main four-pointed star — center */}
            <polygon points="24,7 26.12,15.88 35,18 26.12,20.12 24,29 21.88,20.12 13,18 21.88,15.88" />
            {/* small four-pointed star — bottom-left */}
            <polygon points="11,22 12.27,26.73 17,28 12.27,29.27 11,34 9.73,29.27 5,28 9.73,26.73" opacity="0.9" />
            {/* small four-pointed star — upper-right */}
            <polygon points="37,2 38.27,6.73 43,8 38.27,9.27 37,14 35.73,9.27 31,8 35.73,6.73" opacity="0.9" />
          </svg>
          Black Light
          {user?.userType === 'business_owner' && (
            <span className="nav-logo-badge">business</span>
          )}
        </Link>
        <div className="nav-menu">
          <Link to="/" className={`nav-link ${isActive('/') ? 'nav-link--active' : ''}`}>
            <Home size={15} />
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'nav-link--active' : ''}`}>
                <Heart size={15} />
                Favorites
              </Link>
              {user?.userType === 'business_owner' && (
                <>
                  <Link to="/business-dashboard" className={`nav-link ${isActive('/business-dashboard') ? 'nav-link--active' : ''}`}>
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>
                  <Link to="/business/messages" className={`nav-link ${isActive('/business/messages') ? 'nav-link--active' : ''}`}>
                    💬 Messages
                  </Link>
                  <Link to="/business/settings" className={`nav-link ${isActive('/business/settings') ? 'nav-link--active' : ''}`}>
                    ⚙️ Settings
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className={`nav-link admin-link ${isActive('/admin') ? 'nav-link--active' : ''}`}>
                  <ShieldCheck size={15} />
                  Admin
                </Link>
              )}
              <span className="nav-user">Hello, {user?.name}</span>
              <button onClick={logout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className={`nav-link ${isActive('/login') ? 'nav-link--active' : ''}`}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
