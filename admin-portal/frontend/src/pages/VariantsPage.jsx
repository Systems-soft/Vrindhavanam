import { useEffect, useState } from "react";

export default function VariantsPage() {
  const [product, setProduct] = useState("honey");
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5005/api/variants/${product}`)
      .then((res) => res.json())
      .then((data) => setVariants(data))
      .catch(console.error);
  }, [product]);

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

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Variety</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {variants.map((v, index) => (
            <tr key={index}>
              <td>{v.variety_name}</td>
              <td>{v.stock_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}