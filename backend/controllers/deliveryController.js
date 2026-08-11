const DeliveryArea = require("../models/DeliveryArea");

// Check delivery availability by pincode
const checkDelivery = async (req, res, next) => {
    try {
        const { pincode } = req.body;

        if (!pincode || !/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                available: false,
                message: "Please enter a valid 6-digit pincode."
            });
        }

        const area = await DeliveryArea.findOne({ pincode, isServiceable: true });

        if (area) {
            return res.status(200).json({
                available: true,
                message: `Delivery available in ${area.city}, ${area.state}!`,
                city: area.city,
                state: area.state
            });
        } else {
            // Check if there are no delivery areas at all (first time install)
            const count = await DeliveryArea.countDocuments();
            if (count === 0 && pincode === "802133") {
                // If DB is empty, treat 802133 as serviceable by default for testing
                return res.status(200).json({
                    available: true,
                    message: "Delivery available in Dumraon, Bihar (Demo default)!",
                    city: "Dumraon",
                    state: "Bihar"
                });
            }
            
            return res.status(200).json({
                available: false,
                message: "We do not deliver to this pincode yet."
            });
        }
    } catch (err) {
        next(err);
    }
};

// Admin: Get all delivery areas
const getDeliveryAreas = async (req, res, next) => {
    try {
        const areas = await DeliveryArea.find({}).sort({ pincode: 1 });
        res.status(200).json(areas);
    } catch (err) {
        next(err);
    }
};

// Admin: Add delivery area
const addDeliveryArea = async (req, res, next) => {
    try {
        const { pincode, city, state } = req.body;
        if (!pincode || !city || !state) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existing = await DeliveryArea.findOne({ pincode });
        if (existing) {
            existing.isServiceable = true;
            await existing.save();
            return res.status(200).json(existing);
        }

        const newArea = await DeliveryArea.create({
            pincode,
            city,
            state,
            isServiceable: true
        });

        res.status(201).json(newArea);
    } catch (err) {
        next(err);
    }
};

// Admin: Delete delivery area
const deleteDeliveryArea = async (req, res, next) => {
    try {
        const deleted = await DeliveryArea.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Delivery area not found." });
        }
        res.status(200).json({ message: "Delivery area deleted successfully." });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    checkDelivery,
    getDeliveryAreas,
    addDeliveryArea,
    deleteDeliveryArea
};
