import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { businessAPI } from '../services/api';
import Map from '../components/Map';
import './Search.css';

const Search = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadBusinesses();
  }, [searchParams]);

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const params = {};
      const search = searchParams.get('search');
      const category = searchParams.get('category');
      const city = searchParams.get('city');

      if (search) params.search = search;
      if (category) params.category = category;
      if (city) params.city = city;

      const response = await businessAPI.getAll(params);
      setBusinesses(response.data.businesses);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h1>Search Results</h1>
          <div className="header-actions">
            <p>
              {loading ? 'Searching...' : `Found ${businesses.length} businesses`}
            </p>
            <button onClick={() => setShowMap(!showMap)} className="toggle-map-btn">
              {showMap ? '📋 List View' : '🗺️ Map View'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : businesses.length === 0 ? (
          <div className="no-results">
            <h2>No businesses found</h2>
            <p>Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            {showMap && (
              <div className="map-section">
                <Map businesses={businesses} />
              </div>
            )}
            <div className="results-grid">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="result-card"
                onClick={() => navigate(`/business/${business.id}`)}
              >
                <img
                  src={business.image_url || 'https://via.placeholder.com/400x300'}
                  alt={business.name}
                  className="result-image"
                />
                <div className="result-info">
                  <h3>{business.name}</h3>
                  <span className="result-category">{business.category}</span>
                  <p className="result-description">{business.description}</p>
                  <div className="result-details">
                    <p>📍 {business.address}</p>
                    <p>
                      {business.city}, {business.state} {business.zip_code}
                    </p>
                    {business.phone && <p>📞 {business.phone}</p>}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
