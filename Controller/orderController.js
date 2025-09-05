const orderModel = require('../Schema/order');
require('../Schema/product'); // Ensure product model is registered

// Create Order
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order is empty' });
    }

    const order = await orderModel.create({
      items,
      customer: req.user.userId,
    });

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate('customer', 'fullName email')
      .populate('items.productId', 'productName cost');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findById(id)
      .populate('customer', 'fullName email')
      .populate('items.productId', 'productName cost');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Shipping Status of a Single Item
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
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Shipping Status for All Items in an Order
// Update Shipping Status for All Items in an Order
const updateOrderStatusAll = async (req, res) => {
  try {
    const { id } = req.params;
    const { shippingStatus } = req.body;
    const allowedStatus = ['pending', 'shipped', 'delivered'];

    if (!shippingStatus || !allowedStatus.includes(shippingStatus)) {
      return res.status(400).json({ error: 'Invalid shipping status' });
    }

    // Update all items and return order with customer field
    const order = await orderModel.findOneAndUpdate(
      { _id: id },
      { $set: { 'items.$[].shippingStatus': shippingStatus } },
      { new: true }
    ).select("customer"); // make sure customer is returned

    if (!order || !order.customer) {
      return res.status(404).json({ error: 'Order or customer not found' });
    }

    // Emit socket notification
    const io = req.app.get("ioServer");
    io.to(order.customer.toString()).emit("shippingStatusUpdate", {
      title: "New shipping status",
      message: `Your last order shipping status has been updated to ${shippingStatus}`,
    });

    res.status(200).json({
      message: 'All order items status updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Order History (Admin sees all, Customer sees only theirs)
const getOrderHistory = async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'admin') {
      orders = await orderModel
        .find()
        .populate('items.productId', 'productName cost');
    } else {
      orders = await orderModel
        .find({ customer: req.user.userId })
        .populate('items.productId', 'productName cost');
    }

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({
      message: 'Order history retrieved successfully',
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderStatusAll,
  getOrderHistory
};
