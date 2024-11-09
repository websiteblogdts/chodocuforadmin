// pages/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth"; // Import hàm kiểm tra token

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />; // Chuyển hướng đến trang đăng nhập nếu không có token
  }
  return children; // Trả về trang được yêu cầu nếu đã xác thực
};

export default ProtectedRoute;
