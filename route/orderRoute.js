const express = require('express');
const orderRouter = express.Router();
const orderController = require('../Controller/orderController')
const checkIfLoggedIn = require('../middleware/authlogin');
const adminMiddleware = require('../middleware/isAdmin')

orderRouter.post('/', checkIfLoggedIn, orderController.createOrder)
orderRouter.get('/',  checkIfLoggedIn,adminMiddleware, orderController.getAllOrders)
orderRouter.get('/:id', checkIfLoggedIn, adminMiddleware,orderController.getOrderById)
orderRouter.patch('/:id/items/:itemId', checkIfLoggedIn, adminMiddleware, orderController.updateOrderStatus);
orderRouter.patch('/:id', checkIfLoggedIn, adminMiddleware, orderController.updateOrderStatusAll)

module.exports = orderRouter;