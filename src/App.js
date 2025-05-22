import React, {useState, useEffect} from 'react';
import { Routes, Route, Navigate, Link} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotPasswordpage from './pages/ForgotPasswordpage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const userJson = localStorage.getItem('currentUser');
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error("Failed to parse current user from local storage", error);
      return null;
    }
  });

  const [cartItems, setCartItems] = useState (() => {
    const savedCart = localStorage.getItem('cartItems');
    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart items from the local storage", error);
      localStorage.removeItem('cartItems');
      return [];
    }
  });


  useEffect(() => {
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cartItems');
    }
  }, [cartItems]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCartItems([]);
    localStorage.removeItem('token');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('currentUser');
  };

  const handleProfileUpdate = (updatedUserData) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
  };

  const handleAddItemToCart = (itemToAdd) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemToAdd.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemToAdd.id ? {...item, quantity: (item.quantity || 1) + 1}
          : item
        );
      } else {
        return [...prevItems, {...itemToAdd, quantity: 1 }];
      }
    });
  };

  const handleRemoveItemFromCart = (itemToRemove) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemToRemove));
  }
  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);


  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} username={currentUser?.username} onLogout={handleLogout} cartItemCount={cartItemCount} />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordpage />} />

        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/menu" element={<MenuPage onAddItem={handleAddItemToCart} />} />
          <Route path="/profile" element={<ProfilePage onProfileUpdate={handleProfileUpdate} onLogout={handleLogout}/>} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} onRemoveItem={handleRemoveItemFromCart} />} />
        </Route>


        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/menu" replace /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<div><h2>404 Not Found</h2><Link to="/">Go Home</Link></div>} />
      </Routes>
    </div>
  );
}

export default App;
