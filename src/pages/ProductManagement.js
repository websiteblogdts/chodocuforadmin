import React, { useEffect, useState } from 'react';
import AdminApiService from '../services/adminApiService';

function ProductManagement() {
  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await AdminApiService.getAllUsers();
  //       setUsers(response.data);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

  return (
    <div>
      <h1>Product Management</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductManagement;
