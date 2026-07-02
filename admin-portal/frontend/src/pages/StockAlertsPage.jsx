import { useEffect, useState } from "react";

export default function StockAlertsPage() {

const [alerts,setAlerts] = useState([]);

const [searchTerm,setSearchTerm] = useState("");

const [showAddModal,setShowAddModal] =
useState(false);

const [newAlert,setNewAlert] =
useState({

 product_name:"",
 current_stock:"",
 minimum_stock:""

});
useEffect(()=>{

 fetch(
  "http://localhost:5005/api/admin/stock-alerts"
 )
 .then(res=>res.json())
 .then(data=>setAlerts(data));

},[]);
const filteredAlerts = alerts.filter((a)=>

  a.product_name
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase())

);
const handleInputChange = (e) => {

  const { name,value } = e.target;

  setNewAlert({

    ...newAlert,

    [name]: value

  });

};
const handleSaveAlert = async () => {

  await fetch(

    "http://localhost:5005/api/admin/stock-alerts",

    {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(newAlert)

    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/stock-alerts"
  );

  const data = await response.json();

  setAlerts(data);

  setNewAlert({

    product_name:"",
    current_stock:"",
    minimum_stock:""

  });

  setShowAddModal(false);

};
const handleDeleteAlert = async(id)=>{

  await fetch(

    `http://localhost:5005/api/admin/stock-alerts/${id}`,

    {
      method:"DELETE"
    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/stock-alerts"
  );

  const data = await response.json();

  setAlerts(data);

};
return (
  <div>

<h2>Stock Alerts</h2>

<input
  type="text"
  placeholder="Search Product..."
  value={searchTerm}
  onChange={(e)=>setSearchTerm(e.target.value)}
/>

<br /><br />

<button
  onClick={()=>setShowAddModal(true)}
>
 Add Alert
</button>

<br /><br />
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

<th>ID</th>

<th>Product</th>

<th>Current Stock</th>

<th>Minimum Stock</th>

<th>Status</th>

<th>Actions</th>

</tr>

</thead>
<tbody>

{
 filteredAlerts.map((a)=>(

 <tr key={a.id}>

  <td>{a.id}</td>

  <td>{a.product_name}</td>

  <td>{a.current_stock}</td>

  <td>{a.minimum_stock}</td>

  <td
   style={{
    color:
      a.status==="Out of Stock"
      ? "red"
      :
      a.status==="Low Stock"
      ? "orange"
      :
      "green"
   }}
  >
   {a.status}
  </td>

  <td>

   <button
    onClick={()=>handleDeleteAlert(a.id)}
   >
    Delete
   </button>

  </td>

 </tr>

 ))
}

</tbody>
</table>
{
showAddModal && (
  <div
    onClick={() => setShowAddModal(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)",
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
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
      }}
    >
      <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px" }}>Add Stock Alert</h3>
      
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Product Name</label>
        <input
          name="product_name"
          placeholder="Product Name"
          value={newAlert.product_name}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#0f1d13",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            outline: "none"
          }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Current Stock</label>
        <input
          type="number"
          name="current_stock"
          placeholder="Current Stock"
          value={newAlert.current_stock}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#0f1d13",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            outline: "none"
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Minimum Stock</label>
        <input
          type="number"
          name="minimum_stock"
          placeholder="Minimum Stock"
          value={newAlert.minimum_stock}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#0f1d13",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            outline: "none"
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSaveAlert}
          style={{
            background: "linear-gradient(135deg, #d7b56d 0%, #b8954b 100%)",
            color: "#08120b",
            fontWeight: "600",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Save
        </button>
        <button
          onClick={()=>setShowAddModal(false)}
          style={{
            background: "transparent",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            marginLeft: "10px"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)
}
</div>

);

}