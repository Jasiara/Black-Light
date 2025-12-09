import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      const response = await favoriteAPI.getAll();
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (businessId) => {
    try {
      await favoriteAPI.remove(businessId);
      setFavorites(favorites.filter((fav) => fav.id !== businessId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <h1>❤️ My Favorites</h1>

        {favorites.length === 0 ? (
          <div className="no-favorites">
            <h2>No favorites yet</h2>
            <p>Start exploring and save your favorite businesses!</p>
            <button onClick={() => navigate('/')} className="explore-button">
              Explore Businesses
            </button>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((business) => (
              <div key={business.id} className="favorite-card">
                <img
                  src={business.image_url || 'https://via.placeholder.com/400x300'}
                  alt={business.name}
                  className="favorite-image"
                  onClick={() => navigate(`/business/${business.id}`)}
                />
                <div className="favorite-info">
                  <h3 onClick={() => navigate(`/business/${business.id}`)}>
                    {business.name}
                  </h3>
                  <span className="favorite-category">{business.category}</span>
                  <p className="favorite-description">{business.description}</p>
                  <p className="favorite-location">
                    📍 {business.city}, {business.state}
                  </p>
                  <button
                    onClick={() => handleRemoveFavorite(business.id)}
                    className="remove-button"
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
