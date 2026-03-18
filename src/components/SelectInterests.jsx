import { useState } from 'react';
import './SelectInterests.css';

const SelectInterests = ({ onSubmit, loading = false }) => {
  const AVAILABLE_INTERESTS = [
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

  const [selectedInterests, setSelectedInterests] = useState([]);

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prevInterests) => {
      if (prevInterests.includes(interest)) {
        return prevInterests.filter((i) => i !== interest);
      } else {
        return [...prevInterests, interest];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }
    onSubmit(selectedInterests);
  };

  return (
    <div className="select-interests-container">
      <div className="select-interests-card">
        <h2>Select Your Interests</h2>
        <p className="interests-subtitle">
          Help us personalize your experience by selecting the types of businesses you're interested in
        </p>

        <form onSubmit={handleSubmit}>
          <div className="interests-grid">
            {AVAILABLE_INTERESTS.map((interest) => (
              <label key={interest} className="interest-option">
                <input
                  type="checkbox"
                  checked={selectedInterests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                />
                <span className="interest-label">{interest}</span>
              </label>
            ))}
          </div>

          <div className="interests-footer">
            <p className="selected-count">
              {selectedInterests.length > 0
                ? `${selectedInterests.length} selected`
                : 'Select at least one'}
            </p>
            <button 
              type="submit" 
              className="submit-interests-button"
              disabled={loading || selectedInterests.length === 0}
            >
              {loading ? 'Please wait...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectInterests;
