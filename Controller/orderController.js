const orderModel = require('../Schema/order')

const createOrder = async (req, res) => {
    try {
        const { items } = req.body;
    
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).send('order is empty ')
        }

        const order = await orderModel.create({
            items,
            customer: req.user.userId,
        });
        res.status(201).send('order created successfully',orderModel)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};

const getAllOrders = async (req, res) => {
    try {
        // .populate('customer', 'fullName email')
        const order = await orderModel.find();
        res.send(order);
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};

const getOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await orderModel.findOne({ _id: id });

        if (!orderModel) {
          return res.status(409).json({ message: "You don't have a product to delete." });
        }
        const order = await orderModel.findById(id)
            // .populate('customer', 'fullName email')
            // .populate('items.productId', 'name price')
        
        if (!orderModel) return res.send({ error: 'Order not found' })
        res.send(order)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const { shippingStatus } = req.body;

        const allowedStatus = ['pending', 'shipped', 'delivered'];

        if (!shippingStatus || !allowedStatus.includes(shippingStatus)) {
            return res.status(400).json({ error: 'Invalid shipping status' });
        }

        const order = await orderModel.findOneAndUpdate(
            { _id: id, 'items._id': itemId },
            { $set: { 'items.$.shippingStatus': shippingStatus } },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order or item not found' });
        }

        res.status(200).json({
            message: 'Order item status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateOrderStatusAll = async (req, res) => {
    try {
        const { id } = req.params;
        const { shippingStatus } = req.body;
        const allowedStatus = ['pending', 'shipped', 'delivered'];

        if (!shippingStatus || !allowedStatus.includes(shippingStatus)) {
            return res.status(400).json({ error: 'Invalid shipping status' });
        }

        const order = await orderModel.findOneAndUpdate(
            { _id: id },
            { $set: { 'items.$[].shippingStatus': shippingStatus } },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order or item not found' });
        }

        res.status(200).json({
            message: 'Order item status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updateOrderStatusAll
}