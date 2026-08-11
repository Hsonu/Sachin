const https = require('https');

const PING_URL = process.env.PING_URL || 'https://sachin-nhmy.onrender.com';

function pingUrl() {
    https.get(PING_URL, (res) => {
        console.log(`[Ping] Request sent to ${PING_URL}. Status Code: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`[Ping] Error sending request to ${PING_URL}:`, err.message);
    });
}

// Ping immediately on start
pingUrl();

// Ping every 5 minutes (5 * 60 * 1000 = 300000 milliseconds)
setInterval(pingUrl, 300000);

