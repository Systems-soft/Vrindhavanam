import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BlogsPage() {

 const [blogs,setBlogs] = useState([]);
 const [search,setSearch] = useState("");
 const navigate = useNavigate();

useEffect(() => {

 fetch("http://localhost:5005/api/admin/blogs")
  .then(res => res.json())
  .then(data => {
   console.log("BLOGS DATA:", data);
   setBlogs(data);
  })
  .catch(err => {
   console.error("BLOG ERROR:", err);
  });

}, []);
const filteredBlogs =
 blogs.filter(blog =>
  blog.title
   .toLowerCase()
   .includes(search.toLowerCase())
 );
 const deleteBlog = async(id)=>{

 await fetch(
  `http://localhost:5005/api/admin/blogs/${id}`,
  {
   method:"DELETE"
  }
 );

 setBlogs(
  blogs.filter(
   blog => blog.id !== id
  )
 );

};
 return (

  <div style={{padding:"20px"}}>

   <h1>Blogs Management</h1>
   <button
 onClick={() =>
  navigate("/admin/blogs/new")
 }
>
 Add Blog
</button>

   <input
 value={search}
 onChange={(e)=>
  setSearch(e.target.value)
 }
 placeholder="Search Blog"
/>
<h3>
 Total Blogs: {blogs.length}
</h3>

<h3>
 Published:
 {
  blogs.filter(
   b => b.status === "Published"
  ).length
 }
</h3>

<h3>
 Draft:
 {
  blogs.filter(
   b => b.status === "Draft"
  ).length
 }
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
      <th>Title</th>
      <th>Slug</th>
      <th>Status</th>
      <th>Created</th>
      <th>Actions</th>
     </tr>
    </thead>

    <tbody>

    {
 filteredBlogs.length > 0 ? (

      filteredBlogs.map(blog => (

       <tr key={blog.id}>
        <td>{blog.id}</td>
        <td>{blog.title}</td>
        <td>{blog.slug}</td>
        <td>{blog.status}</td>
        <td>{blog.created_at}</td>
        <td>

 <button
 onClick={() =>
  navigate(`/admin/blogs/${blog.id}`)
 }
>
 Edit
</button>
 <button
  onClick={()=>
   deleteBlog(blog.id)
  }
 >
  Delete
 </button>

</td>
       </tr>

      ))

     ) : (

      <tr>
       <td colSpan="6">
        No Blogs Found
       </td>
      </tr>

     )
    }

    </tbody>

   </table>

  </div>

 );

}