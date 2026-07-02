import { useEffect,useState } from "react";

export default function ActivityLogsPage(){

 const [logs,setLogs] =
  useState([]);

 const [search,setSearch] =
  useState("");

  const [sort,setSort] =
 useState("latest");

 const [loading,setLoading] =
 useState(false);
const [page,setPage] = useState(1);
const [dateFilter,setDateFilter] =
 useState("");
 const [adminFilter,setAdminFilter] =
 useState("");
const pageSize = 10;

 const loadLogs = async()=>{

 try{

  setLoading(true);

  const res =
   await fetch(
    "http://localhost:5005/api/admin/activity-logs"
   );

  const data =
   await res.json();

  setLogs(data);

 }catch(error){

  console.error(error);

 }finally{

  setLoading(false);

 }

};

 
const getRelativeTime = (date)=>{

 const diff =
  Date.now() -
  new Date(date).getTime();

 const mins =
  Math.floor(diff/60000);

 if(mins < 1)
  return "Just now";

 if(mins < 60)
  return `${mins} min ago`;

 const hrs =
  Math.floor(mins/60);

 if(hrs < 24)
  return `${hrs} hr ago`;

 const days =
  Math.floor(hrs/24);

 if(days === 1)
  return "Yesterday";

 return `${days} days ago`;

};

 useEffect(()=>{

 loadLogs();

 const interval =
  setInterval(
   loadLogs,
   30000
  );

  
 return () =>
  clearInterval(interval);

},[]);


useEffect(() => {
 setPage(1);
}, [
 search,
 dateFilter,
 adminFilter,
 sort
]);
 const filteredLogs =
 logs.filter(log => {

  const matchesSearch =
 log.action?.toLowerCase()
  .includes(search.toLowerCase())
 ||
 log.name?.toLowerCase()
  .includes(search.toLowerCase())
 ||
 log.id?.toString()
  .includes(search);

  const matchesDate =
   !dateFilter ||
   log.created_at.startsWith(dateFilter);

   const matchesAdmin =
 !adminFilter ||
 log.name===adminFilter;
  return matchesSearch &&
       matchesDate &&
       matchesAdmin;

 });

  const sortedLogs =
 [...filteredLogs].sort((a,b)=>{

  if(sort==="latest"){
   return new Date(b.created_at)
    - new Date(a.created_at);
  }

  return new Date(a.created_at)
   - new Date(b.created_at);

 });

const paginatedLogs =
 sortedLogs.slice(
  (page-1)*pageSize,
  page*pageSize
 );

 
 const totalPages =
 Math.max(
  1,
  Math.ceil(
   filteredLogs.length /
   pageSize
  )
 );
  const exportCSV = () => {

    const csvRows = sortedLogs.map(log => [
  log.id,
  log.name,
  log.action,
  `"${JSON.stringify(log.details)}"`,
  log.created_at
 ].join(","));

 const csvContent =
  [
   "ID,Admin,Action,Details,Created",
   ...csvRows
  ].join("\n");

 const blob =
  new Blob(
   [csvContent],
   { type:"text/csv" }
  );

 const url =
  URL.createObjectURL(blob);

 const a =
  document.createElement("a");

 a.href = url;
 a.download = "activity_logs.csv";

 a.click();
URL.revokeObjectURL(url);
};

const formatDetails = (details) => {
 try{
  return typeof details === "string"
   ? JSON.parse(details)
   : details;
 }catch{
  return details;
 }
};
 return(

   <div
    style={{
     padding:"20px",
     color: "#eff6eb"
    }}
   >

    <h1>Activity Logs</h1>
    {
  loading &&
  (
   <div
    style={{
     padding:"10px 15px",
     background:"rgba(255, 193, 7, 0.15)",
     color:"#ffe066",
     border:"1px solid rgba(255, 193, 7, 0.3)",
     borderRadius:"6px",
     marginBottom:"15px"
    }}
   >
    ⏳ Loading logs...
   </div>
  )
 }
<input
 placeholder="Search Logs"
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
   outline: "none"
 }}
/>

{" "}

<input
 type="date"
 value={dateFilter}
 onChange={(e)=>
  setDateFilter(e.target.value)
 }
 style={{
   padding: "8px 12px",
   background: "#0f1d13",
   color: "#eff6eb",
   border: "1px solid rgba(255,255,255,0.15)",
   borderRadius: "8px",
   outline: "none",
   marginLeft: "5px"
 }}
/>

{" "}

<select
 value={sort}
 onChange={(e)=>
  setSort(e.target.value)
 }
 style={{
   padding: "8px 12px",
   background: "#0f1d13",
   color: "#eff6eb",
   border: "1px solid rgba(255,255,255,0.15)",
   borderRadius: "8px",
   outline: "none",
   cursor: "pointer",
   marginLeft: "5px"
 }}
>
 <option value="latest" style={{ background: "#0f1d13" }}>
  Latest First
 </option>

 <option value="oldest" style={{ background: "#0f1d13" }}>
  Oldest First
 </option>
</select>

{" "}

<button
 onClick={()=>{
  setSearch("");
  setDateFilter("");
  setSort("latest");
  setAdminFilter("");
 }}
 style={{
   background: "transparent",
   color: "#eff6eb",
   border: "1px solid rgba(255,255,255,0.2)",
   padding: "8px 16px",
   borderRadius: "8px",
   cursor: "pointer",
   marginLeft: "5px"
 }}
>
 Clear Filters
</button>
<div
 style={{
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
  gap:"15px",
  marginBottom:"20px",
  marginTop:"20px"
 }}
>

 <div style={{ background: "rgba(18, 24, 20, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "15px 20px", borderRadius: "10px" }}>
  <h3 style={{ margin: "0 0 8px 0", fontSize: "0.95rem", color: "rgba(239,246,235,0.6)" }}>Total Logs</h3>
  <h2 style={{ margin: 0, color: "#eff6eb" }}>{logs.length}</h2>
 </div>

 <div style={{ background: "rgba(18, 24, 20, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "15px 20px", borderRadius: "10px" }}>
  <h3 style={{ margin: "0 0 8px 0", fontSize: "0.95rem", color: "rgba(239,246,235,0.6)" }}>Created</h3>
  <h2 style={{ margin: 0, color: "#5dd374" }}>
  {
   logs.filter(log =>
  (log.action || "").includes("Create")
 ).length
  }
  </h2>
 </div>

 <div style={{ background: "rgba(18, 24, 20, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "15px 20px", borderRadius: "10px" }}>
  <h3 style={{ margin: "0 0 8px 0", fontSize: "0.95rem", color: "rgba(239,246,235,0.6)" }}>Updated</h3>
  <h2 style={{ margin: 0, color: "#ffe066" }}>
  {
   logs.filter(log =>
    (log.action || "").includes("Update")
   ).length
  }
  </h2>
 </div>

 <div style={{ background: "rgba(18, 24, 20, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "15px 20px", borderRadius: "10px" }}>
  <h3 style={{ margin: "0 0 8px 0", fontSize: "0.95rem", color: "rgba(239,246,235,0.6)" }}>Deleted</h3>
  <h2 style={{ margin: 0, color: "#ff8080" }}>
  {
   logs.filter(log =>
    log.action.includes("Delete")
   ).length
  }
  </h2>
 </div>

 <div style={{ background: "rgba(18, 24, 20, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "15px 20px", borderRadius: "10px" }}>
  <h3 style={{ margin: "0 0 8px 0", fontSize: "0.95rem", color: "rgba(239,246,235,0.6)" }}>Today's Logs</h3>
  <h2 style={{ margin: 0, color: "#eff6eb" }}>
   {
    logs.filter(log =>
     new Date(log.created_at)
      .toDateString() ===
     new Date().toDateString()
    ).length
   }
  </h2>
 </div>

</div>

<div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
  <button
   disabled={!filteredLogs.length}
   onClick={exportCSV}
   style={{
     background: "transparent",
     color: "#eff6eb",
     border: "1px solid rgba(255,255,255,0.2)",
     padding: "8px 16px",
     borderRadius: "8px",
     cursor: "pointer"
   }}
  >
   Export CSV
  </button>

  <button 
   onClick={loadLogs}
   style={{
     background: "linear-gradient(135deg, #d7b56d 0%, #b8954b 100%)",
     color: "#08120b",
     fontWeight: "600",
     padding: "8px 16px",
     border: "none",
     borderRadius: "8px",
     cursor: "pointer"
   }}
  >
   Refresh Logs
  </button>
</div>

<select
 value={adminFilter}
 onChange={(e)=>
  setAdminFilter(e.target.value)
 }
 style={{
   padding: "8px 12px",
   background: "#0f1d13",
   color: "#eff6eb",
   border: "1px solid rgba(255,255,255,0.15)",
   borderRadius: "8px",
   outline: "none",
   cursor: "pointer",
   marginBottom: "15px"
 }}
>

<option value="" style={{ background: "#0f1d13" }}>
 All Admins
</option>

{
 [...new Set(logs.map(
  log => log.name
 ))].map(name => (

  <option
   key={name}
   value={name}
   style={{ background: "#0f1d13" }}
  >
   {name}
  </option>

 ))
}

</select>
   <table
    border="1"
    cellPadding="10"
    style={{
     width:"100%",
     borderCollapse:"collapse",
     borderColor: "rgba(255,255,255,0.08)",
     marginTop: "15px"
    }}
   >

    <thead style={{ background: "#0f1d13", color: "#d7b56d" }}>

     <tr>
      <th>ID</th>
      <th>Admin</th>
      <th>Action</th>
      <th>Details</th>
      <th>Date</th>
      <th>Role</th>
     </tr>

    </thead>

    <tbody>

    {
     filteredLogs.length > 0 ? (

      paginatedLogs.map(log => (

      <tr
 key={log.id}
 style={{
  background:
   new Date(log.created_at)
    .toDateString() ===
   new Date().toDateString()
   ? "rgba(76, 175, 80, 0.08)"
   : "transparent"
 }}
>

        <td>{log.id}</td>

        <td>
         {log.name || "Unknown"}
        </td>
 <td>

<span
 style={{
  padding:"4px 8px",
  borderRadius:"6px",
  fontWeight: "600",
  fontSize: "0.85rem",
  background:
   (log.action || "").includes("Create")
   ? "rgba(40, 167, 69, 0.15)"
   : (log.action || "").includes("Update")
   ? "rgba(255, 193, 7, 0.15)"
   : (log.action || "").includes("Delete")
   ? "rgba(220, 53, 69, 0.15)"
   : "rgba(0, 123, 255, 0.15)",
  color:
   (log.action || "").includes("Create")
   ? "#5dd374"
   : (log.action || "").includes("Update")
   ? "#ffe066"
   : (log.action || "").includes("Delete")
   ? "#ff8080"
   : "#7abaff",
  border:
   (log.action || "").includes("Create")
   ? "1px solid rgba(40, 167, 69, 0.25)"
   : (log.action || "").includes("Update")
   ? "1px solid rgba(255, 193, 7, 0.25)"
   : (log.action || "").includes("Delete")
   ? "1px solid rgba(220, 53, 69, 0.25)"
   : "1px solid rgba(0, 123, 255, 0.25)"
 }}
>

{
 (log.action || "")
 .includes("Create")
 ? "🟢 "
 : (log.action || "")
 .includes("Update")
 ? "🟡 "
 : (log.action || "")
 .includes("Delete")
 ? "🔴 "
 : "📁 "
}

{log.action}

</span>

</td>
      
      <td>

  <pre
   style={{
    whiteSpace:"pre-wrap",
    margin:0,
    background: "#08120b",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#eff6eb",
    fontSize: "0.85rem"
   }}
  >
  {
   (() => {
    try{
     return log.details
      ? JSON.stringify(
         typeof log.details === "string"
          ? JSON.parse(log.details)
          : log.details,
         null,
         2
        )
      : "-";
    }catch{
     return log.details || "-";
    }
   })()
  }
  </pre>

 <button
  style={{
   marginTop:"5px"
  }}
  onClick={()=>
   navigator.clipboard.writeText(
 JSON.stringify(
  formatDetails(log.details),
  null,
  2
 )
)
  }
 >
  Copy
 </button>

<button
 style={{
  marginLeft:"5px"
 }}
 onClick={() => {

  const blob =
   new Blob(
    [
     JSON.stringify(
      log,
      null,
      2
     )
    ],
    {
     type:"application/json"
    }
   );

  const url =
   URL.createObjectURL(blob);

  const a =
   document.createElement("a");

  a.href = url;

  a.download =
   `log_${log.id}.json`;

  a.click();

  URL.revokeObjectURL(url);

 }}
>
 Download
</button>
</td>

<td>

<div>
 {getRelativeTime(log.created_at)}
</div>

<small>
 {
  new Date(
   log.created_at
  ).toLocaleString()
 }
</small>

</td>
<td>{log.role}</td>
       </tr>

      ))

     ) : (

      <tr>

       <td colSpan="6">
        No Logs Found
       </td>

      </tr>

     )
    }

    </tbody>

   </table>
    <div style={{marginTop:"10px", color: "rgba(239,246,235,0.7)"}}>
  <div style={{marginTop:"10px"}}>
 {
  filteredLogs.length > 0
  ? `Showing ${
     (page-1)*pageSize + 1
    }-${
     Math.min(
      page*pageSize,
      filteredLogs.length
     )
    } of ${
     filteredLogs.length
    } logs`
  : "Showing 0 logs"
 }
 </div>
 </div>

 <div style={{marginTop:"20px", display: "flex", alignItems: "center", gap: "10px"}}>

  <button
   disabled={page===1}
   onClick={()=>
    setPage(page-1)
   }
  >
   Previous
  </button>

  <span
  style={{
   margin:"0 10px",
   color: "rgba(239,246,235,0.85)"
  }}
 >
  Page {page} of {totalPages}
 </span>
  <button
  disabled={page >= totalPages}
  onClick={()=>
   setPage(page+1)
  }
 >
  Next
 </button>

 </div>
   </div>

 );

}