// utils/auth.js
export const isAuthenticated = () => {
    const token = localStorage.getItem("token"); // Hoặc sử dụng sessionStorage tùy theo cách bạn lưu trữ token
    return !!token; // Trả về true nếu có token, false nếu không
  };
  