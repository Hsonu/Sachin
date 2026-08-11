const Card = require("../models/Cart");
const Product = require("../models/Product");

// Helper: Get user identification (phone or user ID) from request
const getUserIdentifier = (req) => {
    const phone = req.user ? req.user.phone : req.headers["x-user-number"];
    const userId = req.user ? req.user._id : null;
    return { phone, userId };
};

// Get Cart Items
const getCart = async (req, res, next) => {
    try {
        const { phone, userId } = getUserIdentifier(req);
        if (!phone && !userId) {
            return res.status(400).json({ message: "Customer identification required to view cart." });
        }

        // Build query to find matching cart items
        let query = {};
        if (userId) {
            query.$or = [{ userId }, { mobileNumber: phone }];
        } else {
            query.mobileNumber = phone;
        }

        const items = await Card.find(query);
        res.status(200).json(items);
    } catch (err) {
        next(err);
    }
};

// Add Item to Cart
const addToCart = async (req, res, next) => {
    try {
        const { phone, userId } = getUserIdentifier(req);
        const { productName, rate, photo, qty, size, flavour, productId } = req.body;

        const activePhone = phone || req.body.mobileNumber;
        if (!activePhone) {
            return res.status(400).json({ message: "Mobile number is required to save items to cart." });
        }

        if (!productName || !rate) {
            return res.status(400).json({ message: "Product name and rate are required." });
        }

        // Check if product exists in catalog (to resolve productId if not sent)
        let resolvedProductId = productId;
        if (!resolvedProductId) {
            const product = await Product.findOne({ Productname: productName });
            if (product) resolvedProductId = product._id;
        }

        // Check if item already exists in customer's cart
        let query = {
            productName,
            mobileNumber: activePhone,
            size: size || "Single Stick",
            flavour: flavour || ""
        };

        let existingItem = await Card.findOne(query);

        if (existingItem) {
            existingItem.qty = (existingItem.qty || 1) + (qty !== undefined ? Number(qty) : 1);
            if (userId) existingItem.userId = userId;
            if (resolvedProductId) existingItem.productId = resolvedProductId;
            const savedItem = await existingItem.save();
            return res.status(200).json(savedItem);
        } else {
            const cartItem = new Card({
                userId,
                productId: resolvedProductId,
                productName,
                mobileNumber: activePhone,
                rate: Number(rate),
                photo: photo || "",
                qty: qty !== undefined ? Number(qty) : 1,
                size: size || "Single Stick",
                flavour: flavour || ""
            });
            const savedItem = await cartItem.save();
            return res.status(200).json(savedItem);
        }
    } catch (err) {
        next(err);
    }
};

// Update Cart Item Quantity
const updateCartItem = async (req, res, next) => {
    try {
        const { qty, size, flavour } = req.body;
        const itemId = req.params.id;

        const cartItem = await Card.findById(itemId);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        if (qty !== undefined) cartItem.qty = Number(qty);
        if (size !== undefined) cartItem.size = size;
        if (flavour !== undefined) cartItem.flavour = flavour;

        const updated = await cartItem.save();
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

// Remove Cart Item
const removeCartItem = async (req, res, next) => {
    try {
        const deleted = await Card.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        res.status(200).json({ message: "Item removed from cart successfully", deleted });
    } catch (err) {
        next(err);
    }
};

// Clear Cart
const clearCart = async (req, res, next) => {
    try {
        const { phone, userId } = getUserIdentifier(req);
        if (!phone && !userId) {
            return res.status(400).json({ message: "Customer identification required to clear cart." });
        }

        let query = {};
        if (userId) {
            query.$or = [{ userId }, { mobileNumber: phone }];
        } else {
            query.mobileNumber = phone;
        }

        await Card.deleteMany(query);
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};
