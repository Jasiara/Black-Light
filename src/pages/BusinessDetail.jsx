import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { businessAPI, reviewAPI, favoriteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Map from '../components/Map';
import './BusinessDetail.css';

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadBusiness();
  }, [id]);

  const loadBusiness = async () => {
    try {
      const response = await businessAPI.getById(id);
      setBusiness(response.data.business);
    } catch (error) {
      console.error('Error loading business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await favoriteAPI.remove(id);
        setIsFavorite(false);
      } else {
        await favoriteAPI.add(id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewAPI.create({
        business_id: id,
        rating,
        comment,
      });
      setComment('');
      setRating(5);
      loadBusiness(); // Reload to show new review
      alert('Review submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="business-detail">
        <div className="loading">Loading business details...</div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="business-detail">
        <div className="error">
          <h2>Business not found</h2>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  let hours = {};
  try {
    if (business.hours) {
      hours = typeof business.hours === 'string' ? JSON.parse(business.hours) : business.hours;
    }
  } catch (error) {
    console.error('Error parsing hours:', error);
    hours = {};
  }

  return (
    <div className="business-detail">
      <div className="detail-container">
        <div className="detail-header">
          <img
            src={business.image_url || 'https://via.placeholder.com/800x400'}
            alt={business.name}
            className="detail-image"
          />
          <div className="header-overlay">
            <h1>{business.name}</h1>
            <span className="detail-category">{business.category}</span>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-main">
            <div className="detail-actions">
              <button onClick={handleFavorite} className="favorite-button">
                {isFavorite ? '❤️ Saved' : '🤍 Save'}
              </button>
              {business.average_rating && (
                <div className="rating-display">
                  ⭐ {business.average_rating} ({business.reviews?.length} reviews)
                </div>
              )}
            </div>

            <section className="info-section">
              <h2>About</h2>
              <p>{business.description}</p>
            </section>

            <section className="info-section">
              <h2>Contact Information</h2>
              <p>📍 {business.address}</p>
              <p>
                {business.city}, {business.state} {business.zip_code}
              </p>
              {business.phone && <p>📞 {business.phone}</p>}
              {business.email && <p>✉️ {business.email}</p>}
              {business.website && (
                <p>
                  🌐{' '}
                  <a href={business.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </p>
              )}
            </section>

            {Object.keys(hours).length > 0 && (
              <section className="info-section">
                <h2>Hours</h2>
                {Object.entries(hours).map(([day, time]) => (
                  <p key={day}>
                    <strong>{day}:</strong> {time}
                  </p>
                ))}
              </section>
            )}

            {business.latitude && business.longitude && (
              <section className="info-section">
                <h2>Location</h2>
                <Map businesses={[business]} center={[business.latitude, business.longitude]} zoom={15} />
              </section>
            )}

            <section className="reviews-section">
              <h2>Reviews ({business.reviews?.length || 0})</h2>

              {isAuthenticated && (
                <form onSubmit={handleSubmitReview} className="review-form">
                  <h3>Write a Review</h3>
                  <div className="form-group">
                    <label>Rating:</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      required
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4)</option>
                      <option value={3}>⭐⭐⭐ (3)</option>
                      <option value={2}>⭐⭐ (2)</option>
                      <option value={1}>⭐ (1)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Comment:</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      rows={4}
                    />
                  </div>
                  <button type="submit" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              <div className="reviews-list">
                {business.reviews && business.reviews.length > 0 ? (
                  business.reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <strong>{review.user_name}</strong>
                        <span className="review-rating">
                          {'⭐'.repeat(review.rating)}
                        </span>
                      </div>
                      {review.comment && <p>{review.comment}</p>}
                      <small>{new Date(review.created_at).toLocaleDateString()}</small>
                    </div>
                  ))
                ) : (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
