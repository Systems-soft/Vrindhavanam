import { useEffect, useState } from "react";

export default function VariantsPage() {
  const [product, setProduct] = useState("honey");
  const [variants, setVariants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch(`http://localhost:5005/api/variants/${product}`)
      .then((res) => res.json())
      .then((data) => setVariants(data))
      .catch(console.error);
  }, [product]);

const filteredVariants = variants.filter((v) => {

  const matchesSearch =
    v.variety_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" ||
    v.stock_status === statusFilter;

  return matchesSearch && matchesStatus;

});
const totalVariants = variants.length;

const inStock = variants.filter(
  v => v.stock_status === "In Stock"
).length;

const lowStock = variants.filter(
  v => v.stock_status === "Low Stock"
).length;

const outOfStock = variants.filter(
  v => v.stock_status === "Out Of Stock"
).length;
  return (

    
    <div className="admin-panel">
      <h2>Variants Management</h2>

     <select
  value={product}
  onChange={(e) => setProduct(e.target.value)}
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

<input
  type="text"
  placeholder="Search Variant..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    marginLeft: "10px",
    padding: "8px"
  }}
/>
<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  style={{
    marginLeft: "10px",
    padding: "8px"
  }}
>
  <option value="All">All</option>
  <option value="In Stock">In Stock</option>
  <option value="Low Stock">Low Stock</option>
  <option value="Out Of Stock">Out Of Stock</option>
</select>
<div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "20px",
    marginBottom: "20px"
  }}
>
  <div>Total Variants: {totalVariants}</div>

  <div>In Stock: {inStock}</div>

  <div>Low Stock: {lowStock}</div>

  <div>Out Of Stock: {outOfStock}</div>
</div>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
  <th>Product</th>
  <th>Variety</th>
  <th>Status</th>
</tr>
        </thead>

        <tbody>
          {filteredVariants.map((v) => (
           <tr
  key={`${product}-${v.variety_name}`}
  style={{
    cursor: "pointer"
  }}
  onMouseEnter={(e) =>
    e.currentTarget.style.background =
      "rgba(255,255,255,0.05)"
  }
  onMouseLeave={(e) =>
    e.currentTarget.style.background =
      "transparent"
  }
>
             <td>{product}</td>

<td>{v.variety_name}</td>

<td
  style={{
    color:
      v.stock_status === "Out Of Stock"
        ? "red"
        : v.stock_status === "Low Stock"
        ? "orange"
        : "green"
  }}
>
  {v.stock_status}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}