import { useEffect, useState } from "react";

export default function CouponsPage() {
const [coupons,setCoupons] = useState([]);

const [searchTerm,setSearchTerm] = useState("");
const [editingCoupon,setEditingCoupon] = useState(null);

const [showAddModal,setShowAddModal] =
useState(false);

const [newCoupon,setNewCoupon] =
useState({

 code:"",
 discount_type:"Percentage",
 discount_value:"",
 minimum_order_amount:"",
 usage_limit:"",
 expiry_date:""

});
useEffect(()=>{

 fetch(
  "http://localhost:5005/api/admin/coupons"
 )
 .then(res=>res.json())
 .then(data=>setCoupons(data));

},[]);
const filteredCoupons =
coupons.filter((c)=>

 c.code
  ?.toLowerCase()
  .includes(searchTerm.toLowerCase())

);
const handleInputChange = (e)=>{

 const { name,value } = e.target;

 setNewCoupon({

  ...newCoupon,

  [name]: value

 });

};

const handleSaveCoupon = async()=>{

 await fetch(

  "http://localhost:5005/api/admin/coupons",

  {

   method:"POST",

   headers:{
    "Content-Type":"application/json"
   },

   body:JSON.stringify(newCoupon)

  }

 );

 const response = await fetch(
  "http://localhost:5005/api/admin/coupons"
 );

 const data = await response.json();

 setCoupons(data);
setNewCoupon({
  code:"",
  discount_type:"Percentage",
  discount_value:"",
  minimum_order_amount:"",
  usage_limit:"",
  expiry_date:""
});
 setShowAddModal(false);

};

const handleDeleteCoupon = async(id)=>{

 await fetch(

  `http://localhost:5005/api/admin/coupons/${id}`,

  {
   method:"DELETE"
  }

 );

 const response = await fetch(
  "http://localhost:5005/api/admin/coupons"
 );

 const data = await response.json();

 setCoupons(data);

};
return(
  <div>

<h2 style={{ marginBottom:"20px" }}>
  Coupons Management
</h2>

<input
  type="text"
  placeholder="Search Coupon..."
  value={searchTerm}
  onChange={(e)=>setSearchTerm(e.target.value)}
/>

<br /><br />

<button
  onClick={()=>setShowAddModal(true)}
>
  Add Coupon
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
  <th>Code</th>
  <th>Type</th>
  <th>Discount</th>
  <th>Minimum Order</th>
  <th>Usage Limit</th>
  <th>Used</th>
  <th>Expiry</th>
  <th>Status</th>
  <th>Actions</th>
</tr>
</thead>
<tbody>

{
filteredCoupons.map((c)=>(

<tr key={c.id}>

<td>{c.id}</td>
<td>{c.code}</td>
<td>{c.discount_type}</td>
<td>{c.discount_value}</td>
<td>{c.minimum_order_amount}</td>
<td>{c.usage_limit}</td>
<td>{c.used_count}</td>
<td>{c.expiry_date}</td>

<td
  style={{
    color:
      c.status === "Active"
        ? "green"
        : "red"
  }}
>
  {c.status}
</td>

<td>

<button
 onClick={()=>handleDeleteCoupon(c.id)}
>
 Delete
</button>

</td>

</tr>

))
}

{
filteredCoupons.length === 0 && (
<tr>
  <td colSpan="10">
    No Coupons Found
  </td>
</tr>
)
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
      <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px" }}>Add Coupon</h3>
      
      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Coupon Code</label>
        <input
          name="code"
          placeholder="Coupon Code"
          value={newCoupon.code}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Discount Type</label>
        <select
          name="discount_type"
          value={newCoupon.discount_type}
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
        >
          <option value="Percentage" style={{ background: "#0f1d13" }}>Percentage</option>
          <option value="Fixed" style={{ background: "#0f1d13" }}>Fixed</option>
        </select>
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Discount Value</label>
        <input
          type="number"
          name="discount_value"
          placeholder="Discount Value"
          value={newCoupon.discount_value}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Minimum Order Amount</label>
        <input
          type="number"
          name="minimum_order_amount"
          placeholder="Minimum Order Amount"
          value={newCoupon.minimum_order_amount}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Usage Limit</label>
        <input
          type="number"
          name="usage_limit"
          placeholder="Usage Limit"
          value={newCoupon.usage_limit}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Expiry Date</label>
        <input
          type="date"
          name="expiry_date"
          value={newCoupon.expiry_date}
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
          onClick={handleSaveCoupon}
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
          onClick={()=>{
            setEditingCoupon(c);
            setNewCoupon(c);
            setShowAddModal(true);
          }}
          style={{
            background: "linear-gradient(135deg, #d7b56d 0%, #b8954b 100%)",
            color: "#08120b",
            fontWeight: "600",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginLeft: "10px"
          }}
        >
          Edit
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