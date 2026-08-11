const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require("../controllers/cartController");
const { requireUser } = require("../middleware/authMiddleware");

// Optional auth wrapper: passes User if logged in, but doesn't block guests
const optionalUser = async (req, res, next) => {
    try {
        const { requireUser } = require("../middleware/authMiddleware");
        await requireUser(req, res, (err) => {
            // Suppress error so request proceeds even without JWT
            next();
        });
    } catch (e) {
        next();
    }
};

router.get("/", optionalUser, getCart);
router.post("/add", optionalUser, addToCart);
router.put("/update/:id", optionalUser, updateCartItem);
router.delete("/remove/:id", optionalUser, removeCartItem);
router.delete("/clear", optionalUser, clearCart);

module.exports = router;
