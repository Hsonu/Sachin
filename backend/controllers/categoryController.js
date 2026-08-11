const Category = require("../models/Category");

// Get all categories
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
};

// Create a category (Admin only)
const createCategory = async (req, res, next) => {
    try {
        const { name, image, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
        const existing = await Category.findOne({ slug });
        if (existing) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const newCategory = await Category.create({
            name,
            slug,
            image: image || "",
            description: description || ""
        });

        res.status(201).json(newCategory);
    } catch (err) {
        next(err);
    }
};

// Delete category (Admin only)
const deleteCategory = async (req, res, next) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category Deleted Successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCategories,
    createCategory,
    deleteCategory
};
