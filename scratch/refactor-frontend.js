const fs = require("fs");
const path = require("path");

const frontendDir = path.join(__dirname, "..", "frontend");
const adminDir = path.join(__dirname, "..", "adminPanel");

// Refactoring rules: [search (String or Regex), replacement]
const replacements = [
    // 1. Core design tokens override (Gold to Pistachio, Dark to Chocolate, Cream background)
    [
        /--gold:\s*#c9a96e;/g,
        "--gold: #2E5A44; /* Pista Green */"
    ],
    [
        /--gold-dark:\s*#a8854e;/g,
        "--gold-dark: #1F3F2F; /* Dark Green */"
    ],
    [
        /--gold-light:\s*#e8d4a8;/g,
        "--gold-light: #FF9933; /* Saffron Accent */"
    ],
    [
        /--gold-bg:\s*#fdf7ee;/g,
        "--gold-bg: #FCF8F2; /* Cream White Background */"
    ],
    [
        /--cream:\s*#ffffff;/g,
        "--cream: #FCF8F2;"
    ],
    [
        /--cream:\s*#F7DFD7;/g,
        "--cream: #FCF8F2;"
    ],
    [
        /--dark:\s*#0d0d0f;/g,
        "--dark: #3D2314; /* Dark Chocolate Brown */"
    ],
    [
        /--dark-2:\s*#1a1a1f;/g,
        "--dark-2: #4E3120;"
    ],
    [
        /--dark-3:\s*#2a2a30;/g,
        "--dark-3: #5F3F2C;"
    ],
    [
        /--text-h:\s*#0d0d0f;/g,
        "--text-h: #3D2314;"
    ],
    [
        /--text-body:\s*#3d3d45;/g,
        "--text-body: #4E3B31;"
    ],
    [
        /--text-muted:\s*#7a7a85;/g,
        "--text-muted: #8E7A6E;"
    ],
    [
        /--border:\s*#e8e0d5;/g,
        "--border: #E6D7C3;"
    ],
    [
        /background:\s*#F7DFD7;/g,
        "background: #FCF8F2;"
    ],
    [
        /background:\s*#110e08;/g,
        "background: #1F3F2F;"
    ],
    [
        /color:\s*#e8d4a8;/g,
        "color: #FAF6EE;"
    ],
    [
        /border-bottom:\s*1px\s*solid\s*#c9a96e;/g,
        "border-bottom: 1px solid #2E5A44;"
    ],
    [
        /background:\s*linear-gradient\(135deg,\s*var\(--gold\),\s*var\(--gold-dark\)\);/g,
        "background: linear-gradient(135deg, #2E5A44, #1F3F2F);"
    ],

    // 2. Brand names & disclaimers
    [
        /Sonu Bin/g,
        "Himalaya Kulfi"
    ],
    [
        /Sonu\s*Bin\s*Jewels/gi,
        "Himalaya Kulfi"
    ],
    [
        /Sonu\s*Bin\s*Jewellers/gi,
        "Himalaya Kulfi"
    ],
    [
        /Account Access – Himalaya Kulfi/g,
        "Account Access – Himalaya Kulfi"
    ],
    [
        /DISCLAIMER:\s*Himalaya Kulfi offers premium imitation\/fashion jewellery only\. All products are non-gold fashion jewellery\. We do not sell real gold, BIS Hallmarked jewellery, certified diamonds, or precious metal jewellery\./g,
        "HIMALAYA KULFI: Experience the rich tradition of authentic slow-frozen Indian kulfi. Prepared under strict hygiene with fresh whole milk."
    ],
    [
        /Not Real Gold\s*•\s*No BIS Hallmark/g,
        "FSSAI Certified • 100% Vegetarian"
    ],
    [
        /Premium Fashion Jewellery/g,
        "Premium Indian Kulfi & Traditional Frozen Desserts"
    ],
    [
        /Gram bin dera post-nagwan,thana simri dumraon buxar bihar 802133/g,
        "Main Market Road, Dumraon, Buxar, Bihar 802133"
    ],

    // 3. Category & Filter tabs remapping
    [
        /data-filter="rings"/g,
        'data-filter="Classic Kulfi"'
    ],
    [
        /data-filter="necklaces"/g,
        'data-filter="Premium Kulfi"'
    ],
    [
        /data-filter="bangles"/g,
        'data-filter="Matka Kulfi"'
    ],
    [
        /data-filter="earrings"/g,
        'data-filter="Falooda"'
    ],
    [
        /data-filter="pendants"/g,
        'data-filter="Rabri"'
    ],
    [
        />Rings<\/button>/g,
        ">Classic Kulfi</button>"
    ],
    [
        />Necklaces<\/button>/g,
        ">Premium Kulfi</button>"
    ],
    [
        />Bangles<\/button>/g,
        ">Matka Kulfi</button>"
    ],
    [
        />Earrings<\/button>/g,
        ">Falooda</button>"
    ],
    [
        />Pendants<\/button>/g,
        ">Rabri</button>"
    ],
    [
        /<li><a href="\.\/allProduct\.html">Rings<\/a><\/li>/g,
        '<li><a href="./allProduct.html">Classic Kulfi</a></li>'
    ],
    [
        /<li><a href="\.\/allProduct\.html">Necklaces<\/a><\/li>/g,
        '<li><a href="./allProduct.html">Premium Kulfi</a></li>'
    ],
    [
        /<li><a href="\.\/allProduct\.html">Bangles<\/a><\/li>/g,
        '<li><a href="./allProduct.html">Matka Kulfi</a></li>'
    ],
    [
        /<li><a href="\.\/allProduct\.html">Earrings<\/a><\/li>/g,
        '<li><a href="./allProduct.html">Falooda & Rabri</a></li>'
    ],

    // 4. Terminology replacements
    [
        /Jewelry/g,
        "Kulfi"
    ],
    [
        /jewelry/g,
        "kulfi"
    ],
    [
        /Jewellery/g,
        "Kulfi"
    ],
    [
        /jewellery/g,
        "kulfi"
    ],
    [
        /rings, necklaces, bangles…/g,
        "malai, mango, kesar pista kulfi…"
    ],
    [
        /Explore Collection/g,
        "Explore Flavours"
    ],
    [
        /Shop Collection/g,
        "Order Kulfi"
    ],
    [
        /All Jewelry/g,
        "All Kulfi"
    ],
    [
        /All Jewellery/g,
        "All Kulfi"
    ],
    [
        /New Arrivals/g,
        "Bestsellers"
    ],
    [
        /100% Certified Jewellery/g,
        "FSSAI Certified 100% Vegetarian"
    ],
    [
        /Easy 30-Day Returns/g,
        "Fresh & Hygenically Frozen"
    ],
    [
        /Premium Imitation Jewellery/g,
        "Premium Traditional Ingredients"
    ],
    [
        /Every piece is crafted by expert artisans with decades of heritage\./g,
        "Our kulfis are crafted from milk reduced for hours, using secrets of royal recipes."
    ],
    [
        /We offer premium quality imitation\/fashion jewellery for all occasions\./g,
        "Delivered frozen in insulated boxes directly to your doorstep."
    ],
    [
        /Not happy\? Return within 30 days for a hassle-free refund\./g,
        "100% pure milk, fresh fruits, and high-quality premium nuts."
    ],
    [
        /Search rings, necklaces, bangles…/g,
        "Search malai, mango, pista kulfi…"
    ],
    [
        /Luxury jewellery/gi,
        "Premium Kulfi & Desserts"
    ],
    [
        /Himalaya\s*Kulfi\s*Jewels\s*Timeless\s*Beauty/gi,
        "Himalaya Kulfi • Premium Frozen Desserts"
    ],
    [
        /Crafted\s*for\s*Eternity,\s*Worn\s*with\s*Grace\.\s*Discover\s*our\s*premium\s*imitation\s*&\s*fashion\s*kulfi\s*—\s*where\s*every\s*piece\s*tells\s*a\s*story\./gi,
        "Pure Royal Tradition. Rich Taste. Real Kulfi. Discover authentic Indian kulfi crafted with fresh whole milk."
    ],
    [
        /Himalaya\s*Kulfi\s*offers\s*premium\s*imitation\/fashion\s*kulfi\s*only\.\s*All\s*products\s*are\s*non-gold\s*fashion\s*kulfi\.\s*We\s*do\s*not\s*sell\s*real\s*gold,\s*BIS\s*Hallmarked\s*kulfi,\s*certified\s*diamonds,\s*or\s*precious\s*metal\s*kulfi\./gi,
        "FSSAI Certified • 100% Vegetarian • Freshly reduced milk & premium nuts. Order online today for door delivery!"
    ],
    [
        /We\s*believe\s*every\s*woman\s*deserves\s*kulfi\s*that\s*makes\s*her\s*feel\s*extraordinary\./gi,
        "Delivering royal Indian kulfi and traditional desserts frozen to perfection."
    ],
    [
        /Discover\s*Every\s*Piece\.\s*Browse\s*our\s*full\s*range\s*of\s*premium\s*handcrafted\s*imitation\s*&\s*fashion\s*kulfi\s*—\s*each\s*piece\s*made\s*to\s*be\s*treasured\s*forever\./gi,
        "Discover Pure Indian Joy. Browse our full range of premium handcrafted kulfis & traditional desserts, prepared with rich milk and dry fruits."
    ],
    [
        /premium\s*handcrafted\s*imitation\s*&\s*fashion\s*kulfi/gi,
        "premium handcrafted traditional kulfi & desserts"
    ],
    [
        /each\s*piece\s*made\s*to\s*be\s*treasured\s*forever/gi,
        "made with love to sweeten your celebrations"
    ],
    [
        /Premium\s*Imitation\s*Kulfi/gi,
        "100% Pure Milk & Nuts"
    ],
    [
        /Free\s*insured\s*delivery\s*pan\s*India/gi,
        "Insulated Frozen Delivery"
    ],
    [
        /<h4>Easy\s*Returns<\/h4>\s*<p>100%\s*pure\s*milk/gi,
        "<h4>Premium Ingredients</h4><p>100% pure milk"
    ]
];

// Helper to refactor a single file
function refactorFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, "utf8");
    let original = content;

    for (let r of replacements) {
        content = content.replace(r[0], r[1]);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ Refactored: ${path.basename(filePath)}`);
    } else {
        console.log(`ℹ️ No changes: ${path.basename(filePath)}`);
    }
}

// Re-write all HTML files in frontend
console.log("--- Starting Frontend Refactoring ---");
const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith(".html"));
for (let file of htmlFiles) {
    refactorFile(path.join(frontendDir, file));
}

// Re-write admin HTML files
console.log("\n--- Starting Admin Panel Refactoring ---");
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

console.log("\n✨ Refactoring Completed Successfully.");
