const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    photo: {
        type: String
    },
    size: {
        type: String
    },
    flavour: {
        type: String
    }
});

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String
    },
    customerMobileNumber: {
        type: String
    },
    customerAdd: {
        type: String
    },
    // Backward compatibility for single product orders
    productName: {
        type: String
    },
    rate: {
        type: Number
    },
    qty: {
        type: Number,
        default: 1
    },
    photo: {
        type: String
    },
    description: {
        type: String
    },
    // Multi-item support
    items: [orderItemSchema],
    
    subtotal: {
        type: Number
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    deliveryCharge: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number
    },
    orderStatus: {
        type: String,
        default: "Order Placed"
    },
    paymentMethod: {
        type: String
    },
    paymentType: {
        type: String,
        default: ""
    },
    // User credentials link
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        default: ""
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    gst: {
        type: Number,
        default: 0
    },
    gstAmount: {
        type: Number,
        default: 0
    },
    withGstTotalAmount: {
        type: Number
    },
    address: {
        fullName: { type: String, default: "" },
        mobileNumber: { type: String, default: "" },
        houseFlat: { type: String, default: "" },
        street: { type: String, default: "" },
        area: { type: String, default: "" },
        city: { type: String, default: "" },
        district: { type: String, default: "" },
        state: { type: String, default: "" },
        pinCode: { type: String, default: "" }
    },
    cancelReason: {
        type: String,
        default: ""
    },
    returnType: {
        type: String,
        default: ""
    },
    returnReason: {
        type: String,
        default: ""
    },
    refundPaymentDetails: {
        type: String,
        default: ""
    },
    exchangeCount: {
        type: Number,
        default: 0
    },
    adminId: {
        type: String,
        default: "admin"
    },
    // PayU Payment Gateway Fields
    transactionId: {
        type: String,
        default: ""
    },
    paymentStatus: {
        type: String,
        default: "pending"
    },
    payuTxnId: {
        type: String,
        default: ""
    }
});

const placeOrderData = mongoose.model("placeOrderData", orderSchema);
module.exports = placeOrderData;
