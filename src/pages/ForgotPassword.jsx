import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './ForgotPassword.css';

/**
 * Forgot Password Page
 * 
 * NOTE: This is a placeholder implementation until email integration is added.
 * In production, users would receive their recovery PIN via email instead of
 * having it stored in the database.
 * 
 * Allows users to reset their password using their email and 6-digit recovery PIN.
 */
const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    recoveryPin: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!formData.email || !formData.recoveryPin || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.recoveryPin.length !== 6) {
      setError('Recovery PIN must be 6 digits');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/\d/.test(formData.newPassword)) {
      setError('Password must include at least one number');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.forgotPassword({
        email: formData.email,
        recoveryPin: formData.recoveryPin,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please check your email and PIN.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="success-message">
            <h1>✓ Password Reset Successful!</h1>
            <p>Your password has been updated. Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-box">
          <h1>🔐 Reset Password</h1>
          <p className="forgot-password-subtitle">
            Enter your email and the 6-digit recovery PIN you received when you created your account
          </p>

          <div className="placeholder-notice">
            <strong>Development Note:</strong> This recovery PIN system is temporary. 
            In production, PINs will be sent to your email address.
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="recoveryPin">6-Digit Recovery PIN</label>
              <input
                type="text"
                id="recoveryPin"
                name="recoveryPin"
                value={formData.recoveryPin}
                onChange={handleChange}
                placeholder="123456"
                maxLength="6"
                pattern="[0-9]{6}"
                required
              />
              <small>Enter the PIN you saved when creating your account</small>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                minLength="8"
                required
              />
              <small>Must be at least 8 characters with 1 number</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                minLength="8"
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="back-to-login">
            <button onClick={() => navigate('/login')} className="link-btn">
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
