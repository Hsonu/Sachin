const EventBooking = require("../models/EventBooking");

// Submit event booking enquiry
const submitEventEnquiry = async (req, res, next) => {
    try {
        const { name, mobile, email, eventType, eventDate, guests, location, requiredProducts, message } = req.body;

        if (!name || !mobile || !email || !eventType || !eventDate || !guests || !location) {
            return res.status(400).json({ message: "Please fill all required fields." });
        }

        const newEnquiry = await EventBooking.create({
            name,
            mobile,
            email,
            eventType,
            eventDate,
            guests: Number(guests),
            location,
            requiredProducts: requiredProducts || "",
            message: message || ""
        });

        res.status(201).json({
            success: true,
            message: "Your event booking enquiry has been submitted successfully! We will contact you soon.",
            data: newEnquiry
        });
    } catch (err) {
        next(err);
    }
};

// Admin: Get all event enquiries
const getEventEnquiries = async (req, res, next) => {
    try {
        const enquiries = await EventBooking.find({}).sort({ createdAt: -1 });
        res.status(200).json(enquiries);
    } catch (err) {
        next(err);
    }
};

// Admin: Update event enquiry status
const updateEventStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: "Status is required." });
        }

        const updated = await EventBooking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Event enquiry not found." });
        }

        res.status(200).json({
            message: "Event enquiry status updated successfully.",
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    submitEventEnquiry,
    getEventEnquiries,
    updateEventStatus
};
