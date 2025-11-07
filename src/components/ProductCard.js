import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.sizes || product.sizes.length === 0) {
      toast.error('No sizes available');
      return;
    }

    const defaultSize = product.sizes[0].size;
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : 'default';
    
    addToCart(product, defaultSize, defaultColor, 1);
    toast.success('Added to cart!');
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={(product.images && product.images[0]?.url) || '/placeholder.jpg'} 
            alt={product.name}
            className="product-image"
          />
          <div className="product-badges">
            {product.featured && <span className="product-badge featured">Featured</span>}
            {product.trending && <span className="product-badge trending">Trending</span>}
            {product.newArrival && <span className="product-badge new">New</span>}
          </div>
          
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <FiShoppingCart />
          </button>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category} • {product.type}</p>
          <div className="product-price">
            <span className="price-current">₹{product.price}</span>
            {product.comparePrice && (
              <span className="price-compare">₹{product.comparePrice}</span>
            )}
          </div>
        </div>
      </Link>

      <style jsx>{`
        .product-card {
          background-color: var(--color-white);
          border-radius: 10px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .product-link {
          text-decoration: none;
          color: inherit;
        }

        .product-image-container {
          position: relative;
          width: 100%;
          height: 300px;
          overflow: hidden;
          background-color: var(--color-gray-100);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-badges {
          position: absolute;
          bottom: 10px;
          left: 10px;
          display: flex;
          gap: 5px;
        }

        .product-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .product-badge.featured {
          background-color: var(--color-neon-green);
          color: var(--color-black);
        }

        .product-badge.trending {
          background-color: var(--color-hot-pink);
          color: var(--color-white);
        }

        .product-badge.new {
          background-color: var(--color-electric-blue);
          color: var(--color-black);
        }

        .add-to-cart-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background-color: var(--color-black);
          color: var(--color-neon-green);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }

        .product-card:hover .add-to-cart-btn {
          opacity: 1;
          transform: translateY(0);
        }

        .add-to-cart-btn:hover {
          background-color: var(--color-neon-green);
          color: var(--color-black);
          box-shadow: var(--shadow-neon-green);
        }

        .product-info {
          padding: 1rem;
        }

        .product-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--color-black);
        }

        .product-category {
          font-size: 14px;
          color: var(--color-gray-500);
          margin-bottom: 0.5rem;
          text-transform: capitalize;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .price-current {
          font-size: 20px;
          font-weight: bold;
          color: var(--color-black);
        }

        .price-compare {
          font-size: 16px;
          color: var(--color-gray-500);
          text-decoration: line-through;
        }

        @media (max-width: 768px) {
          .product-image-container {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;

