// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminApiService from '../../services/adminApiService'; // Nhập AdminApiService mà bạn đã tạo
import Swal from 'sweetalert2'; // Nhập SweetAlert2
import '../../components/Login.css'; // Thêm tệp CSS cho styling

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Ngăn chặn việc reload trang
        try {
            const response = await AdminApiService.loginUser({
                identifier,
                password
            });
    
            const { token, role, user } = response.data;
    
            if (role === 'admin') {
                // Lưu token và thông tin admin vào local storage
                localStorage.setItem('token', token);
                localStorage.setItem('userRole', role);
                localStorage.setItem('userId', user._id);

                Swal.fire({
                    title: 'Đăng nhập thành công!',
                    text: 'Chào mừng bạn, bạn đang đăng nhập với vai trò admin.',
                    icon: 'success',
                    confirmButtonText: 'Đồng ý'
                });

                navigate("/"); // Chuyển hướng đến dashboard cho admin
            } else {
                // Nếu không phải admin, hiển thị thông báo lỗi
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Tài khoản này không được cấp phép, hãy đăng nhập với tài khoản Admin.',
                    icon: 'error',
                    confirmButtonText: 'Đồng ý'
                });
            }
        } catch (error) {
            console.error("Login error:", error.response ? error.response.data : error.message);
            Swal.fire({
                title: 'Lỗi!',
                text: error.response ? error.response.data.error : 'Đã xảy ra lỗi không mong muốn.',
                icon: 'error',
                confirmButtonText: 'Đồng ý'
            });
        }
    };

    return (
        <div className="login-container">
            <div className="logo-container">
                <img 
                    src="https://res.cloudinary.com/dvm8fnczy/image/upload/v1713510313/vrzu6ljfyvevdfzatyzf.jpg"
                    alt="Logo"
                    className="logo"
                />
            </div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>Email or Phone</label>
                    <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
