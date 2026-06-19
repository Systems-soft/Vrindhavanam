import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [selectedCategory, setSelectedCategory] = useState("cardamom");

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

  return (
    <div className="admin-panel">
      <h2>Products Management</h2>
      <select
  value={selectedCategory}
onChange={(e) => setSelectedCategory(e.target.value)}
  style={{
    marginBottom: "20px",
    padding: "8px",
    borderRadius: "6px"
  }}
>
  <option value="cardamom">Cardamom</option>
  <option value="pepper">Pepper</option>
  <option value="honey">Honey</option>
  <option value="coffee">Coffee</option>
  <option value="cloves">Cloves</option>
  <option value="ghee">Ghee</option>
  <option value="tea">Tea</option>
  <option value="turmeric">Turmeric</option>
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
          {Array.isArray(products) &&
            products.map((p) => (
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
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div
  style={{
    background: "#fff",
    color: "#000",
    padding: "20px",
    borderRadius: "10px",
    width: "500px"
  }}
>
     <h3>Edit Product</h3>
<div style={{ marginBottom: "10px" }}>
  <label>Name</label>
  <input
    type="text"
    value={selectedProduct?.product_name || ""}
    onChange={(e) =>
      setSelectedProduct({
        ...selectedProduct,
        product_name: e.target.value
      })
    }
  />
</div>

<div style={{ marginBottom: "10px" }}>
  <label>Variety</label>

  <input
    type="text"
    value={selectedProduct?.variety_name || ""}
    onChange={(e) =>
      setSelectedProduct({
        ...selectedProduct,
        variety_name: e.target.value
      })
    }
  />
</div>
<div style={{ marginBottom: "10px" }}>
  <label>Weight</label>

  <input
    type="text"
    value={selectedProduct?.weight || ""}
    onChange={(e) =>
      setSelectedProduct({
        ...selectedProduct,
        weight: e.target.value
      })
    }
  />
</div>

<div style={{ marginBottom: "10px" }}>
  <label>Price</label>
  <input
    type="number"
    value={selectedProduct?.price || ""}
    onChange={(e) =>
      setSelectedProduct({
        ...selectedProduct,
        price: e.target.value
      })
    }
  />
</div>

<div style={{ marginBottom: "10px" }}>
  <label>Stock Quantity</label>
  <input
    type="number"
    value={selectedProduct?.stock_quantity || ""}
    onChange={(e) =>
      setSelectedProduct({
        ...selectedProduct,
        stock_quantity: e.target.value
      })
    }
  />
</div>

<div style={{ marginBottom: "10px" }}>
  <label>Status</label>

  <select
    value={selectedProduct?.stock_status || ""}
    onChange={(e) =>
      setSelectedProduct({
        ...selectedProduct,
        stock_status: e.target.value
      })
    }
  >
    <option value="In Stock">In Stock</option>
    <option value="Out Of Stock">Out Of Stock</option>
    <option value="Low Stock">Low Stock</option>
  </select>
</div>
<button onClick={handleSave}>
  Save Changes
</button>
<button
  onClick={() => setShowEditModal(false)}
>
  Close
</button>
    </div>
  </div>
)}
    </div>
  );
}