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
    const authToken = req.headers['authorization'];

    if (!authToken) {
        throw new Error("Access denied")
    }

    const {userId, role} = jsonWebToken.decode(authToken);


    if (role == 'admin') {
        const productName = req.body.productName;
        const cost = req.body.cost;
        const productImage = req.body.productImage;
        const description = req.body.description;
        const stockStatus = req.body.stockStatus;
    
        const newProduct = await productModel.create({
            productName,userId,cost,description,productImage,stockStatus
            
        })
        res.status(201).send({
            message: "product added successfully",
            newProduct
        });
    } else {
        res.status(409).send("You're not an admin")
    }
   
}

// transporter.sendMail({
//     from: "ade@gmail.com",
//     to: "abc@gmail.com",
//     subject: "Todo (Create New Tod)",
//     html: `
//         <h1> You've added a new product:${req.body.title}</h1>
//         <div>${req.body.description}</div>
//     `
// })

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const authToken = req.headers['authorization'];

    if (!authToken && !id) {
        res.status(409).send("Provide product Id and token")
    }

    const {userId, role} = jsonWebToken.decode(authToken);

    if (role === 'admin') {

    let deleteProduct = await productModel.findByIdAndDelete(id).where('userId').equals(userId);

        if (!deleteProduct) {
        res.status(409).send("You don't have a product to delete")
    }

    res.send({
        message: 'Product deleted successfully',
        deleteProduct
    });
    } else {
        throw new Error("You're not an admin")
    }

}

module.exports = {
    addProduct,
    getAllProduct,
    deleteProduct
}
