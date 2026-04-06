import { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { businessAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BusinessDetailsForm from '../components/BusinessDetailsForm';
import './BusinessDashboard.css';

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="bd-stars">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i} className="bd-star full">★</span>;
        if (i === full && half) return <span key={i} className="bd-star half">★</span>;
        return <span key={i} className="bd-star empty">★</span>;
      })}
    </span>
  );
};

const RatingBar = ({ stars, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="bd-bar-row">
      <span className="bd-bar-label">{stars}★</span>
      <div className="bd-bar-track">
        <div className="bd-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="bd-bar-count">{count}</span>
    </div>
  );
};

const ReviewItem = ({ review, onReplySubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    await onReplySubmit(review.id, text);
    setSubmitting(false);
    setShowForm(false);
    setText('');
  };

  return (
    <div className="bd-review">
      <div className="bd-review-header">
        <div className="bd-review-avatar">{review.user_name?.[0]?.toUpperCase() || '?'}</div>
        <div className="bd-review-meta">
          <span className="bd-review-name">{review.user_name}</span>
          <div className="bd-review-sub">
            <StarRating rating={review.rating} />
            <span className="bd-review-date">
              {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
      {review.comment && <p className="bd-review-body">{review.comment}</p>}
      {review.owner_reply && (
        <div className="bd-owner-reply">
          <span className="bd-owner-reply-label">Your response</span>
          <p>{review.owner_reply}</p>
        </div>
      )}
      {!review.owner_reply && !showForm && (
        <button className="bd-reply-btn" onClick={() => setShowForm(true)}>Reply</button>
      )}
      {showForm && (
        <div className="bd-reply-form">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write your public response..."
            rows={3}
          />
          <div className="bd-reply-actions">
            <button className="bd-btn-primary" onClick={submit} disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Response'}
            </button>
            <button className="bd-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    businessAPI.getMy()
      .then(res => {
        const biz = res.data.business;
        setBusiness(biz);
        if (biz) {
          reviewAPI.getByBusiness(biz.id)
            .then(r => setReviews(r.data.reviews || []))
            .catch(() => setReviews([]));
        }
      })
      .catch(() => setBusiness(null))
      .finally(() => setLoading(false));
  }, []);

  const handleReply = async (reviewId, reply) => {
    const res = await reviewAPI.reply(reviewId, reply);
    setReviews(prev => prev.map(r => r.id === reviewId ? res.data.review : r));
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const repliedCount = reviews.filter(r => r.owner_reply).length;

  const parseHours = (hours) => {
    if (!hours) return [];
    try {
      const h = typeof hours === 'string' ? JSON.parse(hours) : hours;
      return Object.entries(h);
    } catch { return []; }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="bd-loading">Loading your dashboard...</div>
    </DashboardLayout>
  );

  if (!business) return (
    <DashboardLayout>
      <div className="bd-page">
        <BusinessDetailsForm
          prefill={{ name: user?.name, email: user?.email }}
          onSuccess={(newBusiness) => setBusiness(newBusiness)}
        />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="bd-page">

        {/* Hero */}
        <div className="bd-hero">
          {business.image_url
            ? <img src={business.image_url} alt={business.name} className="bd-hero-img" />
            : <div className="bd-hero-gradient" />
          }
          <div className="bd-hero-overlay" />
          <div className="bd-hero-content">
            <span className="bd-hero-category">{business.category}</span>
            <h1 className="bd-hero-name">{business.name}</h1>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bd-stats-bar">
          <div className="bd-stat">
            <span className="bd-stat-value">{avgRating ?? '—'}</span>
            {avgRating && <StarRating rating={parseFloat(avgRating)} />}
            <span className="bd-stat-label">Avg Rating</span>
          </div>
          <div className="bd-stat-divider" />
          <div className="bd-stat">
            <span className="bd-stat-value">{reviews.length}</span>
            <span className="bd-stat-label">Reviews</span>
          </div>
          <div className="bd-stat-divider" />
          <div className="bd-stat">
            <span className="bd-stat-value">{repliedCount}</span>
            <span className="bd-stat-label">Replied</span>
          </div>
          <div className="bd-stat-divider" />
          <div className="bd-stat">
            <span className="bd-stat-value">{reviews.length - repliedCount}</span>
            <span className="bd-stat-label">Pending Reply</span>
          </div>
        </div>

        {/* Body */}
        <div className="bd-body">

          {/* Sidebar */}
          <aside className="bd-sidebar">
            <div className="bd-card">
              <h3 className="bd-card-title">Business Info</h3>
              <div className="bd-info-list">
                <div className="bd-info-row">
                  <span className="bd-info-icon">📍</span>
                  <span>{business.address}, {business.city}, {business.state} {business.zip_code}</span>
                </div>
                {business.phone && (
                  <div className="bd-info-row">
                    <span className="bd-info-icon">📞</span>
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.email && (
                  <div className="bd-info-row">
                    <span className="bd-info-icon">✉️</span>
                    <span>{business.email}</span>
                  </div>
                )}
                {business.website && (
                  <div className="bd-info-row">
                    <span className="bd-info-icon">🌐</span>
                    <a href={business.website} target="_blank" rel="noreferrer" className="bd-link">
                      {business.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {parseHours(business.hours).length > 0 && (
              <div className="bd-card">
                <h3 className="bd-card-title">Hours</h3>
                <div className="bd-hours-list">
                  {parseHours(business.hours).map(([days, time]) => (
                    <div key={days} className="bd-hours-row">
                      <span className="bd-hours-days">{days}</span>
                      <span className="bd-hours-time">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(() => {
              const tags = business.community_tags
                ? (typeof business.community_tags === 'string'
                    ? JSON.parse(business.community_tags)
                    : business.community_tags)
                : [];
              return tags.length > 0 ? (
                <div className="bd-card">
                  <h3 className="bd-card-title">Tags</h3>
                  <div className="bd-tags">
                    {tags.map(tag => <span key={tag} className="bd-tag">{tag}</span>)}
                  </div>
                </div>
              ) : null;
            })()}
          </aside>

          {/* Main */}
          <div className="bd-main">
            <div className="bd-tabs">
              {['overview', 'reviews', 'insights'].map(tab => (
                <button
                  key={tab}
                  className={`bd-tab${activeTab === tab ? ' bd-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="bd-tab-content">
                <div className="bd-actions-row">
                  {[
                    { icon: '✏️', label: 'Edit Profile' },
                    { icon: '📷', label: 'Add Photos' },
                    { icon: '📣', label: 'Promotions' },
                    { icon: '📊', label: 'Analytics' },
                  ].map(a => (
                    <button key={a.label} className="bd-action-btn">
                      <span>{a.icon}</span>
                      <span>{a.label}</span>
                    </button>
                  ))}
                </div>

                {business.description && (
                  <div className="bd-card">
                    <h3 className="bd-card-title">About</h3>
                    <p className="bd-description">{business.description}</p>
                  </div>
                )}

                <div className="bd-card">
                  <h3 className="bd-card-title">Recent Reviews</h3>
                  {reviews.length === 0
                    ? <p className="bd-empty-text">No reviews yet.</p>
                    : reviews.slice(0, 3).map(r => (
                        <ReviewItem key={r.id} review={r} onReplySubmit={handleReply} />
                      ))
                  }
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bd-tab-content">
                <div className="bd-card">
                  <h3 className="bd-card-title">All Reviews ({reviews.length})</h3>
                  {reviews.length === 0
                    ? <p className="bd-empty-text">No reviews yet.</p>
                    : reviews.map(r => (
                        <ReviewItem key={r.id} review={r} onReplySubmit={handleReply} />
                      ))
                  }
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="bd-tab-content">
                <div className="bd-insights-grid">
                  {[
                    { icon: '⭐', value: avgRating ?? '—', label: 'Avg Rating' },
                    { icon: '💬', value: reviews.length, label: 'Total Reviews' },
                    { icon: '✅', value: repliedCount, label: 'Replied' },
                    { icon: '⏳', value: reviews.length - repliedCount, label: 'Awaiting Reply' },
                  ].map(s => (
                    <div key={s.label} className="bd-insight-card">
                      <span className="bd-insight-icon">{s.icon}</span>
                      <span className="bd-insight-value">{s.value}</span>
                      <span className="bd-insight-label">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="bd-card">
                  <h3 className="bd-card-title">Rating Breakdown</h3>
                  {reviews.length === 0
                    ? <p className="bd-empty-text">No reviews yet.</p>
                    : [5, 4, 3, 2, 1].map(stars => (
                        <RatingBar
                          key={stars}
                          stars={stars}
                          count={reviews.filter(r => r.rating === stars).length}
                          total={reviews.length}
                        />
                      ))
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessDashboard;
