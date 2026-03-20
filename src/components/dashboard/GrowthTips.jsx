import './GrowthTips.css';

const GrowthTips = () => {
  const tips = [
    { icon: '📸', title: 'Add Photos to Boost Engagement', description: 'Businesses with more photos get 35% more clicks', status: 'incomplete' },
    { icon: '⭐', title: 'Respond to Reviews', description: 'You have 2 unresponded reviews. Engage with customers!', status: 'priority' },
    { icon: '📱', title: 'Add Your Phone Business Hours', description: 'Specify your exact hours for each day', status: 'incomplete' },
    { icon: '🔗', title: 'Add Website & Social Links', description: 'Connect customers to your online presence', status: 'incomplete' },
  ];

  return (
    <div className="growth-tips-card">
      <h3>📈 Growth Tips</h3>
      
      <div className="tips-list">
        {tips.map((tip, index) => (
          <div key={index} className={`tip-item ${tip.status}`}>
            <span className="tip-icon">{tip.icon}</span>
            <div className="tip-content">
              <h4>{tip.title}</h4>
              <p>{tip.description}</p>
            </div>
            <button className="action-btn">Start</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrowthTips;
