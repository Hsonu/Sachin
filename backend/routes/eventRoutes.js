const express = require("express");
const router = express.Router();
const { submitEventEnquiry, getEventEnquiries, updateEventStatus } = require("../controllers/eventController");
const { requireAdmin } = require("../middleware/authMiddleware");

// Submit enquiry (Public)
router.post("/", submitEventEnquiry);

// Admin: Get all event bookings (Admin only)
router.get("/list", requireAdmin, getEventEnquiries);

// Admin: Update event enquiry status (Admin only)
router.put("/:id/status", requireAdmin, updateEventStatus);

module.exports = router;
