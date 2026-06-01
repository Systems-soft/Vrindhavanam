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
    cardamom: { price: 1240, image: 'images/plantation17.jpg' },
    pepper: { price: 890, image: 'images/plantation14.jpg' },
    turmeric: { price: 680, image: 'images/plantation16.jpg' },
    cloves: { price: 1480, image: 'images/plantation13.jpg' },
    tea: { price: 450, image: 'images/tea.jpg' },
    coffee: { price: 620, image: 'images/coffee1.jpg' },
    honey: { price: 580, image: 'images/honey.jpg' },
    ghee: { price: 760, image: 'images/ghee1.jpg' },
    ginger: { price: 360, image: 'images/ginger1.jpg' },
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

const productPageCartStorageKey = 'vrindhavanamProductVarietyCart';
let productPageCart = [];
let productPageToastTimer;

function ensureProductCartDrawer() {
    if (!document.querySelector('.product-buy-btn')) {
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

if (typeof window.addToCart !== 'function') {
    window.addToCart = function addToCart(name, price) {
        const category = getVarietyCategory(name);
        addProductPageCartItem(name, parseCartPrice(price), getProductPageImageForName(name), category);
    };
}

window.removeFromCart = window.removeFromCart || function removeFromCart(key) {
    productPageCart = productPageCart.filter(item => item.key !== key);
    saveProductPageCart();
    updateProductPageCartUI();
};

window.changeQty = window.changeQty || function changeQty(key, delta) {
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

    const name = card.querySelector('.product-variety-name')?.textContent.trim() || 'Product Variety';
    const pageTitle = document.querySelector('.product-page .section-title')?.textContent || name;
    const category = getVarietyCategory(pageTitle + ' ' + name);
    const defaults = varietyCartDefaults[category];
    const image = card.querySelector('.product-variety-image')?.getAttribute('src') || defaults.image;

    addProductPageCartItem(name, defaults.price, image, category);
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

// SMOOTH SCROLL (Mostly handled by CSS, but can add offset logic here if needed)
document.addEventListener('DOMContentLoaded', () => {
    const productBuyButtons = document.querySelectorAll('.product-buy-btn');

    ensureProductCartDrawer();

    if (productBuyButtons.length) {
        loadProductPageCart();
        updateProductPageCartUI();
    }

    if (window.location.hash === '#cartDrawer') {
        openCart();
    }

    productBuyButtons.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            addVarietyTileToCart(button);
        });
    });

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
});
