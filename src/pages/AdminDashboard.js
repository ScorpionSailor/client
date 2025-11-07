import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { _, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin only.');
      return;
    }
    fetchDashboardData();
  }, []);

  const AddProduct = () => {
    navigate('/admin/products/new');
  };

  const viewOrders = () => {
    navigate('/admin/orders');
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchDashboardData(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [statsRes, productsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/products')
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <p>Access denied</p>
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
    <div className="admin-page">
      <div className="container">
        <h1 className="admin-title">Admin Dashboard</h1>
        
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Products</h3>
              <p>{stats.totalProducts}</p>
            </div>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p>₹{stats.totalRevenue}</p>
            </div>
          </div>
        )}

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <button className="view-all-btn" onClick={viewOrders}>View All Orders</button>
          </div>
          {stats && stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="recent-orders">
              {stats.recentOrders.slice(0, 3).map(order => (
                <div key={order._id} className="order-row">
                  <div>
                    <h4>#{order.orderNumber}</h4>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`status-badge ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                  <span className="order-total">₹{order.total}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent orders</p>
          )}
        </div>

        <div className="products-section">
          <h2>Products</h2>
          <button className='product-btn' onClick={AddProduct}>+ Add Product</button>
          <div className="products-table">
            {products.map(product => (
              <div key={product._id} className="product-row">
                <img src={(product.images && product.images[0]?.url) || '/placeholder.jpg'} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <p>{product.category} • {product.type}</p>
                </div>
                <span>₹{product.price}</span>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDeleteProduct(product._id)}
                  title="Delete product"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page {
          padding: 4rem 0;
          min-height: 60vh;
        }

        .admin-title {
          font-family: var(--font-bold);
          font-size: 42px;
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .dashboard-section {
          margin-bottom: 4rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .view-all-btn {
          padding: 0.75rem 1.5rem;
          background: none;
          border: 2px solid var(--color-black);
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-all-btn:hover {
          background-color: var(--color-black);
          color: var(--color-white);
        }

        .recent-orders {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 2rem;
          align-items: center;
          padding: 1.5rem;
          background-color: var(--color-white);
          border-radius: 10px;
          box-shadow: var(--shadow-md);
        }

        .order-row h4 {
          margin-bottom: 0.5rem;
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

        .order-total {
          font-weight: bold;
          font-size: 18px;
        }

        .stat-card {
          background-color: var(--color-white);
          padding: 2rem;
          border-radius: 10px;
          box-shadow: var(--shadow-md);
          text-align: center;
        }

        .stat-card h3 {
          color: var(--color-gray-500);
          margin-bottom: 1rem;
        }

        .stat-card p {
          font-size: 32px;
          font-weight: bold;
          color: var(--color-neon-green);
        }

        .products-section h2 {
          margin-bottom: 2rem;
        }
        
        .product-btn {
          font-size: 18px;
          padding: 15px 40px;
        }
        
        .product-row {
          display: grid;
          grid-template-columns: 80px 1fr auto auto;
          gap: 2rem;
          align-items: center;
          padding: 1.5rem;
          background-color: var(--color-white);
          border-radius: 10px;
          box-shadow: var(--shadow-md);
          margin-bottom: 1rem;
        }

        .product-row img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 10px;
        }

        .product-row span {
          font-weight: bold;
          font-size: 18px;
        }

        .btn-delete {
          background-color: var(--color-hot-pink);
          color: var(--color-white);
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: opacity 0.3s ease;
        }

        .btn-delete:hover {
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .product-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .btn-delete {
            justify-self: start;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

