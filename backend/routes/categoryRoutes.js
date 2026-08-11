const express = require("express");
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require("../controllers/categoryController");
const { requireAdmin } = require("../middleware/authMiddleware");

// Get all categories
router.get("/", getCategories);

// Create category (Admin only)
router.post("/", requireAdmin, createCategory);

// Delete category (Admin only)
router.delete("/:id", requireAdmin, deleteCategory);

module.exports = router;
