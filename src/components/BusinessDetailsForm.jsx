import { useState } from 'react';
import { businessAPI } from '../services/api';
import './BusinessDetailsForm.css';

const BusinessDetailsForm = ({ onSuccess, loading: parentLoading, prefill = {} }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [geocodeStatus, setGeocodeStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [geocodeMessage, setGeocodeMessage] = useState('');
  const [formData, setFormData] = useState({
    name: prefill.name || '',
    category: 'Food & Restaurants',
    description: '',
    address: '',
    city: 'Greensboro',
    state: 'NC',
    zip_code: '',
    phone: '',
    email: prefill.email || '',
    website: '',
    hours: JSON.stringify({ 'Mon-Fri': '9am-5pm', 'Sat-Sun': 'Closed' }),
    latitude: '',
    longitude: '',
    image_url: '',
    community_tags: [],
  });

  const categories = [
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      community_tags: prev.community_tags.includes(tag)
        ? prev.community_tags.filter(t => t !== tag)
        : [...prev.community_tags, tag]
    }));
  };

  const geocodeAddress = async () => {
    const { address, city, state, zip_code } = formData;
    if (!address || !city || !state || !zip_code) {
      setGeocodeStatus('error');
      setGeocodeMessage('Please fill in address, city, state, and ZIP before verifying.');
      return;
    }
    setGeocodeStatus('loading');
    setGeocodeMessage('');
    const query = encodeURIComponent(`${address}, ${city}, ${state} ${zip_code}, USA`);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'BlackLight-App' } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(data[0].lat).toFixed(6),
          longitude: parseFloat(data[0].lon).toFixed(6),
        }));
        setGeocodeStatus('success');
        setGeocodeMessage(`Location found: ${data[0].display_name}`);
      } else {
        setGeocodeStatus('error');
        setGeocodeMessage('Address not found. Please check the address and try again.');
      }
    } catch {
      setGeocodeStatus('error');
      setGeocodeMessage('Failed to look up address. Please check your connection.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // For now, just show preview - actual upload would require backend file storage
        // Store a placeholder or filename instead of base64
        setFormData(prev => ({
          ...prev,
          image_url: file.name // Store filename as placeholder
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      image_url: url
    }));
    if (url) {
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zip_code) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      if (!formData.latitude || !formData.longitude) {
        setError('Please click "Verify Address & Set Pin" to set the map location');
        setLoading(false);
        return;
      }

      // Parse hours if it's a string
      let hoursData = formData.hours;
      if (typeof hoursData === 'string') {
        try {
          hoursData = JSON.stringify(JSON.parse(hoursData));
        } catch (e) {
          hoursData = JSON.stringify({ 'Mon-Fri': '9am-5pm', 'Sat-Sun': 'Closed' });
        }
      }

      const businessData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        hours: hoursData
      };

      console.log('Creating business with data:', businessData);
      const response = await businessAPI.create(businessData);

      if (response.data && response.data.business) {
        console.log('Business created successfully:', response.data.business);
        onSuccess(response.data.business);
      } else {
        setError(response.data?.error || 'Failed to create business');
      }
    } catch (err) {
      console.error('Error creating business:', err);
      setError(err.response?.data?.error || 'An error occurred while creating your business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="business-details-overlay">
      <div className="business-details-modal">
        <h2>Complete Your Business Profile</h2>
        <p className="modal-subtitle">Fill in your business details to get started</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="business-details-form">
          <div className="form-section">
            <h3>Basic Information</h3>

            {prefill.name ? (
              <div className="form-group prefill-display">
                <label>Business Name</label>
                <p className="prefill-value">{formData.name}</p>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="name">Business Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  required
                />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your business"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>

            <div className="form-row">
              {prefill.email ? (
                <div className="form-group prefill-display">
                  <label>Email</label>
                  <p className="prefill-value">{formData.email}</p>
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="business@example.com"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(336) 555-0000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Location</h3>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Greensboro"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NC"
                  maxLength="2"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="zip_code">ZIP Code *</label>
                <input
                  type="text"
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  placeholder="27401"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <button
                type="button"
                className="geocode-btn"
                onClick={geocodeAddress}
                disabled={geocodeStatus === 'loading'}
              >
                {geocodeStatus === 'loading' ? 'Finding Location...' : 'Verify Address & Set Pin'}
              </button>
              {geocodeStatus === 'success' && (
                <p className="geocode-success">{geocodeMessage}</p>
              )}
              {geocodeStatus === 'error' && (
                <p className="geocode-error">{geocodeMessage}</p>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Business Image</h3>

            <div className="image-upload-group">
              <div className="image-preview">
                {imagePreview ? (
                  <img src={imagePreview} alt="Business preview" />
                ) : (
                  <div className="placeholder">📸 No image selected</div>
                )}
              </div>

              <div className="image-upload-options">
                <div className="form-group">
                  <label htmlFor="imageFile">Upload Image</label>
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <p className="or-text">OR</p>

                <div className="form-group">
                  <label htmlFor="image_url">Image URL</label>
                  <input
                    type="url"
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Hours of Operation</h3>

            <div className="form-group">
              <label htmlFor="hours">Hours (JSON format)</label>
              <textarea
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                rows="4"
                placeholder='{"Mon-Fri": "9am-5pm", "Sat-Sun": "Closed"}'
              />
              <small>Format as JSON, e.g., {`{"Mon-Fri": "9am-5pm", "Sat": "10am-6pm", "Sun": "Closed"}`}</small>
            </div>
          </div>

          <div className="form-section">
            <h3>Community Tags</h3>
            <p className="section-description">Select tags that describe your business</p>
            <div className="tags-grid">
              {communityTagOptions.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-button ${formData.community_tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading || parentLoading}>
              {loading ? 'Creating Business...' : 'Create Business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessDetailsForm;
