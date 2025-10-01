const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const dummyMenuItems = [
    {
        name: "Margherita Pizza",
        description: "Classic pizza with fresh tomatoes, mozzarella, and basil",
        price: 12.99,
        category: "Main Course",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        isAvailable: true
    },
    {
        name: "Cheeseburger Deluxe",
        description: "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
        price: 9.99,
        category: "Main Course",
        imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
        isAvailable: true
    },
    {
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
        price: 7.99,
        category: "Appetizer",
        imageUrl: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop",
        isAvailable: true
    },
    {
        name: "Spaghetti Carbonara",
        description: "Creamy pasta with bacon, eggs, and parmesan cheese",
        price: 11.99,
        category: "Main Course",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
        isAvailable: true
    },
    {
        name: "Cappuccino",
        description: "Rich espresso with steamed milk and foam",
        price: 3.99,
        category: "Beverage",
        imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop",
        isAvailable: true
    },
    {
        name: "Chocolate Cake",
        description: "Decadent chocolate layer cake with rich frosting",
        price: 5.99,
        category: "Dessert",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        isAvailable: true
    },
    {
        name: "Grilled Chicken Sandwich",
        description: "Tender grilled chicken breast with avocado and vegetables",
        price: 8.99,
        category: "Main Course",
        imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
        isAvailable: true
    },
    {
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice",
        price: 2.99,
        category: "Beverage",
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
        isAvailable: true
    }
];

const seedMenu = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing menu items (optional)
        await MenuItem.deleteMany({});
        console.log('Cleared existing menu items');

        // Insert dummy menu items
        const createdItems = await MenuItem.insertMany(dummyMenuItems);
        console.log(`Added ${createdItems.length} menu items with images`);

        // Disconnect
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding menu:', error);
        process.exit(1);
    }
};

// Run the seed function
seedMenu();