import React, { useState, useEffect } from 'react';
import './MenuPage.css';

function Menupage ({ onAddItem}) {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/menu`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched menu data:", data);
        setMenuItems(data);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setError('Failed to load menu items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddToCart = (item) => {
    console.log("Adding to cart:", item);
    onAddItem({ ...item, id: item._id });
  }

  return (
    <div className="menu-page-container">
      <h1>Menu</h1>
      <p>Select items to add to your cart.</p>
      {isLoading && <p>Loading menu...</p>}
      {error && <p className="error-message">{error}</p>}
      <ul>
        {!isLoading && !error && menuItems.map(item => (
          <li key={item._id} className="menu-item">
            <img src={item.imageUrl || 'http://via.placeholder.com/150'} alt={item.name} className="menu-item-image" />
            <div className="item-details">
              <span className="item-name">{item.name}</span>
              <span className="item-price">${item.price.toFixed(2)}</span>
            </div>
            <button onClick={() => handleAddToCart(item)}>Add To Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menupage;

