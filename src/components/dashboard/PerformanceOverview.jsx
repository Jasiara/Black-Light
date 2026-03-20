import './PerformanceOverview.css';

const PerformanceOverview = () => {
  const stats = [
    { label: 'Views', value: '1,234', icon: '👁️' },
    { label: 'Clicks', value: '567', icon: '🖱️' },
    { label: 'Calls', value: '89', icon: '📞' },
    { label: 'Directions', value: '234', icon: '📍' },
  ];

  return (
    <div className="performance-overview-card">
      <h3>📊 Performance Overview</h3>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-icon">{stat.icon}</span>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="trend-indicator">
        <span className="trend-up">📈 +12% vs last month</span>
      </div>
    </div>
  );
};

export default PerformanceOverview;
