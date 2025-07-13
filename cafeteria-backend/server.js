require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const path = require('path');
const connectDB = require('./db');
const { default: mongoose } = require('mongoose');
const mongoURI = process.env.MONGODB_URI

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect to the database

app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your frontend URL
    credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

if (!mongoURI) {
    console.error('MongoDB URI is not defined in the environment variables.');
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Cafeteria backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 