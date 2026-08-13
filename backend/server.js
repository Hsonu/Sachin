// Global Crash Prevention - Updated MongoDB Atlas Connection
process.on("uncaughtException", (err) => {
    console.error("🔥 CRITICAL: Uncaught Exception caught:", err.stack || err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("🔥 CRITICAL: Unhandled Rejection caught at:", promise, "reason:", reason);
});

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const db = require("./db"); // Mongoose DB Connection
require("./ping"); // Self keep-alive ping script every 5 minutes

// Import Models for inline handlers and seeder checks
const Admin = require("./models/Admin");
const Blog = require("./models/Blog");
const Complaint = require("./models/Complaint");
const User = require("./models/User");
const Product = require("./models/Product");
const Card = require("./models/Cart");
const Address = require("./models/Address");
const EventBooking = require("./models/EventBooking");

// Import Middleware
const { requireAdmin, requireOwner, requireUser } = require("./middleware/authMiddleware");

// Import Controllers for legacy mappings
const productController = require("./controllers/productController");
const orderController = require("./controllers/orderController");
const cartController = require("./controllers/cartController");
const addressController = require("./controllers/addressController");
const paymentController = require("./controllers/paymentController");
const deliveryController = require("./controllers/deliveryController");
const eventController = require("./controllers/eventController");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

// Serve Static Assets
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.static(path.join(__dirname, "../adminPanel")));
app.use("/admin", express.static(path.join(__dirname, "../adminPanel/order")));

// ── NEW REST API ROUTING ─────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/address", require("./routes/addressRoutes"));

// ── BACKWARD COMPATIBLE LEGACY ROUTE MAPPINGS ─────────────────────────────────

// PayU payment gateway legacy links
app.post("/payu/initiate", paymentController.initiatePayment);
app.post("/payu/success", paymentController.paymentSuccess);
app.post("/payu/failure", paymentController.paymentFailure);

// Products legacy mappings
app.get("/addProduct", productController.getProducts);
app.post("/addProduct", requireAdmin, productController.createProduct);
app.put("/updateProduct/:id", requireAdmin, productController.updateProduct);
app.delete("/DelProduct/:id", requireAdmin, productController.deleteProduct);
app.get("/singleProduct/:id", productController.getProductById);

// Cart legacy mappings
app.get("/Card", cartController.getCart);
app.post("/Card", cartController.addToCart);
app.delete("/card/:id", cartController.removeCartItem);

// Address legacy mappings
app.post("/address", addressController.saveAddress);
app.get("/address", addressController.getAddresses);
app.put("/address/:phone", addressController.updateAddressByPhone);

// Order legacy mappings
app.post("/placeOrder", orderController.placeOrder);
app.get("/viwePlaceOrder", orderController.getOrders);
app.get("/statusSingleData/:id", orderController.getOrderById);
app.post("/cancelOrder/:id", orderController.cancelOrder);
app.put("/updateOrderStatus/:id", requireAdmin, orderController.updateOrderStatus);

// OTP-based user registration legacy link
app.post("/newUser/:userNumber", async (req, res, next) => {
    try {
        const phone = req.params.userNumber;
        let existingUser = await User.findOne({ phone });

        const sessionToken = crypto.randomBytes(32).toString("hex");

        if (existingUser) {
            // User exists, return user details
            return res.status(200).json({
                message: "User Already Exists",
                user: {
                    useNumber: existingUser.phone,
                    currentSessionToken: sessionToken
                },
                sessionToken
            });
        }

        // Create virtual password/user to allow backward compatibility
        const virtualUser = new User({
            name: `Customer_${phone.substring(6)}`,
            email: `customer_${phone}@himalayakulfi.com`,
            phone,
            password: `virtual_pass_${phone}` // hashes automatically in pre-save hook
        });

        const saved = await virtualUser.save();

        res.status(200).json({
            message: "New User Saved",
            data: {
                useNumber: saved.phone,
                currentSessionToken: sessionToken
            },
            sessionToken
        });
    } catch (err) {
        next(err);
    }
});

// OTP send legacy endpoint (mocked to match UI expectations)
app.post("/send-otp", async (req, res, next) => {
    try {
        const { number } = req.body;
        if (!number || number.length !== 10) {
            return res.status(400).json({ message: "Invalid 10-digit number" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log(`[Legacy OTP] OTP Code generated for ${number}: ${otp}`);

        res.status(200).json({
            message: "OTP Sent",
            otp
        });
    } catch (err) {
        next(err);
    }
});

// Pincode Proxy (keeps Postal PIN code lookup functional)
app.get("/api/pincode/:pincode", async (req, res, next) => {
    try {
        const pincode = req.params.pincode;
        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json([{ Status: "Error", Message: "Pincode must be exactly 6 digits." }]);
        }

        console.log(`[Pincode Proxy] Querying details for: ${pincode}`);
        const apiRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);

        if (!apiRes.ok) {
            return res.status(apiRes.status).json([{ Status: "Error", Message: "Failed to fetch from Postal Pincode API" }]);
        }

        const data = await apiRes.json();
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// Tunnel API
app.get("/api/tunnel", async (req, res) => {
    try {
        const response = await fetch("http://127.0.0.1:4040/api/tunnels");
        if (response.ok) {
            const data = await response.json();
            const httpsTunnel = data.tunnels.find(t => t.proto === "https" || (t.public_url && t.public_url.startsWith("https")));
            if (httpsTunnel) {
                return res.json({ url: httpsTunnel.public_url });
            }
        }
        res.json({ url: null });
    } catch (err) {
        res.json({ url: null });
    }
});

// Legacy Client Booking mapping (Appointment)
app.post("/newClient", async (req, res, next) => {
    try {
        const { FullName, mobileNumber, email, message } = req.body;
        // Redirect to EventBooking
        const enquiry = await EventBooking.create({
            name: FullName,
            mobile: String(mobileNumber),
            email: email || "customer@himalayakulfi.com",
            eventType: "Other Event",
            eventDate: new Date(),
            guests: 10,
            location: "Enquiry Location",
            message: message || "Legacy booking enquiry"
        });

        res.status(200).json(enquiry);
    } catch (err) {
        next(err);
    }
});

// ── ADMIN PANEL LOGIN & OWNER CONTROL ROUTINGS ───────────────────────────────

app.get("/owner", (req, res) => res.sendFile(path.join(__dirname, "../adminPanel/owner/owner-login.html")));
app.get("/owner/dashboard", (req, res) => res.sendFile(path.join(__dirname, "../adminPanel/owner/owner-dashboard.html")));
app.get("/owner/create-admin", (req, res) => res.sendFile(path.join(__dirname, "../adminPanel/owner/create-admin.html")));
app.get("/owner/orders", (req, res) => res.sendFile(path.join(__dirname, "../adminPanel/owner/owner-orders.html")));
app.get("/owner/reports", (req, res) => res.sendFile(path.join(__dirname, "../adminPanel/owner/owner-reports.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "../adminPanel/order/login.html")));

// Admin login
app.post("/admin/login", async (req, res, next) => {
    try {
        const { adminId, password } = req.body;
        if (!adminId || !password) {
            return res.status(400).json({ message: "Admin ID and password are required" });
        }
        const admin = await Admin.findOne({ adminId });
        if (!admin) {
            return res.status(401).json({ message: "Invalid admin ID or password" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid admin ID or password" });
        }
        if (admin.isActive === false) {
            return res.status(403).json({ message: "Account is deactivated. Contact Owner." });
        }

        const sessionToken = crypto.randomBytes(32).toString("hex");
        admin.currentSessionToken = sessionToken;
        await admin.save();

        res.status(200).json({
            message: "Login successful",
            adminId: admin.adminId,
            role: admin.role,
            sessionToken
        });
    } catch (err) {
        next(err);
    }
});

// Owner Login
app.post("/owner/login", async (req, res, next) => {
    try {
        const { adminId, password } = req.body;
        const admin = await Admin.findOne({ adminId });
        if (!admin || admin.role !== "owner") {
            return res.status(401).json({ message: "Invalid owner credentials" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid owner credentials" });
        }

        const sessionToken = crypto.randomBytes(32).toString("hex");
        admin.currentSessionToken = sessionToken;
        await admin.save();

        res.status(200).json({
            message: "Owner login successful",
            adminId: admin.adminId,
            role: "owner",
            sessionToken
        });
    } catch (err) {
        next(err);
    }
});

// Owner endpoints
app.post("/owner/create-admin", requireOwner, async (req, res, next) => {
    try {
        const { adminId, password } = req.body;
        if (!adminId || !password) return res.status(400).json({ message: "Admin ID and password required" });
        const existing = await Admin.findOne({ adminId });
        if (existing) return res.status(409).json({ message: "Admin ID already exists" });
        const newAdmin = new Admin({ adminId, password, role: "admin" });
        await newAdmin.save();
        res.status(200).json({ message: "Admin created successfully", adminId });
    } catch (err) {
        next(err);
    }
});

app.get("/owner/admins", requireOwner, async (req, res, next) => {
    try {
        const admins = await Admin.find({ role: "admin" });
        res.json(admins);
    } catch (err) {
        next(err);
    }
});

app.get("/owner/all-products", requireOwner, async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        next(err);
    }
});

app.get("/owner/all-orders", requireOwner, async (req, res, next) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

app.post("/owner/change-credentials", requireOwner, async (req, res, next) => {
    try {
        const { newAdminId, newPassword } = req.body;
        if (!newAdminId || !newPassword) {
            return res.status(400).json({ message: "New Owner ID and password are required" });
        }

        const existing = await Admin.findOne({ adminId: newAdminId });
        if (existing && existing.role !== "owner") {
            return res.status(409).json({ message: "Admin ID already exists" });
        }

        const ownerDoc = req.admin;
        if (ownerDoc) {
            ownerDoc.adminId = newAdminId;
            ownerDoc.password = newPassword;
            await ownerDoc.save();
        }
        res.status(200).json({ message: "Owner credentials updated successfully", adminId: newAdminId });
    } catch (err) {
        next(err);
    }
});

app.post("/owner/toggle-admin-status", requireOwner, async (req, res, next) => {
    try {
        const { adminId, isActive } = req.body;
        if (!adminId || isActive === undefined) {
            return res.status(400).json({ message: "Admin ID and active status required" });
        }

        await Admin.updateOne({ adminId, role: "admin" }, { isActive });
        res.status(200).json({ message: `Admin status set to ${isActive}` });
    } catch (err) {
        next(err);
    }
});

app.post("/owner/update-admin", requireOwner, async (req, res, next) => {
    try {
        const { adminId, newAdminId, newPassword } = req.body;
        if (!adminId || !newAdminId || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await Admin.findOne({ adminId: newAdminId });
        if (existing && existing.adminId !== adminId) {
            return res.status(409).json({ message: "Admin ID already exists" });
        }

        const adminDoc = await Admin.findOne({ adminId, role: "admin" });
        if (adminDoc) {
            adminDoc.adminId = newAdminId;
            adminDoc.password = newPassword;
            await adminDoc.save();
        }

        if (newAdminId !== adminId) {
            await Product.updateMany({ createdBy: adminId }, { createdBy: newAdminId });
            await Order.updateMany({ adminId: adminId }, { adminId: newAdminId });
        }

        res.status(200).json({ message: "Admin updated successfully" });
    } catch (err) {
        next(err);
    }
});

app.delete("/owner/delete-admin/:adminId", requireOwner, async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        await Admin.deleteOne({ adminId, role: "admin" });
        res.status(200).json({ message: "Admin account deleted" });
    } catch (err) {
        next(err);
    }
});

// Blogs
app.get("/blogs", async (req, res, next) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        next(err);
    }
});

app.post("/owner/blogs", requireOwner, async (req, res, next) => {
    try {
        const { title, content, tag } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        let photoUrl = "";
        if (req.files && req.files.photo) {
            const uploadResult = await cloudinary.uploader.upload(req.files.photo.tempFilePath);
            photoUrl = uploadResult.secure_url;
        }

        const newBlog = new Blog({
            title,
            content,
            tag: tag || "Kulfi",
            photo: photoUrl
        });

        await newBlog.save();
        res.status(200).json({ message: "Blog post created successfully", blog: newBlog });
    } catch (err) {
        next(err);
    }
});

app.delete("/owner/blogs/:id", requireOwner, async (req, res, next) => {
    try {
        const deleted = await Blog.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (err) {
        next(err);
    }
});

// Complaints
app.post("/submitComplaint", async (req, res, next) => {
    try {
        const { orderId, customerMobileNumber, productName, complaintText } = req.body;
        if (!orderId || !customerMobileNumber || !productName || !complaintText) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const complaint = await Complaint.create({
            orderId,
            customerMobileNumber,
            productName,
            complaintText
        });

        res.status(200).json({ message: "Complaint filed successfully", complaint });
    } catch (err) {
        next(err);
    }
});

app.get("/orderComplaints/:orderId", async (req, res, next) => {
    try {
        const list = await Complaint.find({ orderId: req.params.orderId });
        res.json(list);
    } catch (err) {
        next(err);
    }
});

app.get("/admin/allComplaints", requireAdmin, async (req, res, next) => {
    try {
        const list = await Complaint.find({}).sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        next(err);
    }
});

app.put("/updateComplaintStatus/:id", requireAdmin, async (req, res, next) => {
    try {
        const { status } = req.body;
        const updated = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) return res.status(404).json({ message: "Complaint not found." });
        res.status(200).json({ message: "Status updated", complaint: updated });
    } catch (err) {
        next(err);
    }
});

app.get("/orderStatusfilter", requireAdmin, async (req, res, next) => {
    try {
        let { fromDate, toDate } = req.query;
        const adminId = req.headers["x-admin-id"];

        let dateFilter = {
            orderDate: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate + "T23:59:59.999Z")
            }
        };

        let query;
        if (adminId) {
            query = {
                ...dateFilter,
                $or: [{ adminId: adminId }, ...(adminId === "admin" ? [{ adminId: { $exists: false } }, { adminId: null }] : [])]
            };
        } else {
            query = dateFilter;
        }

        const response = await Order.find(query);
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
});

// Seed Owner account on startup
async function seedOwner() {
    try {
        let owner = await Admin.findOne({ role: "owner" });
        if (!owner) {
            owner = new Admin({ adminId: "owner", password: "owner@123", role: "owner" });
            await owner.save();
            console.log("✅ Owner account seeded  →  ID: owner  |  Pass: owner@123");
        }
    } catch (e) {
        console.error("Owner seed error:", e.message);
    }
}
db.once("open", seedOwner);

// Fallback 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "../frontend/404.html"), (err) => {
        if (err) res.status(404).send("Page Not Found");
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Express caught unhandled runtime error:", err.stack || err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

app.listen(port, () => {
    console.log(`===================================================`);
    console.log(`Himalaya Kulfi Server running on port ${port}`);
    console.log(`URL: http://localhost:${port}`);
    console.log(`===================================================`);
});