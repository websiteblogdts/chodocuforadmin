// Header.js
import React from 'react';

function Header({ toggleClass }) {
  return (
    <nav>
      <i className='bx bx-menu' onClick={toggleClass}></i>
    </nav>
  );
}

export default Header;
