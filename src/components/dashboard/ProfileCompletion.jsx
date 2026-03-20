import './ProfileCompletion.css';

const ProfileCompletion = ({ completionPercentage = 70 }) => {
  return (
    <div className="profile-completion-card">
      <h2>Welcome Back! 👋</h2>
      <p className="business-name">Your Business Dashboard</p>
      
      <div className="completion-section">
        <label>Profile Completion</label>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${completionPercentage}%` }}>
            <span className="progress-text">{completionPercentage}%</span>
          </div>
        </div>
        <p className="completion-hint">Complete your profile to improve visibility</p>
      </div>
    </div>
  );
};

export default ProfileCompletion;
