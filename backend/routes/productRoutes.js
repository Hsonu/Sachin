const express = require("express");
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { requireAdmin } = require("../middleware/authMiddleware");

// Product list & Search
router.get("/", getProducts);

// Product details
router.get("/:id", getProductById);

// Create product (Admin only)
router.post("/", requireAdmin, createProduct);

// Update product (Admin only)
router.put("/:id", requireAdmin, updateProduct);

// Delete product (Admin only)
router.delete("/:id", requireAdmin, deleteProduct);

module.exports = router;
