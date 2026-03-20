import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { businessAPI } from '../services/api';
import RecommendedForYou from '../components/RecommendedForYou';
import './Home.css';

const Home = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = [
    'All',
    'Food & Restaurants',
    'Technology',
    'Fashion & Clothing',
    'Health & Wellness',
    'Beauty & Hair',
    'Real Estate',
    'Entertainment',
    'Automotive',
    'Professional Services',
    'Retail',
    'Arts & Culture',
    'Education',
    'Home & Garden',
    'Sports & Fitness',
    'Travel & Tourism',
    'Music'
  ];

  useEffect(() => {
    loadFeaturedBusinesses();
  }, []);

  const loadFeaturedBusinesses = async () => {
    setLoading(true);
    try {
      console.log('Loading featured businesses...'); // Debug
      const response = await businessAPI.getAll({ limit: 50 });
      console.log('Featured businesses loaded:', response.data); // Debug
      setFeaturedBusinesses(response.data.businesses);
    } catch (error) {
      console.error('Error loading featured businesses:', error);
      alert('Error loading businesses. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (category && category !== 'All') params.append('category', category);
    if (location) params.append('city', location);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="home">
      {user && user.userType === 'business_owner' && (
        <section className="business-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h3>Welcome back, {user.name}! 👋</h3>
              <p><strong>Access your business dashboard to manage your listings, promotions, and reviews.</strong></p>
            </div>
            <button 
              className="banner-button"
              onClick={() => navigate('/business-dashboard')}
            >
              💼 Go to Dashboard
            </button>
          </div>
        </section>
      )}

      <section className="hero">
        <div className="hero-content">
          <h1>Discover & Support Black-Owned Businesses</h1>
          <p>Find local Black-owned businesses in your community</p>

          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="search-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="City or ZIP"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="search-input location-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
      </section>

      <RecommendedForYou />

      <section className="featured">
        <h2>✨ Featured Black-Owned Businesses</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="featured-grid">
              {featuredBusinesses.slice(0, 9).map((business) => (
                <div
                  key={business.id}
                  className="business-card"
                  onClick={() => navigate(`/business/${business.id}`)}
                >
                  <img
                    src={business.image_url || 'https://via.placeholder.com/400x300'}
                    alt={business.name}
                    className="business-image"
                  />
                  <div className="business-info">
                    <h3>{business.name}</h3>
                    <div className="category-tags-row">
                      <p className="category">{business.category}</p>
                      {business.community_tags && business.community_tags.length > 0 && (
                        <div className="community-tags">
                          {business.community_tags.map((tag, idx) => (
                            <span key={idx} className="tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="description">{business.description}</p>
                    <p className="location">
                      📍 {business.city}, {business.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {featuredBusinesses.length > 9 && (
              <div className="explore-more-container">
                <button 
                  className="explore-more-btn"
                  onClick={() => navigate('/search')}
                >
                  Explore More Nearby
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
