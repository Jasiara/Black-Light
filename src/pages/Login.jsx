import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import RecoveryPinModal from '../components/RecoveryPinModal';
import SelectInterests from '../components/SelectInterests';
import BusinessDetailsForm from '../components/BusinessDetailsForm';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [showInterestsSelection, setShowInterestsSelection] = useState(false);
  const [showBusinessDetailsForm, setShowBusinessDetailsForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [recoveryPin, setRecoveryPin] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!isLogin) {
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      if (!/\d/.test(formData.password)) {
        setError('Password must include at least one number');
        return;
      }
      if (isBusinessMode && !formData.businessName) {
        setError('Business name is required');
        return;
      }
    }

    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        if (!formData.name) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        
        // Business registration
        if (isBusinessMode) {
          const response = await authAPI.registerBusiness({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            businessName: formData.businessName,
          });
          
          if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            setRecoveryPin(response.data.recoveryPin);
            setShowPinModal(true);
            setLoading(false);
            return;
          } else {
            setError(response.data?.error || 'Registration failed');
            setLoading(false);
            return;
          }
        }
        
        // Regular customer registration
        result = await register(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        // Show interests selection for new registrations
        if (!isLogin) {
          // Store recovery PIN temporarily to show after interests selection
          if (result.recoveryPin) {
            localStorage.setItem('tempRecoveryPin', result.recoveryPin);
          }
          setShowInterestsSelection(true);
          return;
        }
        
        // Redirect based on user type
        const user = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
        if (user.isAdmin) {
          navigate('/admin');
        } else if (user.userType === 'business_owner') {
          navigate('/business-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePinModalClose = () => {
    setShowPinModal(false);
    try {
      const user = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      if (user.userType === 'business_owner') {
        // Show business details form instead of navigating to dashboard
        setShowBusinessDetailsForm(true);
      } else {
        navigate('/');
      }
    } catch (err) {
      navigate('/');
    }
  };

  const handleInterestsSelected = async (interests) => {
    setLoading(true);
    try {
      // Update user interests via API
      const response = await authAPI.updateInterests({ interests });
      
      if (response.data && response.data.user) {
        // Show recovery PIN modal (there should be one stored from registration)
        const storedPin = localStorage.getItem('tempRecoveryPin');
        if (storedPin) {
          setRecoveryPin(storedPin);
          localStorage.removeItem('tempRecoveryPin');
          setShowPinModal(true);
          setShowInterestsSelection(false);
          return;
        }
        
        // If no PIN stored, redirect to home
        navigate('/');
        setShowInterestsSelection(false);
      }
    } catch (err) {
      setError('Failed to save interests. Please try again.');
      setShowInterestsSelection(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessDetailsSubmit = (business) => {
    // Business created successfully
    console.log('Business created:', business);
    setShowBusinessDetailsForm(false);
    // Navigate to business dashboard
    navigate('/business-dashboard');
  };

  return (
    <div className="login-page">
      {showInterestsSelection && (
        <SelectInterests 
          onSubmit={handleInterestsSelected}
          loading={loading}
        />
      )}
      
      {showBusinessDetailsForm && (
        <BusinessDetailsForm
          onSuccess={handleBusinessDetailsSubmit}
          loading={loading}
          prefill={{ name: formData.businessName, email: formData.email }}
        />
      )}
      
      {!showInterestsSelection && !showBusinessDetailsForm && (
        <>
          {showPinModal && (
            <RecoveryPinModal 
              pin={recoveryPin} 
              onClose={handlePinModalClose}
            />
          )}
      
      <div className="login-container">
        <div className="login-box">
          <h1>{isLogin ? 'Welcome Back' : isBusinessMode ? 'Add Your Business' : 'Create Account'}</h1>
          <p className="login-subtitle">
            {isLogin
              ? 'Login to save favorites and write reviews'
              : isBusinessMode
              ? 'Register your business and connect with customers'
              : 'Join us to discover Black-owned businesses'}
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">{isBusinessMode ? 'Owner Name' : 'Name'}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder={isBusinessMode ? "Enter your name" : "Enter your name"}
                />
              </div>
            )}

            {!isLogin && isBusinessMode && (
              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required={isBusinessMode && !isLogin}
                  placeholder="Enter your business name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                minLength={8}
              />
              {!isLogin && (
                <small style={{ color: '#666', fontSize: '0.875rem' }}>
                  Must be at least 8 characters and include at least one number
                </small>
              )}
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Login' : isBusinessMode ? 'Create Business Account' : 'Register'}
            </button>
          </form>

          {isLogin && (
            <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>
          )}

          <div className="toggle-form">
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setIsBusinessMode(false);
                  setError('');
                }} 
                className="toggle-button"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
            {isLogin && (
              <p>
                {"Want to add your business? "}
                <button 
                  onClick={() => {
                    setIsLogin(false);
                    setIsBusinessMode(true);
                    setError('');
                  }} 
                  className="toggle-button"
                >
                  Add your business
                </button>
              </p>
            )}
            {!isLogin && isBusinessMode && (
              <p>
                {"Looking to create a customer account? "}
                <button 
                  onClick={() => {
                    setIsBusinessMode(false);
                    setError('');
                  }} 
                  className="toggle-button"
                >
                  Register as customer
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default Login;
