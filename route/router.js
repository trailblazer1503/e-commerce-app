const express = require('express')

const router = express.Router();

const productController = require('../Controller/productController');
const middleware = require('../middleware/authlogin');
const checkIfLoggedIn = require('../middleware/authlogin');
router.use(checkIfLoggedIn);
router.get('/', productController.getAllProduct )

router.post('/product',productController.addProduct)

router.delete('/product/:id', productController.deleteProduct)

module.exports = router;