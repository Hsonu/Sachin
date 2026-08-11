const mongoose = require("mongoose");

const eventBookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true,
        enum: ["Birthday", "Wedding", "Engagement", "Corporate Event", "Party", "Family Function", "Other Event"]
    },
    eventDate: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    requiredProducts: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Contacted", "Completed", "Cancelled"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const EventBooking = mongoose.model("EventBooking", eventBookingSchema);
module.exports = EventBooking;
