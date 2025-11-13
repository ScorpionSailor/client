import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { FiTrash2 } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, getTotalPrice, clearWishlist } = useContext(WishlistContext);

  if (wishlist.length === 0) {
    return (
      <div className="Wishlist-page">
        <div className="container">
          <div className="empty-Wishlist">
            <h2>Your Wishlist is empty</h2>
            <p>Looks like you haven't added anything yet</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        </div>

        <style jsx>{`
          .Wishlist-page {
            padding: 4rem 0;
            min-height: 60vh;
          }

          .empty-Wishlist {
            text-align: center;
            padding: 4rem 0;
          }

          .empty-Wishlist h2 {
            font-size: 32px;
            margin-bottom: 1rem;
          }

          .empty-Wishlist p {
            font-size: 18px;
            color: var(--color-gray-500);
            margin-bottom: 2rem;
          }
        `}</style>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="Wishlist-page">
      <div className="container">
        <h1 className="Wishlist-title">Shopping Wishlist</h1>
        
        <div className="Wishlist-layout">
          <Link className="Wishlist-items">
            {wishlist.map((item, index) => (
              <div key={item.product._id || index} className="Wishlist-item">
                <img 
                  src={(item.product.images && item.product.images[0]?.url) || '/placeholder.jpg'}
                  alt={item.product.name}
                  className="Wishlist-item-image"
                />
                <div className="Wishlist-item-details">
                  <h3>{item.product.name}</h3>
                  <p className="Wishlist-item-price">₹{item.product.price}</p>
                </div>
                <div className="Wishlist-item-actions">
                  <button className="remove-btn" onClick={() => removeFromWishlist(item.product._id ?? index)}>
                    <FiTrash2 />
                  </button>
                </div>
                <div className="Wishlist-item-total">
                  ₹{item.product.price}
                </div>
              </div>
            ))}
          </Link>

          <div className="Wishlist-summary">
            <h3>Wishlist Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (GST)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button className="btn btn-outline" onClick={clearWishlist} style={{ width: '100%', marginTop: '1rem' }}>
              Clear Wishlist
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .Wishlist-page {
          padding: 4rem 0;
          min-height: 60vh;
        }

        .Wishlist-title {
          font-family: var(--font-bold);
          font-size: 42px;
          margin-bottom: 2rem;
        }

        .Wishlist-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        .Wishlist-item {
          display: grid;
          grid-template-columns: 120px 1fr auto auto;
          gap: 1.5rem;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-gray-200);
          background-color: var(--color-white);
        }

        .Wishlist-item-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 10px;
        }

        .Wishlist-item-details h3 {
          margin-bottom: 0.5rem;
        }

        .Wishlist-item-details p {
          color: var(--color-gray-500);
          margin-bottom: 0.5rem;
        }

        .Wishlist-item-price {
          font-weight: bold;
          font-size: 18px;
        }

        .Wishlist-item-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quantity-controls button {
          width: 30px;
          height: 30px;
          border: 2px solid var(--color-gray-300);
          background-color: var(--color-white);
          border-radius: 5px;
          cursor: pointer;
        }

        .quantity-controls span {
          font-weight: bold;
          min-width: 30px;
          text-align: center;
        }

        .remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: var(--color-gray-500);
          transition: color 0.3s ease;
        }

        .remove-btn:hover {
          color: var(--color-hot-pink);
        }

        .Wishlist-item-total {
          font-weight: bold;
          font-size: 20px;
        }

        .Wishlist-summary {
          background-color: var(--color-gray-100);
          padding: 2rem;
          border-radius: 10px;
          height: fit-content;
        }

        .Wishlist-summary h3 {
          margin-bottom: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-gray-300);
        }

        .summary-row.total {
          border-bottom: none;
          border-top: 2px solid var(--color-black);
          margin-top: 0.5rem;
          padding-top: 1rem;
          font-size: 20px;
          font-weight: bold;
        }

        .checkout-btn {
          width: 100%;
          margin-top: 1.5rem;
        }

        @media (max-width: 968px) {
          .Wishlist-layout {
            grid-template-columns: 1fr;
          }

          .Wishlist-item {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .Wishlist-item-image {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default Wishlist;

