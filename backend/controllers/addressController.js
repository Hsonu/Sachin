const Address = require("../models/Address");
const User = require("../models/User");

// Helper: Get user details from request (JWT or headers)
const getUserIdentifier = (req) => {
    const phone = req.user ? req.user.phone : req.headers["x-user-number"];
    const userId = req.user ? req.user._id : null;
    return { phone, userId };
};

// Save address
const saveAddress = async (req, res, next) => {
    try {
        const { name, phone, email, address } = req.body;
        const { userId } = getUserIdentifier(req);

        if (!name || !phone || !address) {
            return res.status(400).json({ message: "Name, phone, and address details are required." });
        }

        const newAddress = new Address({
            userId,
            name,
            phone,
            email: email || "",
            address: {
                fullAddress: address.fullAddress || "",
                houseFlat: address.houseFlat || "",
                street: address.street || "",
                area: address.area || "",
                city: address.city || "",
                district: address.district || "",
                state: address.state || "",
                pinCode: address.pinCode || address.pincode || "",
                landmark: address.landmark || ""
            }
        });

        const saved = await newAddress.save();

        // Also save to User profile savedAddresses if user is logged in
        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                user.savedAddresses.push({
                    fullName: name,
                    mobileNumber: phone,
                    houseFlat: address.houseFlat || "",
                    street: address.street || "",
                    area: address.area || "",
                    city: address.city || "",
                    state: address.state || "",
                    pincode: address.pinCode || address.pincode || "",
                    landmark: address.landmark || ""
                });
                await user.save();
            }
        }

        res.status(200).json({
            message: "Address saved successfully",
            data: saved
        });
    } catch (err) {
        next(err);
    }
};

// Get addresses (Customer)
const getAddresses = async (req, res, next) => {
    try {
        const { phone, userId } = getUserIdentifier(req);
        let query = {};

        if (userId) {
            query.$or = [{ userId }, { phone }];
        } else if (phone) {
            query.phone = phone;
        } else {
            // If no identifier, return all for backward compatibility
            const list = await Address.find({});
            return res.status(200).json(list);
        }

        const list = await Address.find(query);
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
};

// Update address by phone
const updateAddressByPhone = async (req, res, next) => {
    try {
        const phone = req.params.phone;
        const updateData = req.body;

        const updated = await Address.findOneAndUpdate(
            { phone },
            {
                $set: {
                    name: updateData.name,
                    email: updateData.email,
                    "address.fullAddress": updateData.address?.fullAddress,
                    "address.houseFlat": updateData.address?.houseFlat,
                    "address.street": updateData.address?.street,
                    "address.area": updateData.address?.area,
                    "address.city": updateData.address?.city,
                    "address.district": updateData.address?.district,
                    "address.state": updateData.address?.state,
                    "address.pinCode": updateData.address?.pinCode || updateData.address?.pincode,
                    "address.landmark": updateData.address?.landmark
                }
            },
            { new: true }
        );

        res.status(200).json({
            message: "Address updated successfully",
            data: updated
        });
    } catch (err) {
        next(err);
    }
};

// Delete address by ID
const deleteAddress = async (req, res, next) => {
    try {
        const deleted = await Address.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Address not found." });
        }
        res.status(200).json({ message: "Address deleted successfully." });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    saveAddress,
    getAddresses,
    updateAddressByPhone,
    deleteAddress
};
