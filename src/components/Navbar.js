import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import './Navbar.css';

function Navbar({ isLoggedIn, username, onLogout, cartItemCount}) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
        <div className="navbar-left">
          {isLoggedIn && username && <span className="navbar-welcome">Welcome, {username}</span>} 
          <Link to="/" className="navbar-brand">Cafeteria</Link>
        </div>
        <div className="navbar-links">
            {isLoggedIn ? (
            <>
            <Link to="/profile">Profile</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/cart" className="cart-link">
               <FaShoppingCart /> {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </Link>
            <button onClick={handleLogoutClick} className="logout-button">Logout</button>
            </>
            ) : (
                <Link to="/login">Login</Link>
            )}
            
        </div>
    </nav>
  );
}

export default Navbar;