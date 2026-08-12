const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, '../frontend'),
  path.join(__dirname, '../adminPanel')
];

function scanDir(dir) {
  let files = [];
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
console.log(`Scanning and theme transforming ${allFiles.length} files...`);

// Mapping of hex color replacements
const hexReplacements = {
  '#1B4332': '#17301C',
  '#1b4332': '#17301C',
  '#0F291E': '#01150A',
  '#0f291e': '#01150A',
  '#C5A880': '#D9A52A',
  '#c5a880': '#D9A52A',
  '#FAF6F0': '#01150A',
  '#faf6f0': '#01150A',
  '#2C1E15': '#01150A',
  '#2c1e15': '#01150A',
  '#3A271C': '#17301C',
  '#3a271c': '#17301C',
  '#4A3527': '#22432a',
  '#4a3527': '#22432a',
  '#E2D5C1': '#C4B873',
  '#e2d5c1': '#C4B873',
  '#8C7769': '#C4B873',
  '#8c7769': '#C4B873',
  '#2c1a0a': '#01150A',
  '#4a2c0f': '#17301C',
  
  // Pink / purple variables inside login & other pages
  '#ff6ec7': '#D9A52A',
  '#ff33b8': '#C4B873',
  '#d42c95': '#9B751D',
  '#ff7197': '#D9A52A',
  '#ff56b4': '#D9A52A',
  '#ff79ce': '#D9A52A',
  '#ff57a8': '#D9A52A',
  '#f7d0fb': '#C4B873',
  '#f5d6ff': '#C4B873',
  '#f2d7ff': '#ffffff',
  '#f6edf8': '#ffffff',
  
  // Card image wrap bg
  '#f8f4ef': '#17301C',
  
  // Skeleton shimmer
  '#f0ebe3': '#17301C',
  '#e8e0d5': '#22432a',
};

// Mapping of rgba/rgba shadow replacements
const shadowReplacements = [
  // Generic shadow/color regexes for old champagne gold shadow
  { old: /rgba\(\s*197,\s*168,\s*128/gi, new: 'rgba(217, 165, 42' },
  // Generic shadow/color regexes for old admin gold shadow
  { old: /rgba\(\s*201,\s*169,\s*110/gi, new: 'rgba(217, 165, 42' },
  { old: /rgba\(197,\s*168,\s*128,\s*0\.2\)/gi, new: 'rgba(217, 165, 42, 0.2)' },
  { old: /rgba\(197,\s*168,\s*128,\s*0\.1\)/gi, new: 'rgba(217, 165, 42, 0.1)' },
  { old: /rgba\(197,\s*168,\s*128,\s*0\.07\)/gi, new: 'rgba(217, 165, 42, 0.07)' },
  { old: /rgba\(197,\s*168,\s*128,\s*0\.08\)/gi, new: 'rgba(217, 165, 42, 0.08)' },
  { old: /rgba\(197,\s*168,\s*128,\s*0\.3\)/gi, new: 'rgba(217, 165, 42, 0.3)' },
  { old: /rgba\(197,\s*168,\s*128,\s*0\.15\)/gi, new: 'rgba(217, 165, 42, 0.15)' },
  { old: /rgba\(197,\s*168,\s*128,\s*0\.4\)/gi, new: 'rgba(217, 165, 42, 0.4)' },
  
  // Pink / purple rgba shadows inside style.css
  { old: /rgba\(255,\s*169,\s*236,\s*0\.18\)/gi, new: 'rgba(217, 165, 42, 0.12)' },
  { old: /rgba\(255,\s*109,\s*185,\s*0\.18\)/gi, new: 'rgba(143, 190, 34, 0.12)' }, // leaf green accent
  { old: /rgba\(255,\s*112,\s*255,\s*0\.25\)/gi, new: 'rgba(217, 165, 42, 0.35)' },
  { old: /rgba\(255,\s*113,\s*197,\s*0\.2\)/gi, new: 'rgba(217, 165, 42, 0.15)' },
  { old: /rgba\(255,\s*109,\s*199,\s*0\.2\)/gi, new: 'rgba(217, 165, 42, 0.15)' },
  { old: /rgba\(255,\s*109,\s*199,\s*0\.4\)/gi, new: 'rgba(217, 165, 42, 0.3)' },
  { old: /rgba\(255,\s*121,\s*206,\s*0\.12\)/gi, new: 'rgba(217, 165, 42, 0.12)' },
  { old: /rgba\(255,\s*87,\s*168,\s*0\.8\)/gi, new: 'rgba(217, 165, 42, 0.8)' },
  { old: /rgba\(255,\s*86,\s*180,\s*0\.28\)/gi, new: 'rgba(217, 165, 42, 0.28)' }
];

// Linear gradient replacements (regex or exact string)
const gradientReplacements = [
  { old: /#0b0b17\s+0%,\s+#160821/gi, new: '#01150A 0%, #17301C' },
  { old: /rgba\(18,\s*10,\s*34,\s*0\.98\)\s+0%,\s+rgba\(30,\s*15,\s*50,\s*0\.98\)/gi, new: 'rgba(1, 21, 10, 0.98) 0%, rgba(23, 48, 28, 0.98)' }
];

const mainRootRegex = /:root\s*\{([^}]*--gold[^}]*--cream[^}]*)\}/gi;

const newRootStyles = `:root {
            --gold: #17301C; /* Supporting deep natural green */
            --gold-dark: #01150A; /* Main very dark Himalayan green */
            --gold-light: #D9A52A; /* Primary rich golden yellow accent */
            --gold-bg: #01150A; /* Background surface for modals / dark panels */
            --cream: #01150A; /* Primary background color (dark theme) */
            --dark: #01150A; /* Main brand dark background */
            --dark-2: #17301C; /* Supporting deep natural green background */
            --dark-3: #22432a; /* Mid-shade natural green for surfaces */
            --text-h: #FFFFFF; /* Heading text (clean white for high contrast) */
            --text-body: #FFFFFF; /* Body text (clean white for high contrast) */
            --text-muted: #C4B873; /* Muted antique gold for labels, subtitles, details */
            --border: #C4B873; /* Muted antique gold borders */
            --white: #17301C; /* Deep green surface background for cards / sections */
            --brand-green: #01150A;
            --deep-green: #17301C;
            --brand-gold: #D9A52A;
            --soft-gold: #C4B873;
            --mountain-blue: #4D9BCB;
            --leaf-green: #8FBE22;
            --header-h: 72px;
            --radius: 14px;
            --transition: 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }`;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Replace main :root blocks in HTML/CSS
  if (content.match(mainRootRegex)) {
    content = content.replace(mainRootRegex, newRootStyles);
  }

  // 2. Replace hex colors
  Object.keys(hexReplacements).forEach(oldHex => {
    const newHex = hexReplacements[oldHex];
    // Use word boundaries or negative lookbehind/lookahead if needed, or simple globally search
    // Since hex values are distinct, a global regex search and replace is fine.
    const escapedHex = oldHex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedHex, 'g');
    content = content.replace(regex, newHex);
  });

  // 3. Replace rgba shadows
  shadowReplacements.forEach(rep => {
    content = content.replace(rep.old, rep.new);
  });

  // 4. Replace linear gradients
  gradientReplacements.forEach(rep => {
    content = content.replace(rep.old, rep.new);
  });

  // 5. Special manual replacement for style.css / style1.css overrides
  if (file.endsWith('style1.css') || file.endsWith('style.css')) {
    // Replace pink references in style1.css
    content = content.replace(/background-color:\s*black;/gi, 'background-color: #01150A;');
    content = content.replace(/border:\s*1px\s*solid\s*pink;/gi, 'border: 1px solid #C4B873;');
    content = content.replace(/box-shadow:\s*0px\s*0px\s*8px\s*0px\s*pink;/gi, 'box-shadow: 0px 0px 8px 0px #C4B873;');
    content = content.replace(/background-color:\s*pink;/gi, 'background-color: #D9A52A; color: #01150A; border-color: #D9A52A;');
    content = content.replace(/color:\s*pink;/gi, 'color: #D9A52A;');
    content = content.replace(/border-bottom:\s*2px\s*solid\s*pink;/gi, 'border-bottom: 2px solid #D9A52A;');
    content = content.replace(/border:\s*1.5px\s*solid\s*#0d6efd;/gi, 'border: 1.5px solid #D9A52A;');
    content = content.replace(/outline-color:\s*#0d6efd;/gi, 'outline-color: #D9A52A;');
    content = content.replace(/background-color:\s*rgb\(44,\s*40,\s*40\);/gi, 'background-color: #D9A52A; color: #01150A; box-shadow: 0px 0px 7px 1px #D9A52A;');
  }

  if (file.endsWith('admin.css')) {
    // Replace admin.css brand colors
    content = content.replace(/--gold:\s*#c9a96e;/gi, '--gold: #D9A52A;');
    content = content.replace(/--gold-dark:\s*#a8854e;/gi, '--gold-dark: #9B751D;');
    content = content.replace(/--gold-light:\s*#e8d4a8;/gi, '--gold-light: #C4B873;');
    content = content.replace(/--gold-bg:\s*#fdf7ee;/gi, '--gold-bg: #01150A;');
    content = content.replace(/--gold-shadow:\s*rgba\(201,\s*169,\s*110,\s*0\.2\);/gi, '--gold-shadow: rgba(217, 165, 42, 0.2);');
    content = content.replace(/--cream:\s*#ffffff;/gi, '--cream: #01150A;');
    content = content.replace(/--card-bg:\s*#ffffff;/gi, '--card-bg: #17301C;');
    content = content.replace(/--page-bg:\s*#ffffff;/gi, '--page-bg: #01150A;');
    content = content.replace(/--sb-bg:\s*#ffffff;/gi, '--sb-bg: #17301C;');
    content = content.replace(/--sb-border:\s*#e8e0d5;/gi, '--sb-border: #C4B873;');
    content = content.replace(/--sb-text:\s*#7a7a85;/gi, '--sb-text: #C4B873;');
    content = content.replace(/--sb-text-active:\s*#a8854e;/gi, '--sb-text-active: #D9A52A;');
    content = content.replace(/--sb-active-bg:\s*#fdf7ee;/gi, '--sb-active-bg: #01150A;');
    content = content.replace(/--tb-bg:\s*#ffffff;/gi, '--tb-bg: #17301C;');
    content = content.replace(/--tb-border:\s*#e8e0d5;/gi, '--tb-border: #C4B873;');
    content = content.replace(/--text-h:\s*#0d0d0f;/gi, '--text-h: #ffffff;');
    content = content.replace(/--text-body:\s*#3d3d45;/gi, '--text-body: #ffffff;');
    content = content.replace(/--text-muted:\s*#7a7a85;/gi, '--text-muted: #C4B873;');
    content = content.replace(/--border:\s*#e8e0d5;/gi, '--border: #C4B873;');
    content = content.replace(/--input-bg:\s*#faf8f5;/gi, '--input-bg: #01150A;');
    content = content.replace(/--input-border:\s*#e8e0d5;/gi, '--input-border: #C4B873;');
    content = content.replace(/--input-focus:\s*#c9a96e;/gi, '--input-focus: #D9A52A;');
    content = content.replace(/--primary:\s*#c9a96e;/gi, '--primary: #D9A52A;');
    content = content.replace(/--primary-dark:\s*#a8854e;/gi, '--primary-dark: #9B751D;');
    content = content.replace(/--primary-light:\s*#fdf7ee;/gi, '--primary-light: #01150A;');
    
    // Also, tables and forms backgrounds
    content = content.replace(/background:\s*#faf8f5;/gi, 'background: #17301C;');
  }

  // 6. Fix HTML files with hardcoded white sections or custom inline elements
  // Example: meta theme color
  content = content.replace(/<meta name="theme-color" content="#0d0d0f">/gi, '<meta name="theme-color" content="#01150A">');
  content = content.replace(/<meta name="theme-color" content="#FAF6F0">/gi, '<meta name="theme-color" content="#01150A">');

  // Fix typo in shippingInfo.html: --white: #white; -> --white: #ffffff; (or #17301C as per mapping)
  content = content.replace(/--white:\s*#white;/gi, '--white: #17301C;');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.relative(path.join(__dirname, '..'), file)}`);
  }
});

console.log("Theme transformation completed successfully!");
