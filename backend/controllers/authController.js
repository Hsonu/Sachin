const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "your_secret_jwt_key_here", {
        expiresIn: "30d"
    });
};

// Register new customer
const registerUser = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        // Check if user exists by email
        const userExistsByEmail = await User.findOne({ email });
        if (userExistsByEmail) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Check if user exists by phone
        const userExistsByPhone = await User.findOne({ phone });
        if (userExistsByPhone) {
            return res.status(400).json({ message: "User with this mobile number already exists" });
        }

        const newUser = await User.create({
            name,
            email,
            phone,
            password
        });

        if (newUser) {
            res.status(201).json({
                success: true,
                token: generateToken(newUser._id),
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                    savedAddresses: newUser.savedAddresses
                }
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (err) {
        next(err);
    }
};

// Login customer
const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body; // username can be email or phone
        
        if (!username || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        // Find by email or phone
        const query = username.includes("@") ? { email: username.toLowerCase().trim() } : { phone: username.trim() };
        const user = await User.findOne(query);

        if (user && (await user.comparePassword(password))) {
            res.status(200).json({
                success: true,
                token: generateToken(user._id),
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    savedAddresses: user.savedAddresses
                }
            });
        } else {
            res.status(401).json({ message: "Invalid email/mobile number or password" });
        }
    } catch (err) {
        next(err);
    }
};

// Get current user profile
const getUserProfile = async (req, res, next) => {
    try {
        // req.user is attached by requireUser middleware
        res.status(200).json(req.user);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
