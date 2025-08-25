// const transporter = require('../Utility/sendmail')
const productModel = require('../Schema/product')
const jsonWebToken = require("jsonwebtoken");

const getAllProduct = async (req, res) => {
    try {
        const product = await productModel.find().populate('brand');
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
      return res.status(401).json({ message: "Access denied. Token not provided." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jsonWebToken.verify(token, process.env.JWT_KEY || "yourSecretKey");

    const { userId, role } = decoded;

    if (role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Only admin can add products." });
    }

    const { productName, cost, productImage, description,brand, stockStatus } = req.body;

    const newProduct = await productModel.create({
      productName,
      cost,
      productImage,
      description,
      stockStatus,
      brand,
      userId
    });
    // transporter.sendMail({
    //   from: "adeniyijoshua010@gmail.com",
    //   to: "adeniyijoshua010@gmail.com",
    //   subject: "Todo [create todo]",
    //   html: `
    //     <h1> You've added a new product: ${req.body.productName} </h1>
    //     <div>${req.body.description}</div>
    //   `
    // })
    return res.status(201).json({
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
      return res.status(401).json({ message: "Authorization token required." });
    }

    if (!id) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jsonWebToken.verify(token, process.env.JWT_KEY || "yourSecretKey");

    const { userId, role } = decoded;

    if (role !== 'admin') {
      return res.status(403).json({ message: "You're not authorized to delete this product." });
    }

   
    const product = await productModel.findOne({ _id: id, userId });

    if (!product) {
      return res.status(409).json({ message: "You don't have a product to delete." });
    }

    await productModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Product deleted successfully',
      product
    });

  } catch (err) {
    console.error("Delete product error:", err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getProductsByBrandPaginated = async (req, res) => {
  try {
    const { brand, page, limit } = req.params;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: "brand"
    };
    const products = await productModel.paginate({ brand }, options);
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



module.exports = {
    addProduct,
    getAllProduct,
  deleteProduct,
    getProductsByBrandPaginated
}
