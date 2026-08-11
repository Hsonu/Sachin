const mongoose = require("mongoose");

const deliveryAreaSchema = new mongoose.Schema({
    pincode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    isServiceable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const DeliveryArea = mongoose.model("DeliveryArea", deliveryAreaSchema);
module.exports = DeliveryArea;
