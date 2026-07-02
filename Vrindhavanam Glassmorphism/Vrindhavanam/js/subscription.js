const radios = document.querySelectorAll('input[name="box"]');
const quantityInput = document.getElementById("subscriptionQuantity");
const total = document.getElementById("subscriptionTotal");
const subscribeBtn = document.getElementById("subscribeBtn");
const minusBtn = document.querySelector(".sub-qty-btn.minus");
const plusBtn = document.querySelector(".sub-qty-btn.plus");

function updatePrice() {
    const selected = document.querySelector('input[name="box"]:checked');
    if (!selected) return;

    const price = Number(selected.dataset.price);
    const quantity = Number(quantityInput.value);

    const finalPrice = price * quantity;

    total.innerText = "₹" + finalPrice;

    subscribeBtn.innerText = `Subscribe — ₹${finalPrice}/month`;
}

// Stepper click handlers
if (minusBtn && plusBtn) {
    minusBtn.addEventListener("click", () => {
        let val = Number(quantityInput.value);
        if (val > 1) {
            quantityInput.value = val - 1;
            updatePrice();
        }
    });
    plusBtn.addEventListener("click", () => {
        let val = Number(quantityInput.value);
        quantityInput.value = val + 1;
        updatePrice();
    });
}

radios.forEach(radio => {
    radio.addEventListener("change", updatePrice);
});

quantityInput.addEventListener("input", updatePrice);

updatePrice();

// Helper to compute next delivery date dynamically
function getNextDeliveryDate(frequency) {
    const today = new Date();
    if (frequency === "Every 2 Months") {
        today.setMonth(today.getMonth() + 2);
    } else {
        // Default to Monthly
        today.setMonth(today.getMonth() + 1);
    }
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Helper to show dynamic toast notifications
function showToast(message, type = "success") {
    // Remove existing toasts if any
    const existing = document.querySelectorAll(".sub-toast");
    existing.forEach(t => t.remove());

    const toast = document.createElement("div");
    toast.className = `sub-toast ${type}`;
    toast.innerText = message;
    
    // Style the toast dynamically matching the premium theme
    Object.assign(toast.style, {
        position: "fixed",
        bottom: "40px",
        right: "40px",
        padding: "16px 28px",
        borderRadius: "8px",
        color: "#FDFBF7",
        fontSize: "0.95rem",
        fontWeight: "500",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        zIndex: "99999",
        opacity: "0",
        transform: "translateY(20px)",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        fontFamily: "'Jost', sans-serif"
    });

    if (type === "success") {
        toast.style.background = "linear-gradient(135deg, #0A1F0A, #1d4d1d)";
        toast.style.border = "1px solid #D4AF37";
        toast.style.boxShadow = "0 10px 30px rgba(10, 31, 10, 0.5), 0 0 15px rgba(212, 175, 55, 0.2)";
    } else {
        toast.style.background = "linear-gradient(135deg, #4A1A1A, #732626)";
        toast.style.border = "1px solid #ff6b6b";
        toast.style.boxShadow = "0 10px 30px rgba(74, 26, 26, 0.5)";
    }

    document.body.appendChild(toast);

    // Trigger reflow to start transition
    toast.offsetHeight;

    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

subscribeBtn.addEventListener("click", async () => {
    const selected = document.querySelector('input[name="box"]:checked');
    if (!selected) {
        showToast("Please select a subscription box plan.", "error");
        return;
    }

    const qty = Number(quantityInput.value);
    if (isNaN(qty) || qty < 1) {
        showToast("Please select a valid quantity (minimum 1).", "error");
        return;
    }

    const freq = document.getElementById("subscriptionFrequency").value;

    const subscription = {
        customer_id: 1,
        product_id: Number(selected.dataset.productId),
        variant_id: Number(selected.dataset.variantId),
        channel: "Website",
        frequency: freq,
        quantity: qty,
        price: Number(selected.dataset.price) * qty,
        next_delivery: getNextDeliveryDate(freq)
    };

    try {
        const response = await fetch("/api/subscriptions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(subscription)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast("Subscription Created Successfully! Redirecting...", "success");
            // Redirect to subscription management page after a short delay
            setTimeout(() => {
                window.location.href = "subscriptions.html";
            }, 1500);
        } else {
            console.error(result);
            showToast(result.error || "Subscription Failed!", "error");
        }
    } catch(err) {
        console.error(err);
        showToast("Server Connection Error", "error");
    }
});