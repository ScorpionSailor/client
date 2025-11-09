import React from 'react';
import { Link } from 'react-router-dom';
import { IoLogoInstagram, IoLogoTwitter } from 'react-icons/io5';
import { FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-logo">MAYTASTIC</h3>
          <p className="footer-tagline">"Why fit in if you were born to stand out."</p>
          <div className="footer-social">
            <a href="https://instagram.com/maytastic" target="_blank" rel="noopener noreferrer" className="social-icon">
              <IoLogoInstagram />
            </a>
            <a href="https://twitter.com/maytastic" target="_blank" rel="noopener noreferrer" className="social-icon">
              <IoLogoTwitter />
            </a>
            <a href="https://facebook.com/maytastic" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaFacebookF />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/shop?category=men">Men's Collection</Link></li>
            <li><Link to="/shop?category=women">Women's Collection</Link></li>
            <li><Link to="/shop?type=hoodie">Hoodies</Link></li>
            <li><Link to="/shop?type=tshirt">T-Shirts</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/about">Our Story</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/refund">Refund Policy</Link></li>
            <li><Link to="/shipping">Shipping Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>📧 support@maytastic.com</li>
            <li>📱 +91 7738267309</li>
            <li>💬 <a href="https://wa.me/917738267309">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Maytastic.com. All rights reserved.</p>
        <p className="footer-brand">Made with 🔥 by the Maytastic team</p>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--color-charcoal);
          color: var(--color-white);
          padding: 3rem 0 1rem;
          margin-top: 4rem;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .footer-section h3 {
          color: var(--color-neon-green);
          font-family: var(--font-bold);
          font-size: 24px;
          margin-bottom: 1rem;
        }

        .footer-section h4 {
          color: var(--color-white);
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .footer-tagline {
          color: var(--color-gray-300);
          margin-bottom: 1rem;
          font-style: italic;
        }

        .footer-section ul {
          list-style: none;
        }

        .footer-section ul li {
          margin-bottom: 0.5rem;
        }

        .footer-section ul li a {
          color: var(--color-gray-300);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-section ul li a:hover {
          color: var(--color-neon-green);
        }

        .footer-social {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-icon {
          color: var(--color-white);
          font-size: 24px;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          color: var(--color-neon-green);
          transform: scale(1.2);
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 2rem auto 0;
          padding: 1rem 20px;
          border-top: 1px solid var(--color-gray-700);
          text-align: center;
          color: var(--color-gray-300);
        }

        .footer-brand {
          margin-top: 0.5rem;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

