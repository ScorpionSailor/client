import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About Maytastic</h1>
        <p>"Why fit in if you are born to stand out."</p>
      </div>

      <div className="container">
        <div className="about-content">
          <h2>Our Story</h2>
          <p>
            Maytastic was born from a simple yet powerful belief: that everyone deserves to express themselves 
            through what they wear. We're not just a clothing brand; we're a movement dedicated to celebrating 
            individuality, creativity, and the fearless spirit of youth.
          </p>

          <h2>What We Stand For</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Bold</h3>
              <p>We don't shy away from making a statement. Our designs are loud, proud, and unapologetically you.</p>
            </div>
            <div className="value-card">
              <h3>Authentic</h3>
              <p>Every piece we create reflects genuine street culture and the real experiences of young India.</p>
            </div>
            <div className="value-card">
              <h3>Inclusive</h3>
              <p>Fashion has no boundaries. We believe everyone should feel empowered in what they wear.</p>
            </div>
          </div>

          <h2>Join the Movement</h2>
          <p>
            When you wear Maytastic, you're not just wearing clothes – you're making a statement. 
            You're telling the world that you refuse to blend in, that you embrace your uniqueness, 
            and that you're here to make your mark.
          </p>
        </div>
      </div>

      <style jsx>{`
        .about-page {
          min-height: 100vh;
        }

        .about-hero {
          background: linear-gradient(135deg, var(--color-black) 0%, var(--color-charcoal) 100%);
          color: var(--color-white);
          padding: 5rem 0;
          text-align: center;
        }

        .about-hero h1 {
          font-family: var(--font-bold);
          font-size: 56px;
          margin-bottom: 1rem;
          color: var(--color-neon-green);
        }

        .about-hero p {
          font-size: 24px;
          font-style: italic;
        }

        .about-content {
          padding: 4rem 0;
          max-width: 900px;
          margin: 0 auto;
        }

        .about-content h2 {
          font-family: var(--font-bold);
          font-size: 36px;
          margin: 3rem 0 1.5rem;
        }

        .about-content p {
          font-size: 18px;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
        }

        .value-card {
          background-color: var(--color-gray-100);
          padding: 2rem;
          border-radius: 10px;
        }

        .value-card h3 {
          color: var(--color-neon-green);
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .about-hero h1 {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
};

export default About;

