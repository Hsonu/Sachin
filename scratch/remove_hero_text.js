const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Target block to remove
const startMarker = '<!-- Left Text Content -->';
const endMarker = '<!-- Right Visual Slider -->';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + content.substring(endIndex);
  console.log("Successfully removed text column!");
} else {
  console.log("Error: markers not found!");
}

fs.writeFileSync(filePath, content, 'utf8');
