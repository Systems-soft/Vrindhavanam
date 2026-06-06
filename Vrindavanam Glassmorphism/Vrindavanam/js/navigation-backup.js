// CART DRAWER CONTROLS
function openCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
        drawer.classList.add('open');
        overlay.classList.add('open');
    }
}

function closeCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    }
}

const varietyCartDefaults = {
    cardamom: { image: 'images/plantation17.jpg' },
    pepper: { image: 'images/plantation14.jpg' },
    turmeric: { image: 'images/plantation16.jpg' },
    cloves: { image: 'images/plantation13.jpg' },
    tea: { image: 'images/tea.jpg' },
    coffee: { image: 'images/coffee1.jpg' },
    honey: { image: 'images/honey.jpg' },
    ghee: { image: 'images/ghee1.jpg' },
    ginger: { image: 'images/ginger1.jpg' },
};

const otherHandpickedProducts = [
    { id: 'cardamom', name: 'Cardamom', label: 'Single Origin', href: 'cardamom.html', image: 'images/cardamom.jpg' },
    { id: 'honey', name: 'Honey', label: 'Naturally Pure', href: 'honey.html', image: 'images/honey.jpg' },
    { id: 'tea', name: 'Tea', label: 'Farm Fresh', href: 'tea.html', image: 'images/tea.jpg' },
    { id: 'coffee', name: 'Coffee', label: 'Fair Grown', href: 'coffee.html', image: 'images/coffee.jpg' },
    { id: 'pepper', name: 'Pepper', label: 'Quality Checked', href: 'pepper.html', image: 'images/pepper.jpg' },
    { id: 'cloves', name: 'Cloves', label: 'Sustainable', href: 'cloves.html', image: 'images/cloves.jpg' },
    { id: 'turmeric', name: 'Turmeric', label: 'Soil First', href: 'turmeric.html', image: 'images/turmeric.jpg' },
    { id: 'ghee', name: 'Ghee', label: 'Golden Pure', href: 'ghee.html', image: 'images/ghee1.jpg' },
    { id: 'ginger', name: 'Ginger', label: 'Fresh Root', href: 'ginger.html', image: 'images/ginger1.jpg' },
];

const productVarietyPageHrefs = {
    cardamom: 'cardamom.html',
    pepper: 'pepper.html',
    turmeric: 'turmeric.html',
    cloves: 'cloves.html',
    tea: 'tea.html',
    coffee: 'coffee.html',
    honey: 'honey.html',
    ghee: 'ghee.html',
    ginger: 'ginger.html',
};

const productDetailCatalog = {
    'chai': {
        name: 'Chai Cardamom',
        label: 'Chai Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail10.jpg',
        backHref: 'cardamom.html',
        description: 'A fragrant cardamom grade selected for tea, milk infusions, desserts, and daily spice blends. These pods open with a sweet green aroma and leave a clean, warming finish in every cup.',
    },
    'masala-cardamom': {
        name: 'Masala Cardamom',
        label: 'Masala Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail1.jpg',
        backHref: 'cardamom.html',
        description: 'Estate-cured pods chosen for masala blends, slow cooking, and pantry use. The profile is bright, floral, and sturdy enough to hold its aroma through roasting and grinding.',
    },
    'biriyani': {
        name: 'Biriyani Cardamom',
        label: 'Rice & Feast Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail2.jpg',
        backHref: 'cardamom.html',
        description: 'Aromatic whole pods selected for biriyani, pulao, festive gravies, and layered rice dishes. The flavor is warm, sweet, and gently resinous without overpowering the dish.',
    },
    'bold': {
        name: 'Bold Cardamom',
        label: 'Large Pods',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail3.jpg',
        backHref: 'cardamom.html',
        description: 'Bold pods chosen for fuller size, deep color, and long-lasting fragrance. A dependable premium grade for gifting, chai counters, and spice-forward cooking.',
    },
    'superbold': {
        name: 'Superbold Cardamom',
        label: 'Premium Size',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail4.jpg',
        backHref: 'cardamom.html',
        description: 'Large, premium pods with a clean green shell and concentrated aroma. Superbold cardamom is ideal for refined spice shelves, gift packs, and recipes where appearance matters.',
    },
    'extrabold': {
        name: 'Extra Bold Cardamom',
        label: 'Select Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail5.jpg',
        backHref: 'cardamom.html',
        description: 'Extra bold lots with polished color, pronounced sweetness, and a strong aromatic finish. Best for premium blends, whole-pod cooking, and special occasion packs.',
    },
    'bulk': {
        name: 'Bulk Cardamom',
        label: 'Wholesale',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail6.jpeg',
        backHref: 'cardamom.html',
        description: 'Large-quantity cardamom lots prepared for traders, kitchens, caterers, and frequent use. The lot is selected for consistent aroma and practical everyday value.',
    },
    'small': {
        name: 'Small Cardamom',
        label: 'Fine Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail7.jpg',
        backHref: 'cardamom.html',
        description: 'Smaller pods with clean aroma, steady sweetness, and flexible kitchen use. A smart daily grade for tea, sweets, spice powders, and home cooking.',
    },
    'fruit': {
        name: 'Fruit Cardamom',
        label: 'Whole Fruit',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail8.jpg',
        backHref: 'cardamom.html',
        description: 'Whole fruit grade with gentle sweetness, warm green aroma, and a rounded pod character. It works well in infusions, festive cooking, and whole-spice blends.',
    },
    'seed': {
        name: 'Seed Cardamom',
        label: 'Seeds',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail9.jpg',
        backHref: 'cardamom.html',
        description: 'Loose cardamom seeds prepared for quick grinding, masala blends, desserts, and bakery use. This format gives direct aroma without needing to shell whole pods.',
    },
    'open': {
        name: 'Open Cardamom',
        label: 'Open Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail11.jpg',
        backHref: 'cardamom.html',
        description: 'Open pods selected for fast infusions, spice powders, and everyday cooking. The grade keeps the cardamom character accessible for recipes where pods are crushed or ground.',
    },
    'wild-forest-honey': {
        name: 'Wild Forest Honey',
        label: 'Raw',
        category: 'honey',
        price: 580,
        image: 'images/honeydetail1.jpg',
        backHref: 'honey.html',
        description: 'Raw forest honey with deep, rounded sweetness from mixed blossoms. It is minimally handled so the natural body, floral notes, and wild character stay intact.',
    },
    'highland-blossom-honey': {
        name: 'Highland Blossom Honey',
        label: 'Floral',
        category: 'honey',
        price: 580,
        image: 'images/honeydetail2.jpg',
        backHref: 'honey.html',
        description: 'A lighter honey profile with gentle floral notes and a clean finish. Ideal for tea, breakfast bowls, toast, and recipes that need sweetness without heaviness.',
    },
    'golden-spice-honey': {
        name: 'Golden Spice Honey',
        label: 'Infusion',
        category: 'honey',
        price: 580,
        image: 'images/honeydetail3.jpg',
        backHref: 'honey.html',
        description: 'A warm pantry companion made for tea, toast, and wellness blends. The sweetness carries a soft spice lift while keeping the honey smooth and balanced.',
    },
    'highland-black-tea': {
        name: 'Highland Black Tea',
        label: 'Leaf',
        category: 'tea',
        price: 450,
        image: 'images/teadetail1.jpg',
        backHref: 'tea.html',
        description: 'Full-bodied highland tea with warm color, soft tannins, and a clean finish. A steady everyday cup that pairs beautifully with milk, honey, or cardamom.',
    },
    'estate-green-tea': {
        name: 'Estate Green Tea',
        label: 'Green',
        category: 'tea',
        price: 450,
        image: 'images/teadetail2.jpg',
        backHref: 'tea.html',
        description: 'A gentle green tea with fresh notes and light natural sweetness. The leaves are handled for a clean cup that stays bright and easy to drink.',
    },
    'spiced-chai-tea': {
        name: 'Spiced Chai Tea',
        label: 'Blend',
        category: 'tea',
        price: 450,
        image: 'images/teadetail3.jpg',
        backHref: 'tea.html',
        description: 'Tea prepared for cardamom, pepper, honey, and warming spice pairings. It brews into a rounded chai base with aroma, body, and comfort.',
    },
    'highland-roast': {
        name: 'Highland Roast',
        label: 'Roast',
        category: 'coffee',
        price: 620,
        image: 'images/coffeedetail1.jpg',
        backHref: 'coffee.html',
        description: 'Balanced estate coffee with warm body, gentle sweetness, and a smooth finish. A reliable roast for morning cups and slow weekend brews.',
    },
    'shade-grown-beans': {
        name: 'Shade Grown Beans',
        label: 'Single Estate',
        category: 'coffee',
        price: 620,
        image: 'images/coffeedetail2.jpg',
        backHref: 'coffee.html',
        description: 'Beans grown under tree cover for a rounded cup profile and calm acidity. The cup leans rich, earthy, and aromatic with a clean finish.',
    },
    'filter-coffee-blend': {
        name: 'Filter Coffee Blend',
        label: 'Classic',
        category: 'coffee',
        price: 620,
        image: 'images/coffeedetail3.jpg',
        backHref: 'coffee.html',
        description: 'A dependable blend for everyday brewing, rich aroma, and satisfying body. Built for traditional filter coffee and milk-forward cups.',
    },
    'estate-black-pepper': {
        name: 'Estate Black Pepper',
        label: 'Premium',
        category: 'pepper',
        price: 890,
        image: 'images/pepperdetail1.jpg',
        backHref: 'pepper.html',
        description: 'Dense peppercorns with bright, lingering heat and layered aroma. A premium grade for grinding fresh over finished dishes or slow cooking.',
    },
    'vine-ripened-pepper': {
        name: 'Vine Ripened Pepper',
        label: 'Organic',
        category: 'pepper',
        price: 890,
        image: 'images/pepperdetail2.jpg',
        backHref: 'pepper.html',
        description: 'Pepper harvested at peak maturity for deeper aroma and fuller warmth. It brings a clean bite to everyday cooking and spice blends.',
    },
    'kitchen-crack-pepper': {
        name: 'Kitchen Crack Pepper',
        label: 'Everyday',
        category: 'pepper',
        price: 890,
        image: 'images/pepperdetail3.jpg',
        backHref: 'pepper.html',
        description: 'Reliable pepper for grinding, seasoning, and daily use. The flavor is warm, direct, and balanced enough for repeated kitchen work.',
    },
    'wild-cloves': {
        name: 'Wild Cloves',
        label: 'Whole Buds',
        category: 'cloves',
        price: 1480,
        image: 'images/clovesdetail1.jpg',
        backHref: 'cloves.html',
        description: 'Whole cloves with concentrated warmth, sweet spice, and a lasting aroma. A strong choice for festive cooking, masalas, and slow infusions.',
    },
    'select-grade-cloves': {
        name: 'Select Grade Cloves',
        label: 'Aromatic',
        category: 'cloves',
        price: 1480,
        image: 'images/clovesdetail2.jpg',
        backHref: 'cloves.html',
        description: 'Selected buds with balanced oil, fragrance, and color. This grade brings steady clove character to both sweet and savory preparations.',
    },
    'masala-clove-grade': {
        name: 'Masala Clove Grade',
        label: 'Blend Ready',
        category: 'cloves',
        price: 1480,
        image: 'images/clovesdetail3.jpg',
        backHref: 'cloves.html',
        description: 'A stronger clove grade prepared for festive cooking, pantry masalas, and bold spice blends. It gives warmth and depth in small amounts.',
    },
    'golden-root': {
        name: 'Golden Root',
        label: 'Whole',
        category: 'turmeric',
        price: 680,
        image: 'images/turmericdetail1.jpg',
        backHref: 'turmeric.html',
        description: 'Whole turmeric roots with warm earthiness, deep color, and natural brightness. Ideal for grating, drying, grinding, or slow kitchen preparations.',
    },
    'curcumin-rich': {
        name: 'Curcumin Rich',
        label: 'Bright',
        category: 'turmeric',
        price: 680,
        image: 'images/turmericdetail2.jpg',
        backHref: 'turmeric.html',
        description: 'A vivid turmeric lot selected for aroma, purity, and naturally bright tone. It adds color and warmth to cooking, drinks, and blends.',
    },
    'kitchen-powder-grade': {
        name: 'Kitchen Powder Grade',
        label: 'Fine',
        category: 'turmeric',
        price: 680,
        image: 'images/turmericdetail3.jpg',
        backHref: 'turmeric.html',
        description: 'Finely prepared turmeric suited for daily cooking and warm blends. The grade is dependable, clean, and easy to measure in everyday recipes.',
    },
    'traditional-ghee': {
    name: 'Traditional Ghee',
    label: 'Classic',
    category: 'ghee',
    price: 2000,
    image: 'images/gheedetail1.jpg',
    backHref: 'ghee.html',
    description: 'A pure everyday ghee with rounded aroma and smooth depth. Made for rice, rotis, roasting, and simple meals where clean richness matters.',
},

'golden-reserve-ghee': {
    name: 'Golden Reserve Ghee',
    label: 'Reserve',
    category: 'ghee',
    price: 4500,
    image: 'images/gheedetail2.jpg',
    backHref: 'ghee.html',
    description: 'Slow-finished ghee with deeper fragrance and a premium table presence. It brings a golden aroma to sweets, finishing, and festive cooking.',
},

'cooking-grade-ghee': {
    name: 'Cooking Grade Ghee',
    label: 'Kitchen',
    category: 'ghee',
    price: 8000,
    image: 'images/gheedetail3.jpg',
    backHref: 'ghee.html',
    description: 'A dependable kitchen ghee for daily cooking, roasting, and tempering. Built for steady flavor and practical use across everyday meals.',
},
    'highland-fresh-ginger': {
        name: 'Highland Fresh Ginger',
        label: 'Fresh',
        category: 'ginger',
        price: 360,
        image: 'images/gingerdetail1.jpg',
        backHref: 'ginger.html',
        description: 'Bright, juicy roots selected for clean heat and fresh aroma. Excellent for tea, broths, marinades, and recipes that need lively warmth.',
    },
    'spice-grade-ginger': {
        name: 'Spice Grade Ginger',
        label: 'Bold',
        category: 'ginger',
        price: 360,
        image: 'images/gingerdetail2.jpg',
        backHref: 'ginger.html',
        description: 'A stronger ginger lot prepared for tea, masala blends, and warming recipes. The profile is punchy, aromatic, and deeply comforting.',
    },
    'daily-kitchen-ginger': {
        name: 'Daily Kitchen Ginger',
        label: 'Kitchen',
        category: 'ginger',
        price: 360,
        image: 'images/gingerdetail3.jpg',
        backHref: 'ginger.html',
        description: 'Balanced roots prepared for everyday cooking and infusions. A useful kitchen grade with clean warmth and reliable freshness.',
    },
};

const productDetailAliases = {
    'estate-green-cardamom': 'masala-cardamom',
    'high-range-bold': 'bold',
    'chai-grade-cardamom': 'chai',
    'bulk-cardamom': 'bulk',
    'small-cardamom': 'small',
    'open-cardamom': 'open',
    'seed-cardamom': 'seed',
    'fruit-cardamom': 'fruit',
    'bold-cardamom': 'bold',
    'super-bold-cardamom': 'superbold',
    'super-bold': 'superbold',
    'extra-bold-cardamom': 'extrabold',
    'extra-bold': 'extrabold',
    'premium-pepper': 'estate-black-pepper',
    'organic-pepper': 'vine-ripened-pepper',
    'bold-pepper': 'kitchen-crack-pepper',
    'malabar-bold': 'estate-black-pepper',
    'vine-ripened-select': 'vine-ripened-pepper',
    'highland-blossom': 'highland-blossom-honey',
    'estate-golden-jar': 'golden-spice-honey',
    'morning-leaf': 'estate-green-tea',
    'estate-breakfast': 'spiced-chai-tea',
    'estate-roast': 'highland-roast',
    'monsoon-blend': 'shade-grown-beans',
    'highland-bean': 'filter-coffee-blend',
    'aroma-reserve': 'select-grade-cloves',
    'culinary-select': 'masala-clove-grade',
};

const productPageCartStorageKey = 'vrindhavanamProductVarietyCart';
let productPageCart = [];
let productPageToastTimer;

function ensureProductCartDrawer() {
    if (!document.querySelector('.product-buy-btn, .product-detail-buy-btn')) {
        return;
    }

    if (!document.querySelector('.cart-btn')) {
        const navRight = document.querySelector('.nav-right');
        if (navRight) {
            navRight.insertAdjacentHTML('beforeend', `
                <button class="cart-btn" onclick="openCart()">
                    Cart
                    <span class="cart-count" id="cartCount">0</span>
                </button>
            `);
        }
    }

    if (document.getElementById('cartDrawer')) {
        return;
    }

    document.body.insertAdjacentHTML('beforeend', `
        <div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
        <div class="cart-drawer" id="cartDrawer">
            <div class="cart-header">
                <h3>Your Cart</h3>
                <button class="cart-close" onclick="closeCart()">x</button>
            </div>
            <div class="cart-items" id="cartItems">
                <div class="cart-empty">Cart<p>Your cart is empty.<br>Add some spices!</p></div>
            </div>
            <div class="cart-footer" id="cartFooter" style="display:none">
                <div class="cart-total">
                    <span class="cart-total-label">Total</span>
                    <span class="cart-total-val" id="cartTotal">\u20b90</span>
                </div>
                <button class="checkout-btn" onclick="showToast('Redirecting to checkout...')">Proceed to Checkout</button>
            </div>
        </div>
        <div class="toast" id="toast"></div>
    `);
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(productPageToastTimer);
    productPageToastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function parseCartPrice(price) {
    return Number(String(price).replace(/[^0-9]/g, '')) || 0;
}

function formatProductPagePrice(price) {
    return '\u20b9' + Number(price || 0).toLocaleString('en-IN');
}

function getProductVarietyPageHref(category) {
    return productVarietyPageHrefs[category] || 'index.html#products';
}

function escapeCartText(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[char]);
}

function saveProductPageCart() {
    try {
        localStorage.setItem(productPageCartStorageKey, JSON.stringify(productPageCart));
    } catch (error) {
        return;
    }
}

function loadProductPageCart() {
    try {
        const storedCart = JSON.parse(localStorage.getItem(productPageCartStorageKey) || '[]');
        productPageCart = Array.isArray(storedCart)
            ? storedCart.filter(item => item && item.key && item.name && Number(item.price) > 0)
            : [];
    } catch (error) {
        productPageCart = [];
    }
}

function getVarietyCartKey(category, name) {
    return `${category}:${String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function getVarietyCategory(text) {
    const value = String(text).toLowerCase();
    if (value.includes('cardamom')) return 'cardamom';
    if (value.includes('pepper')) return 'pepper';
    if (value.includes('turmeric')) return 'turmeric';
    if (value.includes('clove')) return 'cloves';
    if (value.includes('tea') || value.includes('chai')) return 'tea';
    if (value.includes('coffee') || value.includes('roast') || value.includes('bean')) return 'coffee';
    if (value.includes('honey') || value.includes('blossom')) return 'honey';
    if (value.includes('ghee')) return 'ghee';
    if (value.includes('ginger')) return 'ginger';
    return 'cardamom';
}

function getProductPageImageForName(name) {
    const category = getVarietyCategory(name);
    return varietyCartDefaults[category].image;
}

function updateProductPageCartUI() {
    const countEl = document.getElementById('cartCount');
    const totalEl = document.getElementById('cartTotal');
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');

    if (!totalEl || !itemsEl || !footerEl) {
        return;
    }

    const count = productPageCart.reduce((total, item) => total + item.qty, 0);
    const total = productPageCart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (countEl) {
        countEl.textContent = count;
    }
    totalEl.textContent = '\u20b9' + total.toLocaleString('en-IN');

    if (!productPageCart.length) {
        itemsEl.innerHTML = '<div class="cart-empty">Cart<p>Your cart is empty.<br>Add some spices!</p></div>';
        footerEl.style.display = 'none';
        return;
    }

    footerEl.style.display = 'block';
    itemsEl.innerHTML = productPageCart.map(item => `
        <div class="cart-item">
            <img src="${escapeCartText(item.image)}" class="cart-item-img" alt="${escapeCartText(item.name)}">
            <div class="cart-item-info">
                <div class="cart-item-name">${escapeCartText(item.name)}</div>
                <div class="cart-item-meta">\u20b9${item.price.toLocaleString('en-IN')} each</div>
                <div class="cart-qty">
                    <button class="qty-btn" onclick="changeQty('${item.key}', -1)">-</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.key}', 1)">+</button>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem">
                <div class="cart-item-price">\u20b9${(item.price * item.qty).toLocaleString('en-IN')}</div>
                <button class="cart-remove" onclick="removeFromCart('${item.key}')">Remove</button>
            </div>
        </div>
    `).join('');
}

function addProductPageCartItem(name, price, image, category) {
    const key = getVarietyCartKey(category, name);
    const existing = productPageCart.find(item => item.key === key);

    if (existing) {
        existing.qty++;
    } else {
        productPageCart.push({ key, category, name, price, image, qty: 1 });
    }

    saveProductPageCart();
    updateProductPageCartUI();
    showToast(name + ' added to cart');
}

window.addToCart = function addToCart(name, price, image) {
    const category = getVarietyCategory(name);
    const priceValue = typeof price === 'number' ? price : parseCartPrice(price);
    addProductPageCartItem(String(name), priceValue, image || getProductPageImageForName(name), category);
};

window.removeFromCart = function removeFromCart(key) {
    productPageCart = productPageCart.filter(item => item.key !== key);
    saveProductPageCart();
    updateProductPageCartUI();
};

window.changeQty = function changeQty(key, delta) {
    const item = productPageCart.find(cartItem => cartItem.key === key);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        window.removeFromCart(key);
    } else {
        saveProductPageCart();
        updateProductPageCartUI();
    }
};

function addVarietyTileToCart(button) {
    const card = button.closest('.product-variety-card');
    if (!card) return;

    const nameEl = card.querySelector('.product-variety-name');
    let name = nameEl?.textContent.trim() || 'Product Variety';
    const pageTitle = document.querySelector('.product-page .section-title')?.textContent || name;
    const category = getVarietyCategory(pageTitle + ' ' + name);

    const image = card.querySelector('.product-variety-image')?.getAttribute('src') || getProductPageImageForName(name);
    const select = card.querySelector('.weight-select');
    let price = 0;

    if (select) {
        price = Number(select.value) || 0;
        const selectedText = select.options[select.selectedIndex].text;
        const weight = selectedText.split('—')[0].trim();
        name = `${name} (${weight})`;
    } else {
        const priceText = card.querySelector('.product-variety-price')?.textContent || card.querySelector('.product-price')?.textContent || '';
        price = parseCartPrice(priceText);
    }

    addProductPageCartItem(name, price, image, category);
}

function getCurrentProductId() {
    const bodyProductClass = Array.from(document.body.classList)
        .find(className => className.startsWith('product-') && className !== 'product-page');

    if (bodyProductClass) {
        return bodyProductClass.replace('product-', '');
    }

    const fileName = window.location.pathname.split('/').pop().toLowerCase();
    const fileProductMap = {
        'cardamom.html': 'cardamom',
        'product1.html': 'cardamom',
        'honey.html': 'honey',
        'product2.html': 'honey',
        'tea.html': 'tea',
        'product3.html': 'tea',
        'coffee.html': 'coffee',
        'product4.html': 'coffee',
        'pepper.html': 'pepper',
        'black-pepper.html': 'pepper',
        'product5.html': 'pepper',
        'cloves.html': 'cloves',
        'product6.html': 'cloves',
        'turmeric.html': 'turmeric',
        'product7.html': 'turmeric',
        'ghee.html': 'ghee',
        'ginger.html': 'ginger',
    };

    return fileProductMap[fileName] || '';
}

function renderOtherHandpickedProducts() {
    const grid = document.querySelector('.other-products-grid');
    if (!grid) return;

    const currentProductId = getCurrentProductId();
    const products = otherHandpickedProducts.filter(product => product.id !== currentProductId);

    grid.innerHTML = products.map(product => {
        const image = escapeCartText(product.image);
        return `
            <a class="other-product-card" href="${escapeCartText(product.href)}" style="--product-image:url('${image}');background-image:linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(5, 15, 5, 0.78)), url('${image}');">
                <span class="other-product-label">${escapeCartText(product.label)}</span>
                <span class="other-product-name">${escapeCartText(product.name)}</span>
            </a>
        `;
    }).join('');
}

function slugifyProductDetailKey(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function normalizeProductDetailKey(key) {
    const slug = slugifyProductDetailKey(key);
    return productDetailAliases[slug] || slug;
}

function getProductDetailFromParams() {
    const params = new URLSearchParams(window.location.search);
    const key = normalizeProductDetailKey(params.get('product'));
    const backParam = params.get('back');

    if (productDetailCatalog[key]) {
        const product = { ...productDetailCatalog[key] };
        if (backParam) {
            product.backHref = backParam;
        }
        return product;
    }

    const name = params.get('name');
    if (!name) {
        return null;
    }

    const category = getVarietyCategory(`${params.get('category') || ''} ${name}`);
    const defaults = varietyCartDefaults[category] || varietyCartDefaults.cardamom;

    return {
        name,
        label: params.get('label') || 'Estate Selection',
        category,
        price: Number(params.get('price')) || defaults.price,
        image: params.get('image') || defaults.image,
        backHref: backParam || params.get('back') || getProductVarietyPageHref(category),
        description: params.get('description') || 'A carefully selected estate product prepared for clean aroma, natural flavor, and everyday kitchen use.',
    };
}

function getProductDetailKeyForCard(card) {
    if (!card) return '';

    const explicit = normalizeProductDetailKey(card.dataset.detailProduct);
    if (productDetailCatalog[explicit]) return explicit;

    const idKey = normalizeProductDetailKey(card.id);
    if (productDetailCatalog[idKey]) return idKey;

    const name = card.querySelector('.product-variety-name')?.textContent;
    const nameKey = normalizeProductDetailKey(name);
    if (productDetailCatalog[nameKey]) return nameKey;

    return nameKey || idKey;
}

function getProductDetailHrefForCard(card) {
    const key = getProductDetailKeyForCard(card);
    const name = card.querySelector('.product-variety-name')?.textContent.trim() || 'Product Variety';
    
    // Ensure card has an ID for returning navigation hash
    if (!card.id) {
        card.id = slugifyProductDetailKey(name);
    }
    const backPath = (window.location.pathname.split('/').pop() || 'index.html') + '#' + card.id;

    if (productDetailCatalog[key]) {
        return `product-detail.html?product=${encodeURIComponent(key)}&back=${encodeURIComponent(backPath)}`;
    }

    const label = card.querySelector('.product-variety-label')?.textContent.trim() || 'Estate Selection';
    const description = card.querySelector('.product-variety-copy')?.textContent.trim() || '';
    const image = card.querySelector('.product-variety-image')?.getAttribute('src') || '';
    const pageTitle = document.querySelector('.product-page .section-title')?.textContent || '';
    const category = getVarietyCategory(`${pageTitle} ${name}`);
    const price = varietyCartDefaults[category]?.price || varietyCartDefaults.cardamom.price;
    const params = new URLSearchParams({
        name,
        label,
        description,
        image,
        category,
        price: String(price),
        back: backPath,
    });

    return `product-detail.html?${params.toString()}`;
}

function ensureProductVarietyDetailButtons() {
    document.querySelectorAll('.product-variety-card').forEach(card => {
        const buyButton = card.querySelector(':scope > .product-buy-btn') || card.querySelector('.product-variety-actions .product-buy-btn');
        const existingDetailsButton = card.querySelector('.cardamom-details-btn, .product-details-btn');
        const nameEl = card.querySelector('.product-variety-name');
        const name = nameEl?.textContent.trim() || 'Product Variety';
        const pageTitle = document.querySelector('.product-page .section-title')?.textContent || name;
        const category = getVarietyCategory(`${pageTitle} ${name}`);
        const defaults = varietyCartDefaults[category] || varietyCartDefaults.cardamom;
        let actions = card.querySelector('.product-variety-actions');

        // Ensure card has an ID so hash fragments can navigate to it
        if (!card.id) {
            card.id = slugifyProductDetailKey(name);
        }

        // Add price element if not present
        let priceEl = card.querySelector('.product-variety-price');
        if (!priceEl) {
            priceEl = document.createElement('span');
            priceEl.className = 'product-variety-price';
            priceEl.textContent = "Loading...";

            if (nameEl) {
                nameEl.insertAdjacentElement('afterend', priceEl);
            } else {
                card.appendChild(priceEl);
            }
        }

        if (buyButton) {
            buyButton.textContent = 'Buy Now';
            buyButton.setAttribute('aria-label', `Buy ${name} now`);
        }

        if (!actions && buyButton) {
            actions = document.createElement('div');
            actions.className = 'product-variety-actions';
            buyButton.insertAdjacentElement('afterend', actions);
            actions.appendChild(buyButton);
        }

        // Ensure the weight display element (.product-price) exists above the dropdown
        let productPrice = card.querySelector('.product-price');
        if (!productPrice) {
            productPrice = document.createElement('div');
            productPrice.className = 'product-price';
            
            const existingSelect = card.querySelector('.weight-select');
            if (existingSelect) {
                card.insertBefore(productPrice, existingSelect);
            } else if (actions) {
                card.insertBefore(productPrice, actions);
            } else {
                card.appendChild(productPrice);
            }
        }

        // Add dropdown if not present
        let select = card.querySelector('.weight-select');
        if (!select) {
            select = document.createElement('select');
            select.className = 'weight-select';
            select.style.margin = '0.5rem 0';
            select.style.width = '100%';
            select.style.maxWidth = '180px';
            select.style.boxSizing = 'border-box';
            
            const weightOptions = [
                { weight: '50g', multiplier: 0.2 },
                { weight: '100g', multiplier: 0.4 },
                { weight: '250g', multiplier: 1.0 },
                { weight: '500g', multiplier: 1.8 },
                { weight: '1kg', multiplier: 3.2 }
            ];
            
            weightOptions.forEach((opt, idx) => {
                const optEl = document.createElement('option');
                const calculatedPrice = Math.round(defaults.price * opt.multiplier);
                optEl.value = calculatedPrice;
                optEl.textContent = `${opt.weight} — ${formatProductPagePrice(calculatedPrice)}`;
                if (idx === 0) {
                    optEl.selected = true;
                }
                select.appendChild(optEl);
            });
            
            const updateCardPrices = () => {
                const selectedOption = select.options[select.selectedIndex];
                const weightText = selectedOption ? selectedOption.text.split('—')[0].trim() : '';
                const selectedPrice = formatProductPagePrice(select.value);
                
                if (productPrice) {
                    productPrice.textContent = weightText;
                }
                if (priceEl) {
                    priceEl.textContent = selectedPrice;
                }
            };
            
            select.addEventListener('change', updateCardPrices);
            updateCardPrices();
            
            if (actions) {
                card.insertBefore(select, actions);
            } else {
                card.appendChild(select);
            }
        }

        const detailsButton = existingDetailsButton || document.createElement('a');
        detailsButton.href = getProductDetailHrefForCard(card);
        detailsButton.textContent = 'Details';
        detailsButton.classList.add('product-details-btn');
        detailsButton.setAttribute('aria-label', `View details for ${name}`);

        if (actions) {
            if (buyButton && buyButton.parentElement !== actions) {
                actions.appendChild(buyButton);
            }

            actions.insertBefore(detailsButton, buyButton || actions.firstElementChild);
        } else if (!existingDetailsButton) {
            card.appendChild(detailsButton);
        }
    });
}

async function renderProductDetailPage() {
    const detailRoot = document.getElementById('productDetailPage');
    if (!detailRoot) return;

    const product = getProductDetailFromParams();

    console.log("DETAIL PAGE PRODUCT:", product);

    const productId =
        new URLSearchParams(window.location.search)
            .get('productId');

    console.log("PRODUCT ID:", productId);

    const fallback = document.getElementById('productDetailFallback');
    
    if (!product) {
        detailRoot.hidden = true;
        if (fallback) fallback.hidden = true;
        return;
    }

    document.body.classList.add(`product-${product.category}`);
    document.title = `${product.name} | Vrindhavanam Estate`;

    const image = document.getElementById('detailImage');
    const label = document.getElementById('detailLabel');
    const name = document.getElementById('detailName');
    const description = document.getElementById('detailDescription');
    const price = document.getElementById('detailPrice');
    const back = document.getElementById('detailBack');
    const floatingBack = document.getElementById('floatingBackBtn');
    const buyButton = document.getElementById('detailBuyButton');

    if (image) {
        image.src = product.image;
        image.alt = product.name;
    }
    if (label) label.textContent = product.label;
    if (name) name.textContent = product.name;
    if (description) description.textContent = product.description;
    if (price) price.textContent = formatProductPagePrice(product.price);
    
    const backUrl = product.backHref || getProductVarietyPageHref(product.category);
    if (back) back.href = backUrl;
    if (floatingBack) floatingBack.href = backUrl;

    // Add weight select dropdown for details page
    let select = document.getElementById('detailWeightSelect');
    if (!select && buyButton) {
        select = document.createElement('select');
        select.id = 'detailWeightSelect';
        select.className = 'weight-select';
        select.style.margin = '1rem 0';
        select.style.padding = '0.5rem';
        select.style.width = '100%';
        select.style.maxWidth = '240px';
        select.style.display = 'block';
        buyButton.insertAdjacentElement('beforebegin', select);
    }

    if (select) {
        select.innerHTML = '';
        const weightOptions = [
            { weight: '50g', multiplier: 0.2 },
            { weight: '100g', multiplier: 0.4 },
            { weight: '250g', multiplier: 1.0 },
            { weight: '500g', multiplier: 1.8 },
            { weight: '1kg', multiplier: 3.2 }
        ];
        
        weightOptions.forEach((opt, idx) => {
            const optEl = document.createElement('option');
            const weightNumber = parseFloat(opt.weight.replace(/[^\d.]/g, ''));
            const calculatedPrice = Math.round(Number(product.price) * opt.multiplier);
            optEl.value = calculatedPrice;
            optEl.textContent = `${opt.weight} — ${formatProductPagePrice(calculatedPrice)}`;
            if (idx === 0) {
                optEl.selected = true;
            }
            select.appendChild(optEl);
        });

        // Set initial price to matches default option (first option)
        if (price) price.textContent = formatProductPagePrice(select.value);

        select.addEventListener('change', () => {
            if (price) price.textContent = formatProductPagePrice(select.value);
        });
    }

    if (buyButton && select) {
        const newBuyButton = buyButton.cloneNode(true);
        buyButton.parentNode.replaceChild(newBuyButton, buyButton);
        newBuyButton.addEventListener('click', () => {
            const selectedText = select.options[select.selectedIndex].text;
            const weight = selectedText.split('—')[0].trim();
            const finalPrice = select.value;
            window.addToCart(`${product.name} (${weight})`, '₹' + finalPrice);
            openCart();
        });
    } else if (buyButton) {
        buyButton.addEventListener('click', () => {
            window.addToCart(product.name, '₹' + product.price);
            openCart();
        });
    }

    detailRoot.hidden = false;
    if (fallback) fallback.hidden = true;
}

// SMOOTH SCROLL (Mostly handled by CSS, but can add offset logic here if needed)
document.addEventListener('DOMContentLoaded', () => {
    ensureProductVarietyDetailButtons();

    const hasCartSurface = Boolean(document.querySelector('.product-buy-btn, .product-detail-buy-btn'));
    const productBuyButtons = document.querySelectorAll('.product-buy-btn');

    ensureProductCartDrawer();

    if (hasCartSurface) {
        loadProductPageCart();
        updateProductPageCartUI();
    }

    if (window.location.hash === '#cartDrawer') {
        openCart();
    }

    productBuyButtons.forEach(button => {
        button.addEventListener('click', event => {
            if (!button.closest('.product-variety-card')) {
                return;
            }
            event.preventDefault();
            addVarietyTileToCart(button);
        });
    });

    renderProductDetailPage();
    renderOtherHandpickedProducts();

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!navToggle || !navLinks) return;

    const closeMenu = () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });

    // Smooth scroll and pulse target card if returning with a hash fragment
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetCard = document.getElementById(hash);
        if (targetCard) {
            setTimeout(() => {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetCard.classList.add('highlight-pulse');
            }, 300);
        }
    }
});
