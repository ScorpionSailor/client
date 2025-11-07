import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { getTotalItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">MAYTASTIC</span>
          <span className="logo-tagline">.com</span>
        </Link>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/shop" className="navbar-link" onClick={() => setIsOpen(false)}>
            Shop
          </Link>
          <Link to="/about" className="navbar-link" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/contact" className="navbar-link" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          
          <div className="navbar-icons">
            {isAuthenticated ? (
              <>
                {user?.role !== "admin" &&(
                  <Link to="/profile" className="navbar-icon" onClick={() => setIsOpen(false)}>
                  <FiUser />
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="navbar-link" onClick={() => setIsOpen(false)}>
                    Admin
                  </Link>
                )}
                <button className="navbar-link logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar-link" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}
            
            {
              user?.role === 'user' && (
                <Link to="/cart" className="navbar-icon cart-icon" onClick={() => setIsOpen(false)}>
                  <FiShoppingCart />
                  {getTotalItems() > 0 && (
                    <span className="cart-badge">{getTotalItems()}</span>
                  )}
                </Link>
              )
            }
          </div>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          {isOpen ? <FiX /> : <FiMenu />}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background-color: var(--color-black);
          color: var(--color-white);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: var(--shadow-md);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-logo {
          font-family: var(--font-bold);
          font-size: 28px;
          color: var(--color-white);
          text-decoration: none;
          letter-spacing: 2px;
        }

        .logo-text {
          color: var(--color-neon-green);
        }

        .logo-tagline {
          color: var(--color-white);
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 30px;
          list-style: none;
        }

        .navbar-link {
          color: var(--color-white);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }

        .navbar-link:hover {
          color: var(--color-neon-green);
        }

        .navbar-icons {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .navbar-icon {
          color: var(--color-white);
          font-size: 24px;
          position: relative;
          transition: color 0.3s ease;
        }

        .navbar-icon:hover {
          color: var(--color-neon-green);
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: var(--color-hot-pink);
          color: var(--color-white);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        .navbar-toggle {
          display: none;
          color: var(--color-white);
          font-size: 28px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .navbar-toggle {
            display: block;
          }

          .navbar-menu {
            position: fixed;
            left: -100%;
            top: 60px;
            flex-direction: column;
            background-color: var(--color-black);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 2rem 0;
            gap: 0;
          }

          .navbar-menu.active {
            left: 0;
          }

          .navbar-link {
            padding: 1rem;
            display: block;
            width: 100%;
          }

          .navbar-icons {
            flex-direction: column;
            gap: 0;
            width: 100%;
          }
        }
      `}      </style>
    </nav>
  );
};

export default Navbar;

