import { useEffect, useState } from "react";

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

export default function BatchPage() {

  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
const [editBatch, setEditBatch] = useState(null);
  const [newBatch, setNewBatch] = useState({
batch_number: "",
  harvest_id: "",
  quantity_kg: "",
  packaging_date: "",
  processing_status: "Pending"

});

  useEffect(() => {

    fetch(
      "http://localhost:5005/api/admin/batches"
    )
      .then((res) => res.json())
      .then((data) => {
  setBatches(data);
})
      .catch(console.error);

  }, []);
const filteredBatches = batches.filter((batch) => {


   const matchesSearch =
  batch.batch_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  batch.crop_type?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
  statusFilter === "All" ||
  batch.processing_status === statusFilter;

return matchesSearch && matchesStatus;
});
const totalBatches = batches.length;

const totalQuantity = batches.reduce(
  (sum, h) => sum + Number(h.quantity_kg || 0),
  0
);

const handleSaveBatch = async () => {
  if (
  !newBatch.batch_number ||
  !newBatch.harvest_id ||
  !newBatch.quantity_kg ||
  !newBatch.packaging_date
)
 {
  alert("Fill all fields");
  return;
}

  try {

    const response = await fetch(
      "http://localhost:5005/api/admin/batches",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newBatch)
      }
    );

    const result = await response.json();

if (response.ok) {
  alert("Batch Added Successfully");
} else {
  alert(result.error);
  return;
}
    console.log(result);

    // reload harvest list

    const updated = await fetch(
      "http://localhost:5005/api/admin/batches"
    );

    const data = await updated.json();

    setBatches(data);

    // close modal

    setShowAddModal(false);

    // clear form

    setNewBatch({
  batch_number: "",
  harvest_id: "",
  quantity_kg: "",
  packaging_date: "",
  processing_status: "Pending"
});

  } catch(err) {

    console.error(err);

  }

};

const handleEditBatch = (batch) => {

  setEditBatch(batch);

  setShowEditModal(true);

};

const handleViewBatch = (batch) => {

  setSelectedBatch(batch);

  setShowModal(true);

};

const handleInputChange = (e) => {

  const { name, value } = e.target;

  setNewBatch({

    ...newBatch,

    [name]: value

  });

};
const handleEditInputChange = (e) => {

  const { name, value } = e.target;

  setEditBatch({

    ...editBatch,

    [name]: value

  });

};


const handleUpdateBatch = async () => {
  if (
  !editBatch.batch_number ||
  !editBatch.harvest_id ||
  !editBatch.quantity_kg ||
  !editBatch.packaging_date
)
   {
  alert("Fill all fields");
  return;
}

  try {

    const response = await fetch(
  `http://localhost:5005/api/admin/batches/${editBatch.id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(editBatch)
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
      "http://localhost:5005/api/admin/batches"
    );

    const data = await updated.json();

    setBatches(data);

    setShowEditModal(false);

    alert("Batch Updated Successfully");

  } catch(err) {

    console.error(err);

  }

};

const handleDeleteBatch = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this batch?"
  );

  if (!confirmDelete) return;

  try {

    const response = await fetch(
  `http://localhost:5005/api/admin/batches/${id}`,
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
      "http://localhost:5005/api/admin/batches"
    );

    const data = await updated.json();

    setBatches(data);

    alert("Batch Deleted Successfully");

  } catch(err) {

    console.error(err);

  }

};
  return (

    <div>
      <h2>Batch Management</h2>

<input
  type="text"
  placeholder="Search Batch Number or Crop..."
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
  <option value="Pending" style={{ background: "#0f1d13", color: "#eff6eb" }}>Pending</option>
  <option value="Drying" style={{ background: "#0f1d13", color: "#eff6eb" }}>Drying</option>
  <option value="Sorting" style={{ background: "#0f1d13", color: "#eff6eb" }}>Sorting</option>
  <option value="Packaging" style={{ background: "#0f1d13", color: "#eff6eb" }}>Packaging</option>
  <option value="Ready" style={{ background: "#0f1d13", color: "#eff6eb" }}>Ready</option>
</select>
     
      <div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "20px",
    marginBottom: "20px"
  }}
>
  <div>Total Batches: {totalBatches}</div>

  <div>Total Quantity: {totalQuantity} kg</div>

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
  Add Batch
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
<th>Crop</th>
<th>Quantity (kg)</th>
<th>Processing Status</th>
<th>Packaging Date</th>
<th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredBatches.map((b) => (

            <tr key={b.id}>

  <td>{b.id}</td>

  <td>{b.batch_number}</td>

  <td>{b.crop_type}</td>

  <td>{b.quantity_kg}</td>

  <td>{b.processing_status}</td>

  <td>
    {b.packaging_date
      ? new Date(b.packaging_date).toLocaleDateString()
      : "-"}
  </td>
              <td>

  <button
    onClick={() => handleViewBatch(b)}
  >
    View
  </button>

  <button
    onClick={() => handleEditBatch(b)}
    style={{ marginLeft: "10px" }}
  >
    Edit
  </button>
<button
  onClick={() => handleDeleteBatch(b.id)}
  style={{ marginLeft: "10px" }}
>
  Delete
</button>

</td>

            </tr>

          ))}

        </tbody>

      </table>

{showModal && selectedBatch && (

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

      <h2>{selectedBatch.batch_number}</h2>

<p>
  Crop:
  {" "}
  {selectedBatch.crop_type}
</p>

<p>
  Quantity:
  {" "}
  {selectedBatch.quantity_kg}
  kg
</p>

<p>
  Processing Status:
  {" "}
  {selectedBatch.processing_status}
</p>

<p>
  Packaging Date:
  {" "}
  {selectedBatch.packaging_date
    ? new Date(
        selectedBatch.packaging_date
      ).toLocaleDateString()
    : "-"}
</p>

<p>
  Harvest Yield:
  {" "}
  {selectedBatch.yield_kg || "-"}
  kg
</p>

<p>
  Created:
  {" "}
  {selectedBatch.created_at
  ? new Date(selectedBatch.created_at).toLocaleString()
  : "-"}
</p>

<button
  onClick={() => setShowModal(false)}
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

      <h2>Add Batch</h2>
      <br /><br />

     <input
  type="text"
  name="batch_number"
  placeholder="Batch Number"
  value={newBatch.batch_number}
  onChange={handleInputChange}
/>

      <br /><br />

      <input
  type="number"
  name="harvest_id"
  placeholder="Harvest ID"
  value={newBatch.harvest_id}
  onChange={handleInputChange}
/>

      <br /><br />

      <input
  type="number"
  name="quantity_kg"
  placeholder="Quantity (kg)"
  value={newBatch.quantity_kg}
  onChange={handleInputChange}
/>

      <br /><br />

      <input
  type="date"
  name="packaging_date"
  value={newBatch.packaging_date}
  onChange={handleInputChange}
/>

<br /><br />

<select
  name="processing_status"
  value={newBatch.processing_status}
  onChange={handleInputChange}
  style={selectStyle}
>
  <option value="Pending" style={optionStyle}>Pending</option>
  <option value="Drying" style={optionStyle}>Drying</option>
  <option value="Sorting" style={optionStyle}>Sorting</option>
  <option value="Packaging" style={optionStyle}>Packaging</option>
  <option value="Ready" style={optionStyle}>Ready</option>
</select>

      <br /><br />

     <button
  onClick={handleSaveBatch}
>
  Save Batch
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
{showEditModal && editBatch && (

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
<h2>Edit Batch</h2>

<input
  type="text"
  name="batch_number"
  placeholder="Batch Number"
  value={editBatch?.batch_number || ""}
  onChange={handleEditInputChange}
/>

<br /><br />

<input
  type="number"
  name="harvest_id"
  placeholder="Harvest ID"
  value={editBatch?.harvest_id || ""}
  onChange={handleEditInputChange}
/>

<br /><br />

<input
  type="number"
  name="quantity_kg"
  placeholder="Quantity (kg)"
  value={editBatch?.quantity_kg || ""}
  onChange={handleEditInputChange}
/>

<br /><br />

<input
  type="date"
  name="packaging_date"
  value={
    editBatch?.packaging_date
      ? String(editBatch.packaging_date).split("T")[0]
      : ""
  }
  onChange={handleEditInputChange}
/>

<br /><br />

<select
  name="processing_status"
  value={editBatch?.processing_status || "Pending"}
  onChange={handleEditInputChange}
  style={selectStyle}
>
  <option style={optionStyle}>Pending</option>
  <option style={optionStyle}>Drying</option>
  <option style={optionStyle}>Sorting</option>
  <option style={optionStyle}>Packaging</option>
  <option style={optionStyle}>Ready</option>
</select>

<br /><br />

<button onClick={handleUpdateBatch}>
  Update Batch
</button>

<button
  onClick={() => setShowEditModal(false)}
>
  Cancel
</button>
<br /><br />
    </div>
    </div>

  )}
  </div>  
  );
}