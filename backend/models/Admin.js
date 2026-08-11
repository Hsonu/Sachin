const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    adminId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "owner"],
        default: "admin"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    currentSessionToken: {
        type: String,
        default: ""
    }
});

// Pre-save hook to hash password
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
