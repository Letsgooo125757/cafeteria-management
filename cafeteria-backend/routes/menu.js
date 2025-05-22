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

    const { name, description, price, category, imageUrl } = req.body;
        const menuItemData = {
            name, 
            description,
            price, 
            category,
            imageUrl,
            isAvailable
        };

        if (typeof req.body.isAvailable === 'boolean') {
            menuItemData.isAvailable = req.body.isAvailable;
        }

        try {
            const newItem = new MenuItem(menuItemData);
            const menuItem = await newItem.save();
            res.json(menuItem);
        } catch (err) {
            console.error(err.message);
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