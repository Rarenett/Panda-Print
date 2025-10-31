import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderOne from './HeaderOne'; // Your header component
 import Footer from './BottomFooter'; // Your footer component
// import './Profile.scss';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [editedUser, setEditedUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      navigate('/account');
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setUser(res.data);
      setEditedUser(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/account');
      }
      setLoading(false);
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
    setProfileImage(null);
  };

  const handleSave = () => {
    // API call to save profile
    axios.put(`${process.env.REACT_APP_API_URL}/profile/`, editedUser, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setUser(res.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    })
    .catch(err => {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <>
         <HeaderOne /> 
        <div className="profile-wrapper">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
         <Footer /> 
      </>
    );
  }

  if (!user) {
    return (
      <>
        <HeaderOne />
        <div className="profile-wrapper">
          <div className="error-container">
            <div className="alert alert-danger">Unable to load profile</div>
          </div>
        </div>
        <Footer /> 
      </>
    );
  }

  const renderProfileSection = () => (
    <div className="profile-card card-animate">
      <div className="profile-header">
        <h3>My Profile</h3>
        <span className="last-login">Last login: {new Date().toLocaleDateString()}</span>
      </div>
      
      <div className="profile-image-container">
        <div className="profile-image">
          {profileImage ? (
            <img src={profileImage} alt="Profile" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        {isEditing && (
          <label className="edit-image-btn">
            <i className="ph ph-camera"></i>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>
        )}
      </div>

      <div className="profile-details">
        <div className="detail-row">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
              className="edit-input"
              placeholder="Full Name"
            />
          ) : (
            <span className="detail-label">{user.name}</span>
          )}
        </div>

        <div className="detail-row">
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
              className="edit-input"
              placeholder="Email"
            />
          ) : (
            <span className="detail-value">{user.email}</span>
          )}
        </div>

        <div className="detail-row">
          <span className="detail-label">Phone:</span>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={editedUser.phone || ''}
              onChange={handleInputChange}
              className="edit-input small"
              placeholder="Phone Number"
            />
          ) : (
            <span className="detail-value">{user.phone || 'Not provided'}</span>
          )}
        </div>

        <div className="detail-row">
          <span className="detail-label">Date of Birth:</span>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={editedUser.dob || ''}
              onChange={handleInputChange}
              className="edit-input small"
            />
          ) : (
            <span className="detail-value">{user.dob || 'Not provided'}</span>
          )}
        </div>
      </div>

      <div className="sms-alerts">
        <span>SMS alerts activation</span>
        <div className="toggle-switch active">
          <div className="toggle-circle"></div>
        </div>
      </div>

      {isEditing ? (
        <div className="button-group">
          <button className="save-btn" onClick={handleSave}>
            <i className="ph ph-check"></i> Save
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            <i className="ph ph-x"></i> Cancel
          </button>
        </div>
      ) : (
        <button className="edit-btn" onClick={handleEdit}>
          <i className="ph ph-pencil-simple"></i> Edit Profile
        </button>
      )}
    </div>
  );

  const renderAddressSection = () => (
    <div className="profile-card card-animate">
      <div className="profile-header">
        <h3>My Addresses</h3>
      </div>
      
      <div className="address-list">
        <div className="address-item">
          <div className="address-type">
            <i className="ph ph-house"></i>
            <span>Home</span>
          </div>
          <p>123 Main Street, Apartment 4B<br/>New York, NY 10001</p>
          <div className="address-actions">
            <button className="btn-icon"><i className="ph ph-pencil-simple"></i></button>
            <button className="btn-icon"><i className="ph ph-trash"></i></button>
          </div>
        </div>

        <div className="address-item">
          <div className="address-type">
            <i className="ph ph-buildings"></i>
            <span>Office</span>
          </div>
          <p>456 Business Ave, Suite 100<br/>New York, NY 10002</p>
          <div className="address-actions">
            <button className="btn-icon"><i className="ph ph-pencil-simple"></i></button>
            <button className="btn-icon"><i className="ph ph-trash"></i></button>
          </div>
        </div>
      </div>

      <button className="add-new-btn">
        <i className="ph ph-plus"></i> Add New Address
      </button>
    </div>
  );

  const renderPasswordSection = () => (
    <div className="profile-card card-animate">
      <div className="profile-header">
        <h3>Change Password</h3>
      </div>
      
      <div className="password-form">
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" className="form-control" placeholder="Enter current password" />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input type="password" className="form-control" placeholder="Enter new password" />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" className="form-control" placeholder="Confirm new password" />
        </div>

        <button className="save-btn">
          <i className="ph ph-lock-key"></i> Update Password
        </button>
      </div>
    </div>
  );

  const renderDesignsSection = () => (
    <div className="profile-card card-animate">
      <div className="profile-header">
        <h3>Saved Designs</h3>
      </div>
      
      <div className="designs-grid">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="design-card">
            <div className="design-preview">
              <i className="ph ph-palette"></i>
            </div>
            <div className="design-info">
              <h4>Design {item}</h4>
              <span>Created: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch(activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'address':
        return renderAddressSection();
      case 'password':
        return renderPasswordSection();
      case 'designs':
        return renderDesignsSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <>
      <HeaderOne />
      <div className="profile-wrapper">
        <div className="profile-dashboard">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-left">
                <h1 className="dashboard-title">My Profile Dashboard</h1>
                <p className="dashboard-subtitle">Welcome to your personal portal</p>
              </div>
              <div className="header-right">
                <div className="user-greeting">
                  <span className="greeting-text">Hello {user.name}</span>
                  <i className="ph ph-caret-down"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="dashboard-content">
            <div className="content-wrapper">
              <div className="content-grid">
                {/* Section 1: Dynamic Content */}
                {renderSectionContent()}

                {/* Section 2: Navigation Menu */}
                <div className="menu-card card-animate">
                  <div className="card-header">
                    <h3>Account Settings</h3>
                  </div>

                  <div className="menu-list">
                    <button
                      className={`menu-item ${activeSection === 'profile' ? 'active' : ''}`}
                      onClick={() => setActiveSection('profile')}
                    >
                      <i className="ph ph-user-circle"></i>
                      <span>My Profile</span>
                      <i className="ph ph-caret-right arrow"></i>
                    </button>

                    <button
                      className={`menu-item ${activeSection === 'address' ? 'active' : ''}`}
                      onClick={() => setActiveSection('address')}
                    >
                      <i className="ph ph-map-pin"></i>
                      <span>Manage Addresses</span>
                      <i className="ph ph-caret-right arrow"></i>
                    </button>

                    <button
                      className={`menu-item ${activeSection === 'password' ? 'active' : ''}`}
                      onClick={() => setActiveSection('password')}
                    >
                      <i className="ph ph-lock-key"></i>
                      <span>Change Password</span>
                      <i className="ph ph-caret-right arrow"></i>
                    </button>

                    <button
                      className={`menu-item ${activeSection === 'designs' ? 'active' : ''}`}
                      onClick={() => setActiveSection('designs')}
                    >
                      <i className="ph ph-palette"></i>
                      <span>Saved Designs</span>
                      <i className="ph ph-caret-right arrow"></i>
                    </button>

                    <button className="menu-item">
                      <i className="ph ph-bell"></i>
                      <span>Notifications</span>
                      <i className="ph ph-caret-right arrow"></i>
                    </button>

                    <button className="menu-item">
                      <i className="ph ph-heart"></i>
                      <span>Wishlist</span>
                      <i className="ph ph-caret-right arrow"></i>
                    </button>
                  </div>
                </div>

                {/* Section 3: My Orders */}
                <div className="orders-card card-animate">
                  <div className="card-header">
                    <h3>My Orders</h3>
                    <button className="view-all-btn">View All</button>
                  </div>

                  <div className="orders-list">
                    <div className="order-item">
                      <div className="order-info">
                        <div className="order-id">#ORD-12345</div>
                        <div className="order-date">Oct 15, 2025</div>
                      </div>
                      <div className="order-status delivered">
                        <i className="ph ph-check-circle"></i>
                        <span>Delivered</span>
                      </div>
                    </div>

                    <div className="order-item">
                      <div className="order-info">
                        <div className="order-id">#ORD-12344</div>
                        <div className="order-date">Oct 12, 2025</div>
                      </div>
                      <div className="order-status processing">
                        <i className="ph ph-clock"></i>
                        <span>Processing</span>
                      </div>
                    </div>

                    <div className="order-item">
                      <div className="order-info">
                        <div className="order-id">#ORD-12343</div>
                        <div className="order-date">Oct 10, 2025</div>
                      </div>
                      <div className="order-status shipped">
                        <i className="ph ph-truck"></i>
                        <span>Shipped</span>
                      </div>
                    </div>

                    <div className="order-item">
                      <div className="order-info">
                        <div className="order-id">#ORD-12342</div>
                        <div className="order-date">Oct 8, 2025</div>
                      </div>
                      <div className="order-status delivered">
                        <i className="ph ph-check-circle"></i>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <Footer/>
    </>
  );
}
