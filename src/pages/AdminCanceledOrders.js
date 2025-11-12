import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

const AdminCanceledOrders = () => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
      return;
    }
    fetchCanceledOrders();
    // eslint-disable-next-line
  }, [isAdmin]);

  const fetchCanceledOrders = async () => {
    try {
      const response = await api.get('/admin/canceled-orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch canceled orders');
      console.error('Error fetching canceled orders:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="page-title" style={{ marginTop: '1.5rem  '}}>Orders Cancelled by Users</h1>

        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/admin" className="btn-back">
            <button className='btn btn-pink'>Back to Dashboard</button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <p>No orders cancelled by users.</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.orderNumber}</h3>
                    <p>Cancelled: {order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : '—'}</p>
                    <p>Customer: {order.user?.name} • {order.user?.email}</p>
                  </div>
                  <span className={`status-badge ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="order-items">
                  {order.items && order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <p>{item.name} • {item.quantity} x ₹{item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="order-total">Total: ₹{order.total}</div>

                {order.cancelReason && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong>Cancel reason:</strong>
                    <p>{order.cancelReason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .page-title { font-size: 36px; margin-bottom: 1rem; }
        .order-card { background: var(--color-white); padding: 1.5rem; border-radius: 10px; box-shadow: var(--shadow-md); margin-bottom: 1rem; }
        .order-header { display:flex; justify-content:space-between; align-items:center; }
        .status-badge { padding: 6px 12px; border-radius: 20px; font-weight:700; }
      `}</style>
    </div>
  );
};

export default AdminCanceledOrders;
