import { useEffect, useState } from "react";

export default function ContactFormsPage() {
  const [contacts,setContacts] = useState([]);

const [searchTerm,setSearchTerm] = useState("");

const [showViewModal,setShowViewModal] =
useState(false);

const [selectedContact,setSelectedContact] =
useState(null);
useEffect(()=>{

 fetch(
  "http://localhost:5005/api/admin/contact-forms"
 )
 .then(res=>res.json())
 .then(data=>setContacts(data));

},[]);

useEffect(() => {

 fetch(
  "http://localhost:5005/api/admin/contact-forms"
 )
 .then(res=>res.json())
 .then(data => {

   console.log("CONTACT DATA:", data);

   setContacts(data);

 });

},[]);

const filteredContacts = contacts.filter((c)=>

 c.name
  ?.toLowerCase()
  .includes(searchTerm.toLowerCase())

 ||

 c.email
  ?.toLowerCase()
  .includes(searchTerm.toLowerCase())

);

const handleResolve = async(id)=>{

 await fetch(

  `http://localhost:5005/api/admin/contact-forms/${id}/resolve`,

  {
   method:"PUT"
  }

 );

 const response = await fetch(
  "http://localhost:5005/api/admin/contact-forms"
 );

 const data = await response.json();

 setContacts(data);

};

const handleDelete = async(id)=>{

 await fetch(

  `http://localhost:5005/api/admin/contact-forms/${id}`,

  {
   method:"DELETE"
  }

 );

 const response = await fetch(
  "http://localhost:5005/api/admin/contact-forms"
 );

 const data = await response.json();

 setContacts(data);

};

return(
  <div>

    <h2>Contact Forms</h2>
  <input
 type="text"
 placeholder="Search Contact..."
 value={searchTerm}
 onChange={(e)=>setSearchTerm(e.target.value)}
/>
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

<th>Name</th>

<th>Email</th>

<th>Phone</th>

<th>Subject</th>

<th>Status</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

{
filteredContacts.length === 0 ? (

<tr>
  <td colSpan="7">
    No Contact Forms Found
  </td>
</tr>

) : (

filteredContacts.map((c)=>(

<tr key={c.id}>

<td>{c.id}</td>

<td>{c.name}</td>

<td>{c.email}</td>

<td>{c.phone}</td>

<td>{c.subject}</td>

<td
 style={{
   color:
    c.status === "Replied"
       ? "green"
       : "orange"
 }}
>
 {c.status}
</td>

<td>

<button
 onClick={()=>{
  setSelectedContact(c);
  setShowViewModal(true);
 }}
>
 View
</button>

<button
 disabled={c.status === "Replied"}
 onClick={()=>handleResolve(c.id)}
>
 Resolve
</button>

<button
 onClick={()=>handleDelete(c.id)}
>
 Delete
</button>

</td>

</tr>

))

)

}

</tbody>
</table>

{
showViewModal && selectedContact && (
  <div
    onClick={() => setShowViewModal(false)}
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
      <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px" }}>Contact Details</h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "12px", marginBottom: "20px" }}>
        <span style={{ color: "rgba(239,246,235,0.6)" }}>Name:</span>
        <span style={{ fontWeight: "500" }}>{selectedContact.name}</span>

        <span style={{ color: "rgba(239,246,235,0.6)" }}>Email:</span>
        <span style={{ fontWeight: "500" }}>{selectedContact.email}</span>

        <span style={{ color: "rgba(239,246,235,0.6)" }}>Phone:</span>
        <span style={{ fontWeight: "500" }}>{selectedContact.phone}</span>

        <span style={{ color: "rgba(239,246,235,0.6)" }}>Subject:</span>
        <span style={{ fontWeight: "500" }}>{selectedContact.subject}</span>

        <span style={{ color: "rgba(239,246,235,0.6)" }}>Message:</span>
        <span style={{ whiteSpace: "pre-wrap" }}>{selectedContact.message}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => setShowViewModal(false)}
          style={{
            background: "transparent",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)
}
</div>
);
}