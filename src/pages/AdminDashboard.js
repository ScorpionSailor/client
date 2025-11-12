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
  const [stockModal, setStockModal] = useState({
    open: false,
    product: null
  });
  const [stockForm, setStockForm] = useState({
    mode: 'set',
    quantity: '',
    sizeUpdates: []
  });
  const [savingStock, setSavingStock] = useState(false);

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

  const openStockManager = (product) => {
    const sizeUpdates = (product.sizes || []).map((size) => ({
      size: size.size,
      stock: typeof size.stock === 'number' ? String(size.stock) : ''
    }));

    setStockForm({
      mode: 'set',
      quantity: '',
      sizeUpdates
    });
    setStockModal({
      open: true,
      product
    });
  };

  const closeStockManager = () => {
    if (savingStock) return;
    setStockModal({
      open: false,
      product: null
    });
    setStockForm({
      mode: 'set',
      quantity: '',
      sizeUpdates: []
    });
  };

  const handleStockQuantityChange = (value) => {
    const sanitized = value === '' ? '' : Number(value);
    if (sanitized === '' || Number.isFinite(sanitized)) {
      setStockForm((prev) => ({
        ...prev,
        quantity: value
      }));
    }
  };

  const handleSizeStockChange = (index, value) => {
    setStockForm((prev) => {
      const next = [...prev.sizeUpdates];
      next[index] = {
        ...next[index],
        stock: value
      };
      return {
        ...prev,
        sizeUpdates: next
      };
    });
  };

  const handleStockModeChange = (mode) => {
    setStockForm((prev) => ({
      ...prev,
      mode
    }));
  };

  const submitStockUpdate = async () => {
    if (!stockModal.product) return;

    const payload = {};

    if (stockForm.quantity !== '') {
      const numericValue = Number(stockForm.quantity);
      if (!Number.isFinite(numericValue)) {
        toast.error('Enter a valid quantity');
        return;
      }
      if (stockForm.mode === 'set') {
        if (numericValue < 0) {
          toast.error('Quantity cannot be negative');
          return;
        }
        payload.newStock = numericValue;
      } else if (stockForm.mode === 'increment') {
        payload.delta = numericValue;
      }
    }

    const sizeStockUpdates = stockForm.sizeUpdates
      .filter((entry) => entry.size && entry.stock !== '')
      .map((entry) => ({
        size: entry.size,
        stock: Number(entry.stock)
      }))
      .filter((entry) => Number.isFinite(entry.stock) && entry.stock >= 0);

    if (sizeStockUpdates.length) {
      payload.sizeStockUpdates = sizeStockUpdates;
    }

    if (!payload.newStock && !payload.delta && !payload.sizeStockUpdates) {
      toast.error('Provide at least one stock adjustment');
      return;
    }

    try {
      setSavingStock(true);
      await api.patch(`/admin/products/${stockModal.product._id}/stock`, payload);
      toast.success('Stock updated successfully');
      closeStockManager();
      fetchDashboardData();
    } catch (error) {
      console.error('Stock update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update stock');
    } finally {
      setSavingStock(false);
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
          <div>
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
                <button className='view-all-btn' style={{ marginTop: '1rem' }} onClick={()=> navigate('/admin/users-details')}></button>
              </div>
              <div className="stat-card">
                <h3>Orders Cancelled</h3>
                <p>{stats.canceledOrdersCount || 0}</p>
                <button className="view-all-btn" style={{ marginTop: '1rem' }} onClick={() => navigate('/admin/canceled-orders')}>View Cancelled</button>
              </div>
            </div>

            <div className="revenue-section">
              <h2>Revenue Breakdown</h2>
              <div className="revenue-grid">
                <div className="stat-card revenue-card">
                  <h3>COD Revenue</h3>
                  <p>₹{stats.codRevenue.toFixed(2)}</p>
                  <small>(from delivered orders)</small>
                </div>
                <div className="stat-card revenue-card">
                  <h3>Online Payments</h3>
                  <p>₹{stats.onlineRevenue.toFixed(2)}</p>
                  <small>(from completed payments)</small>
                </div>
                <div className="stat-card revenue-card total">
                  <h3>Total Revenue</h3>
                  <p>₹{stats.totalRevenue.toFixed(2)}</p>
                  <small>(COD + Online)</small>
                </div>
              </div>
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
          <button className='product-btn' style={{marginBottom:'2rem'}} onClick={AddProduct}>+ Add Product</button>
          <div className="products-table">
            {products.map(product => (
              <div key={product._id} className="product-row">
                <img src={(product.images && product.images[0]?.url) || '/placeholder.jpg'} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <p>{product.category} • {product.type}</p>
                </div>
                <div className="stock-block">
                  <span className="stock-count">Stock: {typeof product.stock === 'number' ? product.stock : 0}</span>
                  <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                    {product.inStock ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                <span className="price-cell">₹{product.price}</span>
                <div className="product-actions">
                  <button
                    className="btn-manage-stock"
                    onClick={() => openStockManager(product)}
                  >
                    Manage Stock
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDeleteProduct(product._id)}
                    title="Delete product"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {stockModal.open && stockModal.product && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Manage Stock</h3>
            <p className="modal-subtitle">{stockModal.product.name}</p>
            <div className="modal-section">
              <span className="label">Current Stock:</span>
              <strong>{typeof stockModal.product.stock === 'number' ? stockModal.product.stock : 0}</strong>
            </div>
            <div className="stock-mode-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="stockMode"
                  value="set"
                  checked={stockForm.mode === 'set'}
                  onChange={() => handleStockModeChange('set')}
                />
                <span>Set exact quantity</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="stockMode"
                  value="increment"
                  checked={stockForm.mode === 'increment'}
                  onChange={() => handleStockModeChange('increment')}
                />
                <span>Add/remove quantity</span>
              </label>
            </div>
            <div className="modal-section">
              <label>
                {stockForm.mode === 'set' ? 'New stock quantity' : 'Quantity to add/remove'}
              </label>
              <input
                type="number"
                min={stockForm.mode === 'set' ? 0 : undefined}
                value={stockForm.quantity}
                onChange={(e) => handleStockQuantityChange(e.target.value)}
                placeholder={stockForm.mode === 'set' ? 'Enter new total stock' : 'Enter positive or negative value'}
              />
              {stockForm.mode === 'increment' && (
                <small className="hint">Use negative values to decrease stock.</small>
              )}
            </div>

            {stockForm.sizeUpdates.length > 0 && (
              <div className="modal-section size-section">
                <label>Size-level stock</label>
                <div className="size-grid">
                  {stockForm.sizeUpdates.map((entry, index) => (
                    <div key={entry.size || index} className="size-row">
                      <span className="size-name">{entry.size}</span>
                      <input
                        type="number"
                        min="0"
                        value={entry.stock}
                        onChange={(e) => handleSizeStockChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn secondary" onClick={closeStockManager} disabled={savingStock}>
                Cancel
              </button>
              <button className="btn primary" onClick={submitStockUpdate} disabled={savingStock}>
                {savingStock ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

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

        .revenue-section {
          margin-bottom: 4rem;
        }

        .revenue-section h2 {
          margin-bottom: 2rem;
          color: var(--color-gray-700);
        }

        .revenue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .revenue-card small {
          display: block;
          color: var(--color-gray-500);
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .revenue-card.total {
          background-color: var(--color-black);
        }

        .revenue-card.total h3,
        .revenue-card.total p,
        .revenue-card.total small {
          color: var(--color-neon-green);
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
          grid-template-columns: 80px 1fr auto auto auto;
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

        .stock-block {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          align-items: flex-start;
        }

        .stock-count {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-gray-700);
        }

        .stock-badge {
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .stock-badge.in-stock {
          background-color: rgba(34, 197, 94, 0.15);
          color: #15803d;
        }

        .stock-badge.out-stock {
          background-color: rgba(236, 72, 153, 0.15);
          color: var(--color-hot-pink);
        }

        .price-cell {
          font-weight: 700;
        }

        .product-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-manage-stock {
          background-color: var(--color-electric-blue);
          color: var(--color-white);
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: opacity 0.3s ease;
        }

        .btn-manage-stock:hover {
          opacity: 0.85;
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

        .modal-backdrop {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.45);
          z-index: 1000;
          padding: 1.5rem;
        }

        .modal-card {
          width: min(520px, 100%);
          background: var(--color-white);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .modal-card h3 {
          margin: 0;
          font-size: 1.5rem;
          font-family: var(--font-bold);
        }

        .modal-subtitle {
          margin: 0;
          color: var(--color-gray-500);
        }

        .modal-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .modal-section label {
          font-weight: 600;
          color: var(--color-gray-600);
        }

        .modal-section input {
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--color-gray-300);
          font-size: 1rem;
        }

        .stock-mode-group {
          display: flex;
          gap: 1.5rem;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          cursor: pointer;
        }

        .radio-option input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .hint {
          color: var(--color-gray-500);
          font-size: 0.8rem;
        }

        .size-section {
          gap: 0.75rem;
        }

        .size-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem 1rem;
        }

        .size-row {
          display: contents;
        }

        .size-name {
          font-weight: 600;
          color: var(--color-gray-600);
          align-self: center;
        }

        .size-row input {
          width: 100%;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .modal-actions .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .modal-actions .btn.primary {
          background-color: var(--color-neon-green);
          color: var(--color-black);
        }

        .modal-actions .btn.secondary {
          background-color: var(--color-gray-200);
          color: var(--color-black);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .product-row {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .product-row img {
            width: 100%;
            height: 180px;
          }

          .stock-block {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .product-actions {
            flex-direction: column;
          }

          .modal-card {
            padding: 1.5rem;
          }

          .stock-mode-group {
            flex-direction: column;
            gap: 0.75rem;
          }

          .size-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

