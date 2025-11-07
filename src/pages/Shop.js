import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../config/api';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    type: searchParams.get('type') || 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.category !== 'all') params.append('category', filters.category.toLowerCase());
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      if (sortBy) params.append('sort', sortBy);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="shop-title">SHOP</h1>
        <p className="shop-subtitle">Find your perfect style</p>
      </div>

      <div className="container shop-container">
        <div className="shop-filters">
          <div className="filter-group">
            <h3>Category</h3>
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="all">All Categories</option>
              <option value="men">Men's</option>
              <option value="women">Women's</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>Type</h3>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="all">All Types</option>
              <option value="tshirt">T-Shirts</option>
              <option value="hoodie">Hoodies</option>
              <option value="oversized">Oversized</option>
              <option value="crop-top">Crop Tops</option>
              <option value="tank">Tanks</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>Sort By</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>Search Products</h3>
            <input
              type="text"
              placeholder="Search products..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .shop-page {
          min-height: 100vh;
          padding-top: 0.45rem;
        }

        .shop-header {
          text-align: center;
          padding: 3rem 0;
          background: linear-gradient(135deg, var(--color-charcoal) 0%, var(--color-black) 100%);
          color: var(--color-white);
        }

        .shop-title {
          font-family: var(--font-bold);
          font-size: 56px;
          color: var(--color-neon-green);
          margin-bottom: 1rem;
        }

        .shop-subtitle {
          font-size: 20px;
          color: var(--color-gray-300);
        }

        .shop-container {
          padding: 3.8rem 0;
        }

        .shop-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
          padding: 2rem;
          background-color: var(--color-gray-100);
          border-radius: 10px;
        }

        .filter-group h3 {
          font-size: 14px;
          margin-bottom: 0.5rem;
          color: var(--color-gray-700);
          font-weight: 600;
        }

        .filter-group select,
        .search-input {
          width: 100%;
          padding: 10px;
          border: 2px solid var(--color-gray-300);
          border-radius: 5px;
          font-size: 16px;
          background-color: var(--color-white);
          transition: border-color 0.3s ease;
        }

        .filter-group select:focus,
        .search-input:focus {
          outline: none;
          border-color: var(--color-neon-green);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .no-products {
          text-align: center;
          padding: 4rem 0;
        }

        .no-products h3 {
          font-size: 32px;
          margin-bottom: 1rem;
        }

        .no-products p {
          font-size: 18px;
          color: var(--color-gray-500);
        }

        @media (max-width: 768px) {
          .shop-title {
            font-size: 36px;
          }

          .shop-filters {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Shop;

