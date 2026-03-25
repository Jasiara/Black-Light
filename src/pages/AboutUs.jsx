import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About <span className="about-brand">Black-Light</span></h1>
          <p>Illuminating Black-owned businesses and the communities that support them.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-mission">
            <div className="about-mission-text">
              <h2>Our Mission</h2>
              <p>
                Black-Light was created to close the visibility gap that Black-owned businesses
                have faced for too long. We believe that when communities can easily discover,
                connect with, and champion these businesses, everyone benefits — economically,
                culturally, and socially.
              </p>
              <p>
                Our platform puts Black-owned businesses on the map, giving them the spotlight
                they deserve while making it effortless for customers to find, review, and
                support them.
              </p>
            </div>
            <div className="about-mission-visual">
              <div className="about-glow-orb" />
              <div className="about-mission-stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Businesses Listed</span>
              </div>
              <div className="about-mission-stat">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Community Members</span>
              </div>
              <div className="about-mission-stat">
                <span className="stat-number">30+</span>
                <span className="stat-label">Cities Represented</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-section about-section--dark">
        <div className="about-container">
          <h2 className="about-section-title">What We Stand For</h2>
          <div className="about-values">
            <div className="about-value-card">
              <div className="about-value-icon">◈</div>
              <h3>Community First</h3>
              <p>Every feature we build centers the needs of Black entrepreneurs and the communities around them.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">◈</div>
              <h3>Radical Visibility</h3>
              <p>We actively work to surface businesses that have been overlooked, underserved, or underrepresented.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">◈</div>
              <h3>Economic Empowerment</h3>
              <p>Directing dollars to Black-owned businesses builds generational wealth and stronger local economies.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">◈</div>
              <h3>Authentic Connection</h3>
              <p>We foster genuine relationships between businesses and customers — not just transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="about-section">
        <div className="about-container about-story">
          <h2>Our Story</h2>
          <p>
            Black-Light started as a simple question: <em>"Why is it so hard to find Black-owned
            businesses in my own city?"</em> What began as a personal frustration became a mission
            to build the platform we always wished existed.
          </p>
          <p>
            Founded in Greensboro, NC, we grew from a local directory into a full platform
            where business owners can manage their presence, run promotions, gather reviews,
            and connect with a loyal customer base — all in one place.
          </p>
          <p>
            We're powered by the belief that visibility is a form of justice. When Black
            businesses thrive, communities thrive.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-container">
          <h2>Join the Movement</h2>
          <p>Whether you're a business owner ready to be seen, or a customer ready to support — there's a place for you here.</p>
          <div className="about-cta-buttons">
            <a href="/search" className="about-btn about-btn--primary">Explore Businesses</a>
            <a href="/login" className="about-btn about-btn--secondary">Create an Account</a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
