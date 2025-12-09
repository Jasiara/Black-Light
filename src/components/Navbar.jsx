import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ✨ Black Light
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/favorites" className="nav-link">
                Favorites
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link admin-link">
                  Admin
                </Link>
              )}
              <span className="nav-user">Hello, {user?.name}</span>
              <button onClick={logout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
