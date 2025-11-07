import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
      return;
    }
    fetchOrders();
  }, [isAdmin, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/all');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success('Order status updated successfully');
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!isAdmin) {
    return null; // Navigate will handle redirect
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="container">
        <h1 className="page-title">Manage Orders</h1>
        
        <div className="orders-list">

        {
          orders.length === 0 ? (
            <div className="no-orders">
              <h3>No orders yet</h3>
              <p>OOP! No Coustomers have placed orders yet</p>
            </div>
          ) : 
          orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Customer: {order.shippingAddress.name}</p>
                </div>
                <div className="order-actions">
                  <span className={`status-badge ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                  <button 
                    className="btn-change-status"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                  >
                    Change Status
                  </button>
                </div>
              </div>
              
              <div className="order-details">
                <div className="items-list">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image || '/placeholder.jpg'} alt={item.name} />
                      <div className="item-info">
                        <p>{item.name}</p>
                        <p>Size: {item.size} • Qty: {item.quantity}</p>
                        <p>₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>₹{order.shipping}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>₹{order.tax}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>

                <div className="shipping-details">
                  <h4>Shipping Details</h4>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.pincode}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Update Modal */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Order Status</h3>
            <p>Order #{selectedOrder.orderNumber}</p>
            <div className="status-options">
              {statusOptions.map(status => (
                <button
                  key={status}
                  className={`status-btn ${selectedOrder.orderStatus === status ? 'active' : ''}`}
                  onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                >
                  {status}
                </button>
              ))}
            </div>
            <button className="btn-close" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-orders-page {
          padding: 4rem 0;
          min-height: 60vh;
        }

        .page-title {
          font-family: var(--font-bold);
          font-size: 42px;
          margin-bottom: 3rem;
        }

        .order-card {
          background-color: var(--color-white);
          border-radius: 10px;
          box-shadow: var(--shadow-md);
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-gray-200);
        }

        .order-info h3 {
          margin-bottom: 0.5rem;
        }

        .order-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: bold;
          text-transform: capitalize;
        }

        .status-badge.pending {
          background-color: var(--color-fluorescent-orange);
          color: var(--color-white);
        }

        .status-badge.processing {
          background-color: var(--color-electric-blue);
          color: var(--color-white);
        }

        .status-badge.shipped {
          background-color: var(--color-neon-green);
          color: var(--color-white);
        }

        .status-badge.delivered {
          background-color: #4CAF50;
          color: var(--color-white);
        }

        .status-badge.cancelled {
          background-color: var(--color-hot-pink);
          color: var(--color-white);
        }

        .btn-change-status {
          padding: 0.5rem 1rem;
          border: 2px solid var(--color-black);
          background: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .btn-change-status:hover {
          background-color: var(--color-black);
          color: var(--color-white);
        }

        .order-details {
          padding: 1.5rem;
        }

        .items-list {
          margin-bottom: 2rem;
        }

        .order-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--color-gray-200);
        }

        .order-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 5px;
        }

        .item-info p {
          margin: 0.25rem 0;
        }

        .order-summary {
          margin: 2rem 0;
          padding: 1rem;
          background-color: var(--color-gray-100);
          border-radius: 5px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
        }

        .summary-row.total {
          border-top: 2px solid var(--color-black);
          font-weight: bold;
          margin-top: 0.5rem;
          padding-top: 1rem;
        }

        .shipping-details {
          background-color: var(--color-gray-100);
          padding: 1rem;
          border-radius: 5px;
        }

        .shipping-details h4 {
          margin-bottom: 1rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background-color: var(--color-white);
          padding: 2rem;
          border-radius: 10px;
          width: 90%;
          max-width: 500px;
        }

        .modal h3 {
          margin-bottom: 1rem;
        }

        .status-options {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin: 2rem 0;
        }

        .status-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--color-gray-300);
          background: none;
          border-radius: 5px;
          cursor: pointer;
          text-transform: capitalize;
          transition: all 0.3s ease;
        }

        .status-btn:hover {
          border-color: var(--color-black);
        }

        .status-btn.active {
          background-color: var(--color-black);
          border-color: var(--color-black);
          color: var(--color-white);
        }

        .btn-close {
          width: 100%;
          padding: 1rem;
          border: none;
          background-color: var(--color-gray-300);
          color: var(--color-black);
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .btn-close:hover {
          background-color: var(--color-gray-400);
        }

        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            gap: 1rem;
          }

          .order-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
