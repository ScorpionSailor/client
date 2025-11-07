import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [featured, trending] = await Promise.all([
        api.get('/products?featured=true&limit=8'),
        api.get('/products?trending=true&limit=8')
      ]);
      
      setFeaturedProducts(featured.data.products || []);
      setTrendingProducts(trending.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-highlight">WHY FIT IN</span>
            <br />
            if you are born to
            <br />
            <span className="hero-highlight neon">STAND OUT</span>
          </h1>
          <p className="hero-subtitle">Bold. Authentic. Inclusive.</p>
          <Link to="/shop" className="btn btn-neon hero-btn">
            Explore Collection
          </Link>
        </div>
        <div className="hero-image">
          <div className="hero-gradient"></div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Collection</h2>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <Link to="/shop" className="btn btn-outline">
              View All Products
            </Link>
          </div>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Statement */}
      <section className="brand-section">
        <div className="container">
          <div className="brand-content">
            <h2>For the Bold. For the Different.</h2>
            <p>
              Maytastic is not just a clothing brand; it's a movement. 
              We create streetwear for those who refuse to blend in, 
              for the rebels, the dreamers, and the fearless.
            </p>
            <Link to="/about" className="btn btn-primary">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Trending Now</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {trendingProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .home {
          min-height: 100vh;
        }

        .hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #000000 0%, #2D2D2D 100%);
          overflow: hidden;
          z-index: 1;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%2339FF14" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 20px;
        }

        .hero-title {
          font-family: var(--font-bold);
          font-size: 72px;
          line-height: 1.1;
          margin-bottom: 1rem;
          color: var(--color-white);
        }

        .hero-highlight {
          color: var(--color-neon-green);
          text-shadow: 0 0 30px var(--color-neon-green);
        }

        .hero-subtitle {
          font-size: 24px;
          color: var(--color-gray-300);
          margin-bottom: 2rem;
        }

        .hero-btn {
          font-size: 18px;
          padding: 15px 40px;
        }

        .hero-image {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 40%;
          background: linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(255, 20, 147, 0.1) 100%);
        }

        .section {
          padding: 4rem 0;
        }

        .section-title {
          font-family: var(--font-bold);
          font-size: 48px;
          text-align: center;
          margin-bottom: 3rem;
          color: var(--color-black);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .brand-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, var(--color-charcoal) 0%, var(--color-black) 100%);
          background-transparency: 0.9;
          color: var(--color-white);
        }

        .brand-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .brand-content h2 {
          font-family: var(--font-bold);
          font-size: 42px;
          margin-bottom: 1rem;
          color: var(--color-neon-green);
        }

        .brand-content p {
          font-size: 18px;
          line-height: 1.8;
          margin-bottom: 2rem;
          color: var(--color-gray-300);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 42px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .section-title {
            font-size: 32px;
          }

          .brand-content h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;

