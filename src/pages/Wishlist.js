import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { FiTrash2 } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, getTotalPrice, clearWishlist } = useContext(WishlistContext);

  if (!wishlist || wishlist.length === 0) {
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
          {/* container for the list */}
          <div className="Wishlist-items">
            {wishlist.map((item, index) => {
              const product = item?.product || {};
              const id = product._id || index;
              return (
                <Link
                  to={`/product/${id}`}
                  key={id}
                  className="Wishlist-item-link"
                >
                  <div className="Wishlist-item">
                    <img
                      src={(product.images && product.images[0]?.url) || '/placeholder.jpg'}
                      alt={product.name || 'Product'}
                      className="Wishlist-item-image"
                    />
                    <div className="Wishlist-item-details">
                      <h3>{product.name}</h3>
                      <p className="Wishlist-item-price">₹{product.price ?? '0'}</p>
                    </div>

                    <div className="Wishlist-item-actions">
                      {/* prevent Link navigation when clicking remove */}
                      <button
                        className="remove-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromWishlist(product._id ?? index);
                        }}
                        aria-label="Remove from wishlist"
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="Wishlist-item-total">
                      ₹{product.price ?? '0'}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <aside className="Wishlist-summary">
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
            <button className="btn btn-outline checkout-btn" onClick={clearWishlist}>
              Clear Wishlist
            </button>
          </aside>
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

        /* two-column layout: list + summary */
        .Wishlist-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        /* list container */
        .Wishlist-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* each item is a clickable link wrapper */
        .Wishlist-item-link {
          text-decoration: none;
          color: inherit;
        }

        .Wishlist-item {
          display: grid;
          grid-template-columns: 120px 1fr auto;
          gap: 1.25rem;
          align-items: center;
          padding: 1rem;
          border: 1px solid var(--color-gray-200);
          background-color: var(--color-white);
          border-radius: 10px;
          overflow: hidden;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .Wishlist-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .Wishlist-item-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
          transition: transform 0.25s ease;
        }

        .Wishlist-item:hover .Wishlist-item-image {
          transform: scale(1.03);
        }

        .Wishlist-item-details h3 {
          margin: 0 0 0.35rem 0;
          font-size: 16px;
          line-height: 1.2;
        }

        .Wishlist-item-details p {
          color: var(--color-gray-500);
          margin: 0;
        }

        .Wishlist-item-price {
          font-weight: 600;
          font-size: 16px;
          margin-top: 6px;
        }

        /* actions column (trash) */
        .Wishlist-item-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
        }

        .remove-btn {
          background: none;
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 18px;
          color: var(--color-gray-600);
          padding: 6px;
          border-radius: 6px;
          transition: background 0.18s ease, color 0.18s ease, transform 0.12s ease;
        }

        .remove-btn:hover {
          background: var(--color-gray-50);
          color: var(--color-hot-pink);
          transform: translateY(-2px);
        }

        .Wishlist-item-total {
          font-weight: 700;
          font-size: 16px;
          justify-self: end;
        }

        .Wishlist-summary {
          background-color: var(--color-gray-100);
          padding: 1.5rem;
          border-radius: 10px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .Wishlist-summary h3 {
          margin: 0 0 0.5rem 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--color-gray-300);
        }

        .summary-row.total {
          border-bottom: none;
          border-top: 2px solid var(--color-black);
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          font-size: 18px;
          font-weight: 700;
        }

        .checkout-btn {
          width: 100%;
          margin-top: 0.5rem;
        }

        /* responsive */
        @media (max-width: 968px) {
          .Wishlist-layout {
            grid-template-columns: 1fr;
          }

          .Wishlist-item {
            grid-template-columns: 1fr auto;
            gap: 0.75rem;
            align-items: center;
          }

          .Wishlist-item-image {
            width: 100%;
            height: 160px;
            border-radius: 8px;
          }

          .Wishlist-item-details {
            padding-right: 0.5rem;
          }

          .Wishlist-item-total {
            justify-self: end;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Wishlist;
