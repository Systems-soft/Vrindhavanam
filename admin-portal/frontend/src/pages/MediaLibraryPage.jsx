import { useEffect, useState, useRef } from "react";

export default function MediaLibraryPage(){

 const [files,setFiles] = useState([]);
 const [selectedFile,setSelectedFile] = useState(null);
const fileInputRef = useRef(null);
 const loadMedia = async()=>{

 const res =
  await fetch(
   "http://localhost:5005/api/admin/media"
  );

 const data =
  await res.json();

 setFiles(data);

};

 useEffect(()=>{
 loadMedia();
},[]);

 const uploadFile = async()=>{

 if(!selectedFile){
  alert("Select a file");
  return;
 }

 const formData = new FormData();

 formData.append(
  "file",
  selectedFile
 );

 await fetch(
  "http://localhost:5005/api/admin/media/upload",
  {
   method:"POST",
   body:formData
  }
 );

 alert("File Uploaded");

 await loadMedia();

 setSelectedFile(null);
 if(fileInputRef.current){
 fileInputRef.current.value = "";

}
 };
const deleteFile = async(id)=>{

 await fetch(
  `http://localhost:5005/api/admin/media/${id}`,
  {
   method:"DELETE"
  }
 );

 setFiles(
  files.filter(
   file => file.id !== id
  )
 );

};
 return(
  

  <div style={{padding:"20px"}}>
  <input
 ref={fileInputRef}
 type="file"
 onChange={(e)=>
  setSelectedFile(
   e.target.files[0]
  )
 }
/>

<button
 style={{
  marginLeft:"10px"
 }}
 onClick={uploadFile}
>
 Upload
</button>

<br/><br/>

   <h1>Media Library</h1>

<h3>
 Total Files: {files.length}
</h3>
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
      <th>File Name</th>
      <th>Type</th>
      <th>Preview</th>
      <th>Actions</th>
     </tr>
    </thead>

    <tbody>

    {
     files.length > 0 ? (

      files.map(file=>(

       <tr key={file.id}>

        <td>{file.id}</td>

        <td>{file.file_name}</td>

        <td>{file.file_type}</td>

        <td>
      {
 file.file_type?.startsWith("image")
 ? (
   <img
 src={file.file_url}
 alt=""
 width="80"
 style={{
  borderRadius:"8px"
 }}
/>
  )
 : (
   <a
    href={file.file_url}
    target="_blank"
    rel="noreferrer"
   >
    View File
   </a>
  )
}
        </td>
       <td>

 <button
  onClick={()=>
   deleteFile(file.id)
  }
 >
  Delete
 </button>

</td>
       </tr>

      ))

     ) : (

      <tr>
       <td colSpan="5">
        No Files Uploaded
       </td>
      </tr>

     )
    }

    </tbody>

   </table>

  </div>

 );

}