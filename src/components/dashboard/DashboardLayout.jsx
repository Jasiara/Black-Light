import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = ({ children, activeTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (tab) => {
    if (tab === 'home') {
      navigate('/');
    } else if (tab === 'dashboard') {
      navigate('/business-dashboard');
    } else if (tab === 'messages') {
      navigate('/business/messages');
    } else if (tab === 'settings') {
      navigate('/business/settings');
    } else if (tab === 'profile') {
      navigate('/business/profile');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <span className="logo">💼 Black-Light</span>
          <span className="logo-subtitle">business</span>
        </div>
        
        <div className="navbar-menu">
          <button 
            className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigation('home')}
          >
            🏠 Home
          </button>
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => handleNavigation('messages')}
          >
            💬 Messages
          </button>
          <button 
            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavigation('settings')}
          >
            ⚙️ Settings
          </button>
          <button 
            className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavigation('profile')}
          >
            👤 Profile
          </button>
        </div>

        <div className="navbar-user">
          <span className="user-name">{user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
