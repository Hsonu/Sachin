const fs = require("fs");
const path = require("path");

const frontendDir = path.join(__dirname, "..", "frontend");
const adminDir = path.join(__dirname, "..", "adminPanel");

const copyReplacements = [
    // Meta descriptions
    [
        /Discover the finest premium imitation & fashion kulfi at Himalaya Kulfi\. Shop rings, necklaces, bangles and more with free delivery\./gi,
        "Discover the finest premium traditional Indian kulfi & desserts at Himalaya Kulfi. Freshly frozen and delivered directly to your doorstep."
    ],
    [
        /Browse the complete Himalaya Kulfi collection\. Discover handcrafted gold, diamond & platinum rings, necklaces, bangles and more\./gi,
        "Browse the complete Himalaya Kulfi collection. Discover premium handcrafted kulfis, matka cups, faloodas, and traditional Indian desserts."
    ],
    [
        /View product details, pricing and buy handcrafted kulfi from Himalaya Kulfi\. Gold, diamond & platinum pieces crafted with love\./gi,
        "View product details, pricing, and order premium traditional kulfis from Himalaya Kulfi."
    ],
    // Header Logo & Tagline
    [
        /Himalaya\s*Kulfi\s*<br\s*class="mobile-br">\s*Jewels/gi,
        "Himalaya Kulfi<br class=\"mobile-br\">Desserts"
    ],
    [
        /Himalaya\s*Kulfi\s*Jewels/gi,
        "Himalaya Kulfi Desserts"
    ],
    [
        /<span class="brand-tagline">Timeless Beauty<\/span>/gi,
        "<span class=\"brand-tagline\">Pure Royal Tradition</span>"
    ],
    [
        /Timeless Beauty/gi,
        "Pure Royal Tradition"
    ],
    // Hero Text
    [
        /<h1>Crafted for <em>Eternity<\/em>,<br>Worn with Grace<\/h1>/gi,
        "<h1>Pure Indian <em>Tradition<\/em>,<br>Frozen to Perfection<\/h1>"
    ],
    [
        /Crafted for Eternity, Worn with Grace/gi,
        "Pure Indian Tradition, Frozen to Perfection"
    ],
    [
        /Discover our premium imitation & fashion kulfi — where every piece tells a story\./gi,
        "Experience the royal taste of authentic Indian kulfis, handcrafted with reduced fresh milk & rich dry fruits."
    ],
    // Footer & other copy leftovers
    [
        /premium imitation & fashion kulfi/gi,
        "premium traditional kulfis & desserts"
    ],
    [
        /imitation & fashion kulfi/gi,
        "traditional kulfis & desserts"
    ],
    [
        /where every piece tells a story\./gi,
        "where every bite brings pure joy."
    ],
    [
        /imitation\/fashion kulfi/gi,
        "traditional kulfi"
    ],
    [
        /imitation kulfi/gi,
        "traditional kulfi"
    ],
    [
        /We believe every woman deserves kulfi that makes her feel extraordinary\./gi,
        "Delivering royal Indian kulfi and traditional desserts frozen to perfection."
    ]
];

function refactorFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf8");
    let original = content;

    for (let r of copyReplacements) {
        content = content.replace(r[0], r[1]);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ Copy Refactored: ${path.basename(filePath)}`);
    }
}

console.log("--- Cleaning Up Leftover Jewelry Copy ---");
const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith(".html"));
for (let file of htmlFiles) {
    refactorFile(path.join(frontendDir, file));
}

const adminSubDirs = ["order", "owner"];
for (let sub of adminSubDirs) {
    const subPath = path.join(adminDir, sub);
    if (fs.existsSync(subPath)) {
        const subFiles = fs.readdirSync(subPath).filter(f => f.endsWith(".html"));
        for (let file of subFiles) {
            refactorFile(path.join(subPath, file));
        }
    }
}
refactorFile(path.join(adminDir, "Dashboard.html"));

console.log("✨ Copy cleanup completed successfully!");
