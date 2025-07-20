const express = require('express');
const Product = require('./models/Product');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const router = express.Router();

// GET all products 
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST a product by admin only
router.post('/', auth, roleCheck(['admin']), async (req, res) => {
  const { productName, cost, productImages, description, stockStatus } = req.body;
  const newProduct = new Product({
    productName,
    cost,
    productImages,
    description,
    stockStatus,
    ownerId: req.user.userId,
  });
  await newProduct.save();
  res.status(201).json({ message: 'Product added', product: newProduct });
});

// DELETE a product  by admin only
router.delete('/:id', auth, roleCheck(['admin']), async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

module.exports = router;
