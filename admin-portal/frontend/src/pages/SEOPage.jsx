import { useEffect,useState } from "react";

export default function SEOPage(){

 const [seo,setSeo] = useState({});
 const [saving,setSaving] = useState(false);

 useEffect(()=>{

  fetch("http://localhost:5005/api/admin/seo")
 .then(res=>res.json())
 .then(data=>setSeo(data))
 .catch(err=>{
   console.error(err);
 });

 },[]);
const saveSEO = async()=>{

 if(
  seo.canonical_url &&
  !seo.canonical_url.startsWith("http")
 ){
  alert("Canonical URL must start with http");
  return;
 }

try {

 setSaving(true);

 await fetch(
  "http://localhost:5005/api/admin/seo",
  {
   method:"PUT",
   headers:{
    "Content-Type":"application/json"
   },
   body:JSON.stringify(seo)
  }
 );

 alert("SEO Updated");

} catch(err){

 console.error(err);
 alert("Failed to update SEO");

} finally {

 setSaving(false);

}
};
 
 return(

 <div
 style={{
  maxWidth:"900px",
  margin:"auto",
  padding:"20px"
 }}
>

  <h1>SEO Settings</h1>
  <h2>General SEO</h2>
  <label>Site Title</label>

<input
 style={{
  width:"100%",
  padding:"10px"
 }}
 value={seo.site_title || ""}
 onChange={(e)=>
  setSeo({
   ...seo,
   site_title:e.target.value
  })
 }
/>
  <br/><br/>

  <label>Meta Description</label>

<textarea
 rows="4"
 style={{
  width:"100%",
  padding:"10px"
 }}
 value={seo.meta_description || ""}
   onChange={(e)=>
    setSeo({
     ...seo,
     meta_description:e.target.value
    })
   }
  />

  <br/><br/>
<label>Meta Keywords</label>
  <input
 style={{
  width:"100%",
  padding:"10px"
 }}
 placeholder="Meta Keywords"
 value={seo.meta_keywords || ""}
 onChange={(e)=>
  setSeo({
   ...seo,
   meta_keywords:e.target.value
  })
 }
/>
<h2>Social Media SEO</h2>
<br/><br/>
<label>OG Title</label>
<input
 placeholder="OG Title"
 value={seo.og_title || ""}
 style={{
 width:"100%",
 padding:"10px"
}}
 onChange={(e)=>
  setSeo({
   ...seo,
   og_title:e.target.value
  })
 }
/>

<br/><br/>
<label>OG Description</label>
<textarea
 placeholder="OG Description"
 value={seo.og_description || ""}
 rows="4"

style={{
 width:"100%",
 padding:"10px"
}}
 onChange={(e)=>
  setSeo({
   ...seo,
   og_description:e.target.value
  })
 }
/>

<br/><br/>
<label>OG Image URL</label>
<input
 placeholder="OG Image URL"
 value={seo.og_image || ""}
 style={{
 width:"100%",
 padding:"10px"
}}
 onChange={(e)=>
  setSeo({
   ...seo,
   og_image:e.target.value
  })
 }
/>

<br/><br/>
<h2>Advanced SEO</h2>
<label>Canonical URL</label>
<input
 placeholder="Canonical URL"
 value={seo.canonical_url || ""}
 style={{
 width:"100%",
 padding:"10px"
}}
 onChange={(e)=>
  setSeo({
   ...seo,
   canonical_url:e.target.value
  })
 }
/>

<br/><br/>



  <button
 disabled={saving}
 onClick={saveSEO}
>
 {saving ? "Saving..." : "Save SEO"}
</button>

<hr />

<h2>SEO Preview</h2>

<p>
 <strong>Title:</strong>
 {" "}
 {seo.site_title}
</p>

<p>
 <strong>Description:</strong>
 {" "}
 {seo.meta_description}
</p>

<p>
 <strong>Keywords:</strong>
 {" "}
 {seo.meta_keywords}
</p>
 </div>

);
}