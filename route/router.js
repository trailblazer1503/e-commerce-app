const express = require('express')

const router = express.Router();

const productController = require('../Controller/productController')
router.get('/', productController.getAllProduct )

router.post('/product',productController.addProduct)

router.delete('/product/:id', productController.deleteProduct)

module.exports = router;