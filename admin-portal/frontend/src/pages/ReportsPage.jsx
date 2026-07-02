import { useEffect, useState } from "react";

export default function ReportsPage() {

  const [summary,setSummary] = useState({});
  const [monthlySales,setMonthlySales] = useState([]);
  const [topProducts,setTopProducts] = useState([]);

  useEffect(()=>{

    fetch("http://localhost:5005/api/admin/reports/sales-summary")
      .then(r=>r.json())
      .then(data=>setSummary(data));

    fetch("http://localhost:5005/api/admin/reports/monthly-sales")
      .then(r=>r.json())
      .then(data=>setMonthlySales(data));

    fetch("http://localhost:5005/api/admin/reports/top-products")
      .then(r=>r.json())
      .then(data=>setTopProducts(data));

  },[]);

  return (
    <div style={{padding:"20px"}}>

      <h1>Reports</h1>

      <div
        style={{
          display:"flex",
          gap:"20px",
          marginBottom:"30px"
        }}
      >

        <div
          style={{
            padding:"20px",
            border:"1px solid #ddd",
            borderRadius:"10px",
            minWidth:"200px"
          }}
        >
          <h3>Total Orders</h3>
          <p>{summary.total_orders || 0}</p>
        </div>

        <div
          style={{
            padding:"20px",
            border:"1px solid #ddd",
            borderRadius:"10px",
            minWidth:"200px"
          }}
        >
          <h3>Total Revenue</h3>
          <p>
            ₹{Number(summary.total_revenue || 0).toLocaleString()}
          </p>
        </div>

      </div>

      <h2>Monthly Sales</h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          width:"100%",
          borderCollapse:"collapse",
          marginBottom:"30px"
        }}
      >
        <thead>
          <tr>
            <th>Month</th>
            <th>Revenue</th>
          </tr>
        </thead>

        <tbody>

        {
          monthlySales.map((m,index)=>(
            <tr key={index}>
              <td>{m.month}</td>
              <td>
                ₹{Number(m.revenue).toLocaleString()}
              </td>
            </tr>
          ))
        }

        </tbody>

      </table>

      <h2>Top Products</h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          width:"100%",
          borderCollapse:"collapse"
        }}
      >

        <thead>
          <tr>
            <th>Product</th>
            <th>Total Sold</th>
          </tr>
        </thead>

        <tbody>

        {
          topProducts.map((p,index)=>(
            <tr
              key={`${p.product_name}-${index}`}
            >
              <td>{p.product_name}</td>
              <td>{p.total_sold}</td>
            </tr>
          ))
        }

        </tbody>

      </table>

    </div>
  );
}