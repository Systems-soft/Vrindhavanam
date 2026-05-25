// CART STATE
let cart = [];
let cartOpen = false;

function addToCart(name, price, emoji) {
    const numPrice = parseInt(price.replace(/[^0-9]/g, ''));
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price: numPrice, emoji, qty: 1 });
    }
    updateCartUI();
    openCart();
    showToast(name + ' added to cart');
}

function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    updateCartUI();
}

function changeQty(name, delta) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) removeFromCart(name);
        else updateCartUI();
    }
}

function getImageForProduct(name) {
    const map = {
        'Cardamom Reserve': 'images/plantation17.jpg',
        'Malabar Pepper': 'images/plantation14.jpg',
        'Cardamom Reserve Batch 12': 'images/plantation17.jpg',
        'Wild Honey Pepper Batch 3': 'images/plantation14.jpg',
        'Saffron-Touch Turmeric Batch 7': 'images/plantation16.jpg',
        'Lakadong Turmeric': 'images/plantation16.jpg',
        'Wild Cloves': 'images/plantation13.jpg'
    };
    return map[name] || 'images/plantation 2.jpg';
}

function updateCartUI() {
    const countEl = document.getElementById('cartCount');
    const totalEl = document.getElementById('cartTotal');
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');

    if (!countEl || !totalEl || !itemsEl || !footerEl) {
        return;
    }

    const count = cart.reduce((a, i) => a + i.qty, 0);
    countEl.textContent = count;
    const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
    totalEl.textContent = '₹' + total.toLocaleString('en-IN');
    if (cart.length === 0) {
        itemsEl.innerHTML = '<div class="cart-empty">🛒<p>Your cart is empty.<br>Add some spices!</p></div>';
        footerEl.style.display = 'none';
    } else {
        footerEl.style.display = 'block';
        itemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
          <img src="${getImageForProduct(item.name)}" class="cart-item-img" alt="${item.name}">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-meta">₹${item.price.toLocaleString('en-IN')} each</div>
            <div class="cart-qty">
              <button class="qty-btn" onclick="changeQty('${item.name}',-1)">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty('${item.name}',1)">+</button>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem">
            <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
            <button class="cart-remove" onclick="removeFromCart('${item.name}')">✕</button>
          </div>
        </div>
      `).join('');
    }
}

// TRACE
function traceSpice() {
    const batchInput = document.getElementById('batchInput');
    const productInput = document.getElementById('productInput');
    const resultBatch = document.getElementById('resultBatch');
    const farmEl = document.getElementById('rFarm');
    const dryEl = document.getElementById('rDry');
    const traceResult = document.getElementById('traceResult');

    if (!batchInput || !productInput || !resultBatch || !farmEl || !dryEl || !traceResult) {
        return;
    }

    const batch = batchInput.value || 'VRD-2024-CRD-12';
    const product = productInput.value || 'Cardamom';
    resultBatch.textContent = batch;
    const farms = ['Vrindavanam Estate, Idukki', 'Hillcrest Plot, Munnar', 'Mist Valley Farm, Wayanad', 'Sunrise Ridge, Thekkady'];
    const methods = ['Sun-Dried, 6 Days', 'Shade Dried, 9 Days', 'Mechanical Drying, 48hrs', 'Traditional Kiln, 4 Days'];
    farmEl.textContent = farms[Math.floor(Math.random() * farms.length)];
    dryEl.textContent = methods[Math.floor(Math.random() * methods.length)];
    traceResult.classList.add('show');
    showToast(product + ' batch ' + batch + ' traced successfully');
}

// WEIGHT SELECT
function updatePrice(select, priceId) {
    const priceEl = document.getElementById(priceId);
    if (!select || !priceEl) return;

    const selectedText = select.options[select.selectedIndex].text;
    const label = selectedText.includes('—')
        ? selectedText.split('—')[1].trim()
        : '₹' + Number(select.value).toLocaleString('en-IN');

    priceEl.textContent = label;
}

// TOAST
let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    // ENTER KEY FOR TRACE
    const batchInput = document.getElementById('batchInput');
    const productInput = document.getElementById('productInput');
    if (batchInput) batchInput.addEventListener('keydown', e => { if (e.key === 'Enter') traceSpice(); });
    if (productInput) productInput.addEventListener('keydown', e => { if (e.key === 'Enter') traceSpice(); });
});
