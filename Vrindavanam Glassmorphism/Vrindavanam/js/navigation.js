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

// SMOOTH SCROLL (Mostly handled by CSS, but can add offset logic here if needed)
document.addEventListener('DOMContentLoaded', () => {
    // Any specific navigation JS logic goes here
});
