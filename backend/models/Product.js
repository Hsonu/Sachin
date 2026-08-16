const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    Productname: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    categoryRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    SubCategory: {
        type: String,
        default: ""
    },
    Units: {
        type: Number,
        required: true,
        default: 0
    },
    Rate: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: true,
        default: function () {
            // fallback mrp calculation if not specified
            return Math.round(this.Rate * 1.2);
        }
    },
    description: {
        type: String
    },
    photo: {
        type: String
    },
    photos: {
        type: [String],
        default: []
    },
    gst: {
        type: Number,
        default: 18 // standard 18% GST for premium  (or 5%, we default to 18%)
    },
    discount: {
        type: Number,
        default: 0
    },
    flavour: {
        type: String,
        default: ""
    },
    size: {
        type: String,
        default: "Single Stick"
    },
    weight: {
        type: String,
        default: "100g"
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isBestseller: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.5
    },
    ingredients: {
        type: String,
        default: "Milk, Cream, Sugar, Cardamom, Dry Fruits"
    },
    createdBy: {
        type: String,
        default: "admin"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
