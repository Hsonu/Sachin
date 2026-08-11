const Order = require("../models/Order");
const Product = require("../models/Product");
const DeliveryArea = require("../models/DeliveryArea");
const { sendWhatsAppSMS } = require("../services/whatsappService");
const nodemailer = require("nodemailer");

// Create Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Helper: Send email notification to Admin & Customer
const sendOrderNotifications = async (savedOrder) => {
    const adminEmail = process.env.SMTP_USER || "sonurajsonuraj4515@gmail.com";
    const targetWhatsApp = "8603632642"; // Default admin notification phone

    // Build items list HTML
    let itemsHtml = "";
    let itemsText = "";
    if (savedOrder.items && savedOrder.items.length > 0) {
        savedOrder.items.forEach(item => {
            itemsHtml += `<tr><td style="padding:8px;border:1px solid #ddd;">${item.name} (${item.flavour || 'Standard'}, ${item.size || 'Single'})</td><td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.qty}</td><td style="padding:8px;border:1px solid #ddd;text-align:right;">₹${item.price}</td></tr>`;
            itemsText += `\n- ${item.name} (${item.qty} x ₹${item.price})`;
        });
    } else {
        itemsHtml = `<tr><td style="padding:8px;border:1px solid #ddd;">${savedOrder.productName}</td><td style="padding:8px;border:1px solid #ddd;text-align:center;">${savedOrder.qty}</td><td style="padding:8px;border:1px solid #ddd;text-align:right;">₹${savedOrder.rate}</td></tr>`;
        itemsText = `\n- ${savedOrder.productName} (${savedOrder.qty} x ₹${savedOrder.rate})`;
    }

    const totalDisplay = (savedOrder.withGstTotalAmount || savedOrder.totalAmount).toLocaleString("en-IN");

    // 1. Send Email Notification
    const emailSubject = `Himalaya Kulfi - New Order Placed: ${savedOrder._id}`;
    const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #2E5A44; padding: 20px; border-radius: 8px; background-color: #FCF8F2;">
            <h2 style="color: #2E5A44; text-align: center; border-bottom: 2px solid #2E5A44; padding-bottom: 10px; font-family: Georgia, serif;">New Dessert Order Received!</h2>
            <p>Hello Admin,</p>
            <p>A new order has been placed on <strong>Himalaya Kulfi</strong>. Here are the details:</p>
            
            <h3 style="color: #3D2314;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                    <tr style="background-color: #2E5A44; color: white;">
                        <th style="padding:8px;text-align:left;">Product</th>
                        <th style="padding:8px;text-align:center;">Qty</th>
                        <th style="padding:8px;text-align:right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr style="background-color: #f9f9f9;"><th style="text-align:left;padding:8px;border:1px solid #ddd;">Order ID</th><td style="padding:8px;border:1px solid #ddd;">${savedOrder._id}</td></tr>
                <tr><th style="text-align:left;padding:8px;border:1px solid #ddd;">Customer</th><td style="padding:8px;border:1px solid #ddd;">${savedOrder.customerName || savedOrder.name}</td></tr>
                <tr style="background-color: #f9f9f9;"><th style="text-align:left;padding:8px;border:1px solid #ddd;">Mobile</th><td style="padding:8px;border:1px solid #ddd;">${savedOrder.customerMobileNumber || savedOrder.phone}</td></tr>
                <tr><th style="text-align:left;padding:8px;border:1px solid #ddd;">Payment Method</th><td style="padding:8px;border:1px solid #ddd;">${savedOrder.paymentMethod}</td></tr>
                <tr style="background-color: #f9f9f9;"><th style="text-align:left;padding:8px;border:1px solid #ddd;">Discount Applied</th><td style="padding:8px;border:1px solid #ddd;color:#e63946;">₹${savedOrder.discountAmount || 0}</td></tr>
                <tr><th style="text-align:left;padding:8px;border:1px solid #ddd;">Final Amount</th><td style="padding:8px;border:1px solid #ddd;font-weight:bold;color:#2E5A44;">₹${totalDisplay}</td></tr>
                <tr style="background-color: #f9f9f9;"><th style="text-align:left;padding:8px;border:1px solid #ddd;">Delivery Address</th><td style="padding:8px;border:1px solid #ddd;">${savedOrder.customerAdd}</td></tr>
            </table>
            
            <p style="margin-top: 20px; font-size: 0.9em; color: #8E7A6E; text-align: center;">Himalaya Kulfi E-Commerce Order System</p>
        </div>
    `;

    transporter.sendMail({
        from: process.env.SMTP_USER || "sonurajsonuraj4515@gmail.com",
        to: adminEmail,
        subject: emailSubject,
        html: emailHtml
    }).then(() => console.log(`✅ Order notification email sent to ${adminEmail}`))
      .catch(err => console.error("❌ Failed to send email notification:", err.message));

    // 2. Send WhatsApp Notification
    const whatsappMsg = `🔔 *New Himalaya Kulfi Order Received!*\n\n*Order ID:* ${savedOrder._id}\n*Customer:* ${savedOrder.customerName || savedOrder.name}\n*Phone:* ${savedOrder.customerMobileNumber || savedOrder.phone}\n*Products:*${itemsText}\n*Final Amount:* ₹${totalDisplay}\n*Payment Method:* ${savedOrder.paymentMethod}\n*Address:* ${savedOrder.customerAdd}`;
    sendWhatsAppSMS(targetWhatsApp, whatsappMsg);
};

// Place Order
const placeOrder = async (req, res, next) => {
    try {
        const {
            customerName,
            customerMobileNumber,
            customerAdd,
            paymentMethod,
            items, // array of items: { productId, qty, size, flavour }
            pincode,
            // Fallback parameters for single-product orders
            productName,
            rate,
            qty,
            photo,
            description
        } = req.body;

        const activePhone = customerMobileNumber || req.body.phone || req.body.useNumber;
        const activeName = customerName || req.body.name;
        
        if (!activePhone) {
            return res.status(401).json({ message: "Please log in to place an order." });
        }

        // Validate Serviceable Pincode
        if (pincode) {
            const serviceable = await DeliveryArea.findOne({ pincode, isServiceable: true });
            if (!serviceable) {
                // Default fallback check
                if (pincode !== "802133") {
                    return res.status(400).json({ message: `We do not deliver to pincode ${pincode} yet.` });
                }
            }
        }

        let orderItems = [];
        let subtotal = 0;
        let adminId = "admin";
        let mainPhoto = photo || "";
        let mainProductName = productName || "";
        let mainRate = rate || 0;
        let mainQty = qty || 1;

        // 1. Process Multi-Item Checkout Cart
        if (items && items.length > 0) {
            for (let item of items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return res.status(404).json({ message: `Product ${item.name || item.productId} not found.` });
                }
                if (product.Units < item.qty) {
                    return res.status(400).json({ message: `Insufficient stock for ${product.Productname}. Only ${product.Units} available.` });
                }

                // Deduct Stock
                product.Units -= item.qty;
                await product.save();

                const itemPrice = product.Rate;
                const itemDiscount = product.discount || 0;
                const itemFinalPrice = Math.round(itemPrice * (1 - itemDiscount / 100));

                orderItems.push({
                    productId: product._id,
                    name: product.Productname,
                    qty: item.qty,
                    price: itemFinalPrice,
                    photo: product.photo,
                    size: item.size || "Single Stick",
                    flavour: item.flavour || product.flavour || ""
                });

                subtotal += itemFinalPrice * item.qty;
                if (product.createdBy) {
                    adminId = product.createdBy;
                }
            }

            // Set main fields (for backwards compatibility displays)
            if (orderItems.length > 0) {
                mainProductName = orderItems.map(i => `${i.name} (x${i.qty})`).join(", ");
                mainPhoto = orderItems[0].photo;
                mainRate = orderItems[0].price;
                mainQty = orderItems.reduce((acc, curr) => acc + curr.qty, 0);
            }
        } 
        // 2. Process Single Product Checkout (legacy compatibility)
        else if (mainProductName) {
            const product = await Product.findOne({ Productname: mainProductName });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            if (product.Units < mainQty) {
                return res.status(400).json({ message: `Insufficient stock. Only ${product.Units} units available.` });
            }

            // Deduct Stock
            product.Units -= mainQty;
            await product.save();

            const itemPrice = product.Rate;
            const itemDiscount = product.discount || 0;
            const itemFinalPrice = Math.round(itemPrice * (1 - itemDiscount / 100));

            orderItems.push({
                productId: product._id,
                name: product.Productname,
                qty: mainQty,
                price: itemFinalPrice,
                photo: product.photo,
                size: req.body.size || "Single Stick",
                flavour: req.body.flavour || product.flavour || ""
            });

            subtotal = itemFinalPrice * mainQty;
            mainRate = itemFinalPrice;
            if (product.createdBy) {
                adminId = product.createdBy;
            }
        } else {
            return res.status(400).json({ message: "No items specified in the order." });
        }

        // Apply 20% discount if paymentMethod is Online Payment
        let discountAmount = 0;
        let isOnline = paymentMethod === "Online Payment" || paymentMethod === "PayU" || req.body.isOnlinePayment === true;
        if (isOnline) {
            discountAmount = Math.round(subtotal * 0.20);
        }

        const deliveryCharge = subtotal > 300 ? 0 : 40; // Free delivery above Rs. 300
        const finalAmountBeforeGst = subtotal - discountAmount + deliveryCharge;
        const gstAmount = Math.round(finalAmountBeforeGst * 0.18); // 18% GST standard
        const finalAmount = finalAmountBeforeGst + gstAmount;

        const orderData = {
            customerName: activeName,
            customerMobileNumber: Number(activePhone),
            customerAdd: customerAdd || req.body.address?.fullAddress || "",
            productName: mainProductName,
            rate: mainRate,
            qty: mainQty,
            photo: mainPhoto,
            description: description || "",
            items: orderItems,
            subtotal,
            discountAmount,
            deliveryCharge,
            totalAmount: finalAmountBeforeGst,
            gst: 18,
            gstAmount,
            withGstTotalAmount: finalAmount,
            paymentMethod: isOnline ? "Online Payment" : "Cash on Delivery",
            paymentStatus: isOnline ? "pending" : "pending",
            orderStatus: "Order Placed",
            adminId,
            name: activeName,
            phone: activePhone,
            email: req.body.email || "",
            address: {
                fullAddress: customerAdd || "",
                city: req.body.address?.city || "",
                state: req.body.address?.state || "",
                pinCode: pincode || req.body.address?.pinCode || ""
            }
        };

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();

        console.log(`[Order Controller] Order placed successfully: ${savedOrder._id}`);
        
        // Dispatch notifications asynchronously
        sendOrderNotifications(savedOrder).catch(e => console.error(e));

        res.status(200).json(savedOrder);
    } catch (err) {
        next(err);
    }
};

// Retrieve Orders
const getOrders = async (req, res, next) => {
    try {
        const adminId = req.headers["x-admin-id"];
        const userNumber = req.headers["x-user-number"] || (req.user ? req.user.phone : null);
        let query = {};

        if (adminId) {
            // Admin/Owner query
            query.$or = [
                { adminId: adminId },
                ...(adminId === "admin" ? [{ adminId: { $exists: false } }, { adminId: null }] : [])
            ];
        } else if (userNumber) {
            // Customer order query
            query.$or = [
                { customerMobileNumber: Number(userNumber) },
                { phone: userNumber }
            ];
        } else {
            return res.status(401).json({ message: "Unauthorized credentials." });
        }

        const orders = await Order.find(query).sort({ orderDate: -1 });
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

// Get single order details
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Validate access permissions (only customer or admin/owner)
        const adminId = req.headers["x-admin-id"];
        const userNumber = req.headers["x-user-number"] || (req.user ? req.user.phone : null);
        
        if (!adminId && userNumber) {
            const isOwnerOfOrder = String(order.phone) === String(userNumber) || String(order.customerMobileNumber) === String(userNumber);
            if (!isOwnerOfOrder) {
                return res.status(403).json({ message: "Access denied." });
            }
        }

        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

// Cancel Order (User or Admin)
const cancelOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const { reason } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        const status = (order.orderStatus || "").toLowerCase();
        if (status === "delivered" || status === "cancelled") {
            return res.status(400).json({ message: `Delivered or already cancelled orders cannot be cancelled.` });
        }

        order.orderStatus = "Cancelled";
        order.cancelReason = reason || "Cancelled by customer";
        await order.save();

        // Restore Stocks
        if (order.items && order.items.length > 0) {
            for (let item of order.items) {
                await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { Units: item.qty } }
                );
            }
        } else {
            await Product.updateOne(
                { Productname: order.productName },
                { $inc: { Units: order.qty } }
            );
        }

        res.status(200).json({ message: "Order cancelled successfully.", order });
    } catch (err) {
        next(err);
    }
};

// Update Order Status (Admin only)
const updateOrderStatus = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required." });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        const previousStatus = order.orderStatus;
        const newStatus = status;

        if (previousStatus !== newStatus) {
            const isCancelled = (s) => (s || "").toLowerCase() === "cancelled";
            
            // If transition TO Cancelled from active state -> restore stock
            if (isCancelled(newStatus) && !isCancelled(previousStatus)) {
                if (order.items && order.items.length > 0) {
                    for (let item of order.items) {
                        await Product.updateOne(
                            { _id: item.productId },
                            { $inc: { Units: item.qty } }
                        );
                    }
                } else {
                    await Product.updateOne(
                        { Productname: order.productName },
                        { $inc: { Units: order.qty } }
                    );
                }
            } 
            // If transition FROM Cancelled back to active -> check and deduct stock
            else if (!isCancelled(newStatus) && isCancelled(previousStatus)) {
                if (order.items && order.items.length > 0) {
                    for (let item of order.items) {
                        const product = await Product.findById(item.productId);
                        if (product) {
                            if (product.Units < item.qty) {
                                return res.status(400).json({ message: `Cannot change status. Insufficient stock for ${product.Productname}.` });
                            }
                            product.Units -= item.qty;
                            await product.save();
                        }
                    }
                } else {
                    const product = await Product.findOne({ Productname: order.productName });
                    if (product) {
                        if (product.Units < order.qty) {
                            return res.status(400).json({ message: `Cannot change status. Insufficient stock.` });
                        }
                        product.Units -= order.qty;
                        await product.save();
                    }
                }
            }
        }

        order.orderStatus = newStatus;
        await order.save();
        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    placeOrder,
    getOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus
};
