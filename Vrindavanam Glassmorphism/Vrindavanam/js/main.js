// CART STATE
let cart = [];
let cartOpen = false;

function addToCart(name, price, emoji, selectId) {
    let finalName = name;
    if (selectId) {
        const select = document.getElementById(selectId);
        if (select) {
            const selectedText = select.options[select.selectedIndex].text;
            const weight = selectedText.split('—')[0].trim();
            finalName = `${name} (${weight})`;
        }
    }
    const numPrice = parseInt(price.replace(/[^0-9]/g, ''));
    const existing = cart.find(i => i.name === finalName);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name: finalName, price: numPrice, emoji, qty: 1 });
    }
    updateCartUI();
    openCart();
    showToast(finalName + ' added to cart');
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
    const baseName = name.replace(/\s*\([^)]+\)$/, '');
    const map = {
        'Cardamom Reserve': 'images/plantation17.jpg',
        'Malabar Pepper': 'images/plantation14.jpg',
        'Cardamom Reserve Batch 12': 'images/plantation17.jpg',
        'Wild Honey Pepper Batch 3': 'images/plantation14.jpg',
        'Saffron-Touch Turmeric Batch 7': 'images/plantation16.jpg',
        'Lakadong Turmeric': 'images/plantation16.jpg',
        'Wild Cloves': 'images/plantation13.jpg',
        'Organic Highland Tea': 'images/tea.jpg',
        'Premium Estate Coffee': 'images/coffee1.jpg',
        'Organic Forest Honey': 'images/honey.jpg'
    };
    return map[baseName] || 'images/plantation 2.jpg';
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
    const farms = ['Vrindhavanam Estate, Idukki', 'Hillcrest Plot, Munnar', 'Mist Valley Farm, Wayanad', 'Sunrise Ridge, Thekkady'];
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

function clearProductValueLinks() {
    document.querySelectorAll('.handpicked-tile.is-linked, .why-card.is-linked').forEach(el => {
        el.classList.remove('is-linked');
    });
}

function highlightProductValue(targetId, sourceCard) {
    clearProductValueLinks();
    const target = document.getElementById(targetId);

    if (sourceCard) {
        sourceCard.classList.add('is-linked');
    }

    if (target) {
        target.classList.add('is-linked');
    }
}

function connectWhyProduct(event, targetId, message) {
    if (event) {
        event.preventDefault();
    }

    const sourceCard = event ? event.currentTarget : null;
    const target = document.getElementById(targetId);
    highlightProductValue(targetId, sourceCard);

    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (typeof showToast === 'function' && message) {
        showToast(message);
    }
}

const handpickedProducts = {
    cardamom: {
        title: 'Cardamom',
        kicker: 'Single Origin Collection',
        overview: 'Estate-grown cardamom selected for clean eucalyptus aroma, bright sweetness, and a long highland finish.',
        image: 'images/plantation17.jpg',
        varieties: [
            { title: 'Estate Green Pods', label: 'Whole Pods', image: 'images/plantation17.jpg' },
            { title: 'Reserve Micro-Lot', label: 'Small Batch', image: 'images/plantation11.jpg' },
            { title: 'Kitchen Grade Select', label: 'Daily Use', image: 'images/plantation12.jpg' },
        ],
    },
    honey: {
        title: 'Honey',
        kicker: 'Naturally Pure Collection',
        overview: 'Raw forest honey collected with minimal processing so the floral aroma and natural body stay intact.',
        image: 'images/honey.jpg',
        varieties: [
            { title: 'Wild Forest Honey', label: 'Raw', image: 'images/honey.jpg' },
            { title: 'Highland Blossom', label: 'Floral', image: 'images/beautiful1.jpg' },
            { title: 'Estate Golden Jar', label: 'Limited', image: 'images/beautiful3.jpg' },
        ],
    },
    tea: {
        title: 'Tea',
        kicker: 'Farm Fresh Collection',
        overview: 'Highland tea packed close to harvest for a clean cup, soft tannins, and a fresh estate aroma.',
        image: 'images/tea.jpg',
        varieties: [
            { title: 'Highland Black Tea', label: 'Bold', image: 'images/tea.jpg' },
            { title: 'Morning Leaf', label: 'Fresh', image: 'images/plantation3.jpg' },
            { title: 'Estate Breakfast', label: 'Classic', image: 'images/beautiful.jpg' },
        ],
    },
    coffee: {
        title: 'Coffee',
        kicker: 'Fair Grown Collection',
        overview: 'Estate-partnered coffee with a rounded body, gentle spice, and careful post-harvest handling.',
        image: 'images/coffee1.jpg',
        varieties: [
            { title: 'Estate Roast', label: 'Medium', image: 'images/coffee1.jpg' },
            { title: 'Monsoon Blend', label: 'Deep', image: 'images/coffee.jpg' },
            { title: 'Highland Bean', label: 'Aromatic', image: 'images/plantation8.jpg' },
        ],
    },
    blackPepper: {
        title: 'Black Pepper',
        kicker: 'Quality Checked Collection',
        overview: 'Bold peppercorns selected for heat, clean bite, and the warm aromatic lift expected from Kerala vines.',
        image: 'images/plantation14.jpg',
        varieties: [
            { title: 'Malabar Bold', label: 'Whole', image: 'images/plantation14.jpg' },
            { title: 'Vine-Ripened Select', label: 'Premium', image: 'images/plantation15.jpg' },
            { title: 'Kitchen Crack Pepper', label: 'Everyday', image: 'images/plantation19.jpg' },
        ],
    },
    cloves: {
        title: 'Cloves',
        kicker: 'Sustainable Collection',
        overview: 'Cloves harvested with low-waste practices and cured for deep warmth, sweetness, and lasting aroma.',
        image: 'images/plantation13.jpg',
        varieties: [
            { title: 'Wild Cloves', label: 'Whole Buds', image: 'images/plantation13.jpg' },
            { title: 'Aroma Reserve', label: 'Intense', image: 'images/plantation20.jpg' },
            { title: 'Culinary Select', label: 'Balanced', image: 'images/plantation23.jpg' },
        ],
    },
    turmeric: {
        title: 'Turmeric',
        kicker: 'Soil First Collection',
        overview: 'Naturally raised turmeric with rich color, earthy sweetness, and careful drying for kitchen-ready purity.',
        image: 'images/plantation16.jpg',
        varieties: [
            { title: 'Golden Root', label: 'Whole', image: 'images/plantation16.jpg' },
            { title: 'Curcumin Rich', label: 'Bright', image: 'images/plantation25.jpg' },
            { title: 'Kitchen Powder Grade', label: 'Fine', image: 'images/plantation27.jpg' },
        ],
    },
};

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[char]);
}

function handpickedTileImageStyle(image) {
    const safeImage = escapeHtml(image);
    return `--detail-image: url('${safeImage}'); background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.06), rgba(5, 15, 5, 0.72)), url('${safeImage}');`;
}

function renderHandpickedDetail(productKey, sourceTile) {
    const detail = document.getElementById('handpicked-detail');
    const product = handpickedProducts[productKey];
    if (!detail || !product) return;

    if (sourceTile && sourceTile.parentElement) {
        sourceTile.after(detail);
    }

    document.querySelectorAll('.handpicked-tile').forEach(tile => {
        const isActive = tile === sourceTile;
        tile.classList.toggle('is-active', isActive);
        tile.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    const varieties = product.varieties.map(variety => `
        <div class="handpicked-variety-tile">
            <img class="handpicked-variety-image" src="${escapeHtml(variety.image)}" alt="${escapeHtml(variety.title)}">
            <span class="handpicked-variety-title">${escapeHtml(variety.title)}</span>
            ${variety.copy ? `<span class="handpicked-variety-copy">${escapeHtml(variety.copy)}</span>` : ''}
            <span class="handpicked-variety-label">${escapeHtml(variety.label)}</span>
        </div>
    `).join('');

    detail.innerHTML = `
        <div class="handpicked-detail-shell">
            <div class="handpicked-detail-head">
                <div>
                    <div class="handpicked-detail-kicker">${escapeHtml(product.kicker)}</div>
                    <div class="handpicked-detail-title">${escapeHtml(product.title)} Varieties</div>
                </div>
                <button class="handpicked-detail-close" type="button" aria-label="Close handpicked details">x</button>
            </div>
            <div class="handpicked-variety-grid">
                ${varieties}
            </div>
            <div class="handpicked-main-tile" style="${handpickedTileImageStyle(product.image)}">
                <span class="handpicked-main-label">Main Product</span>
                <span class="handpicked-main-title">${escapeHtml(product.title)} Overview</span>
                <p class="handpicked-main-copy">${escapeHtml(product.overview)}</p>
            </div>
        </div>
    `;

    detail.hidden = false;
    requestAnimationFrame(() => detail.classList.add('is-open'));

    const closeButton = detail.querySelector('.handpicked-detail-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeHandpickedDetail);
    }

    detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeHandpickedDetail() {
    const detail = document.getElementById('handpicked-detail');
    if (!detail) return;

    detail.classList.remove('is-open');
    document.querySelectorAll('.handpicked-tile').forEach(tile => {
        tile.classList.remove('is-active');
        tile.setAttribute('aria-expanded', 'false');
    });

    setTimeout(() => {
        if (!detail.classList.contains('is-open')) {
            detail.hidden = true;
            detail.innerHTML = '';
        }
    }, 420);
}

function setupGroupedTileSlider(selector, groupSize = 3, direction = 'left') {
    const container = document.querySelector(selector);
    if (!container || container.querySelector('.tile-slider-track')) return;

    const cards = Array.from(container.children);
    if (!cards.length) return;

    const track = document.createElement('div');
    track.className = 'tile-slider-track';

    if (cards.length <= groupSize) return;

    const useRightMotion = direction === 'right' && cards.length === groupSize * 2;

    if (useRightMotion) {
        cards.slice(groupSize).forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
    }

    cards.forEach(card => track.appendChild(card));
    container.appendChild(track);

    if (!useRightMotion) {
        cards.slice(0, groupSize).forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
    }

    const originalGroups = Math.ceil(cards.length / groupSize);
    const loopGroup = originalGroups;
    let currentGroup = useRightMotion ? 1 : 0;

    const getStepSize = () => {
        const firstCard = track.children[0];
        const styles = window.getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap || 0);
        return firstCard.getBoundingClientRect().width + gap;
    };

    const moveToGroup = (group, animated = true) => {
        track.style.transition = animated ? 'transform 700ms ease' : 'none';
        track.style.transform = `translateX(${-group * groupSize * getStepSize()}px)`;
    };

    const advance = () => {
        if (useRightMotion) {
            if (currentGroup === 1) {
                currentGroup = 0;
                moveToGroup(currentGroup);

                window.setTimeout(() => {
                    currentGroup = 2;
                    moveToGroup(currentGroup, false);
                }, 720);
            } else {
                currentGroup = 1;
                moveToGroup(currentGroup);
            }

            return;
        }

        currentGroup += 1;
        moveToGroup(currentGroup);

        if (currentGroup === loopGroup) {
            window.setTimeout(() => {
                currentGroup = 0;
                moveToGroup(currentGroup, false);
            }, 720);
        }
    };

    moveToGroup(currentGroup, false);
    window.addEventListener('resize', () => moveToGroup(currentGroup, false));
    window.setInterval(advance, 5000);
}

function setupAboutRowExchange() {
    const container = document.querySelector('#about .about-pillars-exchange');
    if (!container) return;

    const rows = container.querySelectorAll('.about-pillars-row');
    if (rows.length < 2) return;

    const updateShift = () => {
        container.style.removeProperty('--about-tile-height');
        container.style.removeProperty('--about-row-height');

        const tiles = container.querySelectorAll('.pillar');
        const maxTileHeight = Math.max(...Array.from(tiles, tile => tile.offsetHeight));

        if (maxTileHeight) {
            container.style.setProperty('--about-tile-height', `${maxTileHeight}px`);
        }

        requestAnimationFrame(() => {
            const maxRowHeight = Math.max(...Array.from(rows, row => row.offsetHeight));
            const rowGap = parseFloat(window.getComputedStyle(container).getPropertyValue('--about-row-gap')) || 0;

            if (maxRowHeight) {
                container.style.setProperty('--about-row-height', `${maxRowHeight}px`);
                container.style.setProperty('--about-row-shift', `${maxRowHeight + rowGap}px`);
            }
        });
    };

    requestAnimationFrame(updateShift);
    window.addEventListener('resize', updateShift);
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    setupGroupedTileSlider('.why-grid');
    setupAboutRowExchange();

    // ENTER KEY FOR TRACE
    const batchInput = document.getElementById('batchInput');
    const productInput = document.getElementById('productInput');
    if (batchInput) batchInput.addEventListener('keydown', e => { if (e.key === 'Enter') traceSpice(); });
    if (productInput) productInput.addEventListener('keydown', e => { if (e.key === 'Enter') traceSpice(); });

    const productMessages = {
        'product-honey': '100% natural and safe connects to Honey.',
        'product-cardamom': 'Single Origin connects to Cardamom.',
        'product-cloves': 'Sustainable connects to Cloves.',
        'product-coffee': 'Fair Wages connects to Coffee.',
        'product-tea': 'Farm to Door connects to Tea.',
        'product-turmeric': 'Bio Cultures & Inputs connects to Turmeric.',
        'product-black-pepper': 'Lab Verified connects to Black Pepper.',
    };

    document.querySelectorAll('.why-card[data-product-target]').forEach(card => {
        const targetId = card.dataset.productTarget;
        const connect = event => connectWhyProduct(event, targetId, productMessages[targetId]);

        card.addEventListener('click', connect);
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                connect(event);
            }
        });
    });

    document.querySelectorAll('.handpicked-tile[data-handpicked-product]').forEach(tile => {
        if (!tile.getAttribute('href') || tile.getAttribute('href').startsWith('#')) {
            tile.addEventListener('click', event => {
                event.preventDefault();
                renderHandpickedDetail(tile.dataset.handpickedProduct, tile);
            });
        }
    });
});
