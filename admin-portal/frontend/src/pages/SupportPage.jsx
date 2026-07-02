import { useEffect, useState } from "react";

export default function SupportPage() {
  const [tickets,setTickets] = useState([]);

const [searchTerm,setSearchTerm] = useState("");

const [showAddModal,setShowAddModal] =
useState(false);

const [newTicket,setNewTicket] =
useState({

 customer_name:"",
 email:"",
 phone:"",
 subject:"",
 message:""

});
useEffect(()=>{

 fetch(
  "http://localhost:5005/api/admin/support-tickets"
 )
 .then(res=>res.json())
 .then(data=>setTickets(data));

},[]);
const filteredTickets = tickets.filter((t)=>

 t.customer_name
  ?.toLowerCase()
  .includes(searchTerm.toLowerCase())

 ||

 t.subject
  ?.toLowerCase()
  .includes(searchTerm.toLowerCase())

);
const handleInputChange = (e) => {

  const { name,value } = e.target;

  setNewTicket({

    ...newTicket,

    [name]: value

  });

};
const handleSaveTicket = async () => {

  await fetch(

    "http://localhost:5005/api/admin/support-tickets",

    {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(newTicket)

    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/support-tickets"
  );

  const data = await response.json();

  setTickets(data);

  setNewTicket({

    customer_name:"",
    email:"",
    phone:"",
    subject:"",
    message:""

  });

  setShowAddModal(false);

};
const handleDeleteTicket = async(id)=>{

  await fetch(

    `http://localhost:5005/api/admin/support-tickets/${id}`,

    {
      method:"DELETE"
    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/support-tickets"
  );

  const data = await response.json();

  setTickets(data);

};
const handleResolveTicket = async(id)=>{

  await fetch(

    `http://localhost:5005/api/admin/support-tickets/${id}/resolve`,

    {
      method:"PUT"
    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/support-tickets"
  );

  const data = await response.json();

  setTickets(data);

};
return (
<div>
  <h2>Support Tickets</h2>

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
 Add Ticket
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

<th>Email</th>

<th>Phone</th>

<th>Subject</th>

<th>Message</th>

<th>Status</th>

<th>Actions</th>

</tr>

</thead>
<tbody>

{
 filteredTickets.map((t)=>(

 <tr key={t.id}>

  <td>{t.id}</td>

  <td>{t.customer_name}</td>

  <td>{t.email}</td>

  <td>{t.phone}</td>

  <td>{t.subject}</td>

  <td>{t.message}</td>

  <td>{t.status}</td>

  <td>

   <button
    onClick={()=>handleResolveTicket(t.id)}
   >
    Resolve
   </button>

   <button
    onClick={()=>handleDeleteTicket(t.id)}
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
      <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px" }}>Add Ticket</h3>
      
      <div style={{ marginBottom: "14px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Customer Name</label>
        <input
          name="customer_name"
          placeholder="Customer Name"
          value={newTicket.customer_name}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newTicket.email}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Phone</label>
        <input
          name="phone"
          placeholder="Phone"
          value={newTicket.phone}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Subject</label>
        <input
          name="subject"
          placeholder="Subject"
          value={newTicket.subject}
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
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Message</label>
        <textarea
          name="message"
          placeholder="Message"
          value={newTicket.message}
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
          onClick={handleSaveTicket}
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