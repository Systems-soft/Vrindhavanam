import { useState, useEffect } from "react";

export default function BackupsPage(){

 const [backups,setBackups]=useState([]);
 const [loading,setLoading] = useState(false);
const [message,setMessage] =
 useState("");

 const [showConfirmModal, setShowConfirmModal] = useState(false);
 const [confirmAction, setConfirmAction] = useState(null);
 const [confirmMessage, setConfirmMessage] = useState("");

 const loadBackups = async()=>{

 try{

  setLoading(true);

  const res =
   await fetch(
    "http://localhost:5005/api/admin/backups"
   );

  const data =
   await res.json();

  setBackups(data);

 }catch(error){

  console.error(error);

 }finally{

  setLoading(false);

 }

};

useEffect(()=>{

 loadBackups();

},[]);

useEffect(()=>{

 if(!message) return;

 const timer =
  setTimeout(
   ()=>setMessage(""),
   3000
  );

 return ()=>clearTimeout(timer);

},[message]);


const createBackup = async()=>{

 try{

  setLoading(true);

  await fetch(
   "http://localhost:5005/api/admin/backups/create",
   {
    method:"POST"
   }
  );

  await loadBackups();

  setMessage(
   "Backup created successfully."
  );

 }catch(error){

  console.error(error);

 }finally{

  setLoading(false);

 }

};


const deleteBackup = async(id)=>{

 try{

  await fetch(
   `http://localhost:5005/api/admin/backups/${id}`,
   {
    method:"DELETE"
   }
  );

  await loadBackups();

  setMessage("Backup deleted successfully.");

 }catch(error){

  console.error(error);

 }

};

  return(

   <div style={{padding:"20px", color: "#eff6eb"}}>

    <h1>Database Backups</h1>

    {
  message &&
  <div
   style={{
    color:"#5dd374",
    background: "rgba(40, 167, 69, 0.15)",
    border: "1px solid rgba(40, 167, 69, 0.3)",
    padding: "10px 15px",
    borderRadius: "6px",
    marginBottom:"15px"
   }}
  >
   {message}
  </div>
 }

    {
  loading &&
  <p>Loading...</p>
 }

    <button
  onClick={createBackup}
  disabled={loading}
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

 {
  loading
  ? "Creating..."
  : "Create Backup"
 }

 </button>

 <button
  onClick={loadBackups}
  disabled={loading}
  style={{
    background: "transparent",
    color: "#eff6eb",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    marginLeft:"10px"
  }}
 >
  Refresh
 </button>

 <div
  style={{
   marginBottom:"15px",
   marginTop:"15px"
  }}
 >
  <strong>
   Total Backups:
  </strong>
  {" "}{backups.length}
 </div>

 <p>
  Latest Backup:
 {" "}
 {
  backups.length
  ? backups[0].filename
  : "-"
 }
 </p>
    <table
     border="1"
     cellPadding="10"
     style={{
      width:"100%",
      borderColor: "rgba(255,255,255,0.08)",
      borderCollapse: "collapse",
      marginTop:"20px"
     }}
    >

     <thead style={{ background: "#0f1d13", color: "#d7b56d" }}>

      <tr>

       <th>ID</th>
       <th>Filename</th>
       <th>Created</th>
       <th>Size</th>
       <th>Actions</th>

      </tr>

     </thead>

     <tbody>

 {
  backups.length>0
 ?

 backups.map(backup=>(

 <tr
  key={backup.id}
  style={{
   background:
    backup.id===backups[0]?.id
    ? "rgba(76, 175, 80, 0.08)"
    : "transparent"
  }}
 >

 <td>{backup.id}</td>

 <td>
  🗄️ {backup.filename}
 </td>

 <td>
 {
  new Date(
   backup.created_at
  ).toLocaleString()
 }
 </td>

 <td>{backup.filesize}</td>


 <td>



 <button disabled>
  Download
 </button>
 {" "}

 <button
  disabled={loading}
  onClick={()=>{
   setConfirmMessage("Delete this backup?");
   setConfirmAction(() => async () => {
     await deleteBackup(backup.id);
     setShowConfirmModal(false);
   });
   setShowConfirmModal(true);
  }}
 >
  Delete
 </button>

 </td>

 </tr>

 ))

 :

 <tr>

 <td colSpan="5" style={{ background: "transparent" }}>

 No backups available.
 Create your first backup.

 </td>

 </tr>

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