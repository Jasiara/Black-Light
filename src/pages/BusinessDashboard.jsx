import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ReviewsCard from '../components/dashboard/ReviewsCard';
import PerformanceOverview from '../components/dashboard/PerformanceOverview';
import PromotionsCard from '../components/dashboard/PromotionsCard';
import LocalInsights from '../components/dashboard/LocalInsights';
import './BusinessDashboard.css';

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="bd-stars" aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i} className="bd-star full">★</span>;
        if (i === full && half) return <span key={i} className="bd-star half">★</span>;
        return <span key={i} className="bd-star empty">★</span>;
      })}
    </span>
  );
};

const ActionButton = ({ icon, label, primary }) => (
  <div className={`bd-action${primary ? ' bd-action--primary' : ''}`}>
    <div className="bd-action-circle">
      <span className="bd-action-icon">{icon}</span>
    </div>
    <span className="bd-action-label">{label}</span>
  </div>
);

const InfoRow = ({ icon, children, accent, chevron }) => (
  <div className={`bd-info-row${chevron ? ' bd-info-row--clickable' : ''}`}>
    <span className="bd-info-icon">{icon}</span>
    <div className={`bd-info-content${accent ? ' bd-info-content--accent' : ''}`}>
      {children}
    </div>
    {chevron && <span className="bd-info-chevron">›</span>}
  </div>
);

const PhotoTile = ({ label, sublabel, name, addButton, onClick }) => (
  <div className={`bd-photo-tile${addButton ? ' bd-photo-tile--add' : ''}`} onClick={onClick}>
    <div className="bd-photo-inner">
      {addButton ? (
        <span className="bd-photo-add-icon">+</span>
      ) : (
        <span className="bd-photo-placeholder-icon">📷</span>
      )}
    </div>
    {label && <span className="bd-photo-badge">{label}</span>}
    {name && <span className="bd-photo-name">{name}</span>}
    {sublabel && <span className="bd-photo-sublabel">{sublabel}</span>}
  </div>
);

const RatingBar = ({ stars, pct, color }) => (
  <div className="bd-bar-row">
    <span className="bd-bar-star">{stars}</span>
    <div className="bd-bar-track">
      <div className="bd-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  </div>
);

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const business = {
    name: user?.businessName || user?.name || 'Your Business',
    category: user?.category || 'Local Business',
    rating: 4.6,
    reviewCount: 751,
    priceRange: '$20–30',
    address: '435 Dolley Madison Rd, Greensboro, NC 27410',
    hours: 'Open · Closes 10 PM',
    priceDesc: '$20–30 per person',
    priceSub: 'Reported by customers',
    website: 'yourbusiness.square.site',
    phone: '(336) 549-9222',
  };

  const services = ['Dine-in', 'Curbside pickup', 'Delivery'];

  const tabs = ['overview', 'promotions', 'reviews', 'insights'];

  const ratingBars = [
    { stars: 5, pct: 84 },
    { stars: 4, pct: 10 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ];

  const actions = [
    { icon: '✏️', label: 'Edit Profile', primary: true },
    { icon: '📷', label: 'Add Photos' },
    { icon: '📣', label: 'Promotions' },
    { icon: '📊', label: 'Analytics' },
    { icon: '↗', label: 'Share' },
  ];

  const menuHighlights = [
    { label: 'Menu' },
    { label: 'Popular', name: 'Mac & Cheese' },
    { label: 'Popular', name: 'Fried Plate' },
  ];

  const photoAlbums = [
    { label: 'All' },
    { label: 'Latest', sublabel: '5 days ago' },
    { label: 'Videos' },
  ];

  return (
    <DashboardLayout activeTab="dashboard">
      <div className="bd-wrapper">
        <div className="bd-panel">

          {/* ── Hero ── */}
          <div className="bd-hero">
            <div className="bd-hero-bg" />
            <button className="bd-hero-cta">📷 Add cover photo</button>
          </div>

          {/* ── Header ── */}
          <div className="bd-header">
            <h1 className="bd-name">{business.name}</h1>
            <div className="bd-rating-row">
              <span className="bd-rating-num">{business.rating}</span>
              <StarRating rating={business.rating} />
              <span className="bd-rating-count">({business.reviewCount})</span>
              <span className="bd-dot">·</span>
              <span className="bd-price">{business.priceRange}</span>
            </div>
            <p className="bd-category">{business.category}</p>
          </div>

          {/* ── Tabs ── */}
          <div className="bd-tabs" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`bd-tab${activeTab === tab ? ' bd-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* ── Divider ── */}
          <div className="bd-divider" />

          {/* ══ OVERVIEW TAB ══ */}
          {activeTab === 'overview' && (
            <>
              {/* Action buttons */}
              <div className="bd-actions">
                {actions.map((a, i) => (
                  <ActionButton key={i} icon={a.icon} label={a.label} primary={a.primary} />
                ))}
              </div>

              <div className="bd-divider" />

              {/* CTA */}
              <div className="bd-cta-wrap">
                <button className="bd-cta-btn">
                  <span className="bd-cta-icon">🛍️</span>
                  Manage your listing
                </button>
              </div>

              <div className="bd-divider" />

              {/* Services */}
              <div className="bd-services">
                {services.map((s, i) => (
                  <div key={i} className="bd-service">
                    <span className="bd-service-check">✓</span>
                    <span>{s}</span>
                  </div>
                ))}
                <span className="bd-services-more">›</span>
              </div>

              <div className="bd-divider" />

              {/* Info list */}
              <div className="bd-info-list">
                <InfoRow icon="📍">
                  {business.address}
                </InfoRow>
                <InfoRow icon="🕐" chevron>
                  <span className="bd-open">{business.hours}</span>
                </InfoRow>
                <InfoRow icon="💲" chevron>
                  <div>{business.priceDesc}</div>
                  <div className="bd-info-sub">{business.priceSub}</div>
                </InfoRow>
                <InfoRow icon="🌐">
                  <span className="bd-link">{business.website}</span>
                </InfoRow>
                <InfoRow icon="📞">
                  {business.phone}
                </InfoRow>
              </div>

              <div className="bd-divider" />

              {/* Menu & highlights */}
              <div className="bd-section">
                <div className="bd-section-header">
                  <h3 className="bd-section-title">Menu &amp; highlights</h3>
                </div>
                <div className="bd-photo-grid">
                  {menuHighlights.map((item, i) => (
                    <PhotoTile key={i} label={item.label} name={item.name} />
                  ))}
                </div>
                <button className="bd-text-btn">See more</button>
              </div>

              <div className="bd-divider" />

              {/* Photos & videos */}
              <div className="bd-section">
                <h3 className="bd-section-title">Photos &amp; videos</h3>
                <div className="bd-photo-grid">
                  {photoAlbums.map((item, i) => (
                    <PhotoTile key={i} label={item.label} sublabel={item.sublabel} />
                  ))}
                </div>
                <button className="bd-add-photos-btn">
                  <span>+</span> Add photos &amp; videos
                </button>
              </div>

              <div className="bd-divider" />

              {/* Review summary */}
              <div className="bd-section">
                <div className="bd-section-header">
                  <h3 className="bd-section-title">Review summary</h3>
                  <button className="bd-help-btn">?</button>
                </div>
                <div className="bd-review-summary">
                  <div className="bd-bars">
                    {ratingBars.map((b) => (
                      <RatingBar
                        key={b.stars}
                        stars={b.stars}
                        pct={b.pct}
                        color={b.pct > 50 ? '#f9ab00' : '#fbcf68'}
                      />
                    ))}
                  </div>
                  <div className="bd-big-rating">
                    <span className="bd-big-num">{business.rating}</span>
                    <StarRating rating={business.rating} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ PROMOTIONS TAB ══ */}
          {activeTab === 'promotions' && (
            <div className="bd-tab-pane">
              <PromotionsCard />
            </div>
          )}

          {/* ══ REVIEWS TAB ══ */}
          {activeTab === 'reviews' && (
            <div className="bd-tab-pane">
              <ReviewsCard />
            </div>
          )}

          {/* ══ INSIGHTS TAB ══ */}
          {activeTab === 'insights' && (
            <div className="bd-tab-pane">
              <PerformanceOverview />
              <div className="bd-divider bd-divider--inner" />
              <LocalInsights />
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessDashboard;
