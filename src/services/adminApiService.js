import axios from 'axios';
import axiosInstance from './axiosInstance'; // Import instance vừa tạo

const API_BASE_URL = 'http://appchodocutest.ddns.net:3000'; // thay bằng URL thực tế của backend

// API đăng nhập
const loginUser = (data) => axios.post(`${API_BASE_URL}/user/login`, data);

// API quản lý User
const getAllUsers = () => axiosInstance.get(`/admin/getalluser`);
const getUserById = (userId) => axiosInstance.get(`/admin/userbyid/${userId}`);
const updateUserById = (userId, data) => axiosInstance.put(`/admin/edituser/${userId}`, data);
const deleteUserById = (userId) => axiosInstance.delete(`/admin/user/delete/${userId}`);
const changeStatusAccount = (userId, data) => axiosInstance.put(`/admin/changstatusaccount/${userId}`, data);

// API quản lý Product
const getProductsByApprovalStatus = () => axiosInstance.get(`/admin/products`);
const updateApprovedStatus = (productId) => axiosInstance.put(`/admin/product/${productId}/approved`);
const rejectProduct = (productId, rejectedReason) =>  axiosInstance.put(`/admin/product/${productId}/reject`, {rejectedReason: rejectedReason});

const getApprovedProducts = () => axiosInstance.get(`/admin/products/?approved=true`);
const getPendingProducts = () => axiosInstance.get(`/admin/products/?approved=false`);
const getRejectedProducts = () => axiosInstance.get(`/admin/rejected-products`);




// API quản lý Category
const createCategory = (data) => axiosInstance.post(`/admin/createcategory`, data);
const getAllCategories = () => axiosInstance.get(`/admin/allcategory`);
const deleteCategory = (categoryId) => axiosInstance.delete(`/admin/categories/${categoryId}`);
const updateCategory = (categoryId, data) => axiosInstance.patch(`/admin/categories/edit/${categoryId}`, data);
const restoreCategory = (categoryId) => axiosInstance.put(`/admin/categories/restore/${categoryId}`);
const getDeletedCategories = () => axiosInstance.get(`/admin/historycategorydelete`);

// Tạo object chứa tất cả các hàm API
const AdminApiService = {
  loginUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  changeStatusAccount,
  updateApprovedStatus,
  rejectProduct,
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  restoreCategory,
  getDeletedCategories,
  getProductsByApprovalStatus,
  getApprovedProducts,
  getPendingProducts,
  getRejectedProducts,
};

// Xuất AdminApiService như một default
export default AdminApiService;
