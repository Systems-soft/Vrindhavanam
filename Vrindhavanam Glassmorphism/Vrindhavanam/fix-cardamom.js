const fs = require('fs');
let content = fs.readFileSync('cardamom.html', 'utf8');
const regex = /(<a\s*href="[^"]*#cartDrawer"[^>]*class="[^"]*product-buy-btn[^"]*"[^>]*>\s*Buy Now\s*<\/a>)/g;
content = content.replace(regex, `<button type="button" class="product-add-btn" style="padding: 0.8rem 1.5rem; background: transparent; border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 8px; color: #fff; font-weight: 500; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; backdrop-filter: blur(10px);">Add to Cart</button>\n                $1`);
fs.writeFileSync('cardamom.html', content, 'utf8');
console.log('Fixed cardamom.html');
