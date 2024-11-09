// axiosInstance.js
import axios from 'axios';

const API_BASE_URL = 'http://appchodocutest.ddns.net:3000'; // thay bằng URL thực tế của backend

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để thêm token vào mỗi request
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Hoặc sessionStorage
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;
