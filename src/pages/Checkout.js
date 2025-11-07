import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!isAuthenticated) {
    toast.error('Please login to continue');
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
        toast.error('Please fill all required fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePlaceOrder = async () => {
    try {
      const shippingAddress = {
        name: formData.name,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };

      const items = cart.map(item => ({
        product: item.product._id,
        name: item.product.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images && item.product.images[0]?.url
      }));

      const response = await api.post('/orders', {
        items,
        shippingAddress,
        paymentMethod: formData.paymentMethod
      });

      // If COD, finish here
      if (formData.paymentMethod === 'cod') {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/orders');
        return;
      }

      // For online payments (Razorpay/UPI/Card/etc.) backend returns razorpayOrderId and keyId
      const { order, razorpayOrderId, keyId } = response.data;

      if (!razorpayOrderId) {
        toast.error('Payment gateway initialization failed');
        return;
      }

      // Dynamically load Razorpay SDK
      const loadRazorpay = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) return resolve(true);
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const ok = await loadRazorpay();
      if (!ok) {
        toast.error('Failed to load payment gateway. Please try again later.');
        return;
      }

      toast.success('Redirecting to payment...');

      const options = {
        key: keyId || process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: Math.round(order.total * 100), // in paise
        currency: 'INR',
        name: 'Maytastic',
        description: `Order ${order._id}`,
        order_id: razorpayOrderId,
        handler: async function (razorpayResponse) {
          try {
            // Verify payment on server
            const verifyRes = await api.post(`/orders/${order._id}/verify`, {
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature
            });

            clearCart();
            toast.success('Payment successful and order placed!');
            navigate('/orders');
          } catch (err) {
            console.error('Payment verification error:', err);
            toast.error(err.response?.data?.message || 'Payment verification failed');
            navigate('/orders');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          orderId: order._id
        },
        theme: {
          color: '#F72585'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error('Payment failed. Please try again.');
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-form">
            {step === 1 && (
              <div className="form-step">
                <h2>Shipping Details</h2>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Address Line 1 *</label>
                  <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Address Line 2</label>
                  <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Pin Code *</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
                </div>
                <button className="btn btn-neon" onClick={handleNext}>Continue to Payment</button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleChange} />
                    <span>UPI</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} />
                    <span>Credit/Debit Card</span>
                  </label>
                </div>
                <div className="button-group">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-neon" onClick={handlePlaceOrder}>Place Order</button>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            {cart.map((item, index) => (
              <div key={index} className="summary-item">
                <img src={(item.product.images && item.product.images[0]?.url) || '/placeholder.jpg'} alt={item.product.name} />
                <div>
                  <p>{item.product.name}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <span>₹{item.product.price * item.quantity}</span>
              </div>
            ))}
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          padding: 4rem 0;
          min-height: 60vh;
        }

        .checkout-title {
          font-family: var(--font-bold);
          font-size: 42px;
          margin-bottom: 2rem;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        .form-step h2 {
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid var(--color-gray-300);
          border-radius: 5px;
          font-size: 16px;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-neon-green);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .payment-option {
          display: flex;
          align-items: center;
          padding: 1rem;
          border: 2px solid var(--color-gray-300);
          border-radius: 5px;
          cursor: pointer;
        }

        .payment-option input {
          margin-right: 1rem;
        }

        .button-group {
          display: flex;
          gap: 1rem;
        }

        .button-group .btn {
          flex: 1;
        }

        .checkout-summary {
          background-color: var(--color-gray-100);
          padding: 2rem;
          border-radius: 10px;
          height: fit-content;
        }

        .checkout-summary h3 {
          margin-bottom: 1.5rem;
        }

        .summary-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--color-gray-300);
        }

        .summary-item img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 5px;
        }

        .summary-item p {
          margin: 0.25rem 0;
        }

        .summary-totals {
          margin-top: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
        }

        .summary-row.total {
          border-top: 2px solid var(--color-black);
          font-weight: bold;
          font-size: 20px;
        }

        @media (max-width: 968px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;

