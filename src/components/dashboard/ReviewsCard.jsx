import './ReviewsCard.css';

const ReviewsCard = () => {
  const reviews = [
    { id: 1, rating: 5, comment: 'Great service and amazing atmosphere! Highly recommend.', author: 'Sarah M.' },
    { id: 2, rating: 4, comment: 'Loved the experience. Staff was very friendly and welcoming.', author: 'James T.' },
    { id: 3, rating: 5, comment: 'Best in town! Will definitely come back.', author: 'Maria C.' },
  ];

  return (
    <div className="reviews-card">
      <h3>⭐ Recent Reviews</h3>
      
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <span className="stars">{'⭐'.repeat(review.rating)}</span>
            </div>
            <p className="review-comment">"{review.comment}"</p>
            <p className="review-author">— {review.author}</p>
            <button className="respond-btn">Respond</button>
          </div>
        ))}
      </div>

      <button className="view-all-reviews-btn">View All Reviews</button>
    </div>
  );
};

export default ReviewsCard;
