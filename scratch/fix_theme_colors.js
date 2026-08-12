const fs = require('fs');
const path = require('path');

const dirs = [
  'c:/Users/SunAdmin/Desktop/SONU/New folder/site/sachin/New folder/Sachin/frontend',
  'c:/Users/SunAdmin/Desktop/SONU/New folder/site/sachin/New folder/Sachin/adminPanel'
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
console.log(`Scanning ${allFiles.length} files for theme color contrast issues...`);

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Fix .filterTab styling in index.html specifically if it got corrupted earlier
  if (file.endsWith('index.html')) {
    const corruptedFilterTab = /\.filterTab\s*\{[^}]*white-space:\s*nowrap;[^}]*\}/;
    if (content.match(corruptedFilterTab)) {
      console.log(`Fixing corrupted .filterTab style block in ${path.basename(file)}`);
      // We will replace the entire corrupted filterTab block and surrounding area
      const targetBlock = /\.filterTab\s*\{[^}]*\}\s*#productCount\s*strong\s*\{[^}]*\}/;
      const correctBlock = `.filterTab {
            padding: 7px 18px;
            border-radius: 999px;
            border: 1.5px solid var(--border);
            background: transparent;
            font-size: 0.78rem;
            font-weight: 500;
            color: var(--text-muted);
            cursor: pointer;
            transition: all var(--transition);
            font-family: inherit;
        }

        .filterTab:hover,
        .filterTab.active {
            border-color: var(--gold-light);
            background: var(--gold-light);
            color: var(--gold-dark);
            font-weight: 700;
        }

        #productCount {
            font-size: 0.82rem;
            color: var(--text-muted);
            white-space: nowrap;
        }

        #productCount strong {
            color: var(--text-h);
            font-weight: 600;
        }`;
      content = content.replace(targetBlock, correctBlock);
    }
  }

  // 2. Fix filterTab hover and active colors in all pages
  // Match filterTab hover/active block that uses var(--gold)
  const filterTabHoverRegex = /\.filterTab:hover,\s*\.filterTab\.active\s*\{[^}]*border-color:\s*var\(--gold\);[^}]*background:\s*var\(--gold\);[^}]*color:\s*var\(--dark\);[^}]*\}/gi;
  if (content.match(filterTabHoverRegex)) {
    console.log(`Fixing .filterTab:hover/.active colors in ${path.basename(file)}`);
    content = content.replace(filterTabHoverRegex, `.filterTab:hover,
        .filterTab.active {
            border-color: var(--gold-light);
            background: var(--gold-light);
            color: var(--gold-dark);
            font-weight: 700;
        }`);
  }

  // 3. Fix .navActionBtn hover color if it uses var(--gold) (which turns dark green)
  const navActionBtnHoverRegex = /\.navActionBtn:hover\s*\{([^}]*)color:\s*var\(--gold\);([^}]*)\}/gi;
  if (content.match(navActionBtnHoverRegex)) {
    console.log(`Fixing .navActionBtn:hover color in ${path.basename(file)}`);
    content = content.replace(navActionBtnHoverRegex, `.navActionBtn:hover {
            border-color: rgba(217, 165, 42, 0.4);
            background: rgba(217, 165, 42, 0.06);
            color: var(--gold-light);
        }`);
  }

  // 4. Fix .cartBadge background if it uses var(--gold)
  const cartBadgeRegex = /\.cartBadge\s*\{([^}]*)background:\s*var\(--gold\);([^}]*)\}/gi;
  if (content.match(cartBadgeRegex)) {
    console.log(`Fixing .cartBadge background in ${path.basename(file)}`);
    content = content.replace(cartBadgeRegex, (match, before, after) => {
      // Replace only background: var(--gold); with background: var(--gold-light);
      let updated = match.replace(/background:\s*var\(--gold\);/gi, 'background: var(--gold-light);');
      return updated;
    });
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Updated ${file}`);
  }
});

console.log('Theme contrast fix complete!');
