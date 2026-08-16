require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

// Load backend .env explicitly
require("dotenv").config({ path: path.join(__dirname, "backend", ".env") });

const Category = require("./backend/models/Category");
const Product = require("./backend/models/Product");
const DeliveryArea = require("./backend/models/DeliveryArea");
const Admin = require("./backend/models/Admin");
const Card = require("./backend/models/Cart");
const Order = require("./backend/models/Order");
const Complaint = require("./backend/models/Complaint");
const Blog = require("./backend/models/Blog");
const EventBooking = require("./backend/models/EventBooking");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Himalayan_kulfi";

const seedData = async () => {
    try {
        console.log("⏳ Connecting to local MongoDB:", MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log("🟢 Connected successfully.");

        // Clear all collections
        console.log("🧹 Clearing existing collections...");
        await Category.deleteMany({});
        await Product.deleteMany({});
        await DeliveryArea.deleteMany({});
        await Card.deleteMany({});
        await Order.deleteMany({});
        await Complaint.deleteMany({});
        await Blog.deleteMany({});
        await EventBooking.deleteMany({});
        // We preserve admin accounts so logins still work, but seed owner if none exists
        const ownerExists = await Admin.findOne({ role: "owner" });
        if (!ownerExists) {
            const bcrypt = require("bcryptjs");
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash("owner@123", salt);
            await Admin.create({
                adminId: "owner",
                password,
                role: "owner",
                isActive: true
            });
            console.log("✅ Seeded default Owner account (ID: owner | Pass: owner@123)");
        }

        // 1. Seed Categories
        console.log("🌱 Seeding Categories...");
        const categoriesData = [
            { name: "Classic Kulfi", slug: "classic-kulfi", description: "Authentic slow-churned traditional kulfis made from rich condensed milk.", image: "/images/category_classic.png" },
            { name: "Premium Kulfi", slug: "premium-kulfi", description: "Luxury flavor combinations infused with dry fruits, spices and real saffron.", image: "/images/category_premium.png" },
            { name: "Matka Kulfi", slug: "matka-kulfi", description: "Slow-frozen traditional kulfi set in earthen clay pots for a unique rustic aroma.", image: "/images/category_matka.png" },
            { name: "Falooda", slug: "falooda", description: "Premium layered dessert drinks served with sweet basil seeds, vermicelli, rose syrup and a slice of kulfi.", image: "/images/category_falooda.png" },
            { name: "Rabri", slug: "rabri", description: "Thickened, sweetened milk dessert with layers of malai (cream), cardamom and nuts.", image: "/images/category_rabri.png" },
            { name: "Family Packs", slug: "family-packs", description: "Large sharing packs of our popular kulfi flavors, perfect for functions and get-togethers.", image: "/images/category_family.png" },
            { name: "Special Desserts", slug: "special-desserts", description: "Chef special fusion frozen desserts and sweets.", image: "/images/category_special.png" }
        ];

        const seededCategories = await Category.insertMany(categoriesData);
        console.log(`✅ Seeded ${seededCategories.length} categories.`);

        // Helper to find category ID by name
        const getCatRef = (name) => {
            const cat = seededCategories.find(c => c.name === name);
            return cat ? cat._id : null;
        };

        // 2. Seed Products
        console.log("🌱 Seeding Products...");
        const productsData = [
            {
                Productname: "Malai Kulfi",
                Category: "Classic Kulfi",
                categoryRef: getCatRef("Classic Kulfi"),
                SubCategory: "Sticks",
                Units: 150,
                Rate: 50,
                mrp: 60,
                description: "The timeless classic. Rich, creamy, slow-reduced milk kulfi infused with green cardamom and sweet saffron threads. Pure tradition in every bite.",
                photo: "/images/malai_kulfi.png",
                photos: ["/images/malai_kulfi.png"],
                gst: 18,
                discount: 16,
                flavour: "Traditional Malai",
                size: "Single Stick",
                weight: "100g",
                isAvailable: true,
                isFeatured: true,
                isBestseller: true,
                rating: 4.9,
                ingredients: "Whole Buffalo Milk, Heavy Cream, Sugar, Green Cardamom, Saffron Threads"
            },
            {
                Productname: "Mango Kulfi",
                Category: "Classic Kulfi",
                categoryRef: getCatRef("Classic Kulfi"),
                SubCategory: "Sticks",
                Units: 120,
                Rate: 60,
                mrp: 75,
                description: "Experience the rich flavor of Alphonso mango pulp blended perfectly with slow-condensed milk for a tropical, refreshing frozen treat.",
                photo: "/images/mango_kulfi.png",
                photos: ["/images/mango_kulfi.png"],
                gst: 18,
                discount: 20,
                flavour: "Alphonso Mango",
                size: "Single Stick",
                weight: "100g",
                isAvailable: true,
                isFeatured: true,
                isBestseller: true,
                rating: 4.8,
                ingredients: "Reduced Whole Milk, Alphonso Mango Pulp, Sugar, Organic Cream"
            },
            {
                Productname: "Pista Kulfi",
                Category: "Classic Kulfi",
                categoryRef: getCatRef("Classic Kulfi"),
                SubCategory: "Sticks",
                Units: 90,
                Rate: 60,
                mrp: 70,
                description: "Our signature Pistachio kulfi loaded with real crushed pistachios, flavored with wild cardamom for a beautiful nutty, creamy crunch.",
                photo: "/images/pista_kulfi.png",
                photos: ["/images/pista_kulfi.png"],
                gst: 18,
                discount: 14,
                flavour: "Pistachio",
                size: "Single Stick",
                weight: "100g",
                isAvailable: true,
                isFeatured: false,
                isBestseller: true,
                rating: 4.7,
                ingredients: "Whole Milk, Organic Cane Sugar, Heavy Cream, Roasted Pistachios, Green Cardamom"
            },
            {
                Productname: "Matka Kulfi",
                Category: "Matka Kulfi",
                categoryRef: getCatRef("Matka Kulfi"),
                SubCategory: "Clay Pot",
                Units: 80,
                Rate: 80,
                mrp: 100,
                description: "Authentic slow-frozen kulfi set in traditional earthen clay pots (matkas). Flavored with saffron and topped with abundant sliced almonds and pistachios.",
                photo: "/images/matka_kulfi.png",
                photos: ["/images/matka_kulfi.png"],
                gst: 18,
                discount: 20,
                flavour: "Kesar Badam Pista",
                size: "Matka Clay Pot",
                weight: "120g",
                isAvailable: true,
                isFeatured: true,
                isBestseller: true,
                rating: 4.9,
                ingredients: "Thickened Buffalo Milk, Sugar, Cream, Kashmiri Saffron, Almond Flakes, Crushed Pistachios"
            },
            {
                Productname: "Strawberry Kulfi",
                Category: "Classic Kulfi",
                categoryRef: getCatRef("Classic Kulfi"),
                SubCategory: "Sticks",
                Units: 100,
                Rate: 60,
                mrp: 70,
                description: "A delightful fusion of traditional rich milk base and natural hand-picked strawberry puree. A sweet and slightly tangy summer favorite.",
                photo: "/images/strawberry_kulfi.png",
                photos: ["/images/strawberry_kulfi.png"],
                gst: 18,
                discount: 14,
                flavour: "Fresh Strawberry",
                size: "Single Stick",
                weight: "100g",
                isAvailable: true,
                isFeatured: false,
                isBestseller: false,
                rating: 4.5,
                ingredients: "Whole Milk, Fresh Strawberry Puree, Organic Sugar, Heavy Cream"
            },
            {
                Productname: "Kesar Pista Kulfi",
                Category: "Premium Kulfi",
                categoryRef: getCatRef("Premium Kulfi"),
                SubCategory: "Luxury Sticks",
                Units: 110,
                Rate: 70,
                mrp: 90,
                description: "Our ultra-premium flavor. Infused with rich Kashmiri saffron (kesar) and abundantly filled with premium ground green pistachios. Pure luxury on a stick.",
                photo: "/images/kesar_pista_kulfi.png",
                photos: ["/images/kesar_pista_kulfi.png"],
                gst: 18,
                discount: 22,
                flavour: "Kesar Pista",
                size: "Single Stick",
                weight: "100g",
                isAvailable: true,
                isFeatured: true,
                isBestseller: true,
                rating: 4.95,
                ingredients: "Reduced Buffalo Milk, Heavy Cream, Sugar, Kashmiri Saffron, Premium Roasted Pistachios"
            },
            {
                Productname: "Chocolate Kulfi",
                Category: "Premium Kulfi",
                categoryRef: getCatRef("Premium Kulfi"),
                SubCategory: "Sticks",
                Units: 60,
                Rate: 70,
                mrp: 80,
                description: "Rich dark cocoa powder and premium melted milk chocolate blended with our signature condensed milk base. A modern chocolate lover's dream.",
                photo: "/images/chocolate_kulfi.png",
                photos: ["/images/chocolate_kulfi.png"],
                gst: 18,
                discount: 12,
                flavour: "Dark Chocolate",
                size: "Single Stick",
                weight: "100g",
                isAvailable: true,
                isFeatured: false,
                isBestseller: false,
                rating: 4.6,
                ingredients: "Reduced Whole Milk, Cocoa Powder, Melted Dark Chocolate, Sugar, Cream"
            },
            {
                Productname: "Badam Pista Kulfi",
                Category: "Premium Kulfi",
                categoryRef: getCatRef("Premium Kulfi"),
                SubCategory: "Sticks",
                Units: 90,
                Rate: 70,
                mrp: 85,
                description: "Traditional kulfi loaded with almond pieces and pistachios, providing a satisfying crunchy nut texture in a smooth cardamom milk base.",
                photo: "/images/badam_pista_kulfi.png",
                photos: ["/images/badam_pista_kulfi.png"],
                gst: 18,
                discount: 17,
                flavour: "Almond Pistachio",
                size: "Single Stick",
                weight: "100g",
                isAvailable: true,
                isFeatured: false,
                isBestseller: true,
                rating: 4.8,
                ingredients: "Whole Milk, Sugar, Cream, Roasted Almond Slivers, Crushed Pistachios, Saffron"
            },
            {
                Productname: "Classic Falooda Dessert",
                Category: "Falooda",
                categoryRef: getCatRef("Falooda"),
                SubCategory: "Sundae Glasses",
                Units: 75,
                Rate: 120,
                mrp: 150,
                description: "A gorgeous layered dessert drink. Features organic rose syrup, vermicelli, sweet basil seeds (sabja), chilled condensed milk, topped with a slice of Malai Kulfi and nuts.",
                photo: "/images/falooda.png",
                photos: ["/images/falooda.png"],
                gst: 18,
                discount: 20,
                flavour: "Rose & Malai",
                size: "Serving Glass",
                weight: "250ml",
                isAvailable: true,
                isFeatured: true,
                isBestseller: true,
                rating: 4.85,
                ingredients: "Sweet Basil Seeds, Vermicelli, Rose Syrup, Chilled Whole Milk, Malai Kulfi Slice, Almonds"
            },
            {
                Productname: "Shahi Kesar Rabri Bowl",
                Category: "Rabri",
                categoryRef: getCatRef("Rabri"),
                SubCategory: "Bowls",
                Units: 50,
                Rate: 150,
                mrp: 180,
                description: "Royal Indian sweet made by boiling whole milk on a slow fire till it is thick and creamy with delicious layers of malai. Flavored with saffron and pistachios.",
                photo: "/images/rabri.png",
                photos: ["/images/rabri.png"],
                gst: 18,
                discount: 16,
                flavour: "Kesar Cardamom",
                size: "Clay Pot Bowl",
                weight: "150g",
                isAvailable: true,
                isFeatured: true,
                isBestseller: false,
                rating: 4.9,
                ingredients: " buffalo milk, Organic sugar, Saffron threads, Cardamom powder, Pistachio flakes"
            }
        ];

        const seededProducts = await Product.insertMany(productsData);
        console.log(`✅ Seeded ${seededProducts.length} products.`);

        // 3. Seed Serviceable Pincodes
        console.log("🌱 Seeding Serviceable Pincodes...");
        const pincodesData = [
            { pincode: "802133", city: "Dumraon", state: "Bihar", isServiceable: true },
            { pincode: "802120", city: "Buxar", state: "Bihar", isServiceable: true },
            { pincode: "110001", city: "Connaught Place", state: "New Delhi", isServiceable: true },
            { pincode: "110016", city: "Green Park", state: "New Delhi", isServiceable: true },
            { pincode: "400001", city: "Colaba Fort", state: "Maharashtra", isServiceable: true },
            { pincode: "400050", city: "Bandra West", state: "Maharashtra", isServiceable: true },
            { pincode: "560001", city: "Mahatma Gandhi Road", state: "Karnataka", isServiceable: true },
            { pincode: "560034", city: "Koramangala", state: "Karnataka", isServiceable: true },
            { pincode: "700001", city: "Kolkata GPO", state: "West Bengal", isServiceable: true },
            { pincode: "700029", city: "Kalighat", state: "West Bengal", isServiceable: true }
        ];

        const seededPincodes = await DeliveryArea.insertMany(pincodesData);
        console.log(`✅ Seeded ${seededPincodes.length} serviceable pincodes.`);

        console.log("==================================================");
        console.log("✨ SUCCESS: Himalayan Kulfi Database Seeding Completed!");
        console.log("Use: npm start to boot the server.");
        console.log("==================================================");

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    } catch (err) {
        console.error("❌ Seeding failed with error:", err);
        process.exit(1);
    }
};

seedData();
