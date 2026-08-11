const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    productName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    photo: {
        type: String
    },
    qty: {
        type: Number,
        default: 1
    },
    size: {
        type: String,
        default: "Single Stick"
    },
    flavour: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Card = mongoose.model("Card", cartSchema);
module.exports = Card;
