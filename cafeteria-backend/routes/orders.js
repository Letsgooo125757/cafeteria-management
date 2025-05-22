const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
    const { items, paymentMethod } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    try {
        let calculatedTotalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            if (!menuItem) {
                return res.status(404).json({ message: `Menu item with id ${item.menuItemId} not found` });
            }
            if (!menuItem.isAvailable) {
                return res.status(400).json({ message: `Menu item ${menuItem.name} is not available` });
            }
            orderItems.push({
                menuItemId: menuItem._id,
                name: menuItem.name,
                quantity: item.quantity,
                price: menuItem.Price
            });
            calculatedTotalAmount += menuItem.price * item.quantity;
        }

        const newOrder = new Order({
            user: req.user.id,
            items: orderItems,
            totalAmount: calculatedTotalAmount,
            paymentDetails: {
                method: paymentMethod || 'Not Paid', 
                paymentStatus: 'Pending' // update this after actual payment intergration
            }
        });

        const order = await newOrder.save();
        res.status(201).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/my-orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// Add more routes later: GET /api/orders/:id, PUT /api/orders/:id/status (Admin), GET /api/orders (Admin)

module.exports = router;