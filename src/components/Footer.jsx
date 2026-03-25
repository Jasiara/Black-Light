import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <h3 className="footer-brand">Black-Light</h3>
            <p className="footer-tagline">Discover and support Black-owned businesses in your community.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">
                <span>f</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon">
                <span>𝕏</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
                <span>📷</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon">
                <span>in</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search">Browse Businesses</Link></li>
              <li><Link to="/favorites">Favorites</Link></li>
              <li><Link to="/login">Login / Sign Up</Link></li>
            </ul>
          </div>

          {/* For Business Owners */}
          <div className="footer-section">
            <h4>For Business Owners</h4>
            <ul>
              <li><a href="#add-business">Add Your Business</a></li>
              <li><a href="#dashboard">Business Dashboard</a></li>
              <li><a href="#promotions">Manage Promotions</a></li>
              <li><a href="#reviews">View Reviews</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p className="contact-info">
              <span>📧 info@blacklight.com</span>
            </p>
            <p className="contact-info">
              <span>📱 (252) 676-3956</span>
            </p>
            <p className="contact-info">
              <span>📍 Greensboro, NC</span>
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Black-Light. All rights reserved. Empowering Black-owned businesses.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
