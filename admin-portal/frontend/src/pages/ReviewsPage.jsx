import { useEffect, useState } from "react";

export default function ReviewsPage() {
  const [reviews,setReviews] = useState([]);

const [searchTerm,setSearchTerm] = useState("");

const [showAddModal,setShowAddModal] =
useState(false);

const [newReview,setNewReview] =
useState({

 customer_name:"",
 product_name:"",
 rating:"",
 review_text:""

});
useEffect(()=>{

 fetch(
  "http://localhost:5005/api/admin/reviews"
 )
 .then(res=>res.json())
 .then(data=>setReviews(data));

},[]);
const filteredReviews = reviews.filter((r)=>

 r.customer_name
  ?.toLowerCase()
  .includes(searchTerm.toLowerCase())

 ||
 r.product_name
  ?.toLowerCase()
  .includes(searchTerm.toLowerCase())

);
const handleInputChange = (e) => {

  const { name,value } = e.target;

  setNewReview({

    ...newReview,

    [name]: value

  });

};
const handleSaveReview = async () => {

  await fetch(

    "http://localhost:5005/api/admin/reviews",

    {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(newReview)

    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/reviews"
  );

  const data = await response.json();

  setReviews(data);

  setNewReview({

    customer_name:"",
    product_name:"",
    rating:"",
    review_text:""

  });

  setShowAddModal(false);

};
const handleDeleteReview = async(id)=>{

  await fetch(

    `http://localhost:5005/api/admin/reviews/${id}`,

    {
      method:"DELETE"
    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/reviews"
  );

  const data = await response.json();

  setReviews(data);

};

const handleApproveReview = async(id)=>{

  await fetch(

    `http://localhost:5005/api/admin/reviews/${id}/approve`,

    {
      method:"PUT"
    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/reviews"
  );

  const data = await response.json();

  setReviews(data);

};

const handleRejectReview = async(id)=>{

  await fetch(

    `http://localhost:5005/api/admin/reviews/${id}/reject`,

    {
      method:"PUT"
    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/reviews"
  );

  const data = await response.json();

  setReviews(data);

};
return (
  <div>

<h2>Reviews</h2>

<input
 type="text"
 placeholder="Search..."
 value={searchTerm}
 onChange={(e)=>setSearchTerm(e.target.value)}
/>

<br /><br />

<button
 onClick={()=>setShowAddModal(true)}
>
 Add Review
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

<th>Customer</th>

<th>Product</th>

<th>Rating</th>

<th>Review</th>

<th>Status</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

{
 filteredReviews.map((r)=>(

 <tr key={r.id}>

  <td>{r.id}</td>

  <td>{r.customer_name}</td>

  <td>{r.product_name}</td>

  <td>{r.rating}</td>

  <td>{r.review_text}</td>

  <td>{r.status}</td>

  <td>

   <button
    onClick={()=>handleApproveReview(r.id)}
   >
    Approve
   </button>

   <button
    onClick={()=>handleRejectReview(r.id)}
   >
    Reject
   </button>

   <button
    onClick={()=>handleDeleteReview(r.id)}
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
      <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px" }}>Add Review</h3>
      
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Customer Name</label>
        <input
          name="customer_name"
          placeholder="Customer Name"
          value={newReview.customer_name}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Product Name</label>
        <input
          name="product_name"
          placeholder="Product Name"
          value={newReview.product_name}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Rating</label>
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={newReview.rating}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Review</label>
        <textarea
          name="review_text"
          placeholder="Review"
          value={newReview.review_text}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#0f1d13",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            outline: "none",
            minHeight: "80px",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSaveReview}
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