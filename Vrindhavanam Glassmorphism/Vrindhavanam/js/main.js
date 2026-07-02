// CART STATE
let cart = [];
let cartOpen = false;
let productsData = [];

window.addToCart = function addToCart(name, price, emoji, selectId) {
    // If a navigation/cart module provides `addToCart`, delegate to it
    if (typeof window.addToCart === 'function' && window.addToCart !== addToCart) {
        try { window.addToCart(name, price); return; } catch (e) { /* fallthrough */ }
    }

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
    console.log("Cart array:", cart);
    updateCartUI();
    showToast(finalName + ' added to cart');
};
function addToCartFromAPI(productName) {

    console.log("Clicked:", productName); // ✅ ADD

    if (!productsData.length) {
        alert("Please wait, products are still loading...");
        return;
    }

    const product = productsData.find(
        p => p.product_name === productName
    );

    console.log("Found product:", product); // ✅ ADD

    if (!product) {
        console.log("Product not found");
        return;
    }

    window.addToCart(
    `${product.product_name}${product.weight ? ` (${product.weight})` : ""}`,
    "₹" + Number(product.price).toLocaleString("en-IN"),
    "🌿",
    null
);
}
window.removeFromCart = function removeFromCart(name) {
    // If a navigation/cart module provides `removeFromCart`, delegate to it
    if (typeof window.removeFromCart === 'function' && window.removeFromCart !== removeFromCart) {
        try { window.removeFromCart(name); return; } catch (e) { /* fallthrough */ }
    }

    if (Array.isArray(window.productPageCart)) {
        window.productPageCart =
            window.productPageCart.filter(
                item => item.name !== name && item.key !== name
            );

        if (typeof window.saveProductPageCart === 'function') {
            window.saveProductPageCart();
        }

        if (typeof window.updateProductPageCartUI === 'function') {
            window.updateProductPageCartUI();
        }

        return;
    }

    cart = cart.filter(i => i.name !== name);
    updateCartUI();
};

window.changeQty = function changeQty(name, delta) {
    // Delegate if navigation cart is present
    if (typeof window.changeQty === 'function' && window.changeQty !== changeQty) {
        try { window.changeQty(name, delta); return; } catch (e) { /* fallthrough */ }
    }

    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) window.removeFromCart(name);
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
        'Organic Forest Honey': 'images/honey.jpg',
        'Ashwagandha': 'images/ashwa.jpg',
        'Ashwagandha Root Powder': 'images/ashwa.jpg',
        'Ashwagandha Whole Root': 'images/gandha.jpg'
    };
    return map[baseName] || 'images/plantation 2.jpg';
}

function updateCartUI() {
    // If navigation module provides its own UI updater, prefer it to avoid
    // duplicate renderers clobbering each other's state.
    if (typeof window.updateProductPageCartUI === 'function' && window.updateProductPageCartUI !== updateCartUI) {
        try { window.updateProductPageCartUI(); return; } catch (e) { /* fallthrough */ }
    }
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
    const dateEl = document.getElementById('rDate');
    const dryEl = document.getElementById('rDry');
    const labEl = document.getElementById('rLab');
    const packEl = document.getElementById('rPack');
    const traceResult = document.getElementById('traceResult');
    
    const verifiedLabel = document.getElementById('verifiedLabel');
    const verifiedBadge = document.getElementById('verifiedBadge');
    
    const infoAltitude = document.getElementById('infoAltitude');
    const infoRainfall = document.getElementById('infoRainfall');
    const infoPurity = document.getElementById('infoPurity');

    if (!batchInput || !productInput || !resultBatch || !traceResult) {
        return;
    }

    const rawBatchVal = batchInput.value.trim();
    const rawProdVal = productInput.value.trim();
    
    const batchVal = rawBatchVal.toLowerCase();
    const prodVal = rawProdVal.toLowerCase();
    
    // We default to Cardamom P003 if no input is provided at all
    const batch = rawBatchVal || 'VRD-2024-CRD-12';
    const product = rawProdVal || 'Cardamom';
    resultBatch.textContent = batch;

    // Always fail search per requirements
    // Show Batch Not Verified label
    if (verifiedLabel) {
        verifiedLabel.textContent = "Batch Not Verified";
        verifiedLabel.className = "badge-warning-status";
        verifiedLabel.style.display = "block";
    }
    if (verifiedBadge) {
        verifiedBadge.style.display = "none";
    }

    // Inside dropdown sections (steps), show "Product Not Found"
    const notFoundHtml = `<span class="badge-warning-status" style="margin: 0.5rem auto 0; display: inline-block;">Product Not Found</span>`;
    if (farmEl) farmEl.innerHTML = notFoundHtml;
    if (dateEl) dateEl.innerHTML = notFoundHtml;
    if (dryEl) dryEl.innerHTML = notFoundHtml;
    if (labEl) labEl.innerHTML = notFoundHtml;
    if (packEl) packEl.innerHTML = notFoundHtml;

    // Metric fields replace with "Loading..."
    const loadingHtml = `<span style="opacity: 0.7;">Loading...</span>`;
    if (infoRainfall) infoRainfall.innerHTML = loadingHtml;
    if (infoAltitude) infoAltitude.innerHTML = loadingHtml;
    if (infoPurity) infoPurity.innerHTML = loadingHtml;

    traceResult.classList.add('show');
    showToast(`Trace Failed: Batch Not Verified ⚠️`);
}


// WEIGHT SELECT


// 1. LOAD PRODUCTS FIRST
// 1. LOAD PRODUCTS FIRST
document.addEventListener("DOMContentLoaded", () => {

    fetch("./data/products.json")
    .then(res => res.json())
    .then(data => {

        productsData = data;
window.productsData = data;

if (typeof ensureProductVarietyDetailButtons === 'function') {
    ensureProductVarietyDetailButtons();
}

console.log("Products loaded", productsData);
console.log("HONEY LOOP STARTED");
        // Update variety cards
        document.querySelectorAll(".product-variety-card").forEach(card => {
console.log("CARD FOUND");
            const name = card.querySelector(".product-variety-name")
                .textContent.trim();

            const product = data.find(p => {

                const apiName = p.variety_name.trim();

                return (
                    apiName === name ||
                    (apiName === "Biriyani" && name === "Biriyani Cardamom") ||
                    (apiName === "For Chai" && name === "Chai Cardamom") ||
                    (apiName === "Open/splits" && name === "Open") ||
                    (apiName === "Superbold" && name === "Super Bold") ||
                    (apiName === "Extrabold" && name === "Extra Bold")
                );
            });
        if (product) {
            const varietyPrice = card.querySelector(".product-variety-price");
            const mainPrice = card.querySelector(".product-price");
            const select = card.querySelector(".weight-select");

            if (select) {
                // Find all entries in data matching this variety
                const dbProducts = data.filter(p => {
                    const apiName = p.variety_name.trim();
                    return (
                        apiName === name ||
                        (apiName === "Biriyani" && name === "Biriyani Cardamom") ||
                        (apiName === "For Chai" && name === "Chai Cardamom") ||
                        (apiName === "Open/splits" && name === "Open") ||
                        (apiName === "Superbold" && name === "Super Bold") ||
                        (apiName === "Extrabold" && name === "Extra Bold")
                    );
                });

                if (dbProducts.length > 0) {
                    select.innerHTML = '';
                    const seenWeights = new Set();
                    dbProducts.forEach((item, idx) => {
                        const weight = (item.weight || "").trim().toLowerCase();
                        if (seenWeights.has(weight)) return;
                        seenWeights.add(weight);

                        const option = document.createElement('option');
                        option.value = item.price;
                        option.textContent = `${item.weight} — ₹${Number(item.price).toLocaleString("en-IN")}`;
                        if (seenWeights.size === 1) option.selected = true;
                        select.appendChild(option);
                    });
                }
                
                // Select first option by default
                select.selectedIndex = 0;

                // Update initial text views
                if (select.options.length > 0) {
                    const firstOpt = select.options[0];
                    if (varietyPrice) {
                        varietyPrice.textContent = "₹" + Number(firstOpt.value).toLocaleString("en-IN");
                    }
                    if (mainPrice) {
                        mainPrice.textContent = firstOpt.text.split("—")[0].trim();
                    }
                }

                // Add change listener
                select.addEventListener("change", function () {
                    if (varietyPrice) {
                        varietyPrice.textContent = "₹" + Number(this.value).toLocaleString("en-IN");
                    }
                    if (mainPrice) {
                        const selectedOption = this.options[this.selectedIndex];
                        if (selectedOption) {
                            mainPrice.textContent = selectedOption.text.split("—")[0].trim();
                        }
                    }
                });
            }
        }
        // ADD THIS AFTER THE LOOP
        /*document.querySelectorAll(".weight-select").forEach(select => {

            const priceId =
                select.getAttribute("onchange")
                      .match(/'([^']+)'/)[1];

            updatePrice(select, priceId);
        });*/
});

    })
    .catch(err => console.log("API Error:", err));
});
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

    // Pad cards to a multiple of groupSize to ensure perfect grid alignment and loop alignment
    const originalCount = cards.length;
    const remainder = originalCount % groupSize;
    if (remainder !== 0) {
        const padCount = groupSize - remainder;
        for (let i = 0; i < padCount; i++) {
            const padClone = cards[i % originalCount].cloneNode(true);
            cards.push(padClone);
        }
    }

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
    setupGroupedTileSlider('.why-grid', 4);
    setupAboutRowExchange();
/*fetch("./data/products.json")
.then(response => response.json())
.then(data => {
    productsData = data;

    console.log("API DATA:", data);

    data.forEach(product => {

        console.log(
            "Product:",
            product.product_name,
            "Price:",
            product.daily_price
        );
if (product.product_name === "Cardamom") {
    const el = document.getElementById("prod1price");
    if (el)
        el.textContent =
            "₹" + Number(product.price).toLocaleString("en-IN");
}

if (product.product_name === "Pepper") {
    const el = document.getElementById("prod2price");
    if (el)
        el.textContent =
            "₹" + Number(product.price).toLocaleString("en-IN");
}

if (product.product_name === "Turmeric") {
    const el = document.getElementById("prod3price");
    if (el)
        el.textContent =
            "₹" + Number(product.price).toLocaleString("en-IN");
}

if (product.product_name === "Honey") {
    const el = document.getElementById("prod7price");
    if (el)
        el.textContent =
            "₹" + Number(product.price).toLocaleString("en-IN");
}

if (product.product_name === "Cloves") {
    const el = document.getElementById("prod4price");
    if (el)
        el.textContent =
            "₹" + Number(product.price).toLocaleString("en-IN");
}

if (product.product_name === "Ginger") {
    const el = document.getElementById("prod9price");
    if (el)
        el.textContent =
            "₹" + Number(product.price).toLocaleString("en-IN");
}

if (product.product_name === "Ghee") {
    const el = document.getElementById("prod8price");
    if (el)
        el.textContent =
            "₹" + Number(product.price).toLocaleString("en-IN");
}

if (product.product_name === "Tea") {
    const el = document.getElementById("prod5price");
    if (el)
        el.textContent =
            "₹" + Number(product.price).toLocaleString("en-IN");
}

if (product.product_name === "Coffee") {
    const el = document.getElementById("prod6price");
    if (el)
        el.textContent =
            "₹" + Number(product.price).toLocaleString("en-IN");
}
        
    });   // closes forEach

})       // closes then(data => ...)
.catch(error => console.error(error));*/
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
