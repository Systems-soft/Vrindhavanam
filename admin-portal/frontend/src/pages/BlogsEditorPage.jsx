import { useState } from "react";

export default function BlogEditorPage(){

 const [title,setTitle] = useState("");
 const [slug,setSlug] = useState("");
 const [content,setContent] = useState("");
 const [imageUrl,setImageUrl] = useState("");
 const [status,setStatus] = useState("Draft");

 return(

  <div style={{padding:"20px"}}>

   <h1>Create Blog</h1>

   <input
    placeholder="Title"
    value={title}
    onChange={(e)=>setTitle(e.target.value)}
   />

   <br/><br/>

   <input
    placeholder="Slug"
    value={slug}
    onChange={(e)=>setSlug(e.target.value)}
   />

   <br/><br/>

   <textarea
    rows="10"
    placeholder="Content"
    value={content}
    onChange={(e)=>setContent(e.target.value)}
   />

   <br/><br/>

   <input
    placeholder="Image URL"
    value={imageUrl}
    onChange={(e)=>setImageUrl(e.target.value)}
   />

   <br/><br/>

   <select
    value={status}
    onChange={(e)=>setStatus(e.target.value)}
   >
    <option>Draft</option>
    <option>Published</option>
   </select>

   <br/><br/>

   <button>
    Save Blog
   </button>

  </div>

 );

}