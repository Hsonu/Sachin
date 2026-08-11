const express = require("express");
const router = express.Router();
const { initiatePayment, paymentSuccess, paymentFailure } = require("../controllers/paymentController");

// Initiate payment redirect (form-post)
router.post("/initiate", initiatePayment);

// PayU success callback redirect URL
router.post("/success", paymentSuccess);

// PayU failure callback redirect URL
router.post("/failure", paymentFailure);

module.exports = router;
