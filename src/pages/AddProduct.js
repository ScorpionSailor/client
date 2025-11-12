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
    inStock: true,
    stock: 0,
    featured: false,
    trending: false,
    newArrival: false,
  });
  const [sizeEntries, setSizeEntries] = useState([{ size: '', stock: '' }]);
  const [colorEntries, setColorEntries] = useState([
    { name: '', hex: '', images: [{ url: '', file: null }] }
  ]);

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

  const handleSizeEntryChange = (index, field, value) => {
    setSizeEntries((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: field === 'size' ? value : value.replace(/[^0-9]/g, '')
      };
      return next;
    });
  };

  const addSizeEntry = () => {
    setSizeEntries((prev) => [...prev, { size: '', stock: '' }]);
  };

  const removeSizeEntry = (index) => {
    setSizeEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleColorEntryChange = (index, field, value) => {
    setColorEntries((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: value
      };
      return next;
    });
  };

  const handleColorImageChange = (colorIndex, imageIndex, value) => {
    setColorEntries((prev) => {
      const next = [...prev];
      const images = [...next[colorIndex].images];
      images[imageIndex] = { ...images[imageIndex], url: value };
      next[colorIndex] = { ...next[colorIndex], images };
      return next;
    });
  };

  const handleColorImageFileChange = (colorIndex, imageIndex, file) => {
    setColorEntries((prev) => {
      const next = [...prev];
      const images = [...next[colorIndex].images];
      images[imageIndex] = { ...images[imageIndex], file };
      next[colorIndex] = { ...next[colorIndex], images };
      return next;
    });
  };

  const addColorEntry = () => {
    setColorEntries((prev) => [
      ...prev,
      { name: '', hex: '', images: [{ url: '', file: null }] }
    ]);
  };

  const removeColorEntry = (index) => {
    setColorEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const addColorImageField = (colorIndex) => {
    setColorEntries((prev) => {
      const next = [...prev];
      const images = [...next[colorIndex].images, { url: '', file: null }];
      next[colorIndex] = { ...next[colorIndex], images };
      return next;
    });
  };

  const removeColorImageField = (colorIndex, imageIndex) => {
    setColorEntries((prev) => {
      const next = [...prev];
      const images = next[colorIndex].images.filter((_, idx) => idx !== imageIndex);
      next[colorIndex] = {
        ...next[colorIndex],
        images: images.length ? images : [{ url: '', file: null }]
      };
      return next;
    });
  };

  const handleUploadColorImage = async (colorIndex, imageIndex) => {
    const file = colorEntries[colorIndex]?.images?.[imageIndex]?.file;
    if (!file) return toast.error('Choose a file first');

    try {
      const toastId = toast.loading('Uploading image...');
      const url = await uploadToCloudinary(file);
      toast.dismiss(toastId);
      setColorEntries((prev) => {
        const next = [...prev];
        const images = [...next[colorIndex].images];
        images[imageIndex] = { url, file: null };
        next[colorIndex] = { ...next[colorIndex], images };
        return next;
      });
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

    const trimmedSizes = sizeEntries
      .map((entry) => ({
        size: entry.size.trim(),
        stock: entry.stock === '' ? '' : Number(entry.stock)
      }))
      .filter((entry) => entry.size || entry.stock !== '');

    const hasPartialSizeEntry = trimmedSizes.some(
      (entry) => !entry.size || entry.stock === '' || Number.isNaN(entry.stock)
    );

    if (hasPartialSizeEntry) {
      toast.error('Please provide a size and numeric stock for each size entry');
      return;
    }

    if (trimmedSizes.some((entry) => entry.stock < 0)) {
      toast.error('Size stock cannot be negative');
      return;
    }

    const sizesPayload = trimmedSizes.map((entry) => ({
      size: entry.size,
      stock: entry.stock
    }));

    const trimmedColors = colorEntries
      .map((entry) => ({
        name: entry.name.trim(),
        hex: entry.hex.trim(),
        images: (entry.images || []).map((img) => ({
          url: (img.url || '').trim()
        }))
      }))
      .filter((entry) => entry.name || entry.hex || entry.images.some((img) => img.url));

    const hasInvalidColor = trimmedColors.some(
      (entry) => !entry.name || !entry.images.some((img) => img.url)
    );

    if (hasInvalidColor) {
      toast.error('Each color variant needs a name and at least one image URL');
      return;
    }

    const totalVariantStock = sizesPayload.reduce((sum, entry) => sum + entry.stock, 0);
    const baseStock = sizesPayload.length ? totalVariantStock : Number(form.stock) || 0;

    const colorsPayload = trimmedColors.map((entry) => {
      const images = entry.images
        .filter((img) => img.url)
        .map((img) => ({
          url: img.url
        }));

      const payloadEntry = {
        name: entry.name,
        images
      };

      if (entry.hex) {
        payloadEntry.hex = entry.hex;
      }

      return payloadEntry;
    });

    const galleryImages = colorsPayload.flatMap((color) =>
      color.images.map((img) => ({
        url: img.url,
        ...(color.name ? { color: color.name } : {})
      }))
    );

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category?.toLowerCase() || '',
      type: form.type,
      sizes: sizesPayload,
      colors: colorsPayload,
      images: galleryImages,
      inStock: form.inStock,
      stock: baseStock,
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
            <label>Sizes & Available Stock</label>
            <div className="size-grid">
              {sizeEntries.map((entry, idx) => (
                <div className="size-row" key={`size-${idx}`}>
                  <input
                    value={entry.size}
                    onChange={(e) => handleSizeEntryChange(idx, 'size', e.target.value)}
                    placeholder="Size (e.g., S)"
                  />
                  <input
                    type="number"
                    min="0"
                    value={entry.stock}
                    onChange={(e) => handleSizeEntryChange(idx, 'stock', e.target.value)}
                    placeholder="Stock"
                  />
                  <button
                    type="button"
                    className="btn small danger"
                    onClick={() => removeSizeEntry(idx)}
                    disabled={sizeEntries.length === 1}
                    aria-label="Remove size"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="btn small secondary" onClick={addSizeEntry}>
              + Add Size
            </button>
          </div>
          <div className="form-row">
            <label>Color Variants & Images</label>
            <div className="color-list">
              {colorEntries.map((color, colorIdx) => (
                <div className="color-card" key={`color-${colorIdx}`}>
                  <div className="color-header">
                    <div className="color-fields">
                      <input
                        value={color.name}
                        onChange={(e) => handleColorEntryChange(colorIdx, 'name', e.target.value)}
                        placeholder="Color name (e.g., Red)"
                      />
                      <input
                        value={color.hex}
                        onChange={(e) => handleColorEntryChange(colorIdx, 'hex', e.target.value)}
                        placeholder="#HEX (optional)"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn small danger"
                      onClick={() => removeColorEntry(colorIdx)}
                      disabled={colorEntries.length === 1}
                      aria-label="Remove color variant"
                    >
                      Remove Color
                    </button>
                  </div>
                  <div className="color-image-grid">
                    {color.images.map((img, imageIdx) => (
                      <div className="color-image-row" key={`color-${colorIdx}-image-${imageIdx}`}>
                        <input
                          value={img.url}
                          onChange={(e) =>
                            handleColorImageChange(colorIdx, imageIdx, e.target.value)
                          }
                          placeholder="https://... (image URL)"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleColorImageFileChange(colorIdx, imageIdx, e.target.files[0])
                          }
                        />
                        <button
                          type="button"
                          className="btn small"
                          onClick={() => handleUploadColorImage(colorIdx, imageIdx)}
                        >
                          Upload
                        </button>
                        <button
                          type="button"
                          className="btn small danger"
                          onClick={() => removeColorImageField(colorIdx, imageIdx)}
                          disabled={color.images.length === 1}
                          aria-label="Remove color image"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn small secondary"
                    onClick={() => addColorImageField(colorIdx)}
                  >
                    + Add Image
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="btn small secondary" onClick={addColorEntry}>
              + Add Color Variant
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
        .form-row select { width: 100%; padding: 10px; border: 2px solid var(--color-gray-300); border-radius: 5px; font-size: 16px; background-color: var(--color-white); transition: border-color 0.3s ease;}
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
        label { color: var(--color-gray-600); font-weight: 600; }
        input, textarea { border: 1px solid var(--color-gray-200); border-radius: 8px; padding: 10px 12px; font-size: 14px; }
        input:focus, textarea:focus { outline: none; border-color: var(--color-neon-green); box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }
        textarea { min-height: 100px; resize: vertical; }
        .size-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
        .size-row { display: grid; grid-template-columns: 1fr 150px auto; gap: 10px; align-items: center; }
        .color-list { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 1rem; }
        .color-card { background: var(--color-gray-100); padding: 1rem; border-radius: 10px; display: flex; flex-direction: column; gap: 1rem; }
        .color-header { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .color-fields { display: grid; grid-template-columns: minmax(160px, 1fr) 160px; gap: 10px; width: 100%; }
        .color-image-grid { display: flex; flex-direction: column; gap: 0.75rem; }
        .color-image-row { display: grid; grid-template-columns: 1fr auto auto auto; gap: 10px; align-items: center; }
        .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 12px; }
        .btn { padding: 10px 18px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; transition: transform 0.2s ease, opacity 0.2s ease; }
        .btn.primary { background: var(--color-neon-green); color: var(--color-black); }
        .btn.secondary { background: var(--color-gray-200); color: var(--color-black); }
        .btn.small { padding: 8px 12px; font-weight: 600; }
        .btn.danger { background: var(--color-hot-pink); color: var(--color-white); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn:not(:disabled):hover { transform: translateY(-1px); opacity: 0.95; }
        .checkbox-group { display: flex; gap: 20px; flex-wrap: wrap; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .checkbox-label input[type="checkbox"] { cursor: pointer; width: 18px; height: 18px; }
        .checkbox-label span { user-select: none; }
        @media (max-width: 768px) {
          .size-row { grid-template-columns: 1fr 1fr; gap: 6px; }
          .size-row .btn { grid-column: span 2; justify-self: start; }
          .color-header { flex-direction: column; align-items: flex-start; }
          .color-fields { grid-template-columns: 1fr; }
          .color-image-row { grid-template-columns: 1fr; }
          .color-image-row .btn { justify-self: start; }
        }
      `}</style>
    </div>
  );
};

export default AddProduct;


