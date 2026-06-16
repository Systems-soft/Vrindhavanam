const fs = require('fs');
const path = require('path');

const dir = 'e:/Glassmorphism/Vrindhavanam Glassmorphism/Vrindhavanam';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html') && file !== 'index.html' && file !== 'checkout.html') {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        // Match the <div class="product-variety-actions"> and the Buy Now button
        // Replace it by adding Add to Cart before Buy Now.
        const regex = /(<a\s+href="[^"]*#cartDrawer"[^>]*class="product-buy-btn"[^>]*>\s*Buy Now\s*<\/a>)/g;
        
        if (regex.test(content)) {
            const replacement = `<button type="button" class="product-add-btn" style="padding: 0.8rem 1.5rem; background: transparent; border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 8px; color: #fff; font-weight: 500; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; backdrop-filter: blur(10px);">Add to Cart</button>\n                $1`;
            
            content = content.replace(regex, replacement);
            fs.writeFileSync(path.join(dir, file), content, 'utf8');
            console.log('Updated ' + file);
        }
    }
});
