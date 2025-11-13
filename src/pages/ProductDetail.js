import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ProductImageCarousel from '../components/ProductImageCarousel';

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
      setActiveImage(0);
      setQuantity(1);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = useCallback((size) => {
    setSelectedSize(size);
    setQuantity(1);
  }, []);

  const handleColorChange = useCallback((color) => {
    setSelectedColor(color);
    setActiveImage(0);
  }, []);

  const getGalleryForColor = useCallback(
    (chosenColor) => {
      if (!product) return [];

      const baseGallery = Array.isArray(product.images) ? product.images : [];

      if (!chosenColor) {
        return baseGallery;
      }

      const target = chosenColor.toLowerCase();

      const colorEntry = product.colors?.find(
        (color) => color?.name && color.name.toLowerCase() === target
      );

      if (colorEntry && Array.isArray(colorEntry.images) && colorEntry.images.length) {
        return colorEntry.images;
      }

      const colorSpecificImages = baseGallery.filter(
        (image) => image?.color && image.color.toLowerCase() === target
      );

      if (colorSpecificImages.length) {
        return colorSpecificImages;
      }

      return baseGallery;
    },
    [product]
  );

  const galleryImages = useMemo(
    () => getGalleryForColor(selectedColor),
    [getGalleryForColor, selectedColor]
  );

  useEffect(() => {
    setActiveImage(0);
  }, [galleryImages.length]);

  const findSizeEntry = useCallback(
    () =>
      product?.sizes?.find(
        (size) =>
          size?.size && selectedSize && size.size.toLowerCase() === selectedSize.toLowerCase()
      ),
    [product?.sizes, selectedSize]
  );

  const availableStock = useMemo(() => {
    if (!product) return 0;

    const baseStock = typeof product.stock === 'number' ? product.stock : 0;
    const sizeEntry = findSizeEntry();
    const sizeStock = typeof sizeEntry?.stock === 'number' ? sizeEntry.stock : null;

    if (sizeEntry) {
      return Math.max(sizeStock ?? 0, baseStock);
    }

    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      const sizeStocks = product.sizes
        .map((entry) => (typeof entry.stock === 'number' ? entry.stock : 0))
        .filter((value) => value > 0);

      if (sizeStocks.length) {
        return Math.max(baseStock, ...sizeStocks);
      }
    }

    return baseStock;
  }, [findSizeEntry, product]);

  const isOutOfStock = availableStock <= 0;

  useEffect(() => {
    if (quantity > availableStock && availableStock > 0) {
      setQuantity(availableStock);
    }
    if (availableStock === 0) {
      setQuantity(1);
    }
  }, [availableStock, quantity]);

  const handleAddToCart = () => {
    if ((product.sizes && product.sizes.length > 0) && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (isOutOfStock) {
      toast.error('This product is currently out of stock');
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} item(s) available`);
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

    if (isOutOfStock) {
      toast.error('This product is currently out of stock');
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} item(s) available`);
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
            <ProductImageCarousel
              images={galleryImages}
              activeIndex={activeImage}
              onActiveIndexChange={setActiveImage}
            />
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

            <div className={`stock-status ${isOutOfStock ? 'out' : 'available'}`}>
              {isOutOfStock ? (
                <span>Out of Stock</span>
              ) : (
                <span>{availableStock} item{availableStock > 1 ? 's' : ''} available</span>
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
                      onClick={() => handleSizeChange(size.size)}
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
                      onClick={() => handleColorChange(color.name)}
                      style={{ backgroundColor: color.hex || color.name }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="quantity-selection">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => {
                    if (isOutOfStock) return;
                    if (quantity < availableStock) {
                      setQuantity(quantity + 1);
                    } else {
                      toast.error(`Only ${availableStock} item(s) available`);
                    }
                  }}
                  disabled={isOutOfStock || quantity >= availableStock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons" style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-pink add-cart-btn"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-neon buy-now-btn"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
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

        .stock-status {
          margin-bottom: 1.5rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .stock-status.available {
          color: var(--color-neon-green);
        }

        .stock-status.out {
          color: var(--color-hot-pink);
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
          border: 3px solid var(--color-gray-200);
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
          transition: background-color 0.3s ease, opacity 0.3s ease;
        }

        .quantity-controls span {
          font-size: 20px;
          font-weight: bold;
          min-width: 30px;
          text-align: center;
        }

        .quantity-controls button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .add-cart-btn {
          width: 100%;
          padding: 15px;
          font-size: 18px;
          margin-bottom: 2rem;
        }

        .action-buttons .add-cart-btn .buy-now-btn {
          width: auto;
          flex: 1;
        }

        .buy-now-btn {
          width: 100%;
          padding: 15px;
          font-size: 18px;
          margin-bottom: 2rem;
        }

        .action-buttons button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
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
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;

