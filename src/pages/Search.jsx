import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { businessAPI } from '../services/api';
import Map from '../components/Map';
import './Search.css';

const Search = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    distance: '',
    minRating: 0,
    openNow: false,
    communityTags: [],
    priceRange: 'all',
    onlyPromotions: false,
    services: [],
  });

  const [sortBy, setSortBy] = useState('nearest');
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem('recentSearches')) || []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const communityTagOptions = [
    'Women-Owned',
    'Family-Owned',
    'Vegan-Friendly',
    'Kid-Friendly',
    'LGBTQ-Owned',
    'New Business'
  ];

  const serviceOptions = [
    'Delivery',
    'Online Booking',
    'Braiding',
    'Takeout',
    'Walk-ins',
    'Appointments',
    'Catering'
  ];

  const trendingSearches = [
    'Soul Food',
    'Hair Services',
    'Tech Startups',
    'Fashion Boutiques',
    'Wellness Centers'
  ];

  useEffect(() => {
    loadBusinesses();
  }, [searchParams]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [businesses, filters, sortBy]);

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
      setBusinesses(response.data.businesses || []);
    } catch (error) {
      console.error('Error loading businesses:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...businesses];

    // Apply filters
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(b => b.category === filters.category);
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(b => (b.rating || 0) >= filters.minRating);
    }

    if (filters.onlyPromotions) {
      filtered = filtered.filter(b => b.hasActivePromotions);
    }

    // Apply community tags filter
    if (filters.communityTags && filters.communityTags.length > 0) {
      filtered = filtered.filter(b => {
        const businessTags = b.community_tags || [];
        return filters.communityTags.some(tag => businessTags.includes(tag));
      });
    }

    // Apply sorting
    if (sortBy === 'nearest') {
      filtered.sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.latitude || 0, 2) + Math.pow(a.longitude || 0, 2));
        const distB = Math.sqrt(Math.pow(b.latitude || 0, 2) + Math.pow(b.longitude || 0, 2));
        return distA - distB;
      });
    } else if (sortBy === 'highestRated') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'mostPopular') {
      filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredBusinesses(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowSuggestions(true);

    // Add to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const performSearch = (query) => {
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    setSearchParams(params);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleCommunityTagToggle = (tag) => {
    setFilters(prev => ({
      ...prev,
      communityTags: prev.communityTags.includes(tag)
        ? prev.communityTags.filter(t => t !== tag)
        : [...prev.communityTags, tag]
    }));
  };

  return (
    <div className="search-page">
      <div className="search-container">
        {/* Smart Search Bar */}
        <div className="search-bar-wrapper">
          <div className="smart-search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search Black-owned businesses near you…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch(searchQuery)}
              className="search-input-enhanced"
            />
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              ⚙️ Filters
            </button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (
            <div className="suggestions-panel">
              {recentSearches.length > 0 && (
                <div className="suggestions-section">
                  <h4>Recent Searches</h4>
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      className="suggestion-item"
                      onClick={() => performSearch(search)}
                    >
                      🕐 {search}
                    </button>
                  ))}
                </div>
              )}
              <div className="suggestions-section">
                <h4>Trending Searches</h4>
                {trendingSearches.map((trend, idx) => (
                  <button
                    key={idx}
                    className="suggestion-item"
                    onClick={() => performSearch(trend)}
                  >
                    📈 {trend}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              {/* Category Filter */}
              <div className="filter-section">
                <h4>Category</h4>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="filter-select"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Distance Filter */}
              <div className="filter-section">
                <h4>Distance</h4>
                <div className="filter-options">
                  {['all', '1', '5', '10'].map(dist => (
                    <button
                      key={dist}
                      className={`filter-option ${filters.distance === dist ? 'active' : ''}`}
                      onClick={() => handleFilterChange('distance', dist)}
                    >
                      {dist === 'all' ? 'All Distances' : `Within ${dist} mi`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="filter-section">
                <h4>Minimum Rating</h4>
                <div className="filter-options">
                  {[0, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      className={`filter-option ${filters.minRating === rating ? 'active' : ''}`}
                      onClick={() => handleFilterChange('minRating', rating)}
                    >
                      {rating === 0 ? 'All' : `${rating}⭐+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Open Now Toggle */}
              <div className="filter-section">
                <h4>Availability</h4>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                  />
                  Open Now
                </label>
              </div>

              {/* Community Tags */}
              <div className="filter-section wide">
                <h4>Community Tags</h4>
                <div className="tag-options">
                  {communityTagOptions.map(tag => (
                    <button
                      key={tag}
                      className={`tag-option ${filters.communityTags.includes(tag) ? 'active' : ''}`}
                      onClick={() => handleCommunityTagToggle(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h4>Price Range</h4>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Prices</option>
                  <option value="budget">Budget Friendly</option>
                  <option value="moderate">Moderate</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              {/* Active Promotions */}
              <div className="filter-section">
                <h4>Promotions</h4>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.onlyPromotions}
                    onChange={(e) => handleFilterChange('onlyPromotions', e.target.checked)}
                  />
                  Active Promotions Only
                </label>
              </div>

              {/* Services */}
              <div className="filter-section wide">
                <h4>Services</h4>
                <div className="service-options">
                  {serviceOptions.map(service => (
                    <button
                      key={service}
                      className={`service-option ${filters.services.includes(service) ? 'active' : ''}`}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          services: prev.services.includes(service)
                            ? prev.services.filter(s => s !== service)
                            : [...prev.services, service]
                        }));
                      }}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="results-header">
          <div className="results-info">
            <h2>Search Results</h2>
            <p>{loading ? 'Searching...' : `Found ${filteredBusinesses.length} businesses`}</p>
          </div>
          <div className="results-actions">
            <div className="sort-by">
              <label htmlFor="sort-select">Sort By:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="nearest">Nearest</option>
                <option value="highestRated">Highest Rated</option>
                <option value="mostPopular">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <button 
              onClick={() => setShowMap(!showMap)} 
              className="toggle-map-btn"
            >
              {showMap ? '📋 List' : '🗺️ Map'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="no-results">
            <h2>No businesses found</h2>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <>
            {showMap && (
              <div className="map-section">
                <Map businesses={filteredBusinesses} />
              </div>
            )}
            <div className="results-grid">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="result-card"
                  onClick={() => navigate(`/business/${business.id}`)}
                >
                  <div className="card-image-wrapper">
                    <img
                      src={business.image_url || 'https://via.placeholder.com/400x300'}
                      alt={business.name}
                      className="result-image"
                    />
                    {business.hasActivePromotions && (
                      <span className="promo-badge">🎉 Promotion</span>
                    )}
                  </div>
                  <div className="result-info">
                    <h3>{business.name}</h3>
                    <span className="result-category">{business.category}</span>
                    {business.rating && (
                      <div className="result-rating">⭐ {business.rating}</div>
                    )}
                    <p className="result-description">{business.description}</p>
                    <div className="result-details">
                      <p>📍 {business.address}</p>
                      <p>
                        {business.city}, {business.state} {business.zip_code}
                      </p>
                      {business.phone && <p>📞 {business.phone}</p>}
                    </div>
                    {business.community_tags && business.community_tags.length > 0 && (
                      <div className="result-tags">
                        {business.community_tags.map((tag, idx) => (
                          <span key={idx} className="result-tag">{tag}</span>
                        ))}
                      </div>
                    )}
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
