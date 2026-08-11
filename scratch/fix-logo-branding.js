const fs = require("fs");
const path = require("path");

const frontendDir = path.join(__dirname, "..", "frontend");
const adminDir = path.join(__dirname, "..", "adminPanel");

function refactorFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf8");
    let original = content;

    // 1. Fix spacing concatenation: "Himalaya KulfiDesserts" -> "Himalaya Kulfi Desserts" on desktop
    content = content.replace(/Himalaya\s*Kulfi\s*<br\s*class="mobile-br">\s*Desserts/gi, "Himalaya Kulfi <br class=\"mobile-br\">Desserts");

    // 2. Fix header brand name font color contrast (change from var(--gold) dark green to #C5A880 gold)
    content = content.replace(/#navLogo\s+\.brand-name\s*\{([\s\S]*?)color:\s*var\(--gold\);/gi, "#navLogo .brand-name {$1color: #C5A880;");

    if (content !== original) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ Logo Refactored: ${path.basename(filePath)}`);
    } else {
        console.log(`ℹ️ No logo changes: ${path.basename(filePath)}`);
    }
}

console.log("--- Updating Header Logo Contrast & Spacing ---");

// Process frontend HTML files
const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith(".html"));
for (let file of htmlFiles) {
    refactorFile(path.join(frontendDir, file));
}

// Process admin panel HTML files
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

console.log("\n✨ Logo branding improvements complete.");
