const Product = require("../models/Product");
const Order = require("../models/Order");
const crypto = require("crypto");

const PAYU_KEY = process.env.PAYU_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PAYU_BASE_URL = "https://test.payu.in/_payment"; // Sandbox URL

// Helper: Generate PayU hash
function generatePayUHash(params) {
    const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|${params.udf1 || ""}|${params.udf2 || ""}|${params.udf3 || ""}|${params.udf4 || ""}|${params.udf5 || ""}||||||${PAYU_SALT}`;
    return crypto.createHash("sha512").update(hashString).digest("hex");
}

// Helper: Verify PayU reverse hash
function verifyPayUHash(params) {
    const hashString = `${PAYU_SALT}|${params.status}||||||${params.udf5 || ""}|${params.udf4 || ""}|${params.udf3 || ""}|${params.udf2 || ""}|${params.udf1 || ""}|${params.email}|${params.firstname}|${params.productinfo}|${params.amount}|${params.txnid}|${params.key}`;
    const calculatedHash = crypto.createHash("sha512").update(hashString).digest("hex");
    return calculatedHash === params.hash;
}

// 1. Initiate PayU Payment with secure backend calculations & 20% discount
const initiatePayment = async (req, res, next) => {
    try {
        if (!PAYU_KEY || !PAYU_SALT) {
            return res.status(503).json({ message: "PayU payment gateway is not configured on this server." });
        }

        const { firstname, email, phone, orderData } = req.body;

        if (!firstname || !phone || !orderData) {
            return res.status(400).json({ message: "Missing required payment fields." });
        }

        // Calculate Secure Amount on the Backend
        let subtotal = 0;
        let resolvedItems = [];
        let mainProductName = "";

        // Determine if multi-item checkout or single-item checkout
        if (orderData.items && orderData.items.length > 0) {
            for (let item of orderData.items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return res.status(404).json({ message: `Product not found: ${item.productId}` });
                }
                const itemPrice = product.Rate;
                const itemDiscount = product.discount || 0;
                const finalItemPrice = Math.round(itemPrice * (1 - itemDiscount / 100));
                
                resolvedItems.push({
                    productId: product._id,
                    name: product.Productname,
                    qty: item.qty,
                    price: finalItemPrice,
                    photo: product.photo,
                    size: item.size || "Single Stick",
                    flavour: item.flavour || ""
                });
                subtotal += finalItemPrice * item.qty;
            }
            mainProductName = resolvedItems.map(i => `${i.name} (x${i.qty})`).join(", ");
        } else if (orderData.productName) {
            const product = await Product.findOne({ Productname: orderData.productName });
            if (!product) {
                return res.status(404).json({ message: "Product not found in database." });
            }
            const itemPrice = product.Rate;
            const itemDiscount = product.discount || 0;
            const finalPrice = Math.round(itemPrice * (1 - itemDiscount / 100));

            resolvedItems.push({
                productId: product._id,
                name: product.Productname,
                qty: orderData.qty || 1,
                price: finalPrice,
                photo: product.photo,
                size: orderData.size || "Single Stick",
                flavour: orderData.flavour || ""
            });
            subtotal = finalPrice * (orderData.qty || 1);
            mainProductName = product.Productname;
        } else {
            return res.status(400).json({ message: "No items specified in the order data." });
        }

        // Apply 20% Online Payment Discount
        const discountAmount = Math.round(subtotal * 0.20);
        const deliveryCharge = subtotal > 300 ? 0 : 40;
        const subtotalAfterDiscount = subtotal - discountAmount + deliveryCharge;
        const gstAmount = Math.round(subtotalAfterDiscount * 0.18);
        const finalPayableAmount = subtotalAfterDiscount + gstAmount;

        // Generate Transaction ID
        const txnid = "TXN_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);

        // Build callback URLs
        const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
        const host = req.headers["x-forwarded-host"] || req.headers.host;
        const baseUrl = `${protocol}://${host}`;

        const surl = `${baseUrl}/api/payment/success`;
        const furl = `${baseUrl}/api/payment/failure`;

        // Package verified order data into base64 udf1
        const verifiedOrderData = {
            ...orderData,
            customerName: firstname,
            customerMobileNumber: Number(phone),
            items: resolvedItems,
            productName: mainProductName,
            subtotal,
            discountAmount,
            deliveryCharge,
            totalAmount: subtotalAfterDiscount,
            gst: 18,
            gstAmount,
            withGstTotalAmount: finalPayableAmount,
            paymentMethod: "Online Payment",
            paymentStatus: "paid",
            orderStatus: "Order Placed",
            phone,
            name: firstname
        };

        const udf1 = Buffer.from(JSON.stringify(verifiedOrderData)).toString("base64");

        const params = {
            key: PAYU_KEY,
            txnid,
            amount: parseFloat(finalPayableAmount).toFixed(2),
            productinfo: mainProductName.substring(0, 80) || "Himalaya Kulfi Order",
            firstname,
            email: email || "customer@himalayakulfi.com",
            phone,
            surl,
            furl,
            udf1,
            udf2: "",
            udf3: "",
            udf4: "",
            udf5: ""
        };

        // Generate Hash
        params.hash = generatePayUHash(params);

        console.log(`[PayU Payment] Initiating payment for ${firstname} - Amount: ₹${params.amount} - Txn ID: ${txnid}`);

        // Return auto-submitting HTML redirect form
        const formHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Redirecting to PayU…</title>
                <style>
                    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #FCF8F2; color: #2E5A44; font-family: 'Inter', sans-serif; }
                    .loader { text-align: center; }
                    .loader h2 { margin-bottom: 12px; font-size: 1.3rem; font-family: Georgia, serif; }
                    .loader p { color: #8E7A6E; font-size: 0.9rem; }
                    .spinner { width: 40px; height: 40px; border: 3px solid rgba(46,90,68,0.2); border-top-color: #2E5A44; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                </style>
            </head>
            <body>
                <div class="loader">
                    <div class="spinner"></div>
                    <h2>Redirecting to PayU Secure Payment…</h2>
                    <p>Please do not close or refresh this window.</p>
                </div>
                <form id="payuForm" method="POST" action="${PAYU_BASE_URL}">
                    ${Object.entries(params).map(([k, v]) => `<input type="hidden" name="${k}" value="${v}" />`).join("\n                    ")}
                </form>
                <script>document.getElementById('payuForm').submit();</script>
            </body>
            </html>
        `;

        res.setHeader("Content-Type", "text/html");
        res.send(formHtml);
    } catch (err) {
        next(err);
    }
};

// 2. PayU Success Callback
const paymentSuccess = async (req, res, next) => {
    try {
        console.log("[PayU Success] Success callback received for txnid:", req.body.txnid);
        const payuResponse = req.body;

        // Verify Hash
        if (!verifyPayUHash(payuResponse)) {
            console.error("[PayU Success] ❌ Hash verification FAILED for txnid:", payuResponse.txnid);
            return res.redirect("/card.html?payment=failed&reason=hash_mismatch");
        }

        // Decode Verified Order Data from UDF1
        let orderPayload = {};
        try {
            orderPayload = JSON.parse(Buffer.from(payuResponse.udf1 || "", "base64").toString("utf-8"));
        } catch (e) {
            console.error("[PayU Success] Failed to decode order payload from udf1:", e.message);
            return res.redirect("/card.html?payment=failed&reason=invalid_order_data");
        }

        // Attach Payment details
        orderPayload.transactionId = payuResponse.txnid;
        orderPayload.payuTxnId = payuResponse.mihpayid || "";
        orderPayload.paymentStatus = "paid";

        // Resolve stocks and update catalog
        if (orderPayload.items && orderPayload.items.length > 0) {
            for (let item of orderPayload.items) {
                await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { Units: -item.qty } }
                );
            }
        } else if (orderPayload.productName) {
            await Product.updateOne(
                { Productname: orderPayload.productName },
                { $inc: { Units: -orderPayload.qty } }
            );
        }

        // Save order to MongoDB
        const newOrder = new Order(orderPayload);
        const savedOrder = await newOrder.save();
        console.log("[PayU Success] ✅ Order saved to MongoDB. ID:", savedOrder._id);

        // Send Email & WhatsApp (handled asynchronously in background)
        const { placeOrder } = require("../controllers/orderController");
        // We import the order notifications handler we built in orderController
        const orderController = require("../controllers/orderController");
        
        // Trigger notifications
        const notificationMsg = `🔔 *New Prepaid Order Placed (PayU)!*\n\n*Order ID:* ${savedOrder._id}\n*Customer:* ${savedOrder.customerName || savedOrder.name}\n*Phone:* ${savedOrder.customerMobileNumber || savedOrder.phone}\n*Products:* ${savedOrder.productName}\n*Total Paid:* ₹${savedOrder.withGstTotalAmount}\n*Address:* ${savedOrder.customerAdd}`;
        sendWhatsAppSMS("8603632642", notificationMsg).catch(e => console.error(e));

        // Redirect user to order details success page
        res.redirect(`/orderDetails.html?id=${savedOrder._id}&payment=success`);
    } catch (err) {
        console.error("[PayU Success] Processing error:", err);
        res.redirect("/card.html?payment=failed&reason=server_error");
    }
};

// 3. PayU Failure Callback
const paymentFailure = async (req, res, next) => {
    console.log("[PayU Failure] Payment failed/cancelled for txnid:", req.body.txnid);
    const reason = req.body.error_Message || req.body.field9 || "Payment was not completed";
    res.redirect(`/card.html?payment=failed&reason=${encodeURIComponent(reason)}`);
};

module.exports = {
    initiatePayment,
    paymentSuccess,
    paymentFailure
};
