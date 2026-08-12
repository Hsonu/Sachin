const fs = require('fs');
const path = require('path');

const dirs = [
    path.join(__dirname, '../frontend'),
    path.join(__dirname, '../adminPanel')
];

function scanDir(dir) {
    let files = [];
    if (!fs.existsSync(dir)) return files;
    const list = fs.readdirSync(dir);
    for (const item of list) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            files = files.concat(scanDir(fullPath));
        } else if (stat.isFile() && (item.endsWith('.html') || item.endsWith('.css'))) {
            files.push(fullPath);
        }
    }
    return files;
}

const allFiles = dirs.flatMap(scanDir);

const globalInputFixCss = `
        /* ═══════════════════════════════════════════
           INPUT TEXT COLOR FIX (HIGH CONTRAST)
        ═══════════════════════════════════════════ */
        input:not(#searchInput), textarea, select, .form-input {
            color: #111111 !important;
            background-color: #ffffff !important;
        }

        input:not(#searchInput)::placeholder, textarea::placeholder, .form-input::placeholder {
            color: #777777 !important;
            opacity: 1 !important;
        }

        #searchInput {
            color: #ffffff !important;
            background: rgba(255, 255, 255, 0.08) !important;
        }

        #searchInput::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
        }
`;

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Clean up any previously misplaced text block
    content = content.replace(/\n?\s*\/\* ═══════════════════════════════════════════\s*INPUT TEXT COLOR FIX \(HIGH CONTRAST\)[\s\S]*?#searchInput::placeholder \{\s*color: rgba\(255, 255, 255, 0\.5\) !important;\s*\}\s*/g, '');

    // Now inject correctly inside <style>
    if (file.endsWith('.html') && content.includes('</style>')) {
        const styleIndex = content.lastIndexOf('</style>');
        content = content.slice(0, styleIndex) + globalInputFixCss + '\n' + content.slice(styleIndex);
    } else if (file.endsWith('.css')) {
        content += '\n' + globalInputFixCss;
    }

    fs.writeFileSync(file, content, 'utf8');
});

console.log("Input color fix successfully applied inside style blocks across all files!");
