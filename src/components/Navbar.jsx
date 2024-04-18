import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo.png';

function Navbar() {
  return (
    <nav className="header" style={{ backgroundColor: '#02367B' }}>
      <div className="logo">
        <img src={logo} alt="Logo" />
        <span style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '15px' }}>
          <i>FaceTracker</i>
        </span>
      </div>
      <div className="navbar-links">
        <Link to="/" style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '15px', fontWeight: 'bold' }}>Home</Link>
        {/* Add more navigation links as needed */}
      </div>
    </nav>
  );
}

export default Navbar;
