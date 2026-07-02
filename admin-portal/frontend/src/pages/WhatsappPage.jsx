import { useEffect, useState } from "react";

export default function WhatsappPage() {

const [messages,setMessages] = useState([]);
const [searchTerm,setSearchTerm] = useState("");

const [showAddModal,setShowAddModal] =
useState(false);

const [newMessage,setNewMessage] =
useState({

 recipient_name:"",
 phone_number:"",
 message:""

});

useEffect(()=>{

 fetch(
  "http://localhost:5005/api/admin/whatsapp-messages"
 )
 .then(res=>res.json())
 .then(data=>setMessages(data));

},[]);

const filteredMessages = messages.filter((m)=>

  m.recipient_name
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase())

  ||

  m.phone_number
    ?.includes(searchTerm)

);
const handleInputChange = (e) => {

  console.log(e.target.name, e.target.value);

  const { name, value } = e.target;

  setNewMessage({
    ...newMessage,
    [name]: value
  });

};
const handleSaveMessage = async () => {

  await fetch(

    "http://localhost:5005/api/admin/whatsapp-messages",

    {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(newMessage)

    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/whatsapp-messages"
  );

  const data = await response.json();

  setMessages(data);

  setNewMessage({

    recipient_name:"",
    phone_number:"",
    message:""

  });

  setShowAddModal(false);

};

const handleDeleteMessage = async (id) => {

  await fetch(

    `http://localhost:5005/api/admin/whatsapp-messages/${id}`,

    {
      method:"DELETE"
    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/whatsapp-messages"
  );

  const data = await response.json();

  setMessages(data);

};

const handleSendWhatsapp = (msg) => {

  window.open(

    `https://wa.me/${msg.phone_number}?text=${encodeURIComponent(msg.message)}`,

    "_blank"

  );
}

return (


<div>

  <h2>WhatsApp Messages</h2>

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
    Add Message
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

        <th>Recipient</th>

        <th>Phone</th>

        <th>Message</th>

        <th>Status</th>

        <th>Actions</th>

      </tr>

    </thead>

    <tbody>

      {
        filteredMessages.map((m)=>(

        <tr key={m.id}>

          <td>{m.id}</td>

          <td>{m.recipient_name}</td>

          <td>{m.phone_number}</td>

          <td>{m.message}</td>

          <td>{m.status}</td>

          <td>

            <button
              onClick={() => handleSendWhatsapp(m)}
            >
              Send
            </button>

            <button
              onClick={() => handleDeleteMessage(m.id)}
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
          <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px" }}>Add WhatsApp Message</h3>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Recipient Name</label>
            <input
              name="recipient_name"
              placeholder="Recipient Name"
              value={newMessage.recipient_name}
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
            <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Phone Number</label>
            <input
              name="phone_number"
              placeholder="Phone Number"
              value={newMessage.phone_number}
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
              value={newMessage.message}
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
              onClick={handleSaveMessage}
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