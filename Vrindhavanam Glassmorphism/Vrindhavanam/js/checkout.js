document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "vrindhavanamProductVarietyCart";
    let cart = [];
    let grandTotal = 0;

    // Load cart from localStorage
    try {
        cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (err) {
        cart = [];
    }

    if (cart.length === 0) {
        alert("Your cart is empty. Redirecting to home.");
        window.location.href = "index.html";
        return;
    }

    const itemsContainer = document.getElementById("orderSummaryItems");
    const totalEl = document.getElementById("orderGrandTotal");

    // Render Cart Items
    itemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;
        return `
            <div class="order-summary-item">
                <div class="order-summary-info">
                    <img src="${item.image || 'images/plantation 2.jpg'}" alt="${item.name}" class="order-summary-img">
                    <div>
                        <div class="order-summary-name">${item.name}</div>
                        <div class="order-summary-qty">Qty: ${item.qty} &times; ₹${item.price.toLocaleString('en-IN')}</div>
                    </div>
                </div>
                <div class="order-summary-price">₹${itemTotal.toLocaleString('en-IN')}</div>
            </div>
        `;
    }).join("");

    totalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

    // Place Order Flow
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const form = document.getElementById("checkoutForm");

    placeOrderBtn.addEventListener("click", async () => {
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const customerData = {
            first_name: document.getElementById("firstName").value.trim(),
            last_name: document.getElementById("lastName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim()
        };

        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = "Processing...";

        try {
            // 1. Save Customer
            const custRes = await fetch("http://localhost:5005/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customerData)
            });
            const custData = await custRes.json();
            
            if (!custData.success) throw new Error(custData.error || "Failed to save customer");

            // 2. Save Order
           const orderData = {
    customer_id: custData.customer_id,
    total_amount: grandTotal,

    items: cart.map(item => ({
        product_name: item.name,
        quantity: item.qty,
        unit_price: item.price
    }))
};

            const orderRes = await fetch("http://localhost:5005/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });
            const orderResData = await orderRes.json();

            if (!orderResData.success) throw new Error(orderResData.error || "Failed to save order");

            // Success!
            document.getElementById("checkoutContent").style.display = "none";
            document.getElementById("successScreen").style.display = "block";
            document.getElementById("successOrderId").textContent = "#" + orderResData.order_id;
            
            // Clear cart
            localStorage.removeItem(STORAGE_KEY);

        } catch (err) {
            console.error("Order error:", err);
            showToast(err.message || "An error occurred while placing your order.");
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = "Place Order";
        }
    });

    function showToast(msg) {
        const t = document.getElementById('toast');
        if (!t) return;
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }
});
