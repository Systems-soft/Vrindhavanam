import { useState,useEffect} from "react";

export default function SettingsPage(){

 const [settings,setSettings] =
 useState({
  siteName:"",
  supportEmail:"",
  maintenanceMode:false,
  updatedAt:"",
  logoUrl:"",
  maintenanceMessage:""
 });

const [message,setMessage] =
useState("");
const [loading,setLoading] =
useState(false);
const [originalSettings,
 setOriginalSettings] =
 useState(null);
 const hasChanges =
 JSON.stringify({
  siteName:settings.siteName,
  supportEmail:settings.supportEmail,
  maintenanceMode:settings.maintenanceMode,
  logoUrl:settings.logoUrl,
  maintenanceMessage:settings.maintenanceMessage
 }) !==
 JSON.stringify({
  siteName:originalSettings?.siteName,
  supportEmail:originalSettings?.supportEmail,
  maintenanceMode:originalSettings?.maintenanceMode,
  logoUrl:originalSettings?.logoUrl,
  maintenanceMessage:originalSettings?.maintenanceMessage
 });

  const loadSettings = async()=>{

 const res =
  await fetch(
   "http://localhost:5005/api/admin/settings"
  );

 const data =
  await res.json();

 setSettings({
 siteName:data.site_name || "",
 supportEmail:data.support_email || "",
 maintenanceMode:Boolean(
  data.maintenance_mode
 ),
 updatedAt:data.updated_at || "",
 logoUrl:data.logo_url || "",
 maintenanceMessage:
  data.maintenance_message || ""
});
setOriginalSettings({
 siteName:data.site_name || "",
 supportEmail:data.support_email || "",
 maintenanceMode:Boolean(
  data.maintenance_mode
 ),
 updatedAt:data.updated_at || "",
 logoUrl:data.logo_url || "",
 maintenanceMessage:
  data.maintenance_message || ""
});

};

useEffect(()=>{

 loadSettings();

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
const saveSettings = async()=>{

 try{

  setLoading(true);

  await fetch(
   "http://localhost:5005/api/admin/settings",
   {
    method:"PUT",

    headers:{
     "Content-Type":
      "application/json"
    },

    body:JSON.stringify(settings)
   }
  );

 await loadSettings();

setMessage(
 "Settings Saved Successfully"
);

 }catch(error){

 console.error(error);

 alert(
  "Failed to save settings"
 );
}finally{

  setLoading(false);

 }

};
 return(
  <div style={{padding:"20px"}}>

   <h1>Settings</h1>
   {
 message &&
 <div
  style={{
   color:"green",
   marginBottom:"10px"
  }}
 >
  {message}
 </div>
}
   <div
 style={{
  display:"flex",
  gap:"20px",
  marginBottom:"20px"
 }}
>

 <div>
  <h3>Site Name</h3>
  <p>{settings.siteName}</p>
 </div>

 <div>
  <h3>Support Email</h3>
  <p>{settings.supportEmail}</p>
 </div>

 <div>
 <h3>Status</h3>
 <p>
  {
   settings.maintenanceMode
    ? "Maintenance"
    : "Live"
  }
 </p>
</div>

<div>
 <h3>Last Updated</h3>
 <p>
  {
   settings.updatedAt
    ? new Date(
       settings.updatedAt
      ).toLocaleString()
    : "-"
  }
 </p>
</div>

</div>

   <input
    placeholder="Site Name"
    value={settings.siteName}
    onChange={(e)=>
     setSettings({
      ...settings,
      siteName:e.target.value
     })
    }
   />

   <br/><br/>

   <input
    placeholder="Support Email"
    value={settings.supportEmail}
    onChange={(e)=>
     setSettings({
      ...settings,
      supportEmail:e.target.value
     })
    }
   />

   <br/><br/>

<br/><br/>

<input
 placeholder="https://example.com/logo.png"
 value={settings.logoUrl}
 onChange={(e)=>
  setSettings({
   ...settings,
   logoUrl:e.target.value
  })
 }
/>
<h3>Logo Preview</h3>
{
 settings.logoUrl && (
  <>
  <img
   src={settings.logoUrl}
   alt="Logo"
   width="120"
   style={{
    marginTop:"10px",
    borderRadius:"8px"
   }}
  />
  <br/>
  </>
 )
}
<br/><br/>
<textarea
 rows="4"
 style={{
  width:"400px"
 }}
 placeholder="Maintenance Message"
 value={
  settings.maintenanceMessage
 }
 onChange={(e)=>
  setSettings({
   ...settings,
   maintenanceMessage:
    e.target.value
  })
 }
/>

<label>

 <input
  type="checkbox"
  checked={settings.maintenanceMode}
  onChange={(e)=>{

   if(
    e.target.checked &&
    !window.confirm(
     "Enable maintenance mode?"
    )
   ){
    return;
   }

   setSettings({
    ...settings,
    maintenanceMode:
     e.target.checked
   });

  }}
 />

 Maintenance Mode

</label>

   <br/><br/>

   <button
 onClick={saveSettings}
 disabled={
  loading ||
  !hasChanges
 }
>
 {
  loading
   ? "Saving..."
   : "Save Settings"
 }
</button>
<button
 onClick={loadSettings}
 disabled={loading}
 style={{
  marginLeft:"10px"
 }}
>
 Reset
</button>
  </div>
 );
}