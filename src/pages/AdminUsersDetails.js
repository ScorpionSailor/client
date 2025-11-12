import React, { useState , useEffect , useContext } from 'react'
import api from '../config/api'
import { AuthContext } from '../context/AuthContext'
import { Link , useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
 
const AdminUsersDetails = () => {
    const { isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [usersDetails, setUsersDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [userOrders, setUserOrders] = useState([])

    useEffect(()=>{
        if(!isAdmin){
            toast.error('Access denied. Admin only.');
            navigate('/');
            return;
        }
        fetchUsersDetails();
    }, [isAdmin]);
                
    const fetchUsersDetails = async()=>{
        try {
            const usersDetails =await api.get('/admin/user-details');
            const orders = fetchOrders();
            usersDetails.data.orders = orders;
            // setUsersDetails(usersDetails);
        }catch(error){
            toast.error('Failed to fetch users details');
            console.log('error fetching users details',error);
        }finally{
            setLoading(false);
        }
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setUserOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
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
        <h1 className="page-title" style={{ marginTop: '1.5rem  '}}>Users Details</h1>

        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/admin" className="btn-back">
            <button className='btn btn-pink'>Back to Dashboard</button>
          </Link>
        </div>

        {usersDetails.length === 0 ? (
          <p>Oops! No users yet.</p>
        ) : (
          <div className="users-list">
            {usersDetails.map(user => (
              <div key={user._id} className="user-card">
                <div className="user-header">
                  <div>
                    <h3>user Id {user._id}</h3>
                    <p>Name: {user?.name} </p>
                    <p>Email: {user?.email}</p>
                  </div>
                </div>

                <div className="user-items">
                  {user.items && user.items.map((item, i) => (
                    <div key={i} className="user-item">
                      <p>{item.name} • {item.quantity} x ₹{item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="user-total">Total: ₹{user.total}</div>

                {user.cancelReason && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong>Cancel reason:</strong>
                    <p>{user.cancelReason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .page-title { font-size: 36px; margin-bottom: 1rem; }
        .user-card { background: var(--color-white); padding: 1.5rem; border-radius: 10px; box-shadow: var(--shadow-md); margin-bottom: 1rem; }
        .user-header { display:flex; justify-content:space-between; align-items:center; }
        .status-badge { padding: 6px 12px; border-radius: 20px; font-weight:700; }
      `}</style>
    </div>
  )
}

export default AdminUsersDetails