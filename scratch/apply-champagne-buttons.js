const fs = require("fs");
const path = require("path");

const frontendDir = path.join(__dirname, "..", "frontend");
const adminDir = path.join(__dirname, "..", "adminPanel");

function refactorFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf8");
    let original = content;

    // 1. Refactor .heroCta button to Champagne Gold background and dark brown text
    content = content.replace(/\.heroCta\s*\{([\s\S]*?)background:\s*[^;]+;([\s\S]*?)color:\s*[^;]+;/gi, ".heroCta {$1background: linear-gradient(135deg, #C5A880, #B4966E);$2color: var(--dark);");

    // 2. Refactor .btn-primary button to Champagne Gold background and dark brown text
    content = content.replace(/\.btn-primary\s*\{([\s\S]*?)background:\s*[^;]+;([\s\S]*?)color:\s*[^;]+;/gi, ".btn-primary {$1background: linear-gradient(135deg, #C5A880, #B4966E);$2color: var(--dark);");

    // 3. Refactor .btn-checkout button to Champagne Gold background and dark brown text
    content = content.replace(/\.btn-checkout\s*\{([\s\S]*?)background:\s*[^;]+;([\s\S]*?)color:\s*[^;]+;/gi, ".btn-checkout {$1background: linear-gradient(135deg, #C5A880, #B4966E);$2color: var(--dark);");

    // 4. Refactor .BuyBtn:hover to Champagne Gold background and dark brown text
    content = content.replace(/\.BuyBtn:hover\s*\{([\s\S]*?)background:\s*[^;]+;([\s\S]*?)border-color:\s*[^;]+;([\s\S]*?)color:\s*[^;]+;/gi, ".BuyBtn:hover {$1background: #C5A880;$2border-color: #C5A880;$3color: var(--dark);");

    // Also update any box-shadow colors in active states to gold-themed shadow
    content = content.replace(/rgba\(201,\s*169,\s*110/gi, "rgba(197, 168, 128");

    if (content !== original) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ Buttons Swapped: ${path.basename(filePath)}`);
    } else {
        console.log(`ℹ️ No button changes: ${path.basename(filePath)}`);
    }
}

console.log("--- Updating CTA Buttons to Champagne Gold Background ---");

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

console.log("\n✨ Champagne Gold button styles completed.");
