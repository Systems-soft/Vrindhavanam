import { useEffect, useState } from "react";

export default function HomepagePage() {

  const [data,setData] = useState({
    hero_title:"",
    hero_subtitle:"",
    about_title:"",
    about_description:"",
    banner_image:""
  });

  useEffect(()=>{

    fetch(
      "http://localhost:5005/api/admin/homepage"
    )
    .then(res=>res.json())
    .then(result=>{
      setData(result);
    });

  },[]);

  const saveHomepage = async()=>{

    await fetch(
      "http://localhost:5005/api/admin/homepage",
      {
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      }
    );

    alert("Homepage Updated Successfully");

  };

  return (

    <div style={{padding:"20px"}}>

      <h1>Homepage Management</h1>

      <div>

        <label>Hero Title</label>

        <input
          value={data.hero_title || ""}
          onChange={(e)=>
            setData({
              ...data,
              hero_title:e.target.value
            })
          }
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"15px"
          }}
        />

        <label>Hero Subtitle</label>

        <textarea
          value={data.hero_subtitle || ""}
          onChange={(e)=>
            setData({
              ...data,
              hero_subtitle:e.target.value
            })
          }
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"15px"
          }}
        />

        <label>About Title</label>

        <input
          value={data.about_title || ""}
          onChange={(e)=>
            setData({
              ...data,
              about_title:e.target.value
            })
          }
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"15px"
          }}
        />

        <label>About Description</label>

        <textarea
          value={data.about_description || ""}
          onChange={(e)=>
            setData({
              ...data,
              about_description:e.target.value
            })
          }
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"15px"
          }}
        />

        <label>Banner Image URL</label>

        <input
          value={data.banner_image || ""}
          onChange={(e)=>
            setData({
              ...data,
              banner_image:e.target.value
            })
          }
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"15px"
          }}
        />

        <button
          onClick={saveHomepage}
        >
          Save Homepage
        </button>

      </div>

    </div>

  );

}