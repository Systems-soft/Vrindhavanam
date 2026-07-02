import { useEffect,useState } from "react";
import {
 BarChart,
 Bar,
 LineChart,
 Line,
 PieChart,
 Pie,
 Cell,
 Legend,
 XAxis,
 YAxis,
 Tooltip,
 CartesianGrid
} from "recharts";
import { useNavigate }
from "react-router-dom";
export default function AnalyticsPage(){
 const [analytics,setAnalytics] = useState(null);
 const [monthlyData,setMonthlyData] =
useState([]);
const [recentOrders,setRecentOrders] =
useState([]);
const [loading,setLoading] =
useState(true);
const [lowStock,setLowStock] =
useState([]);
const [monthlyRevenue,setMonthlyRevenue] =
useState([]);
const [topProducts,setTopProducts] =
useState([]);
const [customerGrowth,setCustomerGrowth] =
useState([]);
const [topCustomers,setTopCustomers] =
useState([]);
const [search,setSearch] =
useState("");
const [revenueGrowth,setRevenueGrowth] =
useState(0);
const [customerGrowthPercent,
setCustomerGrowthPercent] =
useState(0);
const [range,setRange] =
useState("30days");
const [error,setError] = useState("");
 useEffect(()=>{
Promise.all([
 fetch("http://localhost:5005/api/admin/analytics")
  .then(res => res.json()),

 fetch("http://localhost:5005/api/admin/analytics/monthly")
  .then(res => res.json()),

 fetch("http://localhost:5005/api/admin/analytics/recent-orders")
  .then(res => res.json()),

  fetch("http://localhost:5005/api/admin/analytics/revenue-growth")
.then(res=>res.json()),

fetch("http://localhost:5005/api/admin/analytics/low-stock")
 .then(res => res.json()),


 fetch("http://localhost:5005/api/admin/analytics/monthly-revenue")
  .then(res => res.json()),

  fetch("http://localhost:5005/api/admin/analytics/customer-growth")
.then(res => res.json()),

fetch("http://localhost:5005/api/admin/analytics/top-customers")
 .then(res => res.json()),

 fetch(
 "http://localhost:5005/api/admin/analytics/customer-growth-percent"
)
.then(res => res.json()),

 fetch("http://localhost:5005/api/admin/analytics/top-products")
 .then(res=>res.json())
])
.then(([
 analyticsData,
 monthly,
 recent,
 revenueGrowthData,
 lowStockData,
 revenue,
 growth,
 customers,
 customerGrowthPercentData,
 products
]) => {

 setAnalytics(analyticsData);

 setMonthlyData(monthly);

 setRecentOrders(recent);

 setMonthlyRevenue(revenue);

 setCustomerGrowth(growth);

 setTopCustomers(customers);

 setTopProducts(products);

 setLowStock(lowStockData);

 setRevenueGrowth(
  revenueGrowthData.growth || 0
 );

 setCustomerGrowthPercent(
  customerGrowthPercentData.growth || 0
 );

 setLoading(false);
})
.catch(err => {
 console.log(err);
 setLoading(false);
 setError("Failed to load analytics");
});
 },[range]);
 if(error){
 return <h3>{error}</h3>;
}
if (loading) {
 return (
 <div style={{padding:"30px"}}>
 <div
 style={{
  display:"grid",
  gridTemplateColumns:
   "repeat(4,1fr)",
  gap:"20px"
 }}
>
 {
  [1,2,3,4].map(i=>(
   <div
    key={i}
    style={{
     height:"100px",
     background:"#eee",
     borderRadius:"10px"
    }}
   />
  ))
 }
</div>
 </div>
);
}

if (!analytics) {
  return <h3>No Analytics Data</h3>;
}

const filteredOrders =
 recentOrders.filter(o =>
  (o.customer_name || "")
   .toLowerCase()
   .includes((search || "").toLowerCase())
 );
 const exportCSV = () => {

 const rows = [
  ["Customer","Total","Status"]
 ];

 recentOrders.forEach(o => {
  rows.push([
   o.customer_name,
   o.total_amount,
   o.status
  ]);
 });

 const csv =
  rows.map(r=>r.join(",")).join("\n");

 const blob =
  new Blob([csv],{
   type:"text/csv"
  });

 const url =
  URL.createObjectURL(blob);

 const a =
  document.createElement("a");

 a.href = url;

 a.download = "orders.csv";

 a.click();
};
const exportReport = () => {

 const report = {
  analytics,
  monthlyData,
  monthlyRevenue,
  recentOrders,
  topProducts,
  customerGrowth,
  topCustomers
 };

 const blob = new Blob(
  [JSON.stringify(report,null,2)],
  { type:"application/json" }
 );

 const url = URL.createObjectURL(blob);

 const a = document.createElement("a");

 a.href = url;
 a.download = "analytics-report.json";

 a.click();
};

const statusData = [
 {
  name: "Pending",
  value: analytics.pending_orders || 0
 },
 {
  name: "Delivered",
  value: analytics.delivered_orders || 0
 },
 {
  name: "Cancelled",
  value: analytics.cancelled_orders || 0
 }
];

const COLORS = [
 "#ff9800",
 "#4caf50",
 "#f44336"
];
return(

  <div style={{ padding:"20px" }}>

  <h2>Analytics Dashboard</h2>

  <button
 onClick={() => window.location.reload()}
>
 Refresh Analytics
</button>

<button
 style={{ marginLeft:"10px" }}
 onClick={exportReport}
>
 Export Report
</button>

<button
 style={{ marginLeft:"10px" }}
 onClick={exportCSV}
>
 Export CSV
</button>

<br/><br/>

<button onClick={()=>setRange("today")}>
 Today
</button>

<button onClick={()=>setRange("7days")}>
 Last 7 Days
</button>

<button onClick={()=>setRange("30days")}>
 Last 30 Days
</button>

<button onClick={()=>setRange("year")}>
 Last Year
</button>

<br /><br />

  <div style={{
 display:"grid",
 gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
 gap:"20px"
}}>


<div className="card"
style={{
 background: "rgba(18, 24, 20, 0.4)",
 padding: "20px",
 borderRadius: "10px",
 border: "1px solid rgba(255,255,255,0.08)",
 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
 color: "#eff6eb",
 cursor: "pointer",
 transition: "0.3s"
}}>
 <h4>Total Orders</h4>
 <h2>{analytics.total_orders}</h2>
</div>

<div className="card"
style={{
 background: "rgba(18, 24, 20, 0.4)",
 padding: "20px",
 borderRadius: "10px",
 border: "1px solid rgba(255,255,255,0.08)",
 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
 color: "#eff6eb",
 cursor: "pointer",
 transition: "0.3s"
}}>
 <h4>Total Revenue</h4>
 <h2>₹{Number(
 analytics.total_revenue || 0
).toLocaleString()}</h2>
</div>

<div className="card"
style={{
 background: "rgba(18, 24, 20, 0.4)",
 padding: "20px",
 borderRadius: "10px",
 border: "1px solid rgba(255,255,255,0.08)",
 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
 color: "#eff6eb",
 cursor: "pointer",
 transition: "0.3s"
}}>
 <h4>Total Customers</h4>
 <h2>{analytics.total_customers}</h2>
</div>

<div className="card"
style={{
 background: "rgba(18, 24, 20, 0.4)",
 padding: "20px",
 borderRadius: "10px",
 border: "1px solid rgba(255,255,255,0.08)",
 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
 color: "#eff6eb",
 cursor: "pointer",
 transition: "0.3s"
}}>
 <h4>Total Products</h4>
 <h2>{analytics.total_products}</h2>
</div>

<div className="card"
style={{
 background: "rgba(18, 24, 20, 0.4)",
 padding: "20px",
 borderRadius: "10px",
 border: "1px solid rgba(255,255,255,0.08)",
 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
 color: "#eff6eb",
 cursor: "pointer",
 transition: "0.3s"
}}>
 
 <h4>Best Seller</h4>

 <h2>
  {
   topProducts.length > 0
    ? topProducts[0].product_name
    : "N/A"
  }
 </h2>

 <p style={{ margin: "5px 0 0 0", color: "rgba(239,246,235,0.6)" }}>
  Sold: {
   topProducts.length > 0
    ? topProducts[0].total_sold
    : 0
  }
 </p>
</div>
<div className="card" style={{
 background: "rgba(18, 24, 20, 0.4)",
 padding: "20px",
 borderRadius: "10px",
 border: "1px solid rgba(255,255,255,0.08)",
 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
 color: "#eff6eb",
 cursor: "pointer",
 transition: "0.3s"
}}>
  <h4>Pending Orders</h4>
  <h2>{analytics.pending_orders || 0}</h2>
</div>

<div className="card" style={{
 background: "rgba(18, 24, 20, 0.4)",
 padding: "20px",
 borderRadius: "10px",
 border: "1px solid rgba(255,255,255,0.08)",
 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
 color: "#eff6eb",
 cursor: "pointer",
 transition: "0.3s"
}}>
  <h4>Delivered Orders</h4>
  <h2>{analytics.delivered_orders || 0}</h2>
</div>

<div className="card" style={{
 background: "rgba(18, 24, 20, 0.4)",
 padding: "20px",
 borderRadius: "10px",
 border: "1px solid rgba(255,255,255,0.08)",
 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
 color: "#eff6eb",
 cursor: "pointer",
 transition: "0.3s"
}}>
  <h4>Cancelled Orders</h4>
  <h2>{analytics.cancelled_orders || 0}</h2>
</div>
<div className="card" style={{
 background: "rgba(18, 24, 20, 0.4)",
 padding: "20px",
 borderRadius: "10px",
 border: "1px solid rgba(255,255,255,0.08)",
 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
 color: "#eff6eb",
 cursor: "pointer",
 transition: "0.3s"
}}>
 <h4>Revenue Growth</h4>
 <h2>{revenueGrowth}%</h2>
</div>

<div className="card" style={{
 background: "rgba(18, 24, 20, 0.4)",
 padding: "20px",
 borderRadius: "10px",
 border: "1px solid rgba(255,255,255,0.08)",
 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
 color: "#eff6eb",
 cursor: "pointer",
 transition: "0.3s"
}}>
 <h4>Customer Growth</h4>
 <h2>{customerGrowthPercent}%</h2>
</div>
<div className="card" style={{
 background: "rgba(18, 24, 20, 0.4)",
 padding: "20px",
 borderRadius: "10px",
 border: "1px solid rgba(255,255,255,0.08)",
 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
 color: "#eff6eb",
 cursor: "pointer",
 transition: "0.3s"
}}>
 <h4>Low Stock Products</h4>

 <h2>
  {lowStock.length}
 </h2>
</div>
</div>
<div
 style={{
  marginTop:"30px",
  padding:"24px 32px",
  background: "linear-gradient(160deg, #0d1c10 0%, #111f14 100%)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  color: "#eff6eb"
 }}
>
<h3 style={{ color: "#d7b56d", marginTop: 0 }}>Summary</h3>

<p>
Orders: {analytics.total_orders}
</p>

<p>
Customers: {analytics.total_customers}
</p>

<p>
Products: {analytics.total_products}
</p>

<p>
Revenue: ₹{
 Number(
  analytics.total_revenue || 0
 ).toLocaleString()
}
</p>
<h3 style={{ color: "#d7b56d", marginTop: "20px" }}>Order Status Overview</h3>

<PieChart
 width={400}
 height={300}
>
 <Pie
  data={statusData}
  dataKey="value"
  cx="50%"
  cy="50%"
  outerRadius={100}
 >
  {
   statusData.map((entry,index)=>(
    <Cell
     key={index}
     fill={COLORS[index]}
    />
   ))
  }
 </Pie>

 <Tooltip contentStyle={{ background: "#0f1d13", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#eff6eb" }} />
</PieChart>
<h4>
 Average Order Value:
 ₹{
  analytics.total_orders > 0
   ? (
      analytics.total_revenue /
      analytics.total_orders
     ).toFixed(2)
   : 0
 }
</h4>
</div>

<h3 style={{marginTop:"40px"}}>
 Monthly Orders
</h3>

{
 monthlyData.length > 0 ? (

  <div style={{ overflowX:"auto" }}>
   <BarChart
    width={900}
    height={300}
    data={monthlyData}
   >

    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

    <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />

    <YAxis stroke="rgba(255,255,255,0.6)" />

   <Tooltip
     contentStyle={{ background: "#0f1d13", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#eff6eb" }}
     formatter={(value)=>`${value} Orders`}
   />

    <Bar
     dataKey="orders"
     fill="#d7b56d"
    />

   </BarChart>

  </div>

 ) : (

  <p>No Monthly Data Available</p>

 )
}

<h3 style={{marginTop:"40px"}}>
 Monthly Revenue
</h3>

{
 monthlyRevenue.length > 0 ? (
  <div style={{ overflowX:"auto" }}>
  <BarChart
   width={900}
   height={300}
   data={monthlyRevenue}
  >

   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

   <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />

   <YAxis stroke="rgba(255,255,255,0.6)" />

   <Tooltip
     contentStyle={{ background: "#0f1d13", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#eff6eb" }}
     formatter={(value)=>
      `₹${Number(value).toLocaleString()}`
     }
   />

   <Bar
    dataKey="revenue"
    fill="#88c999"
   />

  </BarChart>
  </div>

 ) : (

  <p>No Revenue Data Available</p>

 )
}
<h3>Revenue Trend</h3>

{
 monthlyRevenue.length > 0 ? (

  <div style={{ overflowX:"auto" }}>
   <LineChart
    width={900}
    height={300}
    data={monthlyRevenue}
   >
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
    <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
    <YAxis stroke="rgba(255,255,255,0.6)" />
    <Tooltip contentStyle={{ background: "#0f1d13", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#eff6eb" }} />
    <Line
     type="monotone"
     dataKey="revenue"
     stroke="#4caf50"
    />
   </LineChart>
  </div>

 ) : (

  <p>No Revenue Trend Data</p>

 )
}
<h3 style={{ marginTop:"40px" }}>
 Top Selling Products Chart
</h3>

{
 topProducts.length > 0 ? (
<div style={{ overflowX:"auto" }}>
  <BarChart
   width={900}
   height={300}
   data={topProducts}
  >

   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

   <XAxis dataKey="product_name" stroke="rgba(255,255,255,0.6)" />

   <YAxis stroke="rgba(255,255,255,0.6)" />

   <Tooltip contentStyle={{ background: "#0f1d13", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#eff6eb" }} />

   <Bar
    dataKey="total_sold"
    fill="#d7b56d"
   />

  </BarChart>
  </div>

 ) : (

  <p>No Product Data Available</p>

 )
}

<h3>Customer Growth</h3>

{
 customerGrowth.length > 0 ? (

  <div style={{ overflowX:"auto" }}>
   <BarChart
    width={900}
    height={300}
    data={customerGrowth}
   >
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
    <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
    <YAxis stroke="rgba(255,255,255,0.6)" />
    <Tooltip contentStyle={{ background: "#0f1d13", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#eff6eb" }} />
    <Bar
     dataKey="customers"
     fill="#7abaff"
    />
   </BarChart>
  </div>

 ) : (

  <p>No Customer Growth Data</p>

 )
}

<h3 style={{marginTop:"40px"}}>
 Top Selling Products
</h3>
<table
 border="1"
 cellPadding="10"
 style={{
  width:"100%",
  borderCollapse:"collapse",
  borderColor: "rgba(255,255,255,0.08)"
 }}
>

<thead
 style={{
  background:"#0f1d13",
  color:"#d7b56d"
 }}
>
<tr>
 <th>Rank</th>
 <th>ID</th>
 <th>Name</th>
 <th>Sold Quantity</th>
</tr>
</thead>

<tbody>

{
 topProducts.length > 0 ? (

  topProducts.map((p,index)=>(

   <tr
 key={p.id}
 style={{ cursor:"pointer", background: "transparent" }}
>
    <td>{index + 1}</td>
    <td>{p.id}</td>
    <td>{p.product_name}</td>
    <td>{p.total_sold}</td>
   </tr>

  ))

 ) : (

  <tr>
   <td colSpan="4">
    No Product Data
   </td>
  </tr>

 )
}

</tbody>

</table>
<h3>Top Customers</h3>

<table
 border="1"
 cellPadding="10"
 style={{
  width:"100%",
  borderCollapse:"collapse",
  borderColor: "rgba(255,255,255,0.08)"
 }}
>
<thead
 style={{
  background:"#0f1d13",
  color:"#d7b56d"
 }}
>
<tr>
 <th>Name</th>
 <th>Orders</th>
 <th>Revenue</th>
</tr>
</thead>

<tbody>

{
 topCustomers.length > 0 ? (

 topCustomers.map((c)=>(

   <tr key={`${c.customer_name}-${c.orders}-${c.revenue}`} style={{ background: "transparent" }}>
    <td>{c.customer_name}</td>
    <td>{c.orders}</td>
    <td>
 ₹{Number(c.revenue || 0).toLocaleString()}
</td>
   </tr>

  ))

 ) : (

  <tr>
   <td colSpan="3">
    No Customer Data
   </td>
  </tr>

 )
}

</tbody>
</table>
<h3>Low Stock Products</h3>

<table
 border="1"
 cellPadding="10"
 style={{
  width:"100%",
  borderCollapse:"collapse",
  borderColor: "rgba(255,255,255,0.08)"
 }}
>

<thead style={{ background: "#0f1d13", color: "#d7b56d" }}>
<tr>
 <th>Product</th>
 <th>Stock Left</th>
</tr>
</thead>

<tbody>

{
 lowStock.length > 0 ? (

  lowStock.map((p)=>(

   <tr key={p.id} style={{ background: "transparent" }}>
    <td>{p.product_name}</td>
    <td>{p.stock}</td>
   </tr>

  ))

 ) : (

  <tr>
   <td colSpan="2">
    No Low Stock Products
   </td>
  </tr>

 )
}

</tbody>

</table>
<h3 style={{marginTop:"40px"}}>
 Recent Orders
</h3>

<input
 value={search}
 onChange={(e)=>setSearch(e.target.value)}
 placeholder="Search Customer"
 style={{
  padding:"8px 12px",
  marginBottom:"10px",
  width:"250px",
  background: "#0f1d13",
  color: "#eff6eb",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "8px",
  outline: "none"
 }}
/>

<p>
Showing {filteredOrders.length} recent orders
</p>
<table
 border="1"
 cellPadding="10"
 style={{
  width:"100%",
  borderCollapse:"collapse",
  borderColor: "rgba(255,255,255,0.08)"
 }}
>

<thead
 style={{
  background:"#0f1d13",
  color:"#d7b56d"
 }}
>
<tr>
 <th>ID</th>
 <th>Customer</th>
 <th>Total</th>
 <th>Status</th>
 <th>Action</th>
</tr>
</thead>

<tbody>

{
 filteredOrders.length > 0 ? (

    filteredOrders.map((o)=>(
  <tr
 key={o.id}
 style={{ cursor:"pointer", background: "transparent" }}
>
    <td>{o.id}</td>
    <td>{o.customer_name}</td>
    <td>
 ₹{Number(o.total_amount).toLocaleString()}
</td>
   <td>
 <span
  style={{
   padding:"5px 10px",
   borderRadius:"5px",
   color:
    o.status === "Delivered"
     ? "#5dd374"
     : o.status === "Pending"
     ? "#ffe066"
     : "#ff8080",
   background:
    o.status === "Delivered"
     ? "rgba(40, 167, 69, 0.2)"
     : o.status === "Pending"
     ? "rgba(255, 193, 7, 0.2)"
     : "rgba(220, 53, 69, 0.2)",
   border:
    o.status === "Delivered"
     ? "1px solid rgba(40, 167, 69, 0.3)"
     : o.status === "Pending"
     ? "1px solid rgba(255, 193, 7, 0.3)"
     : "1px solid rgba(220, 53, 69, 0.3)"
  }}
 >
  {o.status}
 </span>
</td>
<td>
 <button
  onClick={() => {
  console.log("Order ID:", o.id);
  navigate(`/admin/orders/${o.id}`);
}}
  
 >
  View
 </button>
</td>
   </tr>

  ))

 ) : (

  <tr>
   <td colSpan="5" style={{ background: "transparent" }}>
    No Recent Orders
   </td>
  </tr>

 )
}

</tbody>
</table>
 </div>
);
}
