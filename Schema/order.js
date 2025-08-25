const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [{
        productName: {
            type: String,
            required: true
        },
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'product',
            required: true
        },
        ownerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        totalCost: {
            type: Number,
            required: true
        },
        shippingStatus: {
            type: String,
            enum: ['pending', 'shipped', 'delivered'],
            default: 'pending'
        },
    }],
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    }
}, {
    timestamps: true,
});

const orderModel = mongoose.model('order', orderSchema)

module.exports = orderModel;