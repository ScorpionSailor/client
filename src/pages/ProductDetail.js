import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      
      // Set default size and color
      if (response.data.sizes && response.data.sizes.length > 0) {
        setSelectedSize(response.data.sizes[0].size);
      }
      if (response.data.colors && response.data.colors.length > 0) {
        setSelectedColor(response.data.colors[0].name);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!isAuthenticated) {
      // Redirect unauthenticated users to login
      navigate('/login');
      return;
    }

    addToCart(product, selectedSize, selectedColor || 'default', quantity);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Add the selected product to cart (will merge if already present) and go to checkout
    addToCart(product, selectedSize, selectedColor || 'default', quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Product not found</h2>
          <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail-grid">
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.images && product.images[activeImage]?.url || '/placeholder.jpg'} 
                alt={product.name}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`${product.name} ${index + 1}`}
                    onClick={() => setActiveImage(index)}
                    className={activeImage === index ? 'active' : ''}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-meta">
              <span className="product-category">{product.category} • {product.type}</span>
              {product.avgRating > 0 && (
                <div className="rating">
                  {'★'.repeat(Math.round(product.avgRating))}
                </div>
              )}
            </div>
            
            <div className="product-price">
              <span className="price-current">₹{product.price}</span>
              {product.comparePrice && (
                <span className="price-compare">₹{product.comparePrice}</span>
              )}
              {product.comparePrice && (
                <span className="discount">
                  {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="size-selection">
                <h3>Size</h3>
                <div className="size-buttons">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`size-btn ${selectedSize === size.size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size.size)}
                      disabled={size.stock === 0}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {product.colors && product.colors.length > 0 && (
              <div className="color-selection">
                <h3>Color</h3>
                <div className="color-buttons">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-btn ${selectedColor === color.name ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color.name)}
                      style={{ backgroundColor: color.name }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="quantity-selection">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="action-buttons" style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-neon add-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn btn-pink buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            <div className="product-details">
              <h3>Product Details</h3>
              <ul>
                <li>100% Cotton</li>
                <li>Machine Washable</li>
                <li>Comfortable Fit</li>
                <li>Premium Quality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-detail {
          padding: 4rem 0;
          min-height: 100vh;
        }

        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }

        .main-image img {
          width: 100%;
          height: 600px;
          object-fit: cover;
          border-radius: 10px;
        }

        .thumbnail-images {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .thumbnail-images img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 5px;
          cursor: pointer;
          border: 2px solid transparent;
          opacity: 0.7;
        }

        .thumbnail-images img:hover,
        .thumbnail-images img.active {
          opacity: 1;
          border-color: var(--color-neon-green);
        }

        .product-title {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .product-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .product-category {
          color: var(--color-gray-500);
          text-transform: capitalize;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .price-current {
          font-size: 32px;
          font-weight: bold;
        }

        .price-compare {
          font-size: 20px;
          color: var(--color-gray-500);
          text-decoration: line-through;
        }

        .discount {
          background-color: var(--color-hot-pink);
          color: var(--color-white);
          padding: 5px 10px;
          border-radius: 5px;
          font-weight: bold;
        }

        .product-description {
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .size-selection,
        .color-selection,
        .quantity-selection {
          margin-bottom: 2rem;
        }

        .size-selection h3,
        .color-selection h3,
        .quantity-selection h3 {
          margin-bottom: 1rem;
        }

        .size-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .size-btn {
          padding: 10px 20px;
          border: 2px solid var(--color-gray-300);
          background-color: var(--color-white);
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .size-btn:hover:not(:disabled) {
          border-color: var(--color-neon-green);
        }

        .size-btn.active {
          background-color: var(--color-black);
          color: var(--color-white);
          border-color: var(--color-black);
        }

        .size-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .color-buttons {
          display: flex;
          gap: 1rem;
        }

        .color-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .color-btn:hover {
          transform: scale(1.1);
        }

        .color-btn.active {
          border-color: var(--color-black);
          transform: scale(1.15);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .quantity-controls button {
          width: 40px;
          height: 40px;
          border: 2px solid var(--color-gray-300);
          background-color: var(--color-white);
          border-radius: 5px;
          cursor: pointer;
          font-size: 20px;
        }

        .quantity-controls span {
          font-size: 20px;
          font-weight: bold;
          min-width: 30px;
          text-align: center;
        }

        .add-cart-btn {
          width: 100%;
          padding: 15px;
          font-size: 18px;
          margin-bottom: 2rem;
        }

        .action-buttons .add-cart-btn ,.buy-now-btn {
          width: auto;
          flex: 1;
        }

        .buy-now-btn {
          width: 100%;
          padding: 15px;
          font-size: 18px;
          margin-bottom: 2rem;
        }

        .buy-now-btn:hover {
          opacity: 0.95;
        }

        .product-details ul {
          list-style: none;
        }

        .product-details ul li {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--color-gray-200);
        }

        @media (max-width: 968px) {
          .product-detail-grid {
            grid-template-columns: 1fr;
          }

          .main-image img {
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;

