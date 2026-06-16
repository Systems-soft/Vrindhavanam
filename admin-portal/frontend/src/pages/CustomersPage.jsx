import { useEffect, useState } from "react";

export default function CustomersPage() {

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
const [showModal, setShowModal] = useState(false);
const [customerOrders, setCustomerOrders] = useState([]);

const closeModal = () => {
  setShowModal(false);
  setSelectedCustomer(null);
  setCustomerOrders([]);
};
const handleViewCustomer = async (customerId) => {
  try {

    const response = await fetch(
      `http://localhost:5005/api/admin/customers/${customerId}`
    );

    const data = await response.json();

    setSelectedCustomer(data.customer);
    setCustomerOrders(data.orders);

    setShowModal(true);

  } catch (err) {

    console.error(err);

  }
};
  useEffect(() => {

    fetch("http://localhost:5005/api/admin/customers")
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error(err));

  }, []);

  return (

   <div
  style={{
    width: "100%",
   overflowX: "auto",
  }}
>

      <h2>Customers</h2>
<table
  border="1"
  cellPadding="10"
  style={{
    width: "100%",
    minWidth: "1400px",
    borderCollapse: "collapse",
    tableLayout: "fixed"
  }}
>
<thead>
  <tr>
    <th style={{ width: "50px" }}>ID</th>
    <th style={{ width: "150px" }}>Name</th>
    <th style={{ width: "250px" }}>Email</th>
    <th style={{ width: "130px" }}>Phone</th>
    <th style={{ width: "100px" }}>Date</th>
    <th style={{ width: "80px" }}>Orders</th>
    <th style={{ width: "100px" }}>Actions</th>
  </tr>
</thead>

        <tbody>

          {customers.map(customer => (

            <tr key={customer.id}>

              <td>{customer.id}</td>

              <td>
                {customer.first_name} {customer.last_name}
              </td>

              <td>{customer.email}</td>

              <td>{customer.phone}</td>
<td>{new Date(customer.created_at).toLocaleDateString()}</td>
<td>{customer.orders_count}</td>
              
<td>
  <button
    onClick={() => handleViewCustomer(customer.id)}
    style={{
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#2e7d32",
    color: "#fff",
    cursor: "pointer",
    marginTop: "20px"
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
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
    onClick={closeModal}
  >

    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#0f1c12",
        color: "#fff",
        padding: "24px",
        borderRadius: "12px",
        width: "700px",
        maxHeight: "80vh",
        overflowY: "auto"
      }}
    >

      <h2>
        {selectedCustomer?.first_name}
        {" "}
        {selectedCustomer?.last_name}
      </h2>

      <p>
        <strong>Email:</strong>
        {" "}
        {selectedCustomer?.email}
      </p>

      <p>
        <strong>Phone:</strong>
        {" "}
        {selectedCustomer?.phone}
      </p>

      <p>
        <strong>Address:</strong>
        {" "}
        {selectedCustomer?.address}
      </p>

      <hr />
<h3>Orders</h3>

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
      <th>Total</th>
      <th>Status</th>
      <th>Date</th>
    </tr>
  </thead>

  <tbody>
    {customerOrders.length === 0 ? (
      <tr>
        <td colSpan="4">
          No orders found
        </td>
      </tr>
    ) : (
      customerOrders.map(order => (
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>
  ₹{Number(order.total_amount).toFixed(2)}
</td>
          <td>{order.status}</td>
          <td>
  {new Date(order.placed_at).toLocaleString()}
</td>

        </tr>
      ))
    )}
  </tbody>
</table>

      <button
        onClick={closeModal}
  style={{
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#2e7d32",
    color: "#fff",
    cursor: "pointer"
  }}
>
  Close
</button>

    </div>

  </div>
)}

    </div>

  );

}