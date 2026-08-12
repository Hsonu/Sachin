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
    } else if (stat.isFile() && (item.endsWith('.html') || item.endsWith('.css') || item.endsWith('.js'))) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = dirs.flatMap(scanDir);

// Find all hardcoded color declarations (like #C5A880, #FAF6F0, etc. or pink, rgb/rgba)
const hexPattern = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g;
const rgbPattern = /rgba?\([^)]+\)/g;
const pinkPattern = /\bpink\b/gi;

console.log("Analyzing hardcoded colors in CSS & HTML styles...");

const results = [];

allFiles.forEach(file => {
  if (file.includes('node_modules') || file.includes('.git') || file.includes('analyze_')) return;
  const content = fs.readFileSync(file, 'utf8');
  
  // Extract style tag contents
  let styleBlocks = [];
  if (file.endsWith('.html')) {
    const styleRegex = /<style>([\s\S]*?)<\/style>/gi;
    let match;
    while ((match = styleRegex.exec(content)) !== null) {
      styleBlocks.push(match[1]);
    }
  } else if (file.endsWith('.css')) {
    styleBlocks.push(content);
  }

  styleBlocks.forEach((styleBlock, idx) => {
    // Find hex matches
    let hexMatch;
    const localHexes = [];
    while ((hexMatch = hexPattern.exec(styleBlock)) !== null) {
      localHexes.push(hexMatch[0]);
    }

    // Find rgb matches
    let rgbMatch;
    const localRgbs = [];
    while ((rgbMatch = rgbPattern.exec(styleBlock)) !== null) {
      localRgbs.push(rgbMatch[0]);
    }

    // Find pink matches
    let pinkMatch;
    const localPinks = [];
    while ((pinkMatch = pinkPattern.exec(styleBlock)) !== null) {
      localPinks.push(pinkMatch[0]);
    }

    if (localHexes.length || localRgbs.length || localPinks.length) {
      results.push({
        file: path.relative(path.join(__dirname, '..'), file),
        blockIdx: idx,
        hexes: [...new Set(localHexes)],
        rgbs: [...new Set(localRgbs)],
        pinks: [...new Set(localPinks)]
      });
    }
  });
});

console.log(JSON.stringify(results, null, 2));
