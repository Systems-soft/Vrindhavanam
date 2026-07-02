import { useEffect, useState } from "react";

const defaultProducts = [
  "Cardamom", "Pepper", "Coffee", "Cloves", "Tea", "Turmeric",
  "Ginger", "Honey", "Ghee", "Cashew", "Ashwagandha", "Manure",
  "Garcinia Cambogia", "Pickle"
].sort();

const selectStyle = {
  width: "100%",
  padding: "9px 12px",
  background: "#0f1d13",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "8px",
  color: "#eff6eb",
  fontSize: "0.9rem",
  cursor: "pointer",
  outline: "none"
};

const optionStyle = {
  background: "#0f1d13",
  color: "#eff6eb"
};

export default function HarvestPage() {

  const [harvests, setHarvests] = useState([]);
  const [productList, setProductList] = useState(defaultProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
const [editHarvest, setEditHarvest] = useState(null);
  const [newHarvest, setNewHarvest] = useState({

  crop_type: "",

  harvest_date: "",

  yield_kg: "",

  quality_grade: "Premium",

  status: "Harvested"

});

  useEffect(() => {
    fetch("http://localhost:5005/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const uniques = [...new Set(data.map(p => p.product_name))].filter(Boolean);
          const combined = [...new Set([...uniques, ...defaultProducts])].sort();
          setProductList(combined);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {

    fetch(
      "http://localhost:5005/api/admin/harvests"
    )
      .then((res) => res.json())
      .then((data) => {
  setHarvests(data);
})
      .catch(console.error);

  }, []);
const filteredHarvests = harvests.filter((h) => {

  const matchesSearch =
    h.crop_type
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" ||
    h.status === statusFilter;

  return matchesSearch && matchesStatus;

});
const totalHarvests = harvests.length;

const totalYield = harvests.reduce(
  (sum, h) => sum + Number(h.yield_kg || 0),
  0
);

const premiumHarvests = harvests.filter(
  h => h.quality_grade === "Premium"
).length;

const handleSaveHarvest = async () => {
  
if (
  !newHarvest.crop_type ||
  !newHarvest.harvest_date ||
  !newHarvest.yield_kg
) {
  alert("Fill all fields");
  return;
}

  try {

    const response = await fetch(
      "http://localhost:5005/api/admin/harvests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newHarvest)
      }
    );

    const result = await response.json();

if (response.ok) {
  alert("Harvest Added Successfully");
} else {
  alert(result.error);
  return;
}
    console.log(result);

    // reload harvest list

    const updated = await fetch(
      "http://localhost:5005/api/admin/harvests"
    );

    const data = await updated.json();

    setHarvests(data);

    // close modal

    setShowAddModal(false);

    // clear form

    setNewHarvest({
      crop_type: "",
      harvest_date: "",
      yield_kg: "",
      quality_grade: "Premium",
      status: "Harvested"
    });

  } catch(err) {

    console.error(err);

  }

};

const handleEditHarvest = (harvest) => {

  setEditHarvest(harvest);

  setShowEditModal(true);

};

const handleViewHarvest = (harvest) => {

  setSelectedHarvest(harvest);

  setShowModal(true);

};

const handleInputChange = (e) => {

  const { name, value } = e.target;

  setNewHarvest({

    ...newHarvest,

    [name]: value

  });

};
const handleEditInputChange = (e) => {

  const { name, value } = e.target;

  setEditHarvest({

    ...editHarvest,

    [name]: value

  });

};


const handleUpdateHarvest = async () => {
  if (
  !editHarvest.crop_type ||
  !editHarvest.harvest_date ||
  !editHarvest.yield_kg
) {
  alert("Fill all fields");
  return;
}

  try {

    const response = await fetch(
  `http://localhost:5005/api/admin/harvests/${editHarvest.id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(editHarvest)
  }
);

let result = {};

try {
  result = await response.json();
} catch {}

if (!response.ok) {
  alert(result.error || "Update failed");
  return;
}

    const updated = await fetch(
      "http://localhost:5005/api/admin/harvests"
    );

    const data = await updated.json();

    setHarvests(data);

    setShowEditModal(false);

    alert("Harvest Updated Successfully");

  } catch(err) {

    console.error(err);

  }

};

const handleDeleteHarvest = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this harvest?"
  );

  if (!confirmDelete) return;

  try {

    const response = await fetch(
  `http://localhost:5005/api/admin/harvests/${id}`,
  {
    method: "DELETE"
  }
);

let result = {};

try {
  result = await response.json();
} catch {}

if (!response.ok) {
  alert(result.error || "Delete failed");
  return;
}

    const updated = await fetch(
      "http://localhost:5005/api/admin/harvests"
    );

    const data = await updated.json();

    setHarvests(data);

    alert("Harvest Deleted Successfully");

  } catch(err) {

    console.error(err);

  }

};
  return (

    <div>
      <h2>Harvest Management</h2>

<input
  type="text"
  placeholder="Search Crop..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  style={{
    marginLeft: "10px",
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
  <option value="All" style={{ background: "#0f1d13", color: "#eff6eb" }}>All</option>
  <option value="Harvested" style={{ background: "#0f1d13", color: "#eff6eb" }}>Harvested</option>
  <option value="Processing" style={{ background: "#0f1d13", color: "#eff6eb" }}>Processing</option>
  <option value="Completed" style={{ background: "#0f1d13", color: "#eff6eb" }}>Completed</option>
</select>
     
      <div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "20px",
    marginBottom: "20px"
  }}
>
  <div>Total Harvests: {totalHarvests}</div>

  <div>Total Yield: {totalYield} kg</div>

  <div>Premium Harvests: {premiumHarvests}</div>
</div>

<button
  onClick={() => setShowAddModal(true)}
  style={{
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#2e7d32",
    color: "#fff",
    cursor: "pointer",
    marginTop: "10px",
    marginBottom: "20px"
  }}
>
  Add Harvest
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

            <th>Crop</th>

            <th>Date</th>

            <th>Yield (kg)</th>

            <th>Quality</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredHarvests.map((h) => (

            <tr key={h.id}>

              <td>{h.id}</td>

              <td>{h.crop_type}</td>

              <td>
                {new Date(
                  h.harvest_date
                ).toLocaleDateString()}
              </td>

              <td>{h.yield_kg}</td>

              <td>{h.quality_grade}</td>

              <td>{h.status}</td>

              <td>

  <button
    onClick={() => handleViewHarvest(h)}
  >
    View
  </button>

  <button
    onClick={() => handleEditHarvest(h)}
    style={{ marginLeft: "10px" }}
  >
    Edit
  </button>
<button
  onClick={() => handleDeleteHarvest(h.id)}
  style={{ marginLeft: "10px" }}
>
  Delete
</button>

</td>

            </tr>

          ))}

        </tbody>

      </table>

{showModal && selectedHarvest && (

  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >

    <div
      style={{
        background: "#0f1c12",
        padding: "20px",
        color: "#fff",
        borderRadius: "10px",
        width: "500px"
      }}
    >

      <h2>
        {selectedHarvest.crop_type}
      </h2>

      <p>
        Date:
        {" "}
        {new Date(
          selectedHarvest.harvest_date
        ).toLocaleDateString()}
      </p>

      <p>
        Yield:
        {" "}
        {selectedHarvest.yield_kg}
        kg
      </p>

      <p>
        Quality:
        {" "}
        {selectedHarvest.quality_grade}
      </p>

      <p>
        Status:
        {" "}
        {selectedHarvest.status}
      </p>

      <p>
        Created:
        {" "}
        {new Date(
          selectedHarvest.created_at
        ).toLocaleString()}
      </p>

      <button
        onClick={() =>
          setShowModal(false)
        }
      >
        Close
      </button>
      

    </div>

  </div>

)}
{showAddModal && (

  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >

    <div
      style={{
        background: "#0f1c12",
        padding: "20px",
        color: "#fff",
        borderRadius: "10px",
        width: "500px"
      }}
    >

      <h2>Add Harvest</h2>

   <select
   name="crop_type"
   value={newHarvest.crop_type}
   onChange={handleInputChange}
   style={selectStyle}
 >
   <option value="" style={optionStyle}>Select Crop</option>
   {productList.map((name) => (
     <option key={name} value={name} style={optionStyle}>
       {name}
     </option>
   ))}
 </select>

      <br /><br />

      <input
        type="date"
        name="harvest_date"
        value={newHarvest.harvest_date}
        onChange={handleInputChange}
      />

      <br /><br />

      <input
        type="number"
        name="yield_kg"
        placeholder="Yield"
        value={newHarvest.yield_kg}
        onChange={handleInputChange}
      />

      <br /><br />

      <select
        name="quality_grade"
        value={newHarvest.quality_grade}
        onChange={handleInputChange}
        style={selectStyle}
      >
        <option style={optionStyle}>Premium</option>
        <option style={optionStyle}>Standard</option>
        <option style={optionStyle}>Economy</option>
      </select>

      <br /><br />

      <select
        name="status"
        value={newHarvest.status}
        onChange={handleInputChange}
        style={selectStyle}
      >
        <option style={optionStyle}>Harvested</option>
        <option style={optionStyle}>Processing</option>
        <option style={optionStyle}>Completed</option>
      </select>

      <br /><br />

     <button
  onClick={handleSaveHarvest}
>
  Save Harvest
</button>

      <button
        onClick={() =>
          setShowAddModal(false)
        }
      >
        Cancel
      </button>

    </div>

  </div>

)}
{showEditModal && editHarvest && (

  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >

    <div
      style={{
        background: "#0f1c12",
        padding: "20px",
        color: "#fff",
        borderRadius: "10px",
        width: "500px"
      }}
    >
<h2>Edit Harvest</h2>
<select
  name="crop_type"
  value={editHarvest?.crop_type || ""}
  onChange={handleEditInputChange}
  style={selectStyle}
>
  <option value="" style={optionStyle}>Select Crop</option>
  {productList.map((name) => (
    <option key={name} value={name} style={optionStyle}>
      {name}
    </option>
  ))}
</select>

<br /><br />

<input
  type="date"
  name="harvest_date"
 value={
  editHarvest?.harvest_date
    ? String(editHarvest.harvest_date).split("T")[0]
    : ""
}
  onChange={handleEditInputChange}
/>
<br /><br />

<input
  type="number"
  name="yield_kg"
  value={editHarvest?.yield_kg || ""}
  onChange={handleEditInputChange}
/>

<br /><br />

<select
  name="quality_grade"
  value={editHarvest?.quality_grade || "Premium"}
  onChange={handleEditInputChange}
  style={selectStyle}
>
  <option style={optionStyle}>Premium</option>
  <option style={optionStyle}>Standard</option>
  <option style={optionStyle}>Economy</option>
</select>

<br /><br />

<select
  name="status"
  value={editHarvest?.status || "Harvested"}
  onChange={handleEditInputChange}
  style={selectStyle}
>
  <option style={optionStyle}>Harvested</option>
  <option style={optionStyle}>Processing</option>
  <option style={optionStyle}>Completed</option>
</select>

<br /><br />

<button onClick={handleUpdateHarvest}>
  Update Harvest
</button>

<button
  onClick={() => setShowEditModal(false)}
>
  Cancel
</button>
    </div>
    </div>

  )}
  </div>  
  );
}