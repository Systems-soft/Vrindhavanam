import { useEffect, useState } from "react";

export default function InventoryPage() {

  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {

    fetch("http://localhost:5005/api/admin/inventory")
      .then(res => res.json())
      .then(data => setInventory(data))
      .catch(err => console.error(err));

  }, []);

  const filteredProducts = inventory.filter((item) => {

  const matchesSearch =
    item.product_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" ||
    item.stock_status === statusFilter;

  return matchesSearch && matchesStatus;

});

const totalProducts = inventory.length;

const inStock = inventory.filter(
  p => p.stock_status === "In Stock"
).length;

const lowStock = inventory.filter(
  p => p.stock_status === "Low Stock"
).length;

const outOfStock = inventory.filter(
  p => p.stock_status === "Out Of Stock"
).length;
  return (

    <div style={{ padding: "20px" }}>

      <h2>Inventory Management</h2>

      <div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "20px"
  }}
>
  <div>Total Products: {totalProducts}</div>

  <div>In Stock: {inStock}</div>

  <div>Low Stock: {lowStock}</div>

  <div>Out Of Stock: {outOfStock}</div>
</div>
<input
  type="text"
  placeholder="Search Product..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    padding: "8px",
    marginRight: "10px",
    marginBottom: "15px"
  }}
/>
<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  style={{
    padding: "8px",
    marginBottom: "15px"
  }}
>
  <option value="All">All</option>
  <option value="In Stock">In Stock</option>
  <option value="Low Stock">Low Stock</option>
  <option value="Out Of Stock">Out Of Stock</option>
</select>
      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >

        <thead>

          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Variety</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {filteredProducts.map((item) => (

            <tr key={item.id}>

              <td>{item.id}</td>

              <td>{item.product_name}</td>

              <td>{item.variety_name}</td>

              <td>₹{item.price}</td>

              <td>{item.stock_quantity}</td>

              <td>{item.stock_status}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}