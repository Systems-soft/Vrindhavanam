import { useEffect, useState } from "react";

export default function AIInsightsPage(){

 const [insights,setInsights]=useState([]);
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [lastRefresh, setLastRefresh] = useState("");

const highCount =
 insights.filter(i => i.priority === "High").length;

const mediumCount =
 insights.filter(i => i.priority === "Medium").length;

const lowCount =
 insights.filter(i => i.priority === "Low").length;

const loadInsights = async () => {

 try{

  setLoading(true);

  const res = await fetch(
   "http://localhost:5005/api/admin/ai-insights"
  );

  const data = await res.json();

  setInsights(data);
  setLastRefresh(new Date().toLocaleTimeString());
  setMessage("Insights updated");

 }catch(error){

  console.error(error);

 }

 finally{

  setLoading(false);

 }

};

useEffect(()=>{

 loadInsights();

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

  return(

   <div style={{padding:"20px", color: "#eff6eb"}}>

    <h1>AI Insights</h1>
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
  <p>Loading AI Insights...</p>
 }

 <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
    <button
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
     Generate Insights
    </button>

    <button
     onClick={loadInsights}
     disabled={loading}
     style={{
       background: "transparent",
       color: "#eff6eb",
       border: "1px solid rgba(255,255,255,0.2)",
       padding: "10px 20px",
       borderRadius: "8px",
       cursor: "pointer"
     }}
    >
     {loading ? "Refreshing..." : "Refresh Insights"}
    </button>
 </div>

  <div
  style={{
   display:"grid",
   gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
   gap:"20px",
   marginBottom:"20px",
   marginTop:"15px"
  }}
 >

 <div style={{ background: "rgba(18, 24, 20, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "20px", borderRadius: "10px" }}>
  <h3 style={{ margin: "0 0 10px 0", color: "rgba(239,246,235,0.6)" }}>Total Insights</h3>
  <h2 style={{ margin: 0, color: "#eff6eb" }}>{insights.length}</h2>
 </div>

 <div style={{ background: "rgba(18, 24, 20, 0.4)", border: "1px solid rgba(255,255,255,0.08)", padding: "20px", borderRadius: "10px" }}>
  <h3 style={{ margin: "0 0 10px 0", color: "rgba(239,246,235,0.6)" }}>Latest Insight</h3>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginTop: "10px", marginBottom: "10px" }}>
    <div style={{ background: "rgba(220, 53, 69, 0.1)", border: "1px solid rgba(220,53,69,0.2)", padding: "8px", borderRadius: "8px", textAlign: "center" }}>
      <small style={{ color: "#ff8080", fontWeight: "600" }}>High</small>
      <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#eff6eb" }}>{highCount}</div>
    </div>
    <div style={{ background: "rgba(255, 193, 7, 0.1)", border: "1px solid rgba(255,193,7,0.2)", padding: "8px", borderRadius: "8px", textAlign: "center" }}>
      <small style={{ color: "#ffe066", fontWeight: "600" }}>Med</small>
      <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#eff6eb" }}>{mediumCount}</div>
    </div>
    <div style={{ background: "rgba(40, 167, 69, 0.1)", border: "1px solid rgba(40,167,69,0.2)", padding: "8px", borderRadius: "8px", textAlign: "center" }}>
      <small style={{ color: "#5dd374", fontWeight: "600" }}>Low</small>
      <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#eff6eb" }}>{lowCount}</div>
    </div>
  </div>
  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "rgba(239,246,235,0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
   {
    insights.length
    ? insights[0].title
    : "-"
   }
  </p>
 </div>

 </div>

 <p style={{ color: "rgba(239,246,235,0.6)" }}>
  Last Refresh: {lastRefresh || "-"}
 </p>

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
    <th>Title</th>
    <th>Insight</th>
    <th>Priority</th>
    <th>Created</th>
  </tr>
</thead>

<tbody>

  {
 insights.length>0

 ?

 insights.map((insight,index)=>(
<tr
 key={insight.id}
 style={{
  background:
   index % 2 === 0
    ? "rgba(255,255,255,0.02)"
    : "transparent"
 }}
>

<td>{insight.id}</td>

<td>{insight.title}</td>

<td>{insight.description}</td>

<td>

<span
 style={{
 padding:"4px 8px",
 borderRadius:"6px",
 fontWeight: "600",
 fontSize: "0.85rem",
 background:
  insight.priority==="High"
   ? "rgba(220, 53, 69, 0.15)"
   : insight.priority==="Medium"
   ? "rgba(255, 193, 7, 0.15)"
   : "rgba(40, 167, 69, 0.15)",
 color:
  insight.priority==="High"
   ? "#ff8080"
   : insight.priority==="Medium"
   ? "#ffe066"
   : "#5dd374",
 border:
  insight.priority==="High"
   ? "1px solid rgba(220, 53, 69, 0.25)"
   : insight.priority==="Medium"
   ? "1px solid rgba(255, 193, 7, 0.25)"
   : "1px solid rgba(40, 167, 69, 0.25)"
}}
>

{insight.priority}

</span>

</td>

<td>

{
 new Date(
  insight.created_at
 ).toLocaleString()
}

</td>

</tr>

))

:

<tr>

<td colSpan="5" style={{ background: "transparent" }}>

No AI insights generated yet.
Click Refresh after more activity.

</td>

</tr>

}
</tbody>

</table>

   </div>

  );

}