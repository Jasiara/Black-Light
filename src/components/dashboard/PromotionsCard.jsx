import { useState } from 'react';
import './PromotionsCard.css';

const PromotionsCard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [promotions] = useState([
    { id: 1, title: '10% Off Promo', discount: '10%', expiry: 'Expires Mar 31' },
    { id: 2, title: 'Weekend Special', discount: 'Buy 1 Get 1', expiry: 'Expires Apr 7' },
  ]);

  return (
    <div className="promotions-card">
      <h3>📣 Active Promotions</h3>
      
      <div className="promotions-list">
        {promotions.map((promo) => (
          <div key={promo.id} className="promotion-item">
            <div className="promo-info">
              <p className="promo-title">{promo.title}</p>
              <p className="promo-discount">{promo.discount}</p>
              <p className="promo-expiry">{promo.expiry}</p>
            </div>
            <button className="promo-action-btn">Edit</button>
          </div>
        ))}
      </div>

      {showCreateForm && (
        <div className="create-promo-form">
          <input type="text" placeholder="Promotion title" />
          <input type="text" placeholder="Discount (e.g., 10% or Buy 1 Get 1)" />
          <input type="date" />
          <button className="submit-btn">Create Promotion</button>
          <button className="cancel-btn" onClick={() => setShowCreateForm(false)}>Cancel</button>
        </div>
      )}

      <button 
        className="create-promo-btn"
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        {showCreateForm ? 'Cancel' : '+ Create Promotion'}
      </button>
    </div>
  );
};

export default PromotionsCard;
