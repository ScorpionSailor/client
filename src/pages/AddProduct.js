import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';
import { uploadToCloudinary } from '../utils/uploadCloudinary';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    type: '',
    sizes: '', // comma-separated, e.g., S,M,L
    colors: '', // comma-separated names, e.g., red,blue
    inStock: true,
    stock: 0,
    featured: false,
    trending: false,
    newArrival: false,
  });
  const [imageUrls, setImageUrls] = useState(['']);
  const [imageFiles, setImageFiles] = useState([null]);

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <p>Access denied</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const parseList = (value) =>
    value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const handleImageChange = (index, value) => {
    setImageUrls((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleFileChange = (index, file) => {
    setImageFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const addImageField = () => {
    setImageUrls((prev) => [...prev, '']);
    setImageFiles((prev) => [...prev, null]);
  };

  const removeImageField = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadFile = async (index) => {
    const file = imageFiles[index];
    if (!file) return toast.error('Choose a file first');

    try {
      const toastId = toast.loading('Uploading image...');
      const url = await uploadToCloudinary(file);
      setImageUrls((prev) => {
        const next = [...prev];
        next[index] = url;
        return next;
      });
      toast.dismiss(toastId);
      toast.success('Image uploaded');
    } catch (err) {
      toast.dismiss();
      console.error('Upload error:', err);
      toast.error(err.message || 'Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Name and Price are required');
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category?.toLowerCase() || '',
      type: form.type,
      sizes: parseList(form.sizes).map((size) => ({ size })),
      colors: parseList(form.colors).map((name) => ({ name })),
      images: imageUrls.map((url) => url.trim()).filter(Boolean).map((url) => ({ url })),
      inStock: form.inStock,
      stock: form.stock,
      featured: form.featured,
      trending: form.trending,
      newArrival: form.newArrival,
    };

    try {
      setSubmitting(true);
      const res = await api.post('/admin/products', payload);
      toast.success('Product created');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h1 className="admin-title">Add Product</h1>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" />
          </div>
          <div className="form-row">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the product" />
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>Price (₹)</label>
              <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} placeholder="0.00" />
            </div>
            <div className="form-row">
              <label>Category</label>
              <input name="category" value={form.category} onChange={handleChange} placeholder="Men/Women/Unisex" />
            </div>
            <div className="form-row">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="all">All Types</option>
                <option value="oversized-t-shirts">Oversized T-Shirts</option>
                <option value="hoodies">Hoodies</option>
                <option value="oversized">Oversized</option>
                <option value="crop-tops">Crop-tops</option>
                <option value="tank-tops">Tanks-tops</option> 
                <option value="sweatshirts">Sweatshirts</option> 
                <option value="track-pants">Track pants</option>  
                <option value="denim-jacket">Denim jacket</option>  
                <option value="tote-bag">Tote bag</option>  
              </select>
            </div>
          </div>
          <div className="form-row">
            <label>Sizes (comma separated)</label>
            <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S,M,L" />
          </div>
          <div className="form-row">
            <label>Colors (comma separated)</label>
            <input name="colors" value={form.colors} onChange={handleChange} placeholder="red,blue" />
          </div>
          <div className="form-row">
            <label>Image URLs</label>
            {imageUrls.map((url, idx) => (
              <div className="image-row" key={idx}>
                <input
                  value={url}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder="https://..."
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(idx, e.target.files[0])}
                  style={{ marginLeft: '8px' }}
                />
                <button type="button" className="btn small" onClick={() => handleUploadFile(idx)}>
                  Upload
                </button>
                <button
                  type="button"
                  className="btn small danger"
                  onClick={() => removeImageField(idx)}
                  disabled={imageUrls.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn small secondary" onClick={addImageField}>
              + Add Image URL
            </button>
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>Stock Quantity</label>
              <input 
                type="number" 
                name="stock" 
                value={form.stock} 
                onChange={handleChange} 
                placeholder="0" 
                min="0"
              />
            </div>
            <div className="form-row">
              <label>
                <input 
                  type="checkbox" 
                  name="inStock" 
                  checked={form.inStock} 
                  onChange={handleChange}
                />
                <span>In Stock</span>
              </label>
            </div>
          </div>
          <div className="form-row">
            <label>Product Flags</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="featured" 
                  checked={form.featured} 
                  onChange={handleChange}
                />
                <span>Featured</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="trending" 
                  checked={form.trending} 
                  onChange={handleChange}
                />
                <span>Trending</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="newArrival" 
                  checked={form.newArrival} 
                  onChange={handleChange}
                />
                <span>New Arrival</span>
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={() => navigate('/admin')} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn primary" disabled={submitting}>{submitting ? 'Saving...' : 'Create Product'}</button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .admin-page { padding: 4rem 0; }
        .admin-title { font-family: var(--font-bold); font-size: 32px; margin-bottom: 2rem; }
        .product-form { background: var(--color-white); padding: 2rem; border-radius: 10px; box-shadow: var(--shadow-md); }
        .form-row { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .form-row select, { width: 100%; padding: 10px; border: 2px solid var(--color-gray-300); border-radius: 5px; font-size: 16px; background-color: var(--color-white); transition: border-color 0.3s ease;}
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
        label { color: var(--color-gray-600); font-weight: 600; }
        input, textarea { border: 1px solid var(--color-gray-200); border-radius: 8px; padding: 10px 12px; font-size: 14px; }
        textarea { min-height: 100px; resize: vertical; }
        .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 12px; }
        .btn { padding: 10px 18px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; }
        .btn.primary { background: var(--color-neon-green); color: var(--color-black); }
        .btn.secondary { background: var(--color-gray-200); color: var(--color-black); }
        .btn.small { padding: 8px 12px; font-weight: 600; }
        .btn.danger { background: var(--color-hot-pink); color: var(--color-white); }
        .image-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-bottom: 8px; }
        .checkbox-group { display: flex; gap: 20px; flex-wrap: wrap; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .checkbox-label input[type="checkbox"] { cursor: pointer; width: 18px; height: 18px; }
        .checkbox-label span { user-select: none; }
      `}</style>
    </div>
  );
};

export default AddProduct;


