import './LocalInsights.css';

const LocalInsights = () => {
  const insights = [
    { label: 'Views', value: '45%', change: '+12%' },
    { label: 'Map Views', value: '35%', change: '+5%' },
    { label: 'Search Views', value: '20%', change: '+8%' },
  ];

  return (
    <div className="local-insights-card">
      <h3>📍 Local Discovery Insights</h3>
      
      <div className="heatmap-placeholder">
        <p>📊 Map Heatmap</p>
        <div className="mini-map">🗺️ Your business location & customer density</div>
      </div>

      <div className="insights-grid">
        <div className="insight-item">
          <h4>Top Neighborhoods</h4>
          <ul>
            <li>Downtown Greensboro - 34%</li>
            <li>North Elm - 28%</li>
            <li>Four Seasons - 20%</li>
          </ul>
        </div>

        <div className="insight-item">
          <h4>Search vs Map</h4>
          <div className="breakdown">
            {insights.map((insight, idx) => (
              <div key={idx} className="insight-stat">
                <span className="label">{insight.label}</span>
                <span className="value">{insight.value}</span>
                <span className="change">{insight.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalInsights;
