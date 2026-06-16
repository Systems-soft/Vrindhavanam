import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("cardamom");

  useEffect(() => {
   fetch(`http://localhost:5005/api/products/${selectedProduct}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);

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
  }, [selectedProduct]);

  return (
    <div className="admin-panel">
      <h2>Products Management</h2>
      <select
  value={selectedProduct}
  onChange={(e) => setSelectedProduct(e.target.value)}
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
          </tr>
        </thead>

        <tbody>
          {Array.isArray(products) &&
            products.map((p) => (
              <tr key={p.serial_no}>
                <td>{p.product_id}</td>
                <td>{p.product_name}</td>
                <td>{p.variety_name}</td>
                <td>{p.weight}</td>
                <td>₹{p.price}</td>
                <td>{p.stock_status}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}