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
console.log(`Found ${allFiles.length} files to analyze.`);

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const rootRegex = /:root\s*\{([^}]+)\}/gi;
  let match;
  let matchesCount = 0;
  while ((match = rootRegex.exec(content)) !== null) {
    matchesCount++;
    console.log(`\n--- File: ${path.relative(path.join(__dirname, '..'), file)} (Match ${matchesCount}) ---`);
    console.log(match[0].trim());
  }
});
