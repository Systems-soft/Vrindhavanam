import { useEffect,useState } from "react";

export default function AdminsPage(){

 const [admins,setAdmins] = useState([]);

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [role,setRole] = useState("MANAGER");

const [search,setSearch] = useState("");

const [showConfirmModal, setShowConfirmModal] = useState(false);
const [confirmAction, setConfirmAction] = useState(null);
const [confirmMessage, setConfirmMessage] = useState("");

 const loadAdmins = async()=>{

  const res =
   await fetch(
    "http://localhost:5005/api/admin/admins"
   );

  const data =
   await res.json();

  setAdmins(data);

 };

 useEffect(()=>{

  loadAdmins();

 },[]);

 const createAdmin = async()=>{

  if(
   !name ||
   !email ||
   !password
  ){
   alert("Fill all fields");
   return;
  }

  await fetch(
   "http://localhost:5005/api/admin/admins",
   {
    method:"POST",
    headers:{
     "Content-Type":"application/json"
    },
    body:JSON.stringify({
     name,
     email,
     password,
     role
    })
   }
  );

  await loadAdmins();

  setName("");
  setEmail("");
  setPassword("");
  setRole("MANAGER");

  alert("Admin Created");

 };

const deleteAdmin = async(id)=>{

  setConfirmMessage("Delete this admin?");
  setConfirmAction(() => async () => {
    await fetch(
     `http://localhost:5005/api/admin/admins/${id}`,
     {
      method:"DELETE"
     }
    );
    await loadAdmins();
    setShowConfirmModal(false);
  });
  setShowConfirmModal(true);

};

  const changeStatus = async(
  id,
  currentStatus
  )=>{

  setConfirmMessage("Are you sure you want to change this admin's status?");
  setConfirmAction(() => async () => {
    const newStatus =
     currentStatus==="ACTIVE"
     ? "INACTIVE"
     : "ACTIVE";

    await fetch(
     `http://localhost:5005/api/admin/admins/${id}/status`,
     {
      method:"PUT",
      headers:{
       "Content-Type":"application/json"
      },
      body:JSON.stringify({
       status:newStatus
      })
     }
    );

    await loadAdmins();
    setShowConfirmModal(false);
  });
  setShowConfirmModal(true);

 };
 const filteredAdmins =
 admins.filter(admin=>
  admin.name
   .toLowerCase()
   .includes(search.toLowerCase())
 ||
  admin.email
   .toLowerCase()
   .includes(search.toLowerCase())
 );

  return(

   <div
    style={{
     padding:"20px",
     color: "#eff6eb"
    }}
   >

    <h1>Admins</h1>

    <input
     placeholder="Search Admin"
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

    <br/><br/>

    <div style={{
      background: "rgba(18, 24, 20, 0.4)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "20px",
      maxWidth: "500px"
    }}>
      <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "15px" }}>Create Admin</h3>

      <div style={{ marginBottom: "12px" }}>
        <input
         placeholder="Name"
         value={name}
         onChange={(e)=>
          setName(e.target.value)
         }
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

      <div style={{ marginBottom: "12px" }}>
        <input
         placeholder="Email"
         value={email}
         onChange={(e)=>
          setEmail(e.target.value)
         }
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

      <div style={{ marginBottom: "12px" }}>
        <input
         type="password"
         placeholder="Password"
         value={password}
         onChange={(e)=>
          setPassword(e.target.value)
         }
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

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Role</label>
        <select
         value={role}
         onChange={(e)=>
          setRole(e.target.value)
         }
         style={{
           width: "100%",
           padding: "10px 12px",
           background: "#0f1d13",
           color: "#eff6eb",
           border: "1px solid rgba(255,255,255,0.15)",
           borderRadius: "8px",
           outline: "none",
           cursor: "pointer"
         }}
        >
         <option value="MANAGER" style={{ background: "#0f1d13" }}>MANAGER</option>
         <option value="INVENTORY" style={{ background: "#0f1d13" }}>INVENTORY</option>
         <option value="SUPPORT" style={{ background: "#0f1d13" }}>SUPPORT</option>
         <option value="MARKETING" style={{ background: "#0f1d13" }}>MARKETING</option>
         <option value="SUPER_ADMIN" style={{ background: "#0f1d13" }}>SUPER_ADMIN</option>
        </select>
      </div>

      <button
       onClick={createAdmin}
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
       Create Admin
      </button>
    </div>
<h3>Total Admins: {admins.length}</h3>

<h3>
Active:
{
 admins.filter(
  a=>a.status==="ACTIVE"
 ).length
}
</h3>

<h3>
Inactive:
{
 admins.filter(
  a=>a.status==="INACTIVE"
 ).length
}
</h3>
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
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Status</th>
      <th>Created</th>
      <th>Last Login</th>
      <th>Actions</th>
     </tr>
    </thead>

    <tbody>

    {
     filteredAdmins.length > 0 ? (

      filteredAdmins.map(admin=>(

       <tr key={admin.id} style={{ background: "transparent" }}>

        <td>{admin.id}</td>

        <td>{admin.name}</td>

        <td>{admin.email}</td>

        <td>

<span
 style={{
  padding:"5px 10px",
  borderRadius:"5px",
  fontWeight: "600",
  fontSize: "0.85rem",
  background:
   admin.role==="SUPER_ADMIN"
    ? "rgba(220, 53, 69, 0.15)"
    : admin.role==="MANAGER"
    ? "rgba(40, 167, 69, 0.15)"
    : "rgba(0, 123, 255, 0.15)",
  color:
   admin.role==="SUPER_ADMIN"
    ? "#ff8080"
    : admin.role==="MANAGER"
    ? "#5dd374"
    : "#7abaff",
  border:
   admin.role==="SUPER_ADMIN"
    ? "1px solid rgba(220, 53, 69, 0.25)"
    : admin.role==="MANAGER"
    ? "1px solid rgba(40, 167, 69, 0.25)"
    : "1px solid rgba(0, 123, 255, 0.25)"
 }}
>
 {admin.role}
</span>

</td>

        <td>

<span
 style={{
  fontWeight: "600",
  color:
   admin.status==="ACTIVE"
    ? "#5dd374"
    : "#ff8080"
 }}
>
 {admin.status}
</span>

</td>
  <td>
 {new Date(admin.created_at).toLocaleString()}
</td>

<td>
 {
  admin.last_login
   ? new Date(admin.last_login).toLocaleString()
   : "Never"
 }
</td>

<td>
 <button
  onClick={()=>
   changeStatus(
    admin.id,
    admin.status
   )
  }
 >
  Toggle Status
 </button>

 {" "}

 <button>
  Edit
 </button>

 {" "}

 <button>
  Reset Password
 </button>

 {" "}

 <button
  disabled={
   admin.role==="SUPER_ADMIN"
  }
  onClick={()=>
   deleteAdmin(admin.id)
  }
 >
  Delete
 </button>
</td>
       </tr>

      ))

     ) : (

      <tr>
       <td colSpan="8" style={{ background: "transparent" }}>
        No Admins Found
       </td>
      </tr>

     )
    }

    </tbody>

   </table>

    {showConfirmModal && (
      <div
        onClick={() => setShowConfirmModal(false)}
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
            width: "400px",
            maxWidth: "90vw",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
          }}
        >
          <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "15px" }}>Confirm Action</h3>
          <p style={{ marginBottom: "24px", color: "rgba(239,246,235,0.85)" }}>{confirmMessage}</p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                if (confirmAction) confirmAction();
              }}
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
              Confirm
            </button>
            <button
              onClick={() => setShowConfirmModal(false)}
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

  </div>

 );

}