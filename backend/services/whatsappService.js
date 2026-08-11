const https = require("https");
const querystring = require("querystring");

/**
 * Send WhatsApp order notification
 * @param {string} toPhone Customer or admin mobile number
 * @param {string} messageText Notification body text
 * @returns {Promise<object>} Status of sending
 */
async function sendWhatsAppSMS(toPhone, messageText) {
    console.log(`[WhatsApp Service] Attempting to send message to ${toPhone}: "${messageText}"`);

    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

    // 1. Twilio Integration (recommended for real-world)
    if (twilioSid && twilioAuthToken) {
        return new Promise((resolve) => {
            const formattedTo = toPhone.startsWith("whatsapp:") ? toPhone : `whatsapp:${toPhone.startsWith("+") ? toPhone : "+91" + toPhone}`;
            const postData = querystring.stringify({
                To: formattedTo,
                From: twilioFrom,
                Body: messageText
            });

            const auth = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString("base64");
            const options = {
                hostname: "api.twilio.com",
                port: 443,
                path: `/2010-04-01/Accounts/${twilioSid}/Messages.json`,
                method: "POST",
                headers: {
                    "Authorization": `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let body = "";
                res.on("data", (chunk) => { body += chunk; });
                res.on("end", () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log("✅ WhatsApp message sent via Twilio successfully.");
                        resolve({ success: true, service: "twilio", status: res.statusCode });
                    } else {
                        console.error(`❌ Twilio API Error status ${res.statusCode}:`, body);
                        resolve({ success: false, service: "twilio", status: res.statusCode, error: body });
                    }
                });
            });

            req.on("error", (err) => {
                console.error("❌ Failed to send WhatsApp via Twilio:", err.message);
                resolve({ success: false, error: err.message });
            });

            req.write(postData);
            req.end();
        });
    }

    // 2. CallMeBot Integration (convenient free alternative)
    const callmebotApiKey = process.env.CALLMEBOT_API_KEY;
    if (callmebotApiKey) {
        return new Promise((resolve) => {
            const formattedTo = toPhone.replace(/\D/g, "");
            const encodedText = encodeURIComponent(messageText);
            const path = `/whatsapp.php?phone=${formattedTo}&text=${encodedText}&apikey=${callmebotApiKey}`;

            const options = {
                hostname: "api.callmebot.com",
                port: 443,
                path: path,
                method: "GET"
            };

            const req = https.request(options, (res) => {
                let body = "";
                res.on("data", (chunk) => { body += chunk; });
                res.on("end", () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log("✅ WhatsApp message sent via CallMeBot successfully.");
                        resolve({ success: true, service: "callmebot" });
                    } else {
                        console.error(`❌ CallMeBot API Error status ${res.statusCode}:`, body);
                        resolve({ success: false, service: "callmebot", error: body });
                    }
                });
            });

            req.on("error", (err) => {
                console.error("❌ Failed to send WhatsApp via CallMeBot:", err.message);
                resolve({ success: false, error: err.message });
            });

            req.end();
        });
    }

    console.warn("⚠️ WhatsApp service not sent: Credentials missing in .env.");
    return { success: false, reason: "No WhatsApp credentials configured" };
}

module.exports = {
    sendWhatsAppSMS
};
