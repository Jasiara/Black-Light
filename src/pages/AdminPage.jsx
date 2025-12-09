import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('businesses');
  const [businesses, setBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [isAdmin, navigate, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'businesses') {
        const response = await adminAPI.getBusinesses();
        setBusinesses(response.data.businesses);
      } else if (activeTab === 'users') {
        const response = await adminAPI.getUsers();
        setUsers(response.data.users);
      } else if (activeTab === 'reviews') {
        const response = await adminAPI.getReviews();
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBusiness = async (id) => {
    if (!confirm('Are you sure you want to delete this business?')) return;
    try {
      await adminAPI.deleteBusiness(id);
      setBusinesses(businesses.filter(b => b.id !== id));
      alert('Business deleted successfully');
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await adminAPI.deleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
      alert('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const startEditBusiness = (business) => {
    setEditingBusiness(business.id);
    setEditForm({
      name: business.name,
      category: business.category,
      description: business.description,
      address: business.address,
      city: business.city,
      state: business.state,
      zip_code: business.zip_code,
      phone: business.phone || '',
      email: business.email || '',
      website: business.website || '',
      hours: typeof business.hours === 'string' ? business.hours : JSON.stringify(business.hours),
      latitude: business.latitude,
      longitude: business.longitude,
      image_url: business.image_url || ''
    });
  };

  const cancelEdit = () => {
    setEditingBusiness(null);
    setEditForm({});
  };

  const handleUpdateBusiness = async (id) => {
    try {
      const response = await adminAPI.updateBusiness(id, editForm);
      setBusinesses(businesses.map(b => b.id === id ? response.data.business : b));
      setEditingBusiness(null);
      setEditForm({});
      alert('Business updated successfully');
    } catch (error) {
      console.error('Error updating business:', error);
      alert('Failed to update business');
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'businesses' ? 'active' : ''}
          onClick={() => setActiveTab('businesses')}
        >
          Businesses ({businesses.length})
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button
          className={activeTab === 'reviews' ? 'active' : ''}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'businesses' && (
              <div className="businesses-list">
                <h2>Manage Businesses</h2>
                {businesses.map(business => (
                  <div key={business.id} className="admin-card">
                    {editingBusiness === business.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          placeholder="Name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="Category"
                          value={editForm.category}
                          onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        />
                        <textarea
                          placeholder="Description"
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="Address"
                          value={editForm.address}
                          onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={editForm.city}
                          onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={editForm.state}
                          onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="Zip Code"
                          value={editForm.zip_code}
                          onChange={(e) => setEditForm({...editForm, zip_code: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="Phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="Website"
                          value={editForm.website}
                          onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={editForm.image_url}
                          onChange={(e) => setEditForm({...editForm, image_url: e.target.value})}
                        />
                        <input
                          type="number"
                          step="0.000001"
                          placeholder="Latitude"
                          value={editForm.latitude}
                          onChange={(e) => setEditForm({...editForm, latitude: e.target.value})}
                        />
                        <input
                          type="number"
                          step="0.000001"
                          placeholder="Longitude"
                          value={editForm.longitude}
                          onChange={(e) => setEditForm({...editForm, longitude: e.target.value})}
                        />
                        <div className="edit-actions">
                          <button onClick={() => handleUpdateBusiness(business.id)} className="save-btn">
                            Save
                          </button>
                          <button onClick={cancelEdit} className="cancel-btn">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="card-header">
                          <h3>{business.name}</h3>
                          <span className="category-badge">{business.category}</span>
                        </div>
                        <p>{business.description}</p>
                        <p className="address">{business.address}, {business.city}, {business.state}</p>
                        {business.phone && <p>📞 {business.phone}</p>}
                        {business.email && <p>📧 {business.email}</p>}
                        <div className="card-actions">
                          <button onClick={() => startEditBusiness(business)} className="edit-btn">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteBusiness(business.id)} className="delete-btn">
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-list">
                <h2>Manage Users</h2>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Admin</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.is_admin ? '✅ Yes' : '❌ No'}</td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td>
                          <button 
                            onClick={() => handleDeleteUser(user.id)} 
                            className="delete-btn"
                            disabled={user.is_admin}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-list">
                <h2>Manage Reviews</h2>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Business</th>
                      <th>User</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review.id}>
                        <td>{review.id}</td>
                        <td>{review.business_name}</td>
                        <td>{review.user_name}</td>
                        <td>{'⭐'.repeat(review.rating)}</td>
                        <td className="comment-cell">{review.comment}</td>
                        <td>{new Date(review.created_at).toLocaleDateString()}</td>
                        <td>
                          <button onClick={() => handleDeleteReview(review.id)} className="delete-btn">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
