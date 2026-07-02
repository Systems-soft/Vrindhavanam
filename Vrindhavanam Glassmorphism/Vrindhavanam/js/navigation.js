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
    cashew: { image: 'images/cashew.jpg' },
    ashwagandha: { image: 'images/ashwa.jpg' },
    garcinia: { image: 'images/garcinia.jpg' },
    pickle: { image: 'images/pickle.jpg' },
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
    { id: 'cashew', name: 'Cashew', label: 'Premium Grade', href: 'cashew.html', image: 'images/cashew.jpg' },
    { id: 'ashwagandha', name: 'Ashwagandha', label: 'Premium Herb', href: 'ashwagandha.html', image: 'images/ashwaghandha.jpg' },
    { id: 'garcinia', name: 'Garcinia', label: 'Naturally Sour', href: 'garcinia.html', image: 'images/garcinia.jpg' },
    { id: 'pickle', name: 'Pickle', label: 'Heritage Recipe', href: 'pickle.html', image: 'images/pickle.jpg' },
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
    cashew: 'cashew.html',
    ashwagandha: 'ashwagandha.html',
    garcinia: 'garcinia.html',
    pickle: 'pickle.html',
};

const productDetailCatalog = {
    'chai': {
        name: 'Chai Cardamom',
        label: 'Chai Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail10.jpg',
        backHref: 'cardamom.html',
        description: 'Sourced from the misty valleys of our high-altitude estates, this Chai Grade Cardamom features small, intensely aromatic pods. It releases a sweet, spicy aroma with bright citrus notes, making it the perfect warming addition to traditional spice teas, desserts, and slow-simmered milk infusions.',
    },
    'masala-cardamom': {
        name: 'Masala Cardamom',
        label: 'Masala Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail1.jpg',
        backHref: 'cardamom.html',
        description: 'Harvested at peak maturity, our Masala Grade Cardamom offers medium-sized, sun-dried pods rich in essential oils. It delivers a robust, warm flavor profile with floral undertones, sturdily standing up to roasting and grinding for garam masalas and savory dishes.',
    },
    'biriyani': {
        name: 'Biriyani Cardamom',
        label: 'Rice & Feast Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail2.jpg',
        backHref: 'cardamom.html',
        description: 'Cultivated in shade-grown plots on our family estates, this Biriyani Cardamom features select green pods chosen for festive cooking. It yields a fragrant, woodsy aroma and a sweet, resinous flavor that beautifully elevates biriyanis, pulaos, and rich gravies.',
    },
    'bold': {
        name: 'Bold Cardamom',
        label: 'Large Pods',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail3.jpg',
        backHref: 'cardamom.html',
        description: 'Hand-picked from our oldest, nutrient-rich soil blocks, our Bold Cardamom consists of plump green pods with a dense seed count. Its deep, lingering warmth and intensely floral fragrance make it a favorite for signature spice mixtures and luxury gifting.',
    },
    'superbold': {
        name: 'Superbold Cardamom',
        label: 'Premium Size',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail4.jpg',
        backHref: 'cardamom.html',
        description: 'Sourced from premium high-elevation slopes, these extra-large Superbold Cardamom pods represent the pinnacle of visual and aromatic quality. It possesses a concentrated camphoraceous sweetness and clean green shell, ideal for gourmet culinary presentation and premium spice shelves.',
    },
    'extrabold': {
        name: 'Extra Bold Cardamom',
        label: 'Select Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail5.jpg',
        backHref: 'cardamom.html',
        description: 'Representing a meticulous selection of our harvest, our Extra Bold Cardamom features polished green shells packed with mature, oil-rich seeds. It opens with an exquisite cardamom sweetness and a crisp, warm finish that elevates special occasion recipes and premium spice collections.',
    },
    'bulk': {
        name: 'Bulk Cardamom',
        label: 'Wholesale',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail6.jpeg',
        backHref: 'cardamom.html',
        description: 'Sourced from our high-yielding estate crops, this Bulk Cardamom offers a reliable selection of mature pods for commercial kitchens and frequent home use. It maintains a steady, classic cardamom warmth and a clean, refreshing finish perfect for everyday culinary preparations.',
    },
    'small': {
        name: 'Small Cardamom',
        label: 'Fine Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail7.jpg',
        backHref: 'cardamom.html',
        description: 'Harvested from the lower canopy branches of our estate plants, this Small Cardamom delivers a sweet green aroma in a compact form. It is highly versatile, providing a gentle, balanced sweetness that is excellent for flavoring delicate desserts, morning tea, and daily spice blends.',
    },
    'fruit': {
        name: 'Fruit Cardamom',
        label: 'Whole Fruit',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail8.jpg',
        backHref: 'cardamom.html',
        description: 'Prepared using whole whole-pod selection, our Fruit Cardamom retains the complete pod structure to preserve natural freshness. It features a mellow, rounded aromatic profile with soft herbal undertones, perfect for whole-spice infusions, mulled beverages, and festive roasting.',
    },
    'seed': {
        name: 'Seed Cardamom',
        label: 'Seeds',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail9.jpg',
        backHref: 'cardamom.html',
        description: 'Meticulously shelled and separated on our estate, these loose Cardamom Seeds offer instant access to pure aromatic flavor. They deliver a highly concentrated citrusy warmth and sweet aroma, saving preparation time for baking, grinding, and blending into fresh chai masalas.',
    },
    'open': {
        name: 'Open Cardamom',
        label: 'Open Grade',
        category: 'cardamom',
        price: 1240,
        image: 'images/cardamomdetail11.jpg',
        backHref: 'cardamom.html',
        description: 'Naturally split during curing, our Open Cardamom pods are chosen for immediate flavor release and fast culinary infusions. It provides a sturdier, rustic spice character with a warm herbal profile, making it a practical and flavorful addition to daily stocks, stews, and spice grinders.',
    },
    'wild-forest-honey': {
        name: 'Wild Forest Honey',
        label: 'Raw',
        category: 'honey',
        price: 580,
        image: 'images/honeydetail1.jpg',
        backHref: 'honey.html',
        description: 'Sourced from wild beehives in the untouched deep forests surrounding our estates, this Raw Wild Forest Honey carries a rich, dark golden color. It boasts a deeply complex, woody sweetness with earthy floral notes and natural enzymes, serving as a premium spread or immune-supporting natural sweetener.',
    },
    'highland-blossom-honey': {
        name: 'Highland Blossom Honey',
        label: 'Floral',
        category: 'honey',
        price: 580,
        image: 'images/honeydetail2.jpg',
        backHref: 'honey.html',
        description: 'Harvested from hives situated amongst high-altitude wildflowers, this Highland Blossom Honey features a light, bright amber tone. It delivers a delicate, sweet floral aroma with a clean, smooth finish, perfect for drizzling over warm breakfast bowls, fresh fruits, or infusing in herbal teas.',
    },
    'golden-spice-honey': {
        name: 'Golden Spice Honey',
        label: 'Infusion',
        category: 'honey',
        price: 580,
        image: 'images/honeydetail3.jpg',
        backHref: 'honey.html',
        description: 'An exquisite infusion combining our pure estate honey with select warm spices. It features a golden, smooth body that delivers a balanced sweet heat with notes of cardamom and cloves, making it an excellent gourmet accompaniment for cheese boards, tea, and warm wellness tonic blends.',
    },
    'highland-black-tea': {
        name: 'Highland Black Tea',
        label: 'Leaf',
        category: 'tea',
        price: 450,
        image: 'images/teadetail1.jpg',
        backHref: 'tea.html',
        description: 'Single-estate black tea leaves harvested from the misty ridges of our high-altitude gardens. It brews into a vibrant, copper-colored cup with a rich, full-bodied flavor, soft natural tannins, and a clean malty finish that pairs beautifully with milk, honey, or fresh spices.',
    },
    'estate-green-tea': {
        name: 'Estate Green Tea',
        label: 'Green',
        category: 'tea',
        price: 450,
        image: 'images/teadetail2.jpg',
        backHref: 'tea.html',
        description: 'Hand-picked green tea leaves processed immediately to retain their fresh natural antioxidants and delicate character. It yields a light, bright jade cup with subtle grassy notes and a clean, refreshing finish, perfect as a soothing beverage to start the morning or wind down in the evening.',
    },
    'spiced-chai-tea': {
        name: 'Spiced Chai Tea',
        label: 'Blend',
        category: 'tea',
        price: 450,
        image: 'images/teadetail3.jpg',
        backHref: 'tea.html',
        description: 'A traditional estate blend of bold CTC black tea leaves specifically prepared to carry robust spices. It produces a strong, dark brew with a deep, comforting body that stands up perfectly to fresh milk, honey, cardamom, and black pepper for an authentic masala chai.',
    },
    'highland-roast': {
        name: 'Highland Roast',
        label: 'Roast',
        category: 'coffee',
        price: 620,
        image: 'images/coffeedetail1.jpg',
        backHref: 'coffee.html',
        description: 'Sourced from shade-grown Arabica beans cultivated on the high slopes of our family estate. Masterfully roasted to a balanced medium profile, it delivers a smooth, rounded body with delicate notes of chocolate and stone fruit, ideal for pour-overs and classic morning drip brewing.',
    },
    'shade-grown-beans': {
        name: 'Shade Grown Beans',
        label: 'Single Estate',
        category: 'coffee',
        price: 620,
        image: 'images/coffeedetail2.jpg',
        backHref: 'coffee.html',
        description: 'Cultivated under the diverse canopy of native forest trees to encourage slow bean development. These single-estate beans produce a rich, low-acid cup with an earthy, complex aroma and subtle hints of spice, perfect for traditional espresso and French press preparations.',
    },
    'filter-coffee-blend': {
        name: 'Filter Coffee Blend',
        label: 'Classic',
        category: 'coffee',
        price: 620,
        image: 'images/coffeedetail3.jpg',
        backHref: 'coffee.html',
        description: 'A classic heritage blend of premium coffee beans roasted and ground to perfection for the traditional South Indian filter. It delivers a strong, full-bodied brew with a rich, caramel-like aroma and satisfying depth that pairs beautifully with hot frothed milk and sugar.',
    },
    'estate-black-pepper': {
        name: 'Estate Black Pepper',
        label: 'Premium',
        category: 'pepper',
        price: 890,
        image: 'images/pepperdetail1.jpg',
        backHref: 'pepper.html',
        description: 'Sourced from mature vines climbing the shade trees of our estate, these dense peppercorns represent the finest black pepper. It delivers a bold, lingering heat with bright citrusy undertones, perfect for crushing fresh over finished gourmet dishes or infusing into slow-cooked stews.',
    },
    'vine-ripened-pepper': {
        name: 'Vine Ripened Pepper',
        label: 'Organic',
        category: 'pepper',
        price: 890,
        image: 'images/pepperdetail2.jpg',
        backHref: 'pepper.html',
        description: 'Harvested only when the peppercorns turn a bright, organic red on the vine to ensure maximum flavor maturity. It yields a deeply complex, fruity warmth and a clean bite that elevates everyday seasoning, marinades, and hand-ground spice mixtures.',
    },
    'kitchen-crack-pepper': {
        name: 'Kitchen Crack Pepper',
        label: 'Everyday',
        category: 'pepper',
        price: 890,
        image: 'images/pepperdetail3.jpg',
        backHref: 'pepper.html',
        description: 'A robust, coarse-ground black pepper selected for everyday kitchen convenience. It provides a direct, balanced heat and classic peppery aroma, making it a reliable spice companion for seasoning meats, roasted vegetables, and daily savory cooking.',
    },
    'wild-cloves': {
        name: 'Wild Cloves',
        label: 'Whole Buds',
        category: 'cloves',
        price: 1480,
        image: 'images/clovesdetail1.jpg',
        backHref: 'cloves.html',
        description: 'Hand-gathered whole clove buds from wild-growing trees nestled within our estate borders. They contain a high concentration of essential oils, delivering a powerful, sweet-spicy warmth and deep aroma that is indispensable for festive baking, mulled drinks, and rich curries.',
    },
    'select-grade-cloves': {
        name: 'Select Grade Cloves',
        label: 'Aromatic',
        category: 'cloves',
        price: 1480,
        image: 'images/clovesdetail2.jpg',
        backHref: 'cloves.html',
        description: 'Meticulously sorted clove buds chosen for their flawless head structure, rich color, and balanced flavor. They yield a warm, woody fragrance with a sweet herbal undertone, bringing a elegant, sturdily balanced warmth to both sweet desserts and savory spice blends.',
    },
    'masala-clove-grade': {
        name: 'Masala Clove Grade',
        label: 'Blend Ready',
        category: 'cloves',
        price: 1480,
        image: 'images/clovesdetail3.jpg',
        backHref: 'cloves.html',
        description: 'Robust clove buds specifically selected and cured for blending into traditional spice powders and spice pastes. It offers a punchy, sharp warmth and long-lasting aroma, serving as a highly effective seasoning base for garam masalas and festive meat dishes.',
    },
    'golden-root': {
        name: 'Golden Root',
        label: 'Whole',
        category: 'turmeric',
        price: 680,
        image: 'images/turmericdetail1.jpg',
        backHref: 'turmeric.html',
        description: 'Sourced from the mineral-rich soils of our estate valleys, these whole turmeric roots are dried slowly to preserve natural curcumin. They carry a warm, earthy aroma and rich golden-orange color, perfect for grating fresh into culinary dishes, herbal milk, or health decoctions.',
    },
    'curcumin-rich': {
        name: 'Curcumin Rich',
        label: 'Bright',
        category: 'turmeric',
        price: 680,
        image: 'images/turmericdetail2.jpg',
        backHref: 'turmeric.html',
        description: 'A premium turmeric powder selected for its exceptionally high natural curcumin content. It boasts a brilliant golden hue, an intensely warm, earthy fragrance, and deep anti-inflammatory wellness properties, making it ideal for health tonics, golden milk, and daily cooking.',
    },
    'kitchen-powder-grade': {
        name: 'Kitchen Powder Grade',
        label: 'Fine',
        category: 'turmeric',
        price: 680,
        image: 'images/turmericdetail3.jpg',
        backHref: 'turmeric.html',
        description: 'A fine-ground, clean turmeric powder prepared for daily kitchen convenience. It offers a balanced, warm spice profile and rich yellow color, serving as a dependable culinary staple to flavor and color everyday curries, lentil dishes, and vegetable sides.',
    },
    'traditional-ghee': {
        name: 'Traditional Ghee',
        label: 'Classic',
        category: 'ghee',
        price: 2000,
        image: 'images/gheedetail1.jpg',
        backHref: 'ghee.html',
        description: 'Prepared using traditional churned butter sourced from local pasture-fed cows on our estate. It features a beautiful granular texture and a clean, rich aroma, sturdily elevating hot rice, rotis, and everyday sautéing with a pure, comforting richness.',
    },
    'golden-reserve-ghee': {
        name: 'Golden Reserve Ghee',
        label: 'Reserve',
        category: 'ghee',
        price: 4500,
        image: 'images/gheedetail2.jpg',
        backHref: 'ghee.html',
        description: 'A premium reserve ghee slow-cooked over a gentle wood fire to achieve a deeply caramelized, nutty fragrance. It carries a luxurious golden color and rich flavor, perfect for finishing gourmet dishes, preparing traditional sweets, and festive table presentation.',
    },
    'cooking-grade-ghee': {
        name: 'Cooking Grade Ghee',
        label: 'Kitchen',
        category: 'ghee',
        price: 8000,
        image: 'images/gheedetail3.jpg',
        backHref: 'ghee.html',
        description: 'A high-smoke-point kitchen ghee crafted for high-heat cooking, roasting, and deep-frying. It delivers a subtle, buttery aroma and clean taste that enhances the natural flavors of ingredients without smoking or burning in daily culinary preparations.',
    },
    'highland-fresh-ginger': {
        name: 'Highland Fresh Ginger',
        label: 'Fresh',
        category: 'ginger',
        price: 360,
        image: 'images/gingerdetail1.jpg',
        backHref: 'ginger.html',
        description: 'Harvested from the wet highland soils of our estate, these plump, fresh ginger roots are chosen for their clean heat. They deliver a bright, zesty aroma and a juicy, fiery bite, perfect for brewing hot ginger tea, flavoring broths, and preparing fresh marinades.',
    },
    'spice-grade-ginger': {
        name: 'Spice Grade Ginger',
        label: 'Bold',
        category: 'ginger',
        price: 360,
        image: 'images/gingerdetail2.jpg',
        backHref: 'ginger.html',
        description: 'Sun-dried ginger slices prepared specifically for grinding and spice blends. It contains a highly concentrated, warming ginger heat with sweet citrus notes, making it an excellent addition to baking recipes, winter spice teas, and dry curry powders.',
    },
    'daily-kitchen-ginger': {
        name: 'Daily Kitchen Ginger',
        label: 'Kitchen',
        category: 'ginger',
        price: 360,
        image: 'images/gingerdetail3.jpg',
        backHref: 'ginger.html',
        description: 'A versatile, kitchen-grade fresh ginger selected for everyday cooking. It offers a balanced, moderate heat and classic ginger fragrance, serving as a dependable daily aromatic base for stir-fries, lentil stews, and warming herbal infusions.',
    },
    'cashew-with-skin': {
        name: 'Cashew with Skin',
        label: 'Natural',
        category: 'cashew',
        price: 520,
        image: 'images/cashewdetail1.jpg',
        backHref: 'cashew.html',
        description: 'Naturally processed estate cashew kernels with their nutrient-dense inner skin kept completely intact. This skin preserves the natural creamy sweetness of the nut while adding a pleasant, rustic crunch, sturdily packed with healthy fats, proteins, and minerals.',
    },
    'cashew-without-skin': {
        name: 'Cashew without Skin',
        label: 'Premium',
        category: 'cashew',
        price: 620,
        image: 'images/cashewdetail2.jpg',
        backHref: 'cashew.html',
        description: 'Premium grade cashew kernels carefully shelled and skin-removed to reveal a beautiful ivory-white color. They feature a buttery texture and delicate sweet flavor, hand-selected to offer the finest gourmet snacking and culinary enrichment.',
    },
    'ashwagandha': {
        name: 'Ashwagandha',
        label: 'Premium Herb',
        category: 'ashwagandha',
        price: 200,
        image: 'images/ashwa.jpg',
        backHref: 'ashwagandha.html',
        description: 'Hand-selected ashwagandha roots harvested from premium estate soils and dried naturally to retain full organic potency. Featuring a deeply earthy aroma with a mild, bitter-sweet herbal profile, it is highly valued for traditional wellness infusions, stress-relief support, and daily vitality teas.',
    },
    'garcinia': {
        name: 'Garcinia Cambogia',
        label: 'Naturally Sour',
        category: 'garcinia',
        price: 250,
        image: 'images/garciniacambogia.jpg',
        backHref: 'garcinia.html',
        description: 'Hand-selected Garcinia Cambogia harvested from our premium estate crops and dried naturally under the sun. Featuring a sharp, tangy aroma and a rich acidic profile, it is highly valued for traditional South Indian culinary preparations, fish curries, and natural wellness infusions.',
    },
    'pickle': {
        name: 'Pickle',
        label: 'Heritage Recipe',
        category: 'pickle',
        price: 200,
        image: 'images/pickledetail.jpg',
        backHref: 'pickle.html',
        description: 'A traditional home-style estate pickle prepared from fresh local farm-sourced ingredients and a heritage spice blend. It delivers a deeply spicy, tangy flavor with rich aromatic undertones, sturdily elevating hot rice, parathas, and everyday Indian meals.',
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
                <button class="checkout-btn" onclick="window.location.href='checkout.html'">Proceed to Checkout</button>
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
    if (value.includes('cashew')) return 'cashew';
    if (value.includes('ashwagandha')) return 'ashwagandha';
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

// Ensure navigation cart API always takes precedence so a single
// cart implementation is used across the site (prevents conflicting
// globals from older scripts like `main.js`).
window.addToCart = function addToCart(name, price) {
    const category = getVarietyCategory(name);
    addProductPageCartItem(name, parseCartPrice(price), getProductPageImageForName(name), category);
};

// Replace any existing removeFromCart so removal operates on the
// `productPageCart` managed by this module.
window.removeFromCart = function removeFromCart(keyOrName) {
    const token = String(keyOrName || '').trim();
    if (!token) return;

    // Accept either the internal `key` or the human-readable `name` so
    // older code that calls removeByName keeps working.
    productPageCart = productPageCart.filter(item => (item.key !== token && item.name !== token));
    saveProductPageCart();
    updateProductPageCartUI();
};

// Replace any existing changeQty so quantity changes modify the
// `productPageCart` state consistently.
window.changeQty = function changeQty(keyOrName, delta) {
    const token = String(keyOrName || '').trim();
    if (!token) return;

    const item = productPageCart.find(cartItem => cartItem.key === token || cartItem.name === token);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        window.removeFromCart(token);
    } else {
        saveProductPageCart();
        updateProductPageCartUI();
    }
};

// Clear the entire cart (useful for checkout completion)
window.clearCart = function clearCart() {
    productPageCart = [];
    saveProductPageCart();
    updateProductPageCartUI();
};

function addVarietyTileToCart(button) {
    const card = button.closest('.product-variety-card');
    if (!card) return;

    const nameEl = card.querySelector('.product-variety-name');
    let name = nameEl?.textContent.trim() || 'Product Variety';
    const pageTitle = document.querySelector('.product-page .section-title')?.textContent || name;
    const category = getVarietyCategory(pageTitle + ' ' + name);
    const defaults = varietyCartDefaults[category];
    console.log("CATEGORY =", category);
console.log("NAME =", name);
    const image = card.querySelector('.product-variety-image')?.getAttribute('src') || defaults.image;

    const select = card.querySelector('.weight-select');
    let price = defaults.price;
    if (select) {
        price = Number(select.value) || defaults.price;
        const selectedText = select.options[select.selectedIndex].text;
        const weight = selectedText.split('—')[0].trim();
        name = `${name} (${weight})`;
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
        'cashew.html': 'cashew',
        'ashwagandha.html': 'ashwagandha',
        'garcinia.html': 'garcinia',
        'pickle.html': 'pickle',
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
    const productId = card.dataset.productId || '';

    return `product-detail.html?product=${encodeURIComponent(key)}&productId=${encodeURIComponent(productId)}&back=${encodeURIComponent(backPath)}`;
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

async function ensureProductVarietyDetailButtons() {
    for (const card of document.querySelectorAll('.product-variety-card')) {
        const buyButton = card.querySelector(':scope > .product-buy-btn') || card.querySelector('.product-variety-actions .product-buy-btn');
        const existingDetailsButton = card.querySelector('.cardamom-details-btn, .product-details-btn');
        const nameEl = card.querySelector('.product-variety-name');
        const name = nameEl?.textContent.trim() || 'Product Variety';
        const pageTitle = document.querySelector('.product-page .section-title')?.textContent || name;
        const category = getVarietyCategory(`${pageTitle} ${name}`);
        const defaults = varietyCartDefaults[category] || varietyCartDefaults.cardamom;
        const productId = card.dataset.productId;
        let dbProducts = [];

        if (productId && typeof productsData !== "undefined" && productsData.length) {
            dbProducts = productsData.filter(p => p.product_id === productId);
        } else if (name && typeof productsData !== "undefined" && productsData.length) {
            dbProducts = productsData.filter(p => {
                const v = (p.variety_name || "").toLowerCase();
                const n = name.toLowerCase();

                return (
                    v === n ||
                    (v === "biriyani" && n === "biriyani cardamom") ||
                    (v === "for chai" && n === "chai cardamom") ||
                    (v === "open/splits" && n === "open") ||
                    (v === "superbold" && n === "super bold") ||
                    (v === "extrabold" && n === "extra bold")
                );
            });
        }

        // If we found DB products, dynamically update the variety card UI from the Excel values
        if (dbProducts.length > 0) {
            const firstProduct = dbProducts[0];
            
            // 1. Update variety name
            if (nameEl && firstProduct.variety_name) {
                nameEl.textContent = firstProduct.variety_name;
            }
            // 2. Update variety copy/description
            const descEl = card.querySelector('.product-variety-copy');
            if (descEl && (firstProduct.description || firstProduct.notes)) {
                descEl.textContent = firstProduct.description || firstProduct.notes;
            }
            // 3. Update variety image
            if (firstProduct.image_url) {
                const imgEl = card.querySelector('.product-variety-image');
                if (imgEl) {
                    imgEl.src = firstProduct.image_url;
                    imgEl.alt = firstProduct.variety_name || '';
                }
                card.style.backgroundImage = `url("${firstProduct.image_url}")`;
                card.style.setProperty('--product-image', `url("${firstProduct.image_url}")`);
            }
            // 4. Update variety label/badge
            const labelEl = card.querySelector('.product-variety-label');
            if (labelEl && (firstProduct.label || firstProduct.stock_status || firstProduct.notes)) {
                labelEl.textContent = firstProduct.label || firstProduct.stock_status || firstProduct.notes;
            }
        }
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

    if (actions) {
        card.insertBefore(select, actions);
    } else {
        card.appendChild(select);
    }
}

// ALWAYS populate from database
select.innerHTML = '';

console.log("BEFORE LOOP", name, dbProducts.length);

const seenWeights = new Set();
dbProducts.forEach((item, idx) => {
        const weight = (item.weight || "").trim().toLowerCase();
        if (seenWeights.has(weight)) return;
        seenWeights.add(weight);

        const optEl = document.createElement('option');
        optEl.value = item.price;
        optEl.textContent = `${item.weight} — ${formatProductPagePrice(item.price)}`;
        if (seenWeights.size === 1) {
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

        // Ensure a Details button exists for each product variety card
        const detailsButton = existingDetailsButton || document.createElement('a');
        detailsButton.href = getProductDetailHrefForCard(card);
        detailsButton.textContent = 'Details';
        // Add both generic and category‑specific classes for styling
        detailsButton.classList.add('product-details-btn');
        // Preserve any existing category class (e.g., cardamom-details-btn) if present
        if (!existingDetailsButton) {
            // For visual consistency, also add a category‑specific class based on the product category
            detailsButton.classList.add(`${category}-details-btn`);
        }
        detailsButton.setAttribute('aria-label', `View details for ${name}`);

        if (actions) {
            // Ensure the Buy button is inside the actions container
            if (buyButton && buyButton.parentElement !== actions) {
                actions.appendChild(buyButton);
            }
            // Insert the Details button before the Buy button (or as first child)
            actions.insertBefore(detailsButton, buyButton || actions.firstElementChild);
        } else {
            // Fallback: append directly to the card element
            card.appendChild(detailsButton);
        }
    }
}
function doesVarietyNameMatch(apiName, name) {
    apiName = (apiName || '').trim().toLowerCase();
    name = (name || '').trim().toLowerCase();
    return (
        apiName === name ||
        (apiName === "biriyani" && name === "biriyani cardamom") ||
        (apiName === "for chai" && name === "chai cardamom") ||
        (apiName === "open/splits" && name === "open") ||
        (apiName === "open/splits" && name === "open cardamom") ||
        (apiName === "superbold" && name === "super bold") ||
        (apiName === "extrabold" && name === "extra bold")
    );
}
async function getProductFromDatabase(productId) {
    try {
        const response = await fetch('./data/products.json');
        const products = await response.json();

        return products.filter(
            p => p.product_id === productId
        );
    } catch (err) {
        console.error(err);
        return [];
    }
}
async function renderProductDetailPage() {
    const detailRoot = document.getElementById('productDetailPage');
    if (!detailRoot) return;

    const product = getProductDetailFromParams();

    let productId =
        new URLSearchParams(window.location.search)
            .get('productId');

    console.log("PRODUCT ID:", productId);

    if (!productId && product && product.name) {
        try {
            const response = await fetch('./data/products.json');
            const products = await response.json();
            const matched = products.find(p => doesVarietyNameMatch(p.variety_name, product.name));
            if (matched) {
                productId = matched.product_id;
                console.log("Found product ID from name matching:", productId);
            }
        } catch (err) {
            console.error("Failed to reverse-lookup product ID:", err);
        }
    }

    const dbProducts =
        productId
            ? await getProductFromDatabase(productId)
            : [];
            console.table(dbProducts);

    console.log("DB PRODUCTS:", dbProducts);
    console.table(dbProducts);

    const fallback = document.getElementById('productDetailFallback');

    console.log("DETAIL PAGE PRODUCT:", product);
    console.log("PRICE FIELD:", product.price);
    console.log("DAILY PRICE FIELD:", product.daily_price);
    console.log("DB PRODUCTS:", dbProducts);

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

    // Dynamic override of product properties from Excel database columns
    if (dbProducts.length > 0) {
        const dbProduct = dbProducts[0];
        
        if (dbProduct.variety_name) {
            product.name = dbProduct.variety_name;
        }
        if (dbProduct.notes || dbProduct.label) {
            product.label = dbProduct.label || dbProduct.notes;
        }
        if (dbProduct.image_url) {
            product.image = dbProduct.image_url;
        }
        if (dbProduct.price) {
            product.price = dbProduct.price;
        }
        if (!product.description && (dbProduct.description || dbProduct.notes)) {
            product.description = dbProduct.description || dbProduct.notes;
        }
    }

    if (image) {
        image.src = product.image;
        image.alt = product.name;
    }
    if (label) label.textContent = product.label;
    if (name) name.textContent = product.name;
    if (description) description.textContent = product.description;
    if (price) price.textContent = formatProductPagePrice(product.price);
    
    // Render any dynamic Excel columns like specifications, discount, stock, availability
    if (dbProducts.length > 0) {
        const dbProduct = dbProducts[0];
        
        // 1. Dynamic Discount Badge
        const discountBadgeId = 'detailDiscountBadge';
        let discountBadge = document.getElementById(discountBadgeId);
        if (discountBadge) discountBadge.remove();
        
        if (dbProduct.discount && price) {
            discountBadge = document.createElement('span');
            discountBadge.id = discountBadgeId;
            discountBadge.style.backgroundColor = 'rgba(255, 75, 75, 0.15)';
            discountBadge.style.color = '#ff4b4b';
            discountBadge.style.padding = '0.2rem 0.6rem';
            discountBadge.style.borderRadius = '20px';
            discountBadge.style.fontSize = '0.85rem';
            discountBadge.style.marginLeft = '1rem';
            discountBadge.style.border = '1px solid rgba(255, 75, 75, 0.3)';
            discountBadge.textContent = `${dbProduct.discount} Off`;
            price.parentNode.appendChild(discountBadge);
        }

        // 2. Dynamic Availability / Stock Status Line
        const availabilityId = 'detailAvailabilityLine';
        let availabilityLine = document.getElementById(availabilityId);
        if (availabilityLine) availabilityLine.remove();
        
        const availabilityText = dbProduct.availability || dbProduct.stock_status || dbProduct.stock;
        if (availabilityText && description) {
            const isOutOfStock = availabilityText.toLowerCase().includes('out of stock');
            const statusText = isOutOfStock ? 'Out of Stock' : 'In Stock';
            
            availabilityLine = document.createElement('div');
            availabilityLine.id = availabilityId;
            availabilityLine.style.margin = '0.75rem 0 1.25rem 0';
            availabilityLine.style.display = 'inline-flex';
            availabilityLine.style.alignItems = 'center';
            availabilityLine.style.padding = '0.4rem 1.1rem';
            availabilityLine.style.borderRadius = '30px';
            availabilityLine.style.fontSize = '0.85rem';
            availabilityLine.style.fontWeight = '600';
            availabilityLine.style.textTransform = 'uppercase';
            availabilityLine.style.letterSpacing = '1px';
            availabilityLine.style.fontFamily = "'Jost', sans-serif";
            availabilityLine.style.backdropFilter = 'blur(10px)';
            availabilityLine.style.webkitBackdropFilter = 'blur(10px)';
            
            if (isOutOfStock) {
                availabilityLine.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
                availabilityLine.style.color = '#ff6b6b';
                availabilityLine.style.border = '1px solid rgba(239, 68, 68, 0.35)';
                availabilityLine.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.25), inset 0 0 8px rgba(239, 68, 68, 0.1)';
            } else {
                availabilityLine.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
                availabilityLine.style.color = '#4ade80';
                availabilityLine.style.border = '1px solid rgba(16, 185, 129, 0.35)';
                availabilityLine.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.25), inset 0 0 8px rgba(16, 185, 129, 0.1)';
            }
            
            const dot = document.createElement('span');
            dot.style.display = 'inline-block';
            dot.style.width = '7px';
            dot.style.height = '7px';
            dot.style.borderRadius = '50%';
            dot.style.marginRight = '8px';

            if (isOutOfStock) {
                dot.style.backgroundColor = '#ff6b6b';
                dot.style.boxShadow = '0 0 8px #ff6b6b';
            } else {
                dot.style.backgroundColor = '#4ade80';
                dot.style.boxShadow = '0 0 8px #4ade80';
            }
            
            availabilityLine.appendChild(dot);
            
            const labelSpan = document.createElement('span');
            labelSpan.textContent = statusText;
            availabilityLine.appendChild(labelSpan);
            
            description.insertAdjacentElement('afterend', availabilityLine);
            
            // If out of stock, disable the Buy Now / Add to Cart buttons
            const addToCartBtn = document.querySelector('.product-detail-add-btn');
            if (buyButton) {
                buyButton.disabled = isOutOfStock;
                buyButton.style.opacity = isOutOfStock ? '0.5' : '1';
                buyButton.style.cursor = isOutOfStock ? 'not-allowed' : 'pointer';
            }
            if (addToCartBtn) {
                addToCartBtn.disabled = isOutOfStock;
                addToCartBtn.style.opacity = isOutOfStock ? '0.5' : '1';
                addToCartBtn.style.cursor = isOutOfStock ? 'not-allowed' : 'pointer';
            }
        }

        // 3. Dynamic Specifications / Features Section
        const specsId = 'detailSpecsContainer';
        let specsContainer = document.getElementById(specsId);
        if (specsContainer) specsContainer.remove();
        
        const specsText = dbProduct.specifications || dbProduct.features;
        if (specsText && description) {
            specsContainer = document.createElement('div');
            specsContainer.id = specsId;
            specsContainer.style.marginTop = '1.5rem';
            specsContainer.style.borderTop = '1px solid rgba(255,255,255,0.1)';
            specsContainer.style.paddingTop = '1rem';
            specsContainer.innerHTML = `
                <h4 style="margin: 0 0 0.5rem 0; font-family: 'Playfair Display', serif; font-size: 1.15rem; color: #fff; letter-spacing: 0.5px;">Product Specifications</h4>
                <p style="margin: 0; font-size: 0.95rem; opacity: 0.8; line-height: 1.6; font-family: 'Jost', sans-serif;">${specsText}</p>
            `;
            const referenceEl = availabilityLine || description;
            referenceEl.insertAdjacentElement('afterend', specsContainer);
        }
    }
    
    const backUrl = product.backHref || getProductVarietyPageHref(product.category);
    if (back) back.href = backUrl;
    if (floatingBack) floatingBack.href = backUrl;

    // Add weight select dropdown for details page
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




    select.addEventListener('change', () => {
        if (price) {
            price.textContent = formatProductPagePrice(select.value);
        }
    });

if (select) {
    select.innerHTML = '';
    const seenWeights = new Set();
    // Use first dbProducts entry as reference for weight and price calculations
    dbProducts.forEach((item, idx) => {
        const weight = (item.weight || "").trim().toLowerCase();
        if (seenWeights.has(weight)) return;
        seenWeights.add(weight);

        const optEl = document.createElement('option');
        optEl.value = item.price;
        optEl.textContent = `${item.weight} — ${formatProductPagePrice(item.price)}`;

        if (seenWeights.size === 1) {
            optEl.selected = true;
        }

        select.appendChild(optEl);
    });


if (select && select.options.length > 0 && price) {
    price.textContent =
        formatProductPagePrice(select.options[0].value);
}
}
console.log("DB PRODUCTS USED:", dbProducts);

    const addButton = document.querySelector('.product-detail-add-btn');

    if (buyButton && select) {
        const newBuyButton = buyButton.cloneNode(true);
        buyButton.parentNode.replaceChild(newBuyButton, buyButton);
        newBuyButton.addEventListener('click', () => {
            const selectedText = select.options[select.selectedIndex].text;
            const weight = selectedText.split('—')[0].trim();
            const finalPrice = select.value;
            window.addToCart(`${product.name} (${weight})`, '₹' + finalPrice);
        });
        
        if (addButton) {
            const newAddButton = addButton.cloneNode(true);
            addButton.parentNode.replaceChild(newAddButton, addButton);
            newAddButton.addEventListener('click', () => {
                const selectedText = select.options[select.selectedIndex].text;
                const weight = selectedText.split('—')[0].trim();
                const finalPrice = select.value;
                window.addToCart(`${product.name} (${weight})`, '₹' + finalPrice);
            });
        }
    } else if (buyButton) {
        buyButton.addEventListener('click', () => {
            window.addToCart(product.name, '₹' + product.price);
        });
        if (addButton) {
            addButton.addEventListener('click', () => {
                window.addToCart(product.name, '₹' + product.price);
            });
        }
    }

    detailRoot.hidden = false;
    if (fallback) fallback.hidden = true;
}

// SMOOTH SCROLL (Mostly handled by CSS, but can add offset logic here if needed)
document.addEventListener('DOMContentLoaded', () => {
    ensureProductVarietyDetailButtons();

    const productBuyButtons = document.querySelectorAll('.product-buy-btn');
    const productAddButtons = document.querySelectorAll('.product-add-btn');

    // Ensure cart drawer exists first, then always load saved cart state
    // from localStorage so cart persists across refreshes and restarts.
    ensureProductCartDrawer();
    loadProductPageCart();
    updateProductPageCartUI();

    if (window.location.hash === '#cartDrawer') {
        openCart();
    }

    productBuyButtons.forEach(button => {
        button.addEventListener('click', event => {
            if (!button.closest('.product-variety-card') && !button.closest('.product-detail-copy')) {
                return;
            }
            event.preventDefault();
            addVarietyTileToCart(button);
        });
    });

    productAddButtons.forEach(button => {
        button.addEventListener('click', event => {
            if (!button.closest('.product-variety-card') && !button.closest('.product-detail-copy')) {
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