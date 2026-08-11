const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    customerMobileNumber: { type: String, required: true },
    productName: { type: String, required: true },
    complaintText: { type: String, required: true },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;
