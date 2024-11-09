import React, { useState,useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Dashboard from './pages/Controller/Dashboard';
import UserManagement from './pages/Controller/UserManagement';
import CategoryManagement from './pages/Controller/CategoryManagement';
import ProductManagement from './pages/Controller/ProductManagement';
import Login from './pages/Login/Login';
import ProtectedRoute from './pages/Controller/ProtectedRoute';
import { isAuthenticated } from './utils/auth';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Swal from 'sweetalert2';
import "./App.css";
import './index.css'; // hoặc tệp CSS chính bạn đã tạo

function App() {
  const [isActive, setActive] = useState(false);
  const [currentPage, setCurrentPage] = useState("/");
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const navigate = useNavigate();
  const location = useLocation();

  // Cập nhật currentPage mỗi khi location.pathname thay đổi
  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const toggleClass = () => {
    setActive(!isActive);
  };

  const navigateTo = (path) => {
    setCurrentPage(path);  // Cập nhật currentPage khi chuyển trang
    navigate(path);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigateTo("/");
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn đăng xuất không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        setIsLoggedIn(false);

        Swal.fire({
          icon: 'success',
          title: 'Đăng xuất thành công',
          text: 'Bạn đã đăng xuất khỏi hệ thống',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigateTo("/login");
        });
      }
    });
  };

  return (
    <div className="App">
      {/* Hiển thị Sidebar và Header chỉ khi không phải trang login */}
      {location.pathname !== "/login" && (
        <>
          <Sidebar 
            isActive={isActive} 
            currentPage={currentPage} 
            navigateTo={navigateTo} 
            handleLogout={handleLogout} 
          />
          <section id="content">
            <Header toggleClass={toggleClass} />
            <main>
              <Routes>
                {/* Dùng LoginLayout cho trang login */}
                <Route path="/login" element={<Login onLogin={handleLogin} />} />

                {/* Các route bảo vệ có sidebar */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
              </Routes>
            </main>
          </section>
        </>
      )}

      {/* Các route không có Sidebar và Header */}
      {location.pathname === "/login" && (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
