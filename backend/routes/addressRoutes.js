const express = require("express");
const router = express.Router();
const { saveAddress, getAddresses, updateAddressByPhone, deleteAddress } = require("../controllers/addressController");
const { requireUser } = require("../middleware/authMiddleware");

// Optional auth wrapper: passes User if logged in
const optionalUser = async (req, res, next) => {
    try {
        const { requireUser } = require("../middleware/authMiddleware");
        await requireUser(req, res, (err) => {
            next();
        });
    } catch (e) {
        next();
    }
};

router.post("/", optionalUser, saveAddress);
router.get("/", optionalUser, getAddresses);
router.put("/:phone", updateAddressByPhone);
router.delete("/:id", deleteAddress);

module.exports = router;
