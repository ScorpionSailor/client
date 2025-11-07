import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FiTrash2 } from 'react-icons/fi';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        </div>

        <style jsx>{`
          .cart-page {
            padding: 4rem 0;
            min-height: 60vh;
          }

          .empty-cart {
            text-align: center;
            padding: 4rem 0;
          }

          .empty-cart h2 {
            font-size: 32px;
            margin-bottom: 1rem;
          }

          .empty-cart p {
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
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Cart</h1>
        
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img 
                  src={(item.product.images && item.product.images[0]?.url) || '/placeholder.jpg'}
                  alt={item.product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p>{item.size} • {item.color}</p>
                  <p className="cart-item-price">₹{item.product.price}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(index, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(index)}>
                    <FiTrash2 />
                  </button>
                </div>
                <div className="cart-item-total">
                  ₹{item.product.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
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
            <Link to="/checkout" className="btn btn-neon checkout-btn">
              Proceed to Checkout
            </Link>
            <button className="btn btn-outline" onClick={clearCart} style={{ width: '100%', marginTop: '1rem' }}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page {
          padding: 4rem 0;
          min-height: 60vh;
        }

        .cart-title {
          font-family: var(--font-bold);
          font-size: 42px;
          margin-bottom: 2rem;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 120px 1fr auto auto;
          gap: 1.5rem;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-gray-200);
        }

        .cart-item-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 10px;
        }

        .cart-item-details h3 {
          margin-bottom: 0.5rem;
        }

        .cart-item-details p {
          color: var(--color-gray-500);
          margin-bottom: 0.5rem;
        }

        .cart-item-price {
          font-weight: bold;
          font-size: 18px;
        }

        .cart-item-actions {
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

        .cart-item-total {
          font-weight: bold;
          font-size: 20px;
        }

        .cart-summary {
          background-color: var(--color-gray-100);
          padding: 2rem;
          border-radius: 10px;
          height: fit-content;
        }

        .cart-summary h3 {
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
          .cart-layout {
            grid-template-columns: 1fr;
          }

          .cart-item {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .cart-item-image {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;

