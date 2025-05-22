const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password mus be at least 6 characters long.' });
    }

    try {
        const existingUserByUsername = await User.findOne({ username: username });
        const existingUserByEmail = await User.findOne({ email: email });

        if (existingUserByUsername && existingUserByEmail) {
            return res.status(409).json({ message: 'Username and email already taken.' });
        } else if (existingUserByUsername) {
            return res.status(409).json({ message: 'Username already taken.' });
        } else if (existingUserByEmail) {
            return res.status(409).json({ message: 'Email already taken.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User ({
            username,
            email,
            passwordHash
        });
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully!',
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json ({message: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' }); //user not found
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' }); //password incorrect
        }

        const tokenPayLoad = {
            userId: user._id,
            username:user.username,
        };

        const token = jwt.sign(tokenPayLoad, JWT_SECRET, { expiresIn: '1h' }); // token expires in 1 hour

        res.status(200).json ({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                phone: user.phone,
                profilePictureUrl: user.profilePictureUrl
            }
        });
    } catch (error) {
        console.error ('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router;
// This code defines an Express router for user authentication, including registration and login routes. It uses bcrypt for password hashing and JWT for token generation. The code also includes error handling for various scenarios, such as missing fields, invalid credentials, and server errors. The router is then exported for use in the main application.