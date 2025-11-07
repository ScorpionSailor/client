import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link , useNavigate} from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  if (!isAuthenticated) {
    return (
      <div className="container">
        <p>Please login to view your profile</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="profile-title">My Profile</h1>
        <div className="profile-card">
          <h3>Personal Information</h3>
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
            <button className="navbar-link logout-btn" onClick={handleLogout}>
                Logout
            </button>
          </div>
          <Link to="/orders" className="btn btn-primary">View Orders</Link>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 4rem 0;
          min-height: 60vh;
        }

        .profile-title {
          font-family: var(--font-bold);
          font-size: 42px;
          margin-bottom: 2rem;
        }

        .profile-card {
          background-color: var(--color-white);
          padding: 2rem;
          border-radius: 10px;
          box-shadow: var(--shadow-md);
        }

        .profile-card h3 {
          margin-bottom: 1.5rem;
        }

        .profile-info p {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-gray-200);
        }

        .profile-info strong {
          margin-right: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Profile;

