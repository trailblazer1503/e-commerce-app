const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "customer"],
        default: "customer"
    },
    products: [{
        type: mongoose.Schema.ObjectId,
        ref: "products"
    }]
}, {timestamps: true});

const userModel = mongoose.model("users", schema);

module.exports = userModel;