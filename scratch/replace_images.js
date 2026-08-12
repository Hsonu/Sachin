const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the slides
content = content.replace(
  '<img src="./hero-necklace.jpg" alt="Exquisite Floral Design Necklace and Earring Set">',
  '<img src="./images/kesar_pista_kulfi.png" alt="Premium Kesar Pista Kulfi">'
);

content = content.replace(
  '<img src="./hero-ring.jpg" alt="Elegant Gold Chain Ring">',
  '<img src="./images/mango_kulfi.png" alt="Delicious Mango Kulfi">'
);

content = content.replace(
  '<img src="./hero-gemstone.jpg" alt="Luxury Multi-Stone Gold Necklaces">',
  '<img src="./images/badam_pista_kulfi.png" alt="Royal Badam Pista Kulfi">'
);

content = content.replace(
  '<img src="./hero-bracelet.jpg" alt="Delicate Sparkly Diamond Bracelet">',
  '<img src="./images/malai_kulfi.png" alt="Traditional Malai Kulfi">'
);

// Replace the thumbnails
content = content.replace(
  '<img src="./hero-necklace.jpg" alt="Necklace Set Thumbnail">',
  '<img src="./images/kesar_pista_kulfi.png" alt="Kesar Pista Kulfi Thumbnail">'
);

content = content.replace(
  '<img src="./hero-ring.jpg" alt="Gold Ring Thumbnail">',
  '<img src="./images/mango_kulfi.png" alt="Mango Kulfi Thumbnail">'
);

content = content.replace(
  '<img src="./hero-gemstone.jpg" alt="Necklaces Thumbnail">',
  '<img src="./images/badam_pista_kulfi.png" alt="Badam Pista Kulfi Thumbnail">'
);

content = content.replace(
  '<img src="./hero-bracelet.jpg" alt="Bracelet Thumbnail">',
  '<img src="./images/malai_kulfi.png" alt="Malai Kulfi Thumbnail">'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Index.html hero images replaced successfully!");
