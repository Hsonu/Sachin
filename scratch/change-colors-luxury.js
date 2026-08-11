const fs = require("fs");
const path = require("path");

const frontendDir = path.join(__dirname, "..", "frontend");
const adminDir = path.join(__dirname, "..", "adminPanel");

const colorReplacements = [
    [/#2E5A44/gi, "#1B4332"], // Primary Deep Cardamom Emerald
    [/Pista Green/gi, "Royal Cardamom Emerald"],
    [/#1F3F2F/gi, "#0F291E"], // Dark Cardamom
    [/Dark Green/gi, "Dark Emerald"],
    [/#FF9933/gi, "#C5A880"], // Accent Champagne Gold
    [/Saffron Accent/gi, "Champagne Gold Accent"],
    [/#FCF8F2/gi, "#FAF6F0"], // Vanilla Almond Cream background
    [/Cream White Background/gi, "Vanilla Almond Cream"],
    [/#3D2314/gi, "#2C1E15"], // Chai Spice Dark
    [/Dark Chocolate Brown/gi, "Chai Spice Dark"],
    [/#4E3120/gi, "#3A271C"],
    [/#5F3F2C/gi, "#4A3527"],
    [/#8E7A6E/gi, "#8C7769"],
    [/#E6D7C3/gi, "#E2D5C1"]
];

function refactorFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf8");
    let original = content;

    for (let r of colorReplacements) {
        content = content.replace(r[0], r[1]);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ Color Refactored: ${path.basename(filePath)}`);
    }
}

// Process frontend HTML files
console.log("--- Refactoring Frontend Colors to Luxury Cardamom & Gold ---");
const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith(".html"));
for (let file of htmlFiles) {
    refactorFile(path.join(frontendDir, file));
}

// Process admin panel HTML files
console.log("\n--- Refactoring Admin Panel Colors to Luxury Cardamom & Gold ---");
refactorFile(path.join(adminDir, "Dashboard.html"));
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

// Process admin CSS file
const adminCssPath = path.join(adminDir, "order", "admin.css");
if (fs.existsSync(adminCssPath)) {
    refactorFile(adminCssPath);
}

console.log("\n✨ Luxury Color Swapping Completed.");
