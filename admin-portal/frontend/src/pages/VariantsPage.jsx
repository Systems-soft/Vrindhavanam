import { useEffect, useState } from "react";

const defaultProducts = [
  { name: "Cardamom", key: "cardamom" },
  { name: "Pepper", key: "pepper" },
  { name: "Cloves", key: "cloves" },
  { name: "Turmeric", key: "turmeric" },
  { name: "Ginger", key: "ginger" },
  { name: "Garcinia Cambogia", key: "garcinia" },
  { name: "Ashwagandha", key: "ashwagandha" },
  { name: "Pickle", key: "pickle" },
  { name: "Honey", key: "honey" },
  { name: "Tea", key: "tea" },
  { name: "Coffee", key: "coffee" },
  { name: "Ghee", key: "ghee" },
  { name: "Cashew", key: "cashew" }
].sort((a, b) => a.name.localeCompare(b.name));

function getVarietyKey(name) {
  const lower = name.toLowerCase();
  if (lower.includes('cardamom')) return 'cardamom';
  if (lower.includes('pepper')) return 'pepper';
  if (lower.includes('turmeric')) return 'turmeric';
  if (lower.includes('clove')) return 'cloves';
  if (lower.includes('tea') || lower.includes('chai')) return 'tea';
  if (lower.includes('coffee') || lower.includes('roast') || lower.includes('bean')) return 'coffee';
  if (lower.includes('honey') || lower.includes('blossom')) return 'honey';
  if (lower.includes('ghee')) return 'ghee';
  if (lower.includes('ginger')) return 'ginger';
  if (lower.includes('cashew')) return 'cashew';
  if (lower.includes('ashwagandha')) return 'ashwagandha';
  if (lower.includes('garcinia')) return 'garcinia';
  if (lower.includes('pickle')) return 'pickle';
  return lower.replace(/[^a-z0-9]+/g, '-');
}

export default function VariantsPage() {
  const [product, setProduct] = useState("cardamom");
  const [productList, setProductList] = useState(defaultProducts);
  const [variants, setVariants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5005/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const uniques = [...new Set(data.map(p => p.product_name))].filter(Boolean);
          const mapped = uniques.map(name => ({
            name: name,
            key: getVarietyKey(name)
          })).sort((a, b) => a.name.localeCompare(b.name));
          setProductList(mapped);
          
          if (mapped.length > 0 && !mapped.some(m => m.key === product)) {
            setProduct(mapped[0].key);
          }
        }
      })
      .catch(console.error);
  }, []);

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
        style={{
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
        {productList.map((item) => (
          <option
            key={item.key}
            value={item.key}
            style={{ background: "#0f1d13", color: "#eff6eb" }}
          >
            {item.name}
          </option>
        ))}
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
    padding: "8px 12px",
    background: "#0f1d13",
    color: "#eff6eb",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    fontSize: "0.9rem",
    cursor: "pointer",
    outline: "none"
  }}
>
  <option value="All" style={{ background: "#0f1d13", color: "#eff6eb" }}>All</option>
  <option value="In Stock" style={{ background: "#0f1d13", color: "#eff6eb" }}>In Stock</option>
  <option value="Low Stock" style={{ background: "#0f1d13", color: "#eff6eb" }}>Low Stock</option>
  <option value="Out Of Stock" style={{ background: "#0f1d13", color: "#eff6eb" }}>Out Of Stock</option>
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