const fs = require('fs');
const path = require('path');

const dir = 'e:/Glassmorphism/Vrindhavanam Glassmorphism/Vrindhavanam';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        // Remove style="" from .product-add-btn
        const regex = /(<button[^>]*class="[^"]*product-add-btn[^"]*"[^>]*)style="[^"]*"/g;
        
        if (regex.test(content)) {
            content = content.replace(regex, '$1');
            fs.writeFileSync(path.join(dir, file), content, 'utf8');
            console.log('Cleaned inline styles in ' + file);
        }
    }
});
