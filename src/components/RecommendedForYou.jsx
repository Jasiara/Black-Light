import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './RecommendedForYou.css';

const RecommendedForYou = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('RecommendedForYou - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      loadRecommendedBusinesses();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadRecommendedBusinesses = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Loading recommended businesses...');
      const response = await businessAPI.getRecommended({ limit: 6 });
      console.log('Recommended businesses response:', response.data);
      setBusinesses(response.data.businesses || []);
    } catch (err) {
      console.error('Error loading recommended businesses:', err);
      setError('Could not load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || loading) {
    return null;
  }

  if (error || !businesses || businesses.length === 0) {
    console.log('No recommendations to show. Error:', error, 'Businesses:', businesses);
    return null;
  }

  return (
    <section className="recommended-section">
      <div className="recommended-header">
        <h2>🎯 Recommended For You</h2>
        <p className="recommended-subtitle">Based on your interests</p>
      </div>

      <div className="recommended-grid">
        {businesses.map((business) => (
          <div
            key={business.id}
            className="recommended-card"
            onClick={() => navigate(`/business/${business.id}`)}
          >
            <div className="recommended-image-wrapper">
              <img
                src={business.image_url || 'https://via.placeholder.com/400x300?text=Business'}
                alt={business.name}
                className="recommended-image"
              />
              <div className="recommended-overlay">
                <span className="view-button">View Details</span>
              </div>
            </div>

            <div className="recommended-content">
              <h3 className="recommended-name">{business.name}</h3>
              <p className="recommended-category">{business.category}</p>

              <div className="recommended-location">
                <span className="location-icon">📍</span>
                <p>
                  {business.city}
                  {business.state && `, ${business.state}`}
                </p>
              </div>

              {business.description && (
                <p className="recommended-description">{business.description.substring(0, 80)}...</p>
              )}

              {business.phone && (
                <div className="recommended-contact">
                  <span className="phone-icon">📞</span>
                  <a href={`tel:${business.phone}`}>{business.phone}</a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedForYou;
