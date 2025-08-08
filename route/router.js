const express = require('express')

const router = express.Router();

const productController = require('../Controller/productController');

const checkIfLoggedIn = require('../middleware/authlogin');
router.use(checkIfLoggedIn);
router.get('/', productController.getAllProduct )

router.post('/product',productController.addProduct)

router.delete('/product/:id', productController.deleteProduct)
router.get('/:brand/:page/:limit', productController.getProductsByBrandPaginated);

module.exports = router;