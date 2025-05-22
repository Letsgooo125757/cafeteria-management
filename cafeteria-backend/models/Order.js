const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
    menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new Schema ({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Ready for pickup', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    paymentDetails: {
        method: { type: String, enum: ['M-Pesa', 'Visa', 'Cash', 'Not Paid'], default: 'Not Paid' },
        transactionId: { type: String },
        paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);