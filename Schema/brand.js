const { required } = require('joi');
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

const brandModel = mongoose.model('brands', brandSchema);
module.exports = brandModel;