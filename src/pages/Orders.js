import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <p>Please login to view your orders</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="orders-title">My Orders</h1>
        {orders.length === 0 ? (
          <div className="no-orders">
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.orderNumber}</h3>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`status-badge ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="order-items">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <p>{item.name} - {item.size} ({item.quantity}x)</p>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <strong>Total: ₹{order.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .orders-page {
          padding: 4rem 0;
          min-height: 60vh;
        }

        .orders-title {
          font-family: var(--font-bold);
          font-size: 42px;
          margin-bottom: 2rem;
        }

        .no-orders {
          text-align: center;
          padding: 4rem 0;
        }

        .order-card {
          background-color: var(--color-white);
          padding: 2rem;
          border-radius: 10px;
          box-shadow: var(--shadow-md);
          margin-bottom: 2rem;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .status-badge {
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: bold;
          text-transform: capitalize;
        }

        .status-badge.pending {
          background-color: var(--color-fluorescent-orange);
        }

        .status-badge.processing {
          background-color: var(--color-electric-blue);
        }

        .status-badge.shipped {
          background-color: var(--color-neon-green);
        }

        .status-badge.delivered {
          background-color: #4CAF50;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-gray-200);
        }

        .order-total {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid var(--color-black);
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default Orders;

