const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ isAvailable: true });
        res.json(menuItems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', protect, async (req, res) => {
    if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access denied' });
    }

    const { name, description, price, category, imageUrl, isAvailable: reqIsAvailable } = req.body;
    
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Menu item name is required.' });
    }
    if (price === undefined || typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: 'Price must be a valid non-negative number.' });
    }

    const menuItemData = {
        name,
        description,
        price,
        category,
        imageUrl
    };

    if (typeof reqIsAvailable === 'boolean') {
        menuItemData.isAvailable = reqIsAvailable;
    } else {
        menuItemData.isAvailable = true;
    }

    try {
        const newItem = new MenuItem(menuItemData);
        const menuItem = await newItem.save();
        res.status(201).json(menuItem);
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }

        res.status(500).send('Server Error');
    }        
});

router.put('/:id', protect, async (req, res) => {
    if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access denied for updating menu item' });
    }
    try{
        let menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        menuItem = await MenuItem.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(menuItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', protect, (req, res) => {
    res.status(501).json({ message: 'DELETE /api/menu/:id not implemented yet' });
});

module.exports = router;