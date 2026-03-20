import './CommunitySpotlight.css';

const CommunitySpotlight = () => {
  const spotlight = {
    trendingBusinesses: [
      { name: 'Unity Coffee House', category: 'Food & Restaurants', rating: 4.8 },
      { name: 'The Fit Collective', category: 'Sports & Fitness', rating: 4.9 },
      { name: 'Natural Hair Studio', category: 'Beauty & Hair', rating: 4.7 },
    ],
    upcomingEvents: [
      { name: 'Black Business Month', date: 'April 1-30', location: 'Greensboro' },
      { name: 'Community Networking', date: 'April 5, 6pm', location: 'Downtown' },
      { name: 'Small Business Workshop', date: 'April 12, 10am', location: 'Virtual' },
    ],
  };

  return (
    <div className="community-spotlight-card">
      <h3>🧑🏾‍🤝‍🧑🏽 Community Spotlight</h3>
      
      <div className="spotlight-grid">
        <div className="spotlight-section">
          <h4>Trending Black-Owned Businesses Nearby</h4>
          <ul className="business-list">
            {spotlight.trendingBusinesses.map((business, idx) => (
              <li key={idx} className="business-item">
                <div className="business-info">
                  <p className="business-name">{business.name}</p>
                  <p className="business-category">{business.category}</p>
                </div>
                <span className="business-rating">⭐ {business.rating}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="spotlight-section">
          <h4>Upcoming Local Events</h4>
          <ul className="events-list">
            {spotlight.upcomingEvents.map((event, idx) => (
              <li key={idx} className="event-item">
                <p className="event-name">{event.name}</p>
                <p className="event-details">{event.date}</p>
                <p className="event-location">📍 {event.location}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunitySpotlight;
