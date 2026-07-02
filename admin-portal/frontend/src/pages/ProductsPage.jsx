import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [selectedCategory, setSelectedCategory] = useState("all");

const handleEdit = (product) => {
  setSelectedProduct(product);
  setShowEditModal(true);
};

const handleSave = async () => {

  try {

    await fetch(
      `http://localhost:5005/api/admin/products/${selectedProduct.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          product_name: selectedProduct.product_name,
          price: selectedProduct.price,
          stock_quantity: selectedProduct.stock_quantity,
          stock_status: selectedProduct.stock_status
        })
      }
    );

    alert("Product Updated");

    setShowEditModal(false);

    window.location.reload();

  } catch (err) {

    console.error(err);

    alert("Update Failed");

  }

};
  useEffect(() => {
   fetch("http://localhost:5005/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
       console.log(JSON.stringify(data[0], null, 2));

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Expected array but got:", data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setProducts([]);
      });
  }, []);

  const uniqueProductNames = [
    ...new Set(products.map((p) => p.product_name))
  ].filter(Boolean).sort();

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(
        (p) =>
          p.product_name &&
          p.product_name.toLowerCase() === selectedCategory.toLowerCase()
      );

  return (
    <div className="admin-panel">
      <h2>Products Management</h2>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "8px 12px",
          borderRadius: "8px",
          background: "#0f1d13",
          color: "#eff6eb",
          border: "1px solid rgba(255,255,255,0.15)",
          fontSize: "0.9rem",
          cursor: "pointer",
          outline: "none"
        }}
      >
        <option value="all" style={{ background: "#0f1d13", color: "#eff6eb" }}>All Products</option>
        {uniqueProductNames.map((name) => (
          <option key={name} value={name} style={{ background: "#0f1d13", color: "#eff6eb" }}>
            {name}
          </option>
        ))}
      </select>


      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Variety</th>
            <th>Weight</th>
            <th>Price</th>
            <th>Status</th>
            <th>Stock Qty</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(filteredProducts) &&
            filteredProducts.map((p) => (
             <tr key={`${p.product_id}-${p.weight}`}>
                <td>{p.product_id}</td>
                <td>{p.product_name}</td>
                <td>{p.variety_name}</td>
                <td>{p.weight}</td>
                <td>₹{p.price}</td>
                <td>{p.stock_status}</td>
                <td>{p.stock_quantity}</td>
                <td>
  <button
    onClick={() => handleEdit(p)}
  >
    Edit
  </button>
</td>
              </tr>
            ))}
        </tbody>
      </table>
      {showEditModal && (
  <div
    onClick={() => setShowEditModal(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.72)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "linear-gradient(160deg, #0d1c10 0%, #111f14 100%)",
        color: "#eff6eb",
        padding: "28px 32px",
        borderRadius: "16px",
        width: "500px",
        maxWidth: "90vw",
        maxHeight: "90vh",
        overflowY: "auto",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        backdropFilter: "blur(16px)"
      }}
    >
      <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px", fontSize: "1.1rem", fontWeight: 600 }}>Edit Product</h3>

      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "5px", color: "rgba(239,246,235,0.75)", fontSize: "0.85rem" }}>Name</label>
        <input
          type="text"
          value={selectedProduct?.product_name || ""}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              product_name: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "8px",
            color: "#eff6eb",
            fontSize: "0.9rem",
            outline: "none"
          }}
        />
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "5px", color: "rgba(239,246,235,0.75)", fontSize: "0.85rem" }}>Variety</label>
        <input
          type="text"
          value={selectedProduct?.variety_name || ""}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              variety_name: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "8px",
            color: "#eff6eb",
            fontSize: "0.9rem",
            outline: "none"
          }}
        />
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "5px", color: "rgba(239,246,235,0.75)", fontSize: "0.85rem" }}>Weight</label>
        <input
          type="text"
          value={selectedProduct?.weight || ""}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              weight: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "8px",
            color: "#eff6eb",
            fontSize: "0.9rem",
            outline: "none"
          }}
        />
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "5px", color: "rgba(239,246,235,0.75)", fontSize: "0.85rem" }}>Price</label>
        <input
          type="number"
          value={selectedProduct?.price || ""}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              price: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "8px",
            color: "#eff6eb",
            fontSize: "0.9rem",
            outline: "none"
          }}
        />
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "5px", color: "rgba(239,246,235,0.75)", fontSize: "0.85rem" }}>Stock Quantity</label>
        <input
          type="number"
          value={selectedProduct?.stock_quantity || ""}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              stock_quantity: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "8px",
            color: "#eff6eb",
            fontSize: "0.9rem",
            outline: "none"
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px", color: "rgba(239,246,235,0.75)", fontSize: "0.85rem" }}>Status</label>
        <select
          value={selectedProduct?.stock_status || ""}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              stock_status: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "#0f1d13",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "8px",
            color: "#eff6eb",
            fontSize: "0.9rem",
            cursor: "pointer",
            outline: "none"
          }}
        >
          <option value="In Stock" style={{ background: "#0f1d13", color: "#eff6eb" }}>In Stock</option>
          <option value="Out Of Stock" style={{ background: "#0f1d13", color: "#eff6eb" }}>Out Of Stock</option>
          <option value="Low Stock" style={{ background: "#0f1d13", color: "#eff6eb" }}>Low Stock</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleSave}
          style={{
            padding: "10px 22px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(135deg, #d7b56d, #6ea66a)",
            color: "#08120b",
            fontWeight: "700",
            fontSize: "0.9rem",
            cursor: "pointer"
          }}
        >
          Save Changes
        </button>
        <button
          onClick={() => setShowEditModal(false)}
          style={{
            padding: "10px 22px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.07)",
            color: "#eff6eb",
            fontWeight: "600",
            fontSize: "0.9rem",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}