import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h2 className="auth-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-neon">Login</button>
          </form>
          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          padding: 4rem 0;
          min-height: 60vh;
        }

        .auth-card {
          max-width: 400px;
          margin: 0 auto;
          background-color: var(--color-white);
          padding: 3rem;
          border-radius: 10px;
          box-shadow: var(--shadow-md);
        }

        .auth-title {
          font-family: var(--font-bold);
          font-size: 32px;
          margin-bottom: 2rem;
          text-align: center;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid var(--color-gray-300);
          border-radius: 5px;
          font-size: 16px;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-neon-green);
        }

        .auth-switch {
          text-align: center;
          margin-top: 2rem;
        }

        .auth-switch a {
          color: var(--color-neon-green);
        }
      `}</style>
    </div>
  );
};

export default Login;

