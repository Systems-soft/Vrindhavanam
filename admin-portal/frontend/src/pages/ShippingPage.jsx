import { useEffect, useState } from "react";

export default function ShippingPage() {
  const [shipping,setShipping] = useState([]);

const [searchTerm,setSearchTerm] =
useState("");

const [showAddModal,setShowAddModal] =
useState(false);

const [newShipping,setNewShipping] =
useState({

 method_name:"",
 delivery_zone:"",
 shipping_charge:"",
 estimated_days:""

});
useEffect(()=>{

 fetch(
  "http://localhost:5005/api/admin/shipping"
 )
 .then(res=>res.json())
 .then(data=>setShipping(data));

},[]);
const filteredShipping =
shipping.filter((s)=>

 s.method_name
  ?.toLowerCase()
  .includes(searchTerm.toLowerCase())

 ||

 s.delivery_zone
  ?.toLowerCase()
  .includes(searchTerm.toLowerCase())

);
const handleInputChange = (e)=>{

 const { name,value } = e.target;

 setNewShipping({

  ...newShipping,

  [name]:value

 });

};
const handleSaveShipping = async()=>{

 await fetch(

  "http://localhost:5005/api/admin/shipping",

  {
   method:"POST",

   headers:{
    "Content-Type":"application/json"
   },

   body:JSON.stringify(newShipping)

  }

 );

 const response = await fetch(
  "http://localhost:5005/api/admin/shipping"
 );

 const data = await response.json();

 setShipping(data);

 setShowAddModal(false);

};
const handleDeleteShipping = async(id)=>{

 await fetch(

  `http://localhost:5005/api/admin/shipping/${id}`,

  {
   method:"DELETE"
  }

 );

 const response = await fetch(
  "http://localhost:5005/api/admin/shipping"
 );

 const data = await response.json();

 setShipping(data);

};
const handleActivateShipping = async(id)=>{

 await fetch(

  `http://localhost:5005/api/admin/shipping/${id}/activate`,

  {
   method:"PUT"
  }

 );

 const response = await fetch(
  "http://localhost:5005/api/admin/shipping"
 );

 const data = await response.json();

 setShipping(data);

};
const handleDeactivateShipping = async(id)=>{

 await fetch(

  `http://localhost:5005/api/admin/shipping/${id}/deactivate`,

  {
   method:"PUT"
  }

 );

 const response = await fetch(
  "http://localhost:5005/api/admin/shipping"
 );

 const data = await response.json();

 setShipping(data);

};
return(
<div>

<h2>Shipping Management</h2>

<input
 type="text"
 placeholder="Search Shipping..."
 value={searchTerm}
 onChange={(e)=>setSearchTerm(e.target.value)}
/>

<br /><br />

<button
 onClick={()=>setShowAddModal(true)}
>
 Add Shipping Method
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
<th>Method</th>
<th>Zone</th>
<th>Charge</th>
<th>Estimated Days</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{
filteredShipping.map((s)=>(

<tr key={s.id}>

<td>{s.id}</td>

<td>{s.method_name}</td>

<td>{s.delivery_zone}</td>

<td>{s.shipping_charge}</td>

<td>{s.estimated_days}</td>

<td
 style={{
  color:
   s.status==="Active"
   ? "green"
   : "red"
 }}
>
 {s.status}
</td>

<td>

<button
 onClick={()=>
 handleActivateShipping(s.id)
 }
>
 Activate
</button>

<button
 onClick={()=>
 handleDeactivateShipping(s.id)
 }
>
 Deactivate
</button>

<button
 onClick={()=>
 handleDeleteShipping(s.id)
 }
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
      <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px" }}>Add Shipping Method</h3>
      
      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Method Name</label>
        <input
          name="method_name"
          placeholder="Method Name"
          value={newShipping.method_name}
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

      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Delivery Zone</label>
        <input
          name="delivery_zone"
          placeholder="Delivery Zone"
          value={newShipping.delivery_zone}
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

      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Shipping Charge</label>
        <input
          type="number"
          name="shipping_charge"
          placeholder="Shipping Charge"
          value={newShipping.shipping_charge}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Estimated Days</label>
        <input
          name="estimated_days"
          placeholder="Estimated Days"
          value={newShipping.estimated_days}
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
          onClick={handleSaveShipping}
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