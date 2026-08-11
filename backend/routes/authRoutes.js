const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { requireUser } = require("../middleware/authMiddleware");

// Register Customer
router.post("/register", registerUser);

// Login Customer
router.post("/login", loginUser);

// Get Profile (Protected)
router.get("/me", requireUser, getUserProfile);

module.exports = router;
