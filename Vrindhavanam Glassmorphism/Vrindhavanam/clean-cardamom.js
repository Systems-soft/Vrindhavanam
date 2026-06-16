const fs = require('fs');
let content = fs.readFileSync('cardamom.html', 'utf8');
const regex = /(<button[^>]*class="[^"]*product-add-btn[^"]*"[^>]*)style="[^"]*"/g;
content = content.replace(regex, '$1');
fs.writeFileSync('cardamom.html', content, 'utf8');
console.log('Cleaned cardamom.html');
