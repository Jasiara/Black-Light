import { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { businessAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BusinessDetailsForm from '../components/BusinessDetailsForm';
import './BusinessDashboard.css';

const CATEGORIES = [
  'Food & Restaurants','Technology','Fashion & Clothing','Health & Wellness',
  'Beauty & Hair','Real Estate','Entertainment','Automotive',
  'Professional Services','Retail','Arts & Culture','Education',
  'Home & Garden','Sports & Fitness','Travel & Tourism','Music',
];

const COMMUNITY_TAG_OPTIONS = [
  'Women-Owned','Family-Owned','Vegan-Friendly','Kid-Friendly','LGBTQ-Owned','New Business',
];

const EditBusinessModal = ({ business, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name:            business.name            || '',
    category:        business.category        || CATEGORIES[0],
    description:     business.description     || '',
    address:         business.address         || '',
    city:            business.city            || '',
    state:           business.state           || '',
    zip_code:        business.zip_code        || '',
    phone:           business.phone           || '',
    email:           business.email           || '',
    website:         business.website         || '',
    image_url:       business.image_url       || '',
    hours:           typeof business.hours === 'string'
                       ? business.hours
                       : JSON.stringify(business.hours || {}),
    community_tags:  Array.isArray(business.community_tags)
                       ? business.community_tags
                       : (typeof business.community_tags === 'string'
                           ? JSON.parse(business.community_tags || '[]')
                           : []),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const [imagePreview, setImagePreview] = useState(business.image_url || '');

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleTag = (tag) =>
    set('community_tags', form.community_tags.includes(tag)
      ? form.community_tags.filter(t => t !== tag)
      : [...form.community_tags, tag]);

  const handleImageUrl = (e) => {
    set('image_url', e.target.value);
    setImagePreview(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      let hoursData = form.hours;
      try { hoursData = JSON.stringify(JSON.parse(form.hours)); } catch { /* keep as-is */ }
      const res = await businessAPI.update(business.id, { ...form, hours: hoursData });
      onSaved(res.data.business);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h2>Edit Business Profile</h2>
          <button className="edit-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {error && <div className="edit-modal-error">{error}</div>}

        <form onSubmit={handleSave} className="edit-modal-form">

          {/* Basic */}
          <div className="edit-section">
            <h3>Basic Information</h3>
            <div className="edit-form-row">
              <div className="edit-form-group">
                <label>Business Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="edit-form-group">
                <label>Category *</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="edit-form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
            </div>
          </div>

          {/* Contact */}
          <div className="edit-section">
            <h3>Contact Information</h3>
            <div className="edit-form-row">
              <div className="edit-form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="edit-form-group">
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(336) 555-0000" />
              </div>
              <div className="edit-form-group">
                <label>Website</label>
                <input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://example.com" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="edit-section">
            <h3>Location</h3>
            <div className="edit-form-group">
              <label>Address *</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} required />
            </div>
            <div className="edit-form-row">
              <div className="edit-form-group">
                <label>City *</label>
                <input value={form.city} onChange={e => set('city', e.target.value)} required />
              </div>
              <div className="edit-form-group edit-form-group--sm">
                <label>State *</label>
                <input value={form.state} onChange={e => set('state', e.target.value)} maxLength={2} required />
              </div>
              <div className="edit-form-group edit-form-group--sm">
                <label>ZIP *</label>
                <input value={form.zip_code} onChange={e => set('zip_code', e.target.value)} required />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="edit-section">
            <h3>Business Image</h3>
            <div className="edit-image-row">
              <div className="edit-image-preview">
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" />
                  : <span>📸</span>}
              </div>
              <div className="edit-form-group" style={{ flex: 1 }}>
                <label>Image URL</label>
                <input type="url" value={form.image_url} onChange={handleImageUrl} placeholder="https://example.com/image.jpg" />
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="edit-section">
            <h3>Hours of Operation</h3>
            <div className="edit-form-group">
              <label>Hours (JSON)</label>
              <textarea value={form.hours} onChange={e => set('hours', e.target.value)} rows={4}
                placeholder='{"Mon-Fri": "9am-5pm", "Sat-Sun": "Closed"}' />
              <small>{`Format: {"Mon-Fri": "9am-5pm", "Sat": "10am-3pm", "Sun": "Closed"}`}</small>
            </div>
          </div>

          {/* Tags */}
          <div className="edit-section">
            <h3>Community Tags</h3>
            <div className="edit-tags-grid">
              {COMMUNITY_TAG_OPTIONS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`edit-tag-btn${form.community_tags.includes(tag) ? ' active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="edit-modal-footer">
            <button type="button" className="bd-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="bd-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
  const [editOpen, setEditOpen] = useState(false);

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
    setReviews(prev => prev.map(r =>
      r.id === reviewId ? { ...r, owner_reply: res.data.review.owner_reply } : r
    ));
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
                    { icon: '✏️', label: 'Edit Profile', onClick: () => setEditOpen(true) },
                    { icon: '📷', label: 'Add Photos' },
                    { icon: '📣', label: 'Promotions' },
                    { icon: '📊', label: 'Analytics' },
                  ].map(a => (
                    <button key={a.label} className="bd-action-btn" onClick={a.onClick}>
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
      {editOpen && (
        <EditBusinessModal
          business={business}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => setBusiness(updated)}
        />
      )}
    </DashboardLayout>
  );
};

export default BusinessDashboard;
