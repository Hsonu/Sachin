const fs = require("fs");
const path = require("path");

const frontendDir = path.join(__dirname, "..", "frontend");
const adminDir = path.join(__dirname, "..", "adminPanel");

function refactorFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf8");
    let original = content;

    // 1. Remove Site-Wide Disclaimer Banner section
    content = content.replace(/<!-- Site-Wide Disclaimer Banner -->[\s\S]*?<div class="site-wide-disclaimer"[\s\S]*?<\/div>/gi, "");
    
    // Also catch the banner if comments are slightly different or missing
    content = content.replace(/<div class="site-wide-disclaimer"[\s\S]*?<\/div>/gi, "");

    // 2. Fix .btn-primary color contrast (change text color from dark brown to white)
    content = content.replace(/\.btn-primary\s*\{([\s\S]*?)color:\s*var\(--dark\);/gi, ".btn-primary {$1color: #ffffff;");

    // 3. Fix .BuyBtn:hover color contrast
    content = content.replace(/\.BuyBtn:hover\s*\{([\s\S]*?)color:\s*var\(--dark\);/gi, ".BuyBtn:hover {$1color: #ffffff;");

    if (content !== original) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ Refactored styling: ${path.basename(filePath)}`);
    } else {
        console.log(`ℹ️ No changes needed: ${path.basename(filePath)}`);
    }
}

console.log("--- Adjusting Button Contrast & Removing Top Disclaimers ---");

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

console.log("\n✨ Button styling contrast fix & disclaimer removal complete.");
