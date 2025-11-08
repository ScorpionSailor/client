import axios from 'axios';

// Use a relative API path so client requests start with `api/...` (no leading slash).
// This makes requests go to `https://<current-host>/api/...` which is useful when
// the client and API are served from the same domain (or when a reverse proxy
// maps /api to the backend). You can still override with REACT_APP_API_URL.
// Use '/api' so existing calls that start with '/products' or '/orders' are
// resolved to '/api/products' etc. This keeps backward compatibility with
// request calls that include a leading '/'. You can override with REACT_APP_API_URL.
const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

