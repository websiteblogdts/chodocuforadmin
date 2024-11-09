import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaLock, FaUnlock } from 'react-icons/fa'; // Import icons
import AdminApiService from '../../services/adminApiService';
import "../../components/UserManagement.css"; 
import UserProfileModal from './UserProfileModal'; // Import the UserProfileModal

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [profileModalVisible, setProfileModalVisible] = useState(false); // State for profile modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // State for the selected user's data 
  const [modalVisible, setModalVisible] = useState(false);
  const [editUserData, setEditUserData] = useState({
    name: '',
    password: '',
    reward_points: '',
    role: '',
    account_status: '',
    email: '',
    phone_number: ''
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await AdminApiService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch users',
        icon: 'error',
        position: 'top',
        showConfirmButton: true,
        zIndex: 1050 // Higher z-index to stay above sidebar
      });
    }
  };

  const navigateToUserDetail = (userId) => {
    navigate(`/user-detail/${userId}`);
  };
  const openUserProfileModal = (user) => {
    setSelectedUser(user); // Set the selected user data
    setProfileModalVisible(true); // Open the profile modal
  };

  const closeUserProfileModal = () => {
    setProfileModalVisible(false); // Close the profile modal
    setSelectedUser(null); // Clear the selected user data
  };
  const handleLockUnlockAccount = async (userId) => {
    try {
      await AdminApiService.changeStatusAccount(userId);
      fetchUsers();
      Swal.fire({
        title: 'Success',
        text: 'Account status changed successfully',
        icon: 'success',
        position: 'top',
        showConfirmButton: true,
        zIndex: 1050 // Higher z-index for visibility
      });
    } catch (error) {
      console.error('Error locking/unlocking account:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to change account status',
        icon: 'error',
        position: 'top',
        showConfirmButton: true,
        zIndex: 1050
      });
    }
  };


  const editUser = async () => {
    try {
      await AdminApiService.updateUserById(selectedUserId, editUserData);
      fetchUsers();
      setModalVisible(false);
      Swal.fire({
        title: 'Success',
        text: 'User updated successfully',
        icon: 'success',
        position: 'top',
        showConfirmButton: true,
        zIndex: 1050
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update user',
        icon: 'error',
        position: 'top',
        showConfirmButton: true,
        zIndex: 1050
      });
    }
  };

  const deleteUser = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
      zIndex: 3050
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminApiService.deleteUserById(id);
          fetchUsers();
          Swal.fire({
            title: 'Deleted!',
            text: 'User has been deleted.',
            icon: 'success',
            position: 'top',
            showConfirmButton: true,
            zIndex:2050
          });
        } catch (error) {
          console.error('Failed to delete user:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete user',
            icon: 'error',
            position: 'top',
            showConfirmButton: true,
            zIndex: 2050
          });
        }
      } else {
        Swal.fire({
          title: 'Cancelled',
          text: 'User was not deleted',
          icon: 'info',
          position: 'top',
          showConfirmButton: true,
          zIndex: 2050
        });
      }
    });
  };

  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchText.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchText.toLowerCase())) ||
    (user.phone_number && user.phone_number.toLowerCase().includes(searchText.toLowerCase()))
  );
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <input
        type="text"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        placeholder="Search Name/Mail/Phone"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500">No data found</p>
      ) : (
        <ul className="space-y-4">
          {filteredUsers.map(user => (
            <li key={user._id} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <div onClick={() => openUserProfileModal(user)}> {/* Open modal on click */}
                <p className="font-semibold truncate">Name: {user.name}</p>
                <p className="truncate">Email: {user.email}</p>
                <p className="truncate">Phone: {user.phone_number}</p>
                <p>Points: {user.reward_points}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-4">
                <FaEdit 
                  className="text-blue-500 cursor-pointer hover:text-blue-600"
                  size={24}
                  onClick={() => {
                    setSelectedUserId(user._id);
                    setEditUserData({
                      name: user.name,
                      email: user.email,
                      phone_number: user.phone_number,
                      password: '',
                      reward_points: user.reward_points.toString(),
                      role: user.role,
                      account_status: user.account_status
                    });
                    setModalVisible(true);
                  }}
                />
                <FaTrash 
                  className="text-red-500 cursor-pointer hover:text-red-600"
                  size={24}
                  onClick={() => deleteUser(user._id)}
                />
                {user.account_status === 'active' ? (
                  <FaLock 
                    className="text-gray-500 cursor-pointer hover:text-gray-600"
                    size={24}
                    onClick={() => handleLockUnlockAccount(user._id)}
                  />
                ) : (
                  <FaUnlock 
                    className="text-green-500 cursor-pointer hover:text-green-600"
                    size={24}
                    onClick={() => handleLockUnlockAccount(user._id)}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
<UserProfileModal
        isOpen={profileModalVisible}
        onClose={closeUserProfileModal}
        user={selectedUser}
      />
      {modalVisible && (
         <div className="modal-overlay">
         <div className="modal-content">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
            <h2 className="text-2xl font-semibold">Edit User</h2>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Name"
              value={editUserData.name}
              onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
            />
             <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg mt-4"
              placeholder="Phone Number"
              value={editUserData.phone_number}
              onChange={(e) => setEditUserData({ ...editUserData, phone_number: e.target.value })}
            />
           <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg mt-4"
              placeholder="Email"
              value={editUserData.email}
              onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
            />
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg mt-4"
              placeholder="Password"
              value={editUserData.password}
              onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
            />
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg mt-4"
              placeholder="Reward Points"
              value={editUserData.reward_points}
              onChange={(e) => setEditUserData({ ...editUserData, reward_points: e.target.value })}
            />
           <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={editUserData.role}
              onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
            </select>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={editUserData.account_status}
              onChange={(e) => setEditUserData({ ...editUserData, account_status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="locked">Locked</option>
            </select>
           
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
              <button 
                className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600" 
                onClick={editUser}>
                Save
              </button>
              <button 
                className="w-full py-2 bg-gray-500 text-white rounded hover:bg-gray-600" 
                onClick={() => setModalVisible(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
