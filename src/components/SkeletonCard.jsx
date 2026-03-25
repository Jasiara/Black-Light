import './SkeletonCard.css';

const SkeletonCard = ({ count = 1, variant = 'card' }) => {
  if (variant === 'detail') {
    return (
      <div className="skeleton-detail">
        <div className="sk sk-hero" />
        <div className="sk-detail-body">
          <div className="sk sk-title-lg" />
          <div className="sk sk-badge" />
          <div className="sk sk-line" />
          <div className="sk sk-line" />
          <div className="sk sk-line sk-short" />
        </div>
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card">
          <div className="sk sk-image" />
          <div className="sk-body">
            <div className="sk sk-title" />
            <div className="sk sk-badge" />
            <div className="sk sk-line" />
            <div className="sk sk-line" />
            <div className="sk sk-line sk-short" />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
