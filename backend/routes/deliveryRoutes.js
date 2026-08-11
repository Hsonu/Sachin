const express = require("express");
const router = express.Router();
const { checkDelivery, getDeliveryAreas, addDeliveryArea, deleteDeliveryArea } = require("../controllers/deliveryController");
const { requireAdmin } = require("../middleware/authMiddleware");

// Public check delivery
router.post("/check", checkDelivery);

// Admin delivery coverage management
router.get("/areas", requireAdmin, getDeliveryAreas);
router.post("/areas", requireAdmin, addDeliveryArea);
router.delete("/areas/:id", requireAdmin, deleteDeliveryArea);

module.exports = router;
