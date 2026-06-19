import { useEffect, useState } from "react";

export default function OrdersPage() {
const [orders, setOrders] = useState([]);
const [selectedItems, setSelectedItems] = useState([]);
const [showModal, setShowModal] = useState(false);
const [loadingItems, setLoadingItems] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

const closeModal = () => {
  setShowModal(false);
  setSelectedItems([]);
  setSelectedOrder(null);
  setLoadingItems(false);
};

const updateStatus = async (orderId, status) => {
  try {
    const response = await fetch(
      `http://localhost:5005/api/admin/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status
        })
      }
    );

    const data = await response.json();

    console.log(data);
    alert("Order status updated successfully");
    setSelectedOrder(prev => ({
  ...prev,
  status
}));

setOrders(prev =>
  prev.map(order =>
    order.id === orderId
      ? { ...order, status }
      : order
  )
);

  } catch (err) {
    console.error(err);
  }
};
const handleViewOrder = async (orderId) => {
  setLoadingItems(true);
  setSelectedItems([]);
  setShowModal(true);

  try {
    const response = await fetch(
      `http://localhost:5005/api/admin/orders/${orderId}/items`
    );

    const data = await response.json();

    setSelectedItems(data);
} catch (err) {

  console.error(err);
  setSelectedItems([]);

}
   finally {

    setLoadingItems(false);

  }
};

  useEffect(() => {
    console.log("Fetching orders...");
    fetch("http://localhost:5005/api/admin/orders")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setOrders(data);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredOrders = orders.filter((order) => {

  const search = searchTerm.toLowerCase();

  const matchesSearch =
    String(order.id).includes(search) ||

    `${order.first_name} ${order.last_name}`
      .toLowerCase()
      .includes(search) ||

    (order.phone || "")
      .toLowerCase()
      .includes(search) ||

    (order.email || "")
      .toLowerCase()
      .includes(search);

  const matchesStatus =
    statusFilter === "All" ||
    order.status === statusFilter;

  return matchesSearch && matchesStatus;

});

  return (
    <div style={{ padding: "20px" }}>
      <h2>Orders Management</h2>

      <input
  type="text"
  placeholder="Search Order ID / Name / Phone / Email"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    padding: "8px",
    width: "350px",
    marginBottom: "15px"
  }}
/>
<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  style={{
    padding: "8px",
    marginLeft: "10px",
    marginBottom: "15px"
  }}
>
  <option value="All">All</option>
  <option value="Pending">Pending</option>
<option value="Confirmed">Confirmed</option>
<option value="Packed">Packed</option>
<option value="Shipped">Shipped</option>
<option value="Delivered">Delivered</option>
<option value="Cancelled">Cancelled</option>
<option value="Refunded">Refunded</option>
</select>

<div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "20px"
  }}
>
  <div>Total Orders: {orders.length}</div>

  <div>
    Pending: {
      orders.filter(o => o.status === "Pending").length
    }
  </div>

  <div>
    Shipped: {
      orders.filter(o => o.status === "Shipped").length
    }
  </div>

  <div>
    Delivered: {
      orders.filter(o => o.status === "Delivered").length
    }
  </div>

  <div>
    Cancelled: {
      orders.filter(o => o.status === "Cancelled").length
    }
  </div>
</div>
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
            <th>Order ID</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((order) => (
  <tr
    key={order.id}
    style={{
      transition: "0.2s"
    }}
  >
              <td>{order.id}</td>
              <td>
                {order.first_name} {order.last_name}
              </td>
              <td>{order.email}</td>
              <td>{order.phone}</td>
             <td>₹{Number(order.total_amount).toFixed(2)}</td>
              <td>{order.status}</td>
              <td>
                {new Date(order.placed_at).toLocaleString()}
              </td>
              <td>
  <button
  onClick={() => {
    setSelectedOrder(order);
    handleViewOrder(order.id);
  }}
  style={{
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  View
</button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
  <div
  onClick={closeModal}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >

   <div
  onClick={(e) => e.stopPropagation()}
  style={{
    background: "#0f1c12",
    color: "#fff",
    padding: "24px",
    borderRadius: "12px",
    width: "800px",
    maxHeight: "80vh",
    overflowY: "auto"
  }}
>

   <h3
  style={{
    color: "#4caf50",
    marginBottom: "15px"
  }}
>
  Order #{selectedOrder?.id}
</h3>

<p>
  <strong>Customer:</strong>{" "}
  {selectedOrder?.first_name} {selectedOrder?.last_name}
</p>

<p>
  <strong>Email:</strong>{" "}
  {selectedOrder?.email}
</p>

<p>
  <strong>Phone:</strong>{" "}
  {selectedOrder?.phone}
</p>

<p>
  <strong>Address:</strong>{" "}
  {selectedOrder?.address}
</p>

<p>
  <strong>Total:</strong>{" "}
 ₹{Number(selectedOrder?.total_amount || 0).toFixed(2)}
</p>

<p>
  <strong>Status:</strong>{" "}
  <span
    style={{
      color:
        selectedOrder?.status === "Pending"
          ? "#ffc107"
          : selectedOrder?.status === "Cancelled"
          ? "#f44336"
          : "#4caf50",
      fontWeight: "bold"
    }}
  >
    {selectedOrder?.status}
  </span>
</p>

<p>
  <strong>Placed At:</strong>{" "}
  {selectedOrder?.placed_at
    ? new Date(selectedOrder.placed_at).toLocaleString()
    : "-"}
</p>

<p>
  <strong>Update Order Status</strong>
</p>

<select
  value={selectedOrder?.status || ""}
  onChange={(e) => {
    updateStatus(
      selectedOrder.id,
      e.target.value
    );
  }}
  style={{
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "15px"
  }}
>
  <option value="Pending">Pending</option>
  <option value="Confirmed">Confirmed</option>
  <option value="Packed">Packed</option>
  <option value="Shipped">Shipped</option>
  <option value="Delivered">Delivered</option>
  <option value="Cancelled">Cancelled</option>
  <option value="Refunded">Refunded</option>
</select>

<hr />

<h3
  style={{
    color: "#4caf50",
    marginTop: "20px"
  }}
>
  Products
</h3>
     <table
  border="1"
  cellPadding="10"
  style={{
    width: "100%",
    borderCollapse: "collapse",
    color: "#fff"
  }}
>
        <thead>
         <tr>
  <th style={{ background: "#1b2d1f" }}>Product</th>
    <th style={{ background: "#1b2d1f" }}>Quantity</th>
    <th style={{ background: "#1b2d1f" }}>Unit Price</th>
    <th style={{ background: "#1b2d1f" }}>Total</th>
</tr>
        </thead>

        <tbody>
  {loadingItems ? (
    <tr>
      <td colSpan="4">Loading...</td>
    </tr>
  ) : selectedItems.length === 0 ? (
    <tr>
      <td colSpan="4">No products found</td>
    </tr>
  ) : (
    selectedItems.map(item => (
     <tr
  key={item.id}
  style={{
    borderBottom: "1px solid #2c3e2f"
  }}
>
  <td>{item.product_name}</td>
  <td>{item.quantity}</td>
  <td>
  ₹{Number(item.unit_price).toFixed(2)}
</td>
  <td>
    ₹{(
      Number(item.quantity) *
      Number(item.unit_price)
    ).toFixed(2)}
  </td>
</tr>
    ))
  )}
</tbody>
      </table>
<p>
  <strong>Total Items:</strong>{" "}
  {selectedItems.reduce(
    (sum, item) =>
      sum + Number(item.quantity),
    0
  )}
</p>

<p>
  <strong>Products Value:</strong>{" "}
  ₹
  {selectedItems
    .reduce(
      (sum, item) =>
        sum +
        Number(item.quantity) *
        Number(item.unit_price),
      0
    )
    .toFixed(2)}
</p>
<p>
  <strong>Order Total:</strong>{" "}
  ₹{Number(selectedOrder?.total_amount || 0).toFixed(2)}
</p>
    <div style={{ marginTop: "20px" }}>

      <button
  onClick={closeModal}
  style={{
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#2e7d32",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600"
  }}
>
  Close
</button>
</div>
    </div>

  </div>

)}
    </div>
  );
}