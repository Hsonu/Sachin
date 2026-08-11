const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

// Authenticate customer via JWT
const requireUser = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.headers["x-session-token"]) {
            // Support session token mapping if passed
            token = req.headers["x-session-token"];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_jwt_key_here");
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }
            next();
        } catch (err) {
            console.error("JWT token verification failed:", err.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    } catch (err) {
        next(err);
    }
};

// Enforce admin access (header-based to support admin dashboard)
const requireAdmin = async (req, res, next) => {
    const adminId = req.headers["x-admin-id"];
    const sessionToken = req.headers["x-session-token"];

    if (!adminId || !sessionToken) {
        return res.status(401).json({ message: "Unauthorized: Admin credentials and session token required." });
    }

    try {
        const admin = await Admin.findOne({ adminId });
        if (!admin) {
            return res.status(403).json({ message: "Forbidden: Invalid Admin ID." });
        }
        if (admin.isActive === false) {
            return res.status(403).json({ message: "Forbidden: Admin account is deactivated." });
        }
        if (admin.currentSessionToken !== sessionToken) {
            return res.status(401).json({ message: "Session expired or logged in from another device." });
        }
        req.admin = admin;
        next();
    } catch (err) {
        next(err);
    }
};

// Enforce owner access (header-based to support owner dashboard)
const requireOwner = async (req, res, next) => {
    const ownerId = req.headers["x-owner-id"] || req.headers["x-admin-id"];
    const sessionToken = req.headers["x-session-token"];

    if (!ownerId || !sessionToken) {
        return res.status(401).json({ message: "Unauthorized: Owner credentials and session token required." });
    }

    try {
        const admin = await Admin.findOne({ adminId: ownerId, role: "owner" });
        if (!admin) {
            return res.status(403).json({ message: "Access denied. Owner only." });
        }
        if (admin.currentSessionToken !== sessionToken) {
            return res.status(401).json({ message: "Session expired or logged in from another device." });
        }
        req.admin = admin;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    requireUser,
    requireAdmin,
    requireOwner
};
