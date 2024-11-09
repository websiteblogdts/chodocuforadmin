// Sidebar.js
import React from 'react';
import "./../App.css";

function Sidebar({ isActive, currentPage, navigateTo, handleLogout }) {
  return (
    <section id="sidebar" className={isActive ? 'hide' : null}>
      <a href="#" className="brand">
        <i className='bx bxs-smile'></i>
        <span className="text">Admin</span>
      </a>
      <ul className="side-menu top">
        <li className={currentPage === "/" ? "active" : ""}>
          <a href="#" onClick={() => navigateTo("/")}>
            <i className='bx bxs-dashboard'></i>
            <span className="text">Dashboard</span>
          </a>
        </li>
        <li className={currentPage === "/products" ? "active" : ""}>
          <a href="#" onClick={() => navigateTo("/products")}>
            <i className='bx bxs-message-dots'></i>
            <span className="text">ProductsUser</span>
          </a>
        </li>
        <li className={currentPage === "/categories" ? "active" : ""}>
          <a href="#" onClick={() => navigateTo("/categories")}>
            <i className='bx bxs-doughnut-chart'></i>
            <span className="text">Categories</span>
          </a>
        </li>
        <li className={currentPage === "/users" ? "active" : ""}>
          <a href="#" onClick={() => navigateTo("/users")}>
            <i className='bx bxs-group'></i>
            <span className="text">User Management</span>
          </a>
        </li>
      </ul>
      <ul className="side-menu">
        <li>
          <a href="#" className="logout" onClick={handleLogout}>
            <i className='bx bxs-log-out-circle'></i>
            <span className="text">Logout</span>
          </a>
        </li>
      </ul>
    </section>
  );
}

export default Sidebar;
