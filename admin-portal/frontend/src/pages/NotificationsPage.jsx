import { useEffect, useState } from "react";

export default function NotificationsPage(){

 const [notifications,setNotifications] =
  useState([]);
  const [search,setSearch] = useState("");

const [title,setTitle] = useState("");
const [message,setMessage] = useState("");
const [type,setType] = useState("Info");
const [showCreateModal,setShowCreateModal] = useState(false);

 useEffect(()=>{

  fetch(
   "http://localhost:5005/api/admin/notifications"
  )
  .then(res=>res.json())
  .then(data=>setNotifications(data));

 },[]);
const filteredNotifications =
 notifications.filter(item =>
  item.title
   .toLowerCase()
   .includes(search.toLowerCase())
 );

 const deleteNotification = async(id)=>{

 await fetch(
  `http://localhost:5005/api/admin/notifications/${id}`,
  {
   method:"DELETE"
  }
 );

 setNotifications(
  notifications.filter(
   item => item.id !== id
  )
 );

};

 const createNotification = async()=>{
   if(!title || !message){
  alert("Title and Message required");
  return;
 }

  await fetch(
   "http://localhost:5005/api/admin/notifications",
   {
    method:"POST",
    headers:{
     "Content-Type":"application/json"
    },
    body:JSON.stringify({
     title,
     message,
     type,
     status:"Active"
    })
   }
  );

  const res =
   await fetch(
    "http://localhost:5005/api/admin/notifications"
   );

  const data =
   await res.json();

  setNotifications(data);

  setTitle("");
  setMessage("");
  setType("Info");
  setShowCreateModal(false);
  alert("Notification Created");

 };
  return(

   <div style={{padding:"20px", color: "#eff6eb"}}>

    <h1>Notifications</h1>
    
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <input
        placeholder="Search Notifications"
        value={search}
        onChange={(e)=>
         setSearch(e.target.value)
        }
        style={{
          padding: "8px 12px",
          background: "#0f1d13",
          color: "#eff6eb",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "8px",
          width: "250px",
          outline: "none"
        }}
      />
      <button
        onClick={() => setShowCreateModal(true)}
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
        Create Notification
      </button>
    </div>

    <h3>
     Total Notifications: {notifications.length}
    </h3>

    {showCreateModal && (
      <div
        onClick={() => setShowCreateModal(false)}
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
          <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px" }}>Create Notification</h3>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Title</label>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Message</label>
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
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
              <option value="Info" style={{ background: "#0f1d13" }}>Info</option>
              <option value="Success" style={{ background: "#0f1d13" }}>Success</option>
              <option value="Warning" style={{ background: "#0f1d13" }}>Warning</option>
              <option value="Error" style={{ background: "#0f1d13" }}>Error</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={createNotification}
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
              onClick={() => setShowCreateModal(false)}
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
    )}

    <br/>
   <table
    border="1"
    cellPadding="10"
    style={{
     width:"100%",
     borderCollapse:"collapse",
     borderColor: "rgba(255,255,255,0.08)",
     marginTop: "20px"
    }}
   >

    <thead style={{ background: "#0f1d13", color: "#d7b56d" }}>
     <tr>
  <th>ID</th>
  <th>Title</th>
  <th>Message</th>
  <th>Type</th>
  <th>Status</th>
  <th>Created</th>
  <th>Actions</th>
     </tr>
    </thead>
<tbody>

{
 filteredNotifications.length > 0 ? (

  filteredNotifications.map(item => (

   <tr key={item.id} style={{ background: "transparent" }}>

    <td>{item.id}</td>

    <td>{item.title}</td>

    <td>{item.message}</td>

    <td>
      <span
        style={{
          padding: "4px 8px",
          borderRadius: "4px",
          fontWeight: "600",
          fontSize: "0.85rem",
          color:
            item.type === "Success"
            ? "#5dd374"
            : item.type === "Warning"
            ? "#ffe066"
            : item.type === "Error"
            ? "#ff8080"
            : "#7abaff",
          background:
            item.type === "Success"
            ? "rgba(40, 167, 69, 0.15)"
            : item.type === "Warning"
            ? "rgba(255, 193, 7, 0.15)"
            : item.type === "Error"
            ? "rgba(220, 53, 69, 0.15)"
            : "rgba(0, 123, 255, 0.15)",
          border:
            item.type === "Success"
            ? "1px solid rgba(40, 167, 69, 0.25)"
            : item.type === "Warning"
            ? "1px solid rgba(255, 193, 7, 0.25)"
            : item.type === "Error"
            ? "1px solid rgba(220, 53, 69, 0.25)"
            : "1px solid rgba(0, 123, 255, 0.25)"
        }}
      >
        {item.type}
      </span>
    </td>

    <td>{item.status}</td>

    <td>{new Date(item.created_at).toLocaleString()}</td>

    <td>
      <button
        onClick={()=>
          deleteNotification(item.id)
        }
      >
        Delete
      </button>
    </td>

   </tr>

  ))

 ) : (

  <tr>
   <td colSpan="7">
    No Notifications Found
   </td>
  </tr>

 )
}

</tbody>

   </table>

  </div>

 );

}