const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '../frontend');

const files = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

console.log(`Processing ${files.length} HTML files in frontend directory...`);

files.forEach(file => {
    const filePath = path.join(frontendDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix footerCol ul li a and hover
    const oldFooterLinkRegex = /\.footerCol\s+ul\s+li\s+a\s*\{[^}]*\}\s*\.footerCol\s+ul\s+li\s+a:hover\s*\{[^}]*\}/g;
    const newFooterLinkCss = `.footerCol ul li a {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.85) !important;
            opacity: 0.85;
            transition: all var(--transition, 0.25s ease);
            display: inline-block;
        }

        .footerCol ul li a:hover {
            opacity: 1 !important;
            color: #F5C542 !important;
            transform: translateX(4px);
            text-shadow: 0 0 10px rgba(245, 197, 66, 0.5);
        }`;

    if (oldFooterLinkRegex.test(content)) {
        content = content.replace(oldFooterLinkRegex, newFooterLinkCss);
        modified = true;
    }

    // 2. Fix footerCol h4
    const oldH4Regex = /\.footerCol\s+h4\s*\{[^}]*\}/g;
    const newH4Css = `.footerCol h4 {
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #D9A52A !important;
            margin-bottom: 18px;
        }`;

    if (oldH4Regex.test(content)) {
        content = content.replace(oldH4Regex, newH4Css);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated footer styles in: ${file}`);
    }
});

console.log("Footer hover fix script finished!");
