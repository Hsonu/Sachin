const express = require("express");
const router = express.Router();
const { placeOrder, getOrders, getOrderById, cancelOrder, updateOrderStatus } = require("../controllers/orderController");
const { requireAdmin } = require("../middleware/authMiddleware");

// Place Order
router.post("/", placeOrder);

// Get Orders (Customer or Admin)
router.get("/", getOrders);

// Get Order details
router.get("/:id", getOrderById);

// Cancel Order
router.post("/:id/cancel", cancelOrder);

// Update status (Admin only)
router.put("/:id/status", requireAdmin, updateOrderStatus);

module.exports = router;
