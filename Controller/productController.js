// const transporter = require('/Utility/sendEmail')
const productModel = require('../Schema/product')
const jsonWebToken = require("jsonwebtoken");

const getAllProduct = async (req, res) => {
    try {
        const product = await productModel.find();
        res.send(product)
    } catch (error) {
        res.status.send({
            error
        });
    }
}

const addProduct = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Access denied. Token not provided." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jsonWebToken.verify(token, process.env.JWT_KEY);

    const { userId, role } = decoded;

    if (role !== 'admin') {
      return res.status(403).send({ message: "Access denied. Only admin can add products." });
    }

    const { productName, cost, productImage, description, stockStatus } = req.body;

    const newProduct = await productModel.create({
      productName,
      cost,
      productImage,
      description,
      stockStatus,
      userId
    });

    return res.status(201).send({
      message: "Product added successfully",
      product: newProduct
    });

  } catch (err) {
    console.error("Add Product Error:", err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};



const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Authorization token required." });
    }

    if (!id) {
      return res.status(400).send({ message: "Product ID is required." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jsonWebToken.verify(token, process.env.JWT_KEY);

    const { userId, role } = decoded;

    if (role !== 'admin') {
      return res.status(403).send({ message: "You're not authorized to delete this product." });
    }

    const product = await productModel.findOne({ _id: id, userId });

    if (!product) {
      return res.status(409).send({ message: "You don't have a product to delete." });
    }

    await productModel.findByIdAndDelete(id);

    return res.status(200).send({
      message: 'Product deleted successfully',
      product
    });

  } catch (err) {
    console.error("Delete product error:", err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};



module.exports = {
    addProduct,
    getAllProduct,
    deleteProduct
}
