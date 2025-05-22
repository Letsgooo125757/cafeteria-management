const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);