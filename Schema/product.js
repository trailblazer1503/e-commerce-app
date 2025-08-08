const { ref } = require('joi');
const mongoose = require('mongoose');
const userModel = require('./user');
const mongoosePaginate = require("mongoose-paginate-v2");

const schema = new mongoose.Schema({
    productName: {
        type: String,
        require: true
    },
    ownerId: {
        type: String,
        require: true
    },
    cost: {
        type: String,
        require: true
    },
    productImage: {
        type: [String],
        require: true
    },
    description: {
        type: String,
        require: true
    },
    stockStatus: {
        type: String,
        enum: ["in-stock", "low-stock", "out-of-stock"],
        default: 'in-stock'
        
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brands'
    }
},{
    timestamps: true
});

schema.plugin(mongoosePaginate);
const productModel = mongoose.model('products', schema)

module.exports = productModel;