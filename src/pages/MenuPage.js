import React, { useState, useEffect } from 'react';
import './MenuPage.css';

// Import images
import BurgerImg from '../assets/images/Burger.jpeg';
import IceCreamImg from '../assets/images/IceCream.jpeg';
import PastaImg from '../assets/images/Pasta.jpeg';
import PizzaImg from '../assets/images/Pizza.jpeg';
import SaladImg from '../assets/images/Salad.jpeg';
import SodaImg from '../assets/images/Soda.jpeg';

function Menupage ({ onAddItem}) {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy menu data with Kenya Shillings (KSH)
  const dummyMenuItems = [
    // Main Courses
    {
      _id: '1',
      name: 'Classic Burger',
      price: 650,
      description: 'Juicy beef patty with lettuce, tomato, and cheese',
      category: 'Main Course',
      imageUrl: BurgerImg,
      available: true
    },
    {
      _id: '2',
      name: 'Margherita Pizza',
      price: 800,
      description: 'Fresh mozzarella, tomatoes, and basil on crispy crust',
      category: 'Main Course',
      imageUrl: PizzaImg,
      available: true
    },
    {
      _id: '3',
      name: 'Chicken Alfredo Pasta',
      price: 750,
      description: 'Creamy alfredo sauce with grilled chicken and fettuccine',
      category: 'Main Course',
      imageUrl: PastaImg,
      available: true
    },
    {
      _id: '4',
      name: 'Grilled Chicken',
      price: 550,
      description: 'Perfectly grilled chicken breast with herbs and spices',
      category: 'Main Course',
      imageUrl: BurgerImg, // Using burger image as placeholder
      available: true
    },
    {
      _id: '5',
      name: 'Fish & Chips',
      price: 450,
      description: 'Crispy battered fish with golden french fries',
      category: 'Main Course',
      imageUrl: PizzaImg, // Using pizza image as placeholder
      available: true
    },
    
    // Kenyan Local Dishes
    {
      _id: '6',
      name: 'Ugali with Sukuma Wiki',
      price: 200,
      description: 'Traditional maize meal with delicious sukuma wiki',
      category: 'Local Dishes',
      imageUrl: SaladImg,
      available: true
    },
    {
      _id: '7',
      name: 'Pilau Rice',
      price: 350,
      description: 'Aromatic spiced rice cooked with tender meat',
      category: 'Local Dishes',
      imageUrl: PastaImg,
      available: true
    },
    {
      _id: '8',
      name: 'Nyama Choma',
      price: 900,
      description: 'Traditional grilled meat with kachumbari',
      category: 'Local Dishes',
      imageUrl: BurgerImg,
      available: true
    },
    {
      _id: '9',
      name: 'Chapati & Beans',
      price: 250,
      description: 'Soft chapati served with delicious cooked beans',
      category: 'Local Dishes',
      imageUrl: PizzaImg,
      available: true
    },

    // Salads & Light Meals
    {
      _id: '10',
      name: 'Caesar Salad',
      price: 400,
      description: 'Crisp romaine lettuce with caesar dressing and croutons',
      category: 'Salads',
      imageUrl: SaladImg,
      available: true
    },
    {
      _id: '11',
      name: 'Greek Salad',
      price: 450,
      description: 'Fresh vegetables with feta cheese and olives',
      category: 'Salads',
      imageUrl: SaladImg,
      available: true
    },
    {
      _id: '12',
      name: 'Fruit Salad',
      price: 300,
      description: 'Fresh seasonal fruits mixed with honey',
      category: 'Salads',
      imageUrl: SaladImg,
      available: true
    },

    // Beverages
    {
      _id: '13',
      name: 'Fresh Soda',
      price: 120,
      description: 'Refreshing cold soda - Various flavors available',
      category: 'Beverages',
      imageUrl: SodaImg,
      available: true
    },
    {
      _id: '14',
      name: 'Fresh Juice',
      price: 150,
      description: 'Freshly squeezed orange, mango, or pineapple juice',
      category: 'Beverages',
      imageUrl: SodaImg,
      available: true
    },
    {
      _id: '15',
      name: 'Kenyan Tea',
      price: 80,
      description: 'Traditional Kenyan tea with milk and sugar',
      category: 'Beverages',
      imageUrl: SodaImg,
      available: true
    },
    {
      _id: '16',
      name: 'Coffee',
      price: 100,
      description: 'Premium Kenyan coffee - black or with milk',
      category: 'Beverages',
      imageUrl: SodaImg,
      available: true
    },
    {
      _id: '17',
      name: 'Bottled Water',
      price: 50,
      description: 'Pure drinking water',
      category: 'Beverages',
      imageUrl: SodaImg,
      available: true
    },

    // Desserts
    {
      _id: '18',
      name: 'Vanilla Ice Cream',
      price: 250,
      description: 'Premium vanilla ice cream with chocolate chips',
      category: 'Desserts',
      imageUrl: IceCreamImg,
      available: true
    },
    {
      _id: '19',
      name: 'Chocolate Cake',
      price: 300,
      description: 'Rich chocolate cake with creamy frosting',
      category: 'Desserts',
      imageUrl: IceCreamImg,
      available: true
    },
    {
      _id: '20',
      name: 'Mandazi',
      price: 30,
      description: 'Golden, fluffy traditional Kenyan sweet fried bread - perfect with tea or coffee',
      category: 'Desserts & Snacks',
      imageUrl: IceCreamImg,
      available: true
    },
    {
      _id: '21',
      name: 'Mahamri',
      price: 25,
      description: 'Coastal Kenyan sweet bread with coconut and cardamom flavors',
      category: 'Desserts & Snacks',
      imageUrl: IceCreamImg,
      available: true
    },
    {
      _id: '22',
      name: 'Githeri',
      price: 180,
      description: 'Traditional mix of maize and beans - hearty and nutritious',
      category: 'Local Dishes',
      imageUrl: SaladImg,
      available: true
    },
    {
      _id: '23',
      name: 'Mukimo',
      price: 220,
      description: 'Mashed green peas, potatoes, maize and greens - Kikuyu favorite',
      category: 'Local Dishes',
      imageUrl: SaladImg,
      available: true
    },
    {
      _id: '24',
      name: 'Kachumbari',
      price: 120,
      description: 'Fresh tomato and onion salad with chili and lemon',
      category: 'Salads',
      imageUrl: SaladImg,
      available: true
    },

    // Snacks
    {
      _id: '25',
      name: 'Samosa',
      price: 50,
      description: 'Crispy pastry filled with spiced vegetables or meat',
      category: 'Snacks',
      imageUrl: BurgerImg,
      available: true
    },
    {
      _id: '26',
      name: 'Spring Rolls',
      price: 60,
      description: 'Fresh spring rolls with vegetables',
      category: 'Snacks',
      imageUrl: SaladImg,
      available: true
    },
    {
      _id: '27',
      name: 'Chicken Wings',
      price: 400,
      description: 'Spicy grilled chicken wings',
      category: 'Snacks',
      imageUrl: BurgerImg,
      available: true
    },
    {
      _id: '28',
      name: 'Bhajia',
      price: 40,
      description: 'Crispy potato fritters with spices - Kenyan street food favorite',
      category: 'Snacks',
      imageUrl: BurgerImg,
      available: true
    },
    {
      _id: '29',
      name: 'Smokies',
      price: 80,
      description: 'Grilled sausages - popular Kenyan snack',
      category: 'Snacks',
      imageUrl: BurgerImg,
      available: true
    },
    {
      _id: '30',
      name: 'Viazi Karai',
      price: 100,
      description: 'Spiced deep-fried potatoes with tangy sauce',
      category: 'Snacks',
      imageUrl: SaladImg,
      available: true
    }
  ];

  useEffect(() => {
    // Simulate API loading delay
    const loadDummyData = () => {
      setTimeout(() => {
        setMenuItems(dummyMenuItems);
        setIsLoading(false);
      }, 1000); // 1 second delay to simulate loading
    };

    loadDummyData();
  }, []);

  const handleAddToCart = (item) => {
    console.log("Adding to cart:", item);
    onAddItem({ ...item, id: item._id });
  }

  return (
    <div className="menu-page-container">
      <h1>Menu</h1>
      <p>Select items to add to your cart.</p>
      {isLoading && <div className="loading-message">Loading delicious menu items...</div>}
      {error && <p className="error-message">{error}</p>}
      <div className="menu-grid">
        {!isLoading && !error && menuItems.map(item => (
          <div key={item._id} className="menu-item">
            <img src={item.imageUrl || 'http://via.placeholder.com/150'} alt={item.name} className="menu-item-image" />
            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-footer">
                <span className="item-price">KSH {item.price}</span>
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="add-to-cart-btn"
                  disabled={!item.available}
                >
                  {item.available ? 'Add To Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menupage;

