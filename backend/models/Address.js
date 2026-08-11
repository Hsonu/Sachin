const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ""
    },
    address: {
        fullAddress: { type: String, default: "" },
        houseFlat: { type: String, default: "" },
        street: { type: String, default: "" },
        area: { type: String, default: "" },
        city: { type: String, default: "" },
        district: { type: String, default: "" },
        state: { type: String, default: "" },
        pinCode: { type: String, default: "" },
        landmark: { type: String, default: "" }
    }
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
