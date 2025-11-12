import React, { useState, useEffect, useContext } from 'react';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminUsersDetails = () => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usersDetails, setUsersDetails] = useState([]);
  const [ordersByUser, setOrdersByUser] = useState({});
  const [expandedUsers, setExpandedUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
      return;
    }

    const fetchUsersDetails = async () => {
      setLoading(true);
      try {
        const [usersResponse, ordersResponse] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/orders')
        ]);

        const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];

        const groupedOrders = orders.reduce((acc, order) => {
          const userId =
            (typeof order.user === 'object' && order.user !== null && order.user._id) ||
            order.user ||
            'unknown';
          if (!acc[userId]) {
            acc[userId] = [];
          }
          acc[userId].push(order);
          return acc;
        }, {});

        setUsersDetails(users);
        setOrdersByUser(groupedOrders);
      } catch (error) {
        console.error('Error fetching users details:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch users details');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersDetails();
  }, [isAdmin, navigate]);

  const toggleUserOrders = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  if (!isAdmin) return null;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <h1 className="page-title" style={{ marginTop: '1.5rem' }}>Users Details</h1>

        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/admin" className="btn-back">
            <button className="btn btn-pink">Back to Dashboard</button>
          </Link>
        </div>

        {usersDetails.length === 0 ? (
          <p>Oops! No users yet.</p>
        ) : (
          <div className="users-list">
            {usersDetails.map((user) => {
              const userId = user._id || user.id || '';
              const orders = ordersByUser[userId] || [];
              const isExpanded = !!expandedUsers[userId];

              return (
                <div className="user-card" key={userId}>
                  <div className="user-header">
                    <div>
                      <h3>{user.name || 'Unnamed User'}</h3>
                      <p className="user-email">{user.email}</p>
                      <p className="user-meta">
                        Joined:{' '}
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="user-meta">Orders Placed: {orders.length}</p>
                    </div>
                    <button
                      className="btn toggle-orders-btn"
                      onClick={() => toggleUserOrders(userId)}
                    >
                      {isExpanded ? 'Hide Orders' : 'View Orders'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="orders-section">
                      {orders.length === 0 ? (
                        <p className="no-orders">No orders yet.</p>
                      ) : (
                        <ul className="orders-list">
                          {orders.map((order) => (
                            <li key={order._id} className="order-card">
                              <div className="order-row">
                                <div>
                                  <h4>Order #{order.orderNumber || order._id?.slice(-6)}</h4>
                                  <p>
                                    Placed on{' '}
                                    {order.createdAt
                                      ? new Date(order.createdAt).toLocaleString()
                                      : 'Unknown'}
                                  </p>
                                </div>
                                <span className={`status-badge ${order.orderStatus || 'pending'}`}>
                                  {order.orderStatus || 'pending'}
                                </span>
                              </div>
                              <div className="order-row">
                                <span>Total: ₹{order.total?.toFixed(2) || '0.00'}</span>
                                <span>Payment: {order.paymentMethod?.toUpperCase() || 'N/A'}</span>
                                <span>Payment Status: {order.paymentStatus || 'N/A'}</span>
                              </div>
                              <div className="items-list">
                                {order.items?.map((item, index) => (
                                  <div className="item-row" key={`${order._id}-${index}`}>
                                    <div>
                                      <strong>{item.name}</strong>
                                      <span>
                                        {item.size && ` • Size: ${item.size}`}
                                        {item.color && ` • Color: ${item.color}`}
                                      </span>
                                    </div>
                                    <span>
                                      Qty: {item.quantity} • ₹{(item.price || 0) * item.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .page-title { font-size: 36px; margin-bottom: 1rem; }
        .users-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .user-card { background: var(--color-white); padding: 1.5rem; border-radius: 10px; box-shadow: var(--shadow-md); }
        .user-header { display:flex; justify-content:space-between; align-items:flex-start; gap: 1rem; flex-wrap: wrap; }
        .user-email { color: var(--color-gray-600); margin: 0.25rem 0; }
        .user-meta { color: var(--color-gray-500); margin: 0.15rem 0; }
        .toggle-orders-btn { background: var(--color-electric-blue); color: var(--color-white); padding: 0.65rem 1.25rem; border-radius: 8px; font-weight: 600; }
        .orders-section { margin-top: 1.25rem; background: var(--color-gray-100); padding: 1rem; border-radius: 8px; }
        .no-orders { margin: 0; color: var(--color-gray-600); }
        .orders-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
        .order-card { background: var(--color-white); border-radius: 8px; padding: 1rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 0.75rem; }
        .order-row { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .items-list { display: flex; flex-direction: column; gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--color-gray-300); }
        .item-row { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; color: var(--color-gray-700); }
        .status-badge { padding: 6px 12px; border-radius: 20px; font-weight: 700; text-transform: capitalize; }
        .status-badge.pending { background-color: rgba(247, 149, 30, 0.2); color: #b45309; }
        .status-badge.processing { background-color: rgba(56, 189, 248, 0.2); color: #0369a1; }
        .status-badge.shipped { background-color: rgba(16, 185, 129, 0.2); color: #047857; }
        .status-badge.delivered { background-color: rgba(34, 197, 94, 0.2); color: #15803d; }
        .status-badge.cancelled { background-color: rgba(236, 72, 153, 0.2); color: #9d174d; }

        @media (max-width: 768px) {
          .user-header { flex-direction: column; align-items: flex-start; }
          .order-row { flex-direction: column; align-items: flex-start; }
          .item-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
};

export default AdminUsersDetails;