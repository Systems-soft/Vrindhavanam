import { useState } from "react";
import { Link } from "react-router-dom";

export default function CheckoutPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [orderItems, setOrderItems] = useState([
    {
      id: 1,
      name: "Vrindhavanam Premium Cardamom",
      variant: "Green Bold - 250g",
      price: 650,
      quantity: 1
    },
    {
      id: 2,
      name: "Vrindhavanam Organic Honey",
      variant: "Wild Forest - 500g",
      price: 450,
      quantity: 2
    }
  ]);

  const [notification, setNotification] = useState({
    type: "", // "success" or "error"
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleQtyChange = (id, delta) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const validateForm = () => {
    if (!form.first_name.trim()) return "First Name is required.";
    if (!form.last_name.trim()) return "Last Name is required.";
    if (!form.email.trim()) return "Email Address is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid Email Address.";
    if (!form.phone.trim()) return "Phone Number is required.";
    if (!form.address.trim()) return "Address is required.";
    return null;
  };

  const saveCustomerData = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      setNotification({ type: "error", message: errorMsg });
      return null;
    }

    setLoading(true);
    setNotification({ type: "", message: "" });

    try {
      const response = await fetch(
        "http://localhost:5005/api/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save customer in database");
      }

      const data = await response.json();
      return data.customer_id;
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: err.message || "Error saving customer."
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    const customerId = await saveCustomerData();
    if (customerId) {
      setNotification({
        type: "success",
        message: `Customer profile successfully saved in Vrindhavanam database. ID: ${customerId}`
      });
    }
  };

  const handlePlaceOrder = async (e) => {
    console.log("PLACE ORDER CLICKED");
  e.preventDefault();

  const customerId = await saveCustomerData();
  console.log("CUSTOMER ID =", customerId);

  if (!customerId) return;

  try {
    console.log("SENDING ORDER");
console.log({
  customer_id: customerId,
  total_amount: totalAmount
});

    const response = await fetch(
      "http://localhost:5005/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_id: customerId,
          total_amount: totalAmount
        })
      }
    );

    const orderData = await response.json();

    setNotification({
      type: "success",
      message:
        `Order Placed Successfully! Order ID: ${orderData.order_id}`
    });

  } catch (err) {

    console.error(err);

    setNotification({
      type: "error",
      message: "Failed to create order"
    });

  }
};

  const totalAmount = calculateTotal();

  return (
    <div
      className="min-height-100vh w-full py-12 px-4 md:px-8 flex flex-col items-center justify-start relative overflow-x-hidden font-sans"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(92, 128, 84, 0.35), transparent 40%), linear-gradient(160deg, #08120b 0%, #0f1d13 45%, #1a2617 100%)"
      }}
    >
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-[#d4af37]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-[#2a7f5b]/10 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center z-10">
        <Link
          to="/"
          className="group flex items-center gap-2 text-[#eff6eb]/60 hover:text-[#eff6eb] transition-all duration-300 text-sm font-medium"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Admin Portal
        </Link>

        {/* Branding Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Vrindhavanam Logo"
            className="w-8 h-8 rounded-full object-cover border border-[#d4af37]/30"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="flex flex-col line-height-1">
            <span
              className="font-['Jost',sans-serif] text-xs font-semibold tracking-[0.2em] text-[#d4af37]"
            >
              VRINDHAVANAM
            </span>
          </div>
        </div>
      </div>

      {/* Main Redesigned Checkout Card */}
      <div className="w-full max-w-5xl bg-[#0a100c]/46 backdrop-blur-[20px] border border-[#d4af37]/18 rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-6 md:p-10 z-10 animate-[fadeUp_700ms_ease_both]">
        
        {/* Header Section */}
        <div className="border-b border-[#eff6eb]/10 pb-6 mb-8 text-center md:text-left">
          <h1 className="font-['Jost',sans-serif] text-3xl md:text-4xl font-medium tracking-wide text-[#F1E5AC] mb-2">
            Checkout
          </h1>
          <p className="font-['Jost',sans-serif] text-sm md:text-base font-normal tracking-[0.08em] text-[#D4AF37] uppercase">
            Customer Information & Order Placement
          </p>
        </div>

        {/* Custom Premium Notifications */}
        {notification.message && (
          <div
            className={`mb-8 p-4 rounded-xl backdrop-blur-md border flex items-start gap-3 animate-[fadeUp_300ms_ease_both] ${
              notification.type === "success"
                ? "bg-[#2a7f5b]/10 border-[#2a7f5b]/40 text-[#eff6eb]"
                : "bg-red-500/10 border-red-500/30 text-[#eff6eb]"
            }`}
          >
            {notification.type === "success" ? (
              <svg
                className="w-6 h-6 text-[#2a7f5b] flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            )}
            <div>
              <h4 className="font-semibold text-sm">
                {notification.type === "success" ? "Success Notification" : "Error Occurred"}
              </h4>
              <p className="text-sm opacity-90 mt-1">{notification.message}</p>
            </div>
          </div>
        )}

        <form className="space-y-10">
          
          {/* Customer Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-wide text-[#d4af37] border-l-2 border-[#d4af37] pl-3">
              Customer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#eff6eb]/70">
                  First Name
                </label>
                <input
                  name="first_name"
                  type="text"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="e.g. Rama"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[#eff6eb] placeholder-[#eff6eb]/30 focus:border-[#d4af37]/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] outline-none transition-all duration-300"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#eff6eb]/70">
                  Last Name
                </label>
                <input
                  name="last_name"
                  type="text"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="e.g. Verma"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[#eff6eb] placeholder-[#eff6eb]/30 focus:border-[#d4af37]/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] outline-none transition-all duration-300"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#eff6eb]/70">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. rama.verma@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[#eff6eb] placeholder-[#eff6eb]/30 focus:border-[#d4af37]/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] outline-none transition-all duration-300"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#eff6eb]/70">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[#eff6eb] placeholder-[#eff6eb]/30 focus:border-[#d4af37]/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] outline-none transition-all duration-300"
                />
              </div>

              {/* Address */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#eff6eb]/70">
                  Shipping Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Provide complete delivery address..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-[#eff6eb] placeholder-[#eff6eb]/30 focus:border-[#d4af37]/50 focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] outline-none transition-all duration-300 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-wide text-[#d4af37] border-l-2 border-[#d4af37] pl-3">
              Order Summary
            </h3>

            {/* Premium Glass Table */}
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="text-left text-xs uppercase tracking-wider text-[#d4af37] font-semibold py-4 px-6">
                        Product Name
                      </th>
                      <th className="text-left text-xs uppercase tracking-wider text-[#d4af37] font-semibold py-4 px-6">
                        Variant
                      </th>
                      <th className="text-center text-xs uppercase tracking-wider text-[#d4af37] font-semibold py-4 px-6">
                        Quantity
                      </th>
                      <th className="text-right text-xs uppercase tracking-wider text-[#d4af37] font-semibold py-4 px-6">
                        Price
                      </th>
                      <th className="text-right text-xs uppercase tracking-wider text-[#d4af37] font-semibold py-4 px-6">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-150"
                      >
                        <td className="py-4 px-6 text-sm font-medium text-[#eff6eb]">
                          {item.name}
                        </td>
                        <td className="py-4 px-6 text-sm text-[#eff6eb]/70">
                          {item.variant}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.id, -1)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-[#eff6eb] hover:bg-[#d4af37]/20 hover:border-[#d4af37]/40 active:scale-90 transition-all font-bold"
                            >
                              -
                            </button>
                            <span className="mx-4 font-semibold text-sm text-[#eff6eb] w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-[#eff6eb] hover:bg-[#d4af37]/20 hover:border-[#d4af37]/40 active:scale-90 transition-all font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right text-sm text-[#eff6eb]/80">
                          ₹{item.price.toLocaleString("en-IN")}
                        </td>
                        <td className="py-4 px-6 text-right text-sm font-semibold text-[#eff6eb]">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                    {/* Grand Total Row */}
                    <tr className="bg-white/[0.01]">
                      <td colSpan="3" className="py-5 px-6"></td>
                      <td className="py-5 px-6 text-right text-sm font-semibold text-[#d4af37] uppercase tracking-wider">
                        Grand Total
                      </td>
                      <td className="py-5 px-6 text-right text-lg font-bold text-[#F1E5AC]">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-[#eff6eb]/10">
            {/* Save Customer */}
            <button
              type="button"
              onClick={handleSaveCustomer}
              disabled={loading}
              className="w-full sm:w-auto bg-transparent border border-[#d7b56d]/40 hover:border-[#d7b56d] text-[#d7b56d] hover:bg-[#d7b56d]/10 font-bold uppercase tracking-wider text-xs md:text-sm py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
            >
              Save Customer
            </button>

            {/* Place Order */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-[#d7b56d] to-[#bca061] text-[#08120b] hover:from-[#e7c57d] hover:to-[#cca071] font-bold uppercase tracking-wider text-xs md:text-sm py-4 px-10 rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}