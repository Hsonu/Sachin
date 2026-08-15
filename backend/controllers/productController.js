const Product = require("../models/Product");
const Category = require("../models/Category");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get products with search, sorting, and filtering
const getProducts = async (req, res, next) => {
    try {
        const { q, category, flavour, minPrice, maxPrice, availability, sort, isFeatured, isBestseller } = req.query;
        let query = {};

        // 1. Search Query (matches product name, flavor, or category)
        if (q) {
            const searchRegex = new RegExp(q.trim(), "i");
            query.$or = [
                { Productname: searchRegex },
                { flavour: searchRegex },
                { Category: searchRegex },
                { description: searchRegex }
            ];
        }

        // 2. Category Filter
        if (category && category !== "all") {
            // Category can be either Name string or ObjectId
            if (category.match(/^[0-9a-fA-F]{24}$/)) {
                query.categoryRef = category;
            } else {
                query.Category = new RegExp("^" + category.trim() + "$", "i");
            }
        }

        // 3. Flavour Filter
        if (flavour) {
            query.flavour = new RegExp(flavour.trim(), "i");
        }

        // 4. Price range
        if (minPrice || maxPrice) {
            query.Rate = {};
            if (minPrice) query.Rate.$gte = Number(minPrice);
            if (maxPrice) query.Rate.$lte = Number(maxPrice);
        }

        // 5. Availability (stock)
        if (availability) {
            if (availability === "available") {
                query.Units = { $gt: 0 };
                query.isAvailable = true;
            } else if (availability === "out_of_stock") {
                query.$or = [{ Units: { $lte: 0 } }, { isAvailable: false }];
            }
        }

        // 6. Featured / Bestseller
        if (isFeatured === "true") {
            query.isFeatured = true;
        }
        if (isBestseller === "true") {
            query.isBestseller = true;
        }

        // Admin Isolation header logic (disabled so admins can see and edit all products)
        /*
        const adminId = req.headers["x-admin-id"];
        if (adminId) {
            query.$or = [
                { createdBy: adminId },
                ...(adminId === "admin" ? [{ createdBy: { $exists: false } }, { createdBy: null }] : [])
            ];
        }
        */

        // Build Sort Options
        let sortOption = {};
        if (sort) {
            switch (sort) {
                case "priceAsc":
                case "Rate_asc":
                    sortOption = { Rate: 1 };
                    break;
                case "priceDesc":
                case "Rate_desc":
                    sortOption = { Rate: -1 };
                    break;
                case "newest":
                case "createdAt_desc":
                    sortOption = { createdAt: -1 };
                    break;
                case "rating":
                case "rating_desc":
                    sortOption = { rating: -1 };
                    break;
                case "popular":
                case "bestseller_desc":
                default:
                    sortOption = { isBestseller: -1, rating: -1 };
                    break;
            }
        } else {
            sortOption = { createdAt: -1 }; // default newest first
        }

        const products = await Product.find(query).sort(sortOption).populate("categoryRef");
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

// Get single product details
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate("categoryRef");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

// Create product (Admin only)
const createProduct = async (req, res, next) => {
    try {
        let fileList = [];
        let photoUrls = [];

        // Upload images if files exist
        if (req.files && req.files.photo) {
            fileList = req.files.photo;
            if (!Array.isArray(fileList)) {
                fileList = [fileList];
            }
            const uploadPromises = fileList.map(file => cloudinary.uploader.upload(file.tempFilePath));
            const uploadResults = await Promise.all(uploadPromises);
            photoUrls = uploadResults.map(r => r.secure_url);
        }

        const createdBy = req.headers["x-admin-id"] || "admin";

        // Map Category String to Category ObjectId if it matches an existing category
        let categoryRef;
        const matchedCategory = await Category.findOne({ name: new RegExp("^" + req.body.Category + "$", "i") });
        if (matchedCategory) {
            categoryRef = matchedCategory._id;
        }

        const productData = {
            Productname: req.body.Productname,
            Category: req.body.Category,
            categoryRef,
            SubCategory: req.body.SubCategory || "",
            Units: req.body.Units !== undefined ? Number(req.body.Units) : 0,
            Rate: Number(req.body.Rate),
            mrp: req.body.mrp ? Number(req.body.mrp) : Math.round(Number(req.body.Rate) * 1.2),
            description: req.body.description || "",
            photo: photoUrls.length > 0 ? photoUrls[0] : (req.body.photo || ""),
            photos: photoUrls.length > 0 ? photoUrls : (req.body.photos || []),
            gst: req.body.gst !== undefined ? Number(req.body.gst) : 18,
            discount: req.body.discount !== undefined ? Number(req.body.discount) : 0,
            flavour: req.body.flavour || "",
            size: req.body.size || "Single Stick",
            weight: req.body.weight || "100g",
            isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable === "true" || req.body.isAvailable === true : true,
            isFeatured: req.body.isFeatured === "true" || req.body.isFeatured === true,
            isBestseller: req.body.isBestseller === "true" || req.body.isBestseller === true,
            rating: req.body.rating ? Number(req.body.rating) : 4.5,
            ingredients: req.body.ingredients || "Milk, Sugar, Cardamom",
            createdBy
        };

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        res.status(200).json(savedProduct);
    } catch (err) {
        next(err);
    }
};

// Update product (Admin only)
const updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        let photoUrls = [];

        // Upload new images if files exist
        if (req.files && req.files.photo) {
            let fileList = req.files.photo;
            if (!Array.isArray(fileList)) {
                fileList = [fileList];
            }
            const uploadPromises = fileList.map(file => cloudinary.uploader.upload(file.tempFilePath));
            const uploadResults = await Promise.all(uploadPromises);
            photoUrls = uploadResults.map(r => r.secure_url);
        }

        // Parse existing photos to keep
        let existingPhotos = [];
        if (req.body.existingPhotos) {
            try {
                existingPhotos = JSON.parse(req.body.existingPhotos);
            } catch (e) {
                if (typeof req.body.existingPhotos === "string") {
                    existingPhotos = [req.body.existingPhotos];
                }
            }
        }

        const allPhotos = [...existingPhotos, ...photoUrls];

        // Map category string to category reference
        let categoryRef;
        if (req.body.Category) {
            const matchedCategory = await Category.findOne({ name: new RegExp("^" + req.body.Category + "$", "i") });
            if (matchedCategory) {
                categoryRef = matchedCategory._id;
            }
        }

        const updateFields = {
            Productname: req.body.Productname,
            Category: req.body.Category,
            categoryRef,
            SubCategory: req.body.SubCategory,
            description: req.body.description,
            Units: req.body.Units !== undefined ? Number(req.body.Units) : undefined,
            Rate: req.body.Rate !== undefined ? Number(req.body.Rate) : undefined,
            mrp: req.body.mrp !== undefined ? Number(req.body.mrp) : undefined,
            gst: req.body.gst !== undefined ? Number(req.body.gst) : undefined,
            discount: req.body.discount !== undefined ? Number(req.body.discount) : undefined,
            flavour: req.body.flavour,
            size: req.body.size,
            weight: req.body.weight,
            isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable === "true" || req.body.isAvailable === true : undefined,
            isFeatured: req.body.isFeatured !== undefined ? req.body.isFeatured === "true" || req.body.isFeatured === true : undefined,
            isBestseller: req.body.isBestseller !== undefined ? req.body.isBestseller === "true" || req.body.isBestseller === true : undefined,
            ingredients: req.body.ingredients
        };

        // Filter undefined fields
        Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

        if (allPhotos.length > 0) {
            updateFields.photo = allPhotos[0];
            updateFields.photos = allPhotos;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateFields,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product Updated Successfully",
            data: updatedProduct
        });
    } catch (err) {
        next(err);
    }
};

// Delete product (Admin only)
const deleteProduct = async (req, res, next) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product Deleted Successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
