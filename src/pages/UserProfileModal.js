import React from 'react';
import '../components/UserProfileModal.css';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="modalcard-overlay">
      <div className="modalcard-content">
        <button className="close-button" onClick={onClose}>✖</button>
        
        <div className="profile-container">
          <div className="profile-left">
            <img src={user.avatar_image || 'https://via.placeholder.com/150'} alt="Profile" className="profile-image" />
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-role">{user.role}</p>
          </div>
          <div className="profile-right">
            <div className="profile-info">
              <h3 className="section-title">Profile Details</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone_number}</p>
              {/* <p><strong>Address:</strong> {user.address || 'N/A'}</p> */}
              <p><strong>Points:</strong> {user.reward_points}</p>
              <p><strong>Status:</strong> {user.account_status === 'active' ? 'Active' : 'Locked'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
