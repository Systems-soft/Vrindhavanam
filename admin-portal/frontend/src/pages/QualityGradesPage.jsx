import { useEffect, useState } from "react";

export default function QualityGradesPage() {

const [grades, setGrades] = useState([]);
const [searchTerm,setSearchTerm] = useState("");
const [batchOptions,setBatchOptions] = useState([]);
const [showAddModal,setShowAddModal] = useState(false);
const [showEditModal,setShowEditModal] = useState(false);
const [editGrade,setEditGrade] = useState(null);
const [showViewModal,setShowViewModal] = useState(false);
const [viewGrade,setViewGrade] = useState(null);
const [gradeFilter,setGradeFilter] = useState("");
const [newGrade,setNewGrade] = useState({

 batch_id:"",
 grade:"",
 moisture_level:"",
 remarks:""

});

  useEffect(() => {

    fetch(
      "http://localhost:5005/api/admin/quality-grades"
    )
      .then((res) => res.json())
      .then((data) => {
        setGrades(data);
      });

      fetch(
 "http://localhost:5005/api/admin/batch-dropdown"
)
.then(res=>res.json())
.then(data=>setBatchOptions(data));

  }, []);
const filteredGrades = grades.filter((g) => {

  const matchesSearch =
    g.grade
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesGrade =
    gradeFilter === "" ||
    g.grade === gradeFilter;

  return matchesSearch && matchesGrade;

});
const handleInputChange = (e) => {

  const { name, value } = e.target;

  setNewGrade({

    ...newGrade,

    [name]: value

  });

};

const handleSaveGrade = async () => {

  await fetch(

    "http://localhost:5005/api/admin/quality-grades",

    {

      method: "POST",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify(newGrade)

    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/quality-grades"
  );

  const data = await response.json();

  setGrades(data);

  setNewGrade({

 batch_id:"",
 grade:"",
 moisture_level:"",
 remarks:""

});
  setShowAddModal(false);

};

const handleDeleteGrade = async (id) => {

  await fetch(

    `http://localhost:5005/api/admin/quality-grades/${id}`,

    {
      method:"DELETE"
    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/quality-grades"
  );

  const data = await response.json();

  setGrades(data);

};
const handleUpdateGrade = async () => {

  await fetch(

    `http://localhost:5005/api/admin/quality-grades/${editGrade.id}`,

    {

      method:"PUT",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(editGrade)

    }

  );

  const response = await fetch(
    "http://localhost:5005/api/admin/quality-grades"
  );

  const data = await response.json();

  setGrades(data);

  setShowEditModal(false);
  setEditGrade(null);

};
  return (

    <div>
      <input
 type="text"
 placeholder="Search Grade..."
 value={searchTerm}
 onChange={(e)=>setSearchTerm(e.target.value)}
/>

<br /><br />

<select
 value={gradeFilter}
 onChange={(e)=>setGradeFilter(e.target.value)}
 style={{
   padding: "8px 12px",
   background: "#0f1d13",
   color: "#eff6eb",
   border: "1px solid rgba(255,255,255,0.15)",
   borderRadius: "8px",
   fontSize: "0.9rem",
   cursor: "pointer",
   outline: "none"
 }}
>

<option value="" style={{ background: "#0f1d13", color: "#eff6eb" }}>
 All Grades
</option>

<option value="Premium" style={{ background: "#0f1d13", color: "#eff6eb" }}>
 Premium
</option>

<option value="A Grade" style={{ background: "#0f1d13", color: "#eff6eb" }}>
 A Grade
</option>

<option value="B Grade" style={{ background: "#0f1d13", color: "#eff6eb" }}>
 B Grade
</option>

</select>

<br /><br />

<h2>Quality Grades</h2>

<button
 onClick={() => setShowAddModal(true)}
>
 Add Grade
</button>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >

        <thead>

          <tr>

            <th>ID</th>

            <th>Batch Number</th>

            <th>Grade</th>

            <th>Moisture %</th>

            <th>Remarks</th>
<th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredGrades.map((g) => (

            <tr key={g.id}>

              <td>{g.id}</td>

              <td>{g.batch_number}</td>

              <td>{g.grade}</td>

              <td>{g.moisture_level}</td>

              <td>{g.remarks}</td>

              <td>

 <button
 onClick={() => {
   setViewGrade(g);
   setShowViewModal(true);
 }}
>
 View
</button>
  <button
 onClick={() => {

  setEditGrade(g);

  setShowEditModal(true);

 }}
>
 Edit
</button>

  <button
 onClick={() => {

 if(
  window.confirm(
   "Delete this grade?"
  )
 ){

  handleDeleteGrade(g.id);

 }

}}
>
 Delete
</button>

</td>

            </tr>

          ))}

        </tbody>

      </table>

      {
showAddModal && (
  <div
    onClick={() => setShowAddModal(false)}
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
        width: "500px",
        maxWidth: "90vw",
        maxHeight: "90vh",
        overflowY: "auto",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
      }}
    >
      <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px" }}>Add Grade</h3>
      
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Batch</label>
        <select
          name="batch_id"
          value={newGrade.batch_id}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#0f1d13",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            outline: "none"
          }}
        >
          <option value="" style={{ background: "#0f1d13" }}>Select Batch</option>
          {batchOptions.map((b)=>(
            <option key={b.id} value={b.id} style={{ background: "#0f1d13" }}>{b.batch_number}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Grade</label>
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={newGrade.grade}
          onChange={handleInputChange}
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

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Moisture %</label>
        <input
          type="number"
          name="moisture_level"
          placeholder="Moisture %"
          value={newGrade.moisture_level}
          onChange={handleInputChange}
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

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Remarks</label>
        <textarea
          name="remarks"
          placeholder="Remarks"
          value={newGrade.remarks}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#0f1d13",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            outline: "none",
            minHeight: "80px",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSaveGrade}
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
          Save
        </button>
        <button
          onClick={() => setShowAddModal(false)}
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
)
}

{
showEditModal && editGrade && (
  <div
    onClick={() => setShowEditModal(false)}
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
        width: "500px",
        maxWidth: "90vw",
        maxHeight: "90vh",
        overflowY: "auto",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
      }}
    >
      <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px" }}>Edit Grade</h3>
      
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Batch</label>
        <select
          value={editGrade.batch_id}
          onChange={(e)=>
            setEditGrade({
              ...editGrade,
              batch_id: e.target.value
            })
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
        >
          <option value="" style={{ background: "#0f1d13" }}>Select Batch</option>
          {batchOptions.map((b)=>(
            <option key={b.id} value={b.id} style={{ background: "#0f1d13" }}>{b.batch_number}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Grade</label>
        <input
          type="text"
          value={editGrade.grade}
          onChange={(e)=>
            setEditGrade({
              ...editGrade,
              grade: e.target.value
            })
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

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Moisture %</label>
        <input
          type="number"
          value={editGrade.moisture_level}
          onChange={(e)=>
            setEditGrade({
              ...editGrade,
              moisture_level: e.target.value
            })
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

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "6px", color: "rgba(239,246,235,0.75)", fontSize: "0.9rem" }}>Remarks</label>
        <textarea
          value={editGrade.remarks}
          onChange={(e)=>
            setEditGrade({
              ...editGrade,
              remarks: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#0f1d13",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            outline: "none",
            minHeight: "80px",
            resize: "vertical"
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleUpdateGrade}
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
          Update
        </button>
        <button
          onClick={() => setShowEditModal(false)}
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
)
}

{
showViewModal && viewGrade && (
  <div
    onClick={() => setShowViewModal(false)}
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
        width: "500px",
        maxWidth: "90vw",
        maxHeight: "90vh",
        overflowY: "auto",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
      }}
    >
      <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "20px" }}>Grade Details</h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px", marginBottom: "20px" }}>
        <span style={{ color: "rgba(239,246,235,0.6)" }}>Batch:</span>
        <span style={{ fontWeight: "500" }}>{viewGrade.batch_number}</span>

        <span style={{ color: "rgba(239,246,235,0.6)" }}>Grade:</span>
        <span style={{ fontWeight: "500" }}>{viewGrade.grade}</span>

        <span style={{ color: "rgba(239,246,235,0.6)" }}>Moisture:</span>
        <span style={{ fontWeight: "500" }}>{viewGrade.moisture_level}%</span>

        <span style={{ color: "rgba(239,246,235,0.6)" }}>Remarks:</span>
        <span style={{ whiteSpace: "pre-wrap" }}>{viewGrade.remarks || "-"}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => setShowViewModal(false)}
          style={{
            background: "transparent",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)
}
    </div>

  );

}