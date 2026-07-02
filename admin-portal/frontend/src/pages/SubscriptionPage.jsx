import React, { useEffect, useState } from "react";

const SubscriptionPage = () => {

  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const totalSubscriptions = subscriptions.length;

const activeSubscriptions =
    subscriptions.filter(sub => sub.status === "active").length;

const pausedSubscriptions =
    subscriptions.filter(sub => sub.status === "paused").length;

const cancelledSubscriptions =
    subscriptions.filter(sub => sub.status === "cancelled").length;

  const loadSubscriptions = () => {
    setLoading(true);

    fetch("http://localhost:5005/api/admin/subscriptions")
        .then(res => res.json())
       .then(data => {

    console.log(data);

    setSubscriptions(data);

    setLoading(false);

})
        .catch(err => {

    console.error(err);

    setLoading(false);

});

};

const pauseSubscription = async (id) => {

    try {

        const response = await fetch(
            "http://localhost:5005/api/subscriptions/pause",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            }
        );

        const result = await response.json();

        if (response.ok && result.success) {

            alert("Subscription Paused");

            loadSubscriptions();

        }

    } catch (err) {

        console.error(err);

    }

};

const resumeSubscription = async (id) => {

    try {

        const response = await fetch(
            "http://localhost:5005/api/subscriptions/resume",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            }
        );

        const result = await response.json();

        if (response.ok && result.success) {

            alert("Subscription Resumed");

            loadSubscriptions();

        }

    } catch (err) {

        console.error(err);

    }

};

const cancelSubscription = async (id) => {

    if (!window.confirm("Cancel this subscription?")) return;

    try {

        const response = await fetch(
            "http://localhost:5005/api/subscriptions/cancel",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            }
        );

        const result = await response.json();

        if (response.ok && result.success) {

            alert("Subscription Cancelled");

            loadSubscriptions();

        }

    } catch (err) {

        console.error(err);

    }

};

const updateFrequency = async (id) => {

    const frequency =
        document.getElementById(`frequency-${id}`).value;

    try {

        const response = await fetch(
            "http://localhost:5005/api/subscriptions/update-frequency",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    id,
                    frequency
                })
            }
        );

        const result = await response.json();

        if (response.ok && result.success) {

            alert("Frequency Updated");

            loadSubscriptions();

        }

    } catch (err) {

        console.error(err);

    }

};

const updateQuantity = async (id, currentPrice, oldQuantity) => {

    const quantity = Number(
        document.getElementById(`quantity-${id}`).value
    );

    const unitPrice = currentPrice / oldQuantity;

    const newPrice = unitPrice * quantity;

    try {

        const response = await fetch(
            "http://localhost:5005/api/subscriptions/update-quantity",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    id,
                    quantity,
                    price: newPrice
                })
            }
        );

        const result = await response.json();

        if(response.ok && result.success){

            alert("Quantity Updated");

            loadSubscriptions();

        }

    } catch(err){

        console.error(err);

    }

};

async function skipDelivery(id){

    const confirmSkip = window.confirm(
        "Are you sure you want to skip the next delivery?"
    );

    if(!confirmSkip){
        return;
    }

    try{
        const response = await fetch(
            "http://localhost:5005/api/subscriptions/skip",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    id
                })
            }
        );

        const result = await response.json();

        if(response.ok && result.success){

            alert("Next delivery skipped.");

            loadSubscriptions();

        }else{

            alert("Skip failed.");

        }

    }catch(err){

        console.error(err);

        alert("Server Error");

    }

};


  useEffect(() => {

    loadSubscriptions();

}, []);

if (loading) {

    return (

        <div className="p-6">

            <h2 className="text-xl font-semibold">
                Loading subscriptions...
            </h2>

        </div>

    );

}

const filteredSubscriptions = subscriptions.filter(sub =>
(
    sub.first_name.toLowerCase().includes(search.toLowerCase()) ||
    sub.last_name.toLowerCase().includes(search.toLowerCase()) ||
    sub.email.toLowerCase().includes(search.toLowerCase()) ||
    sub.product_name.toLowerCase().includes(search.toLowerCase())
)
&&
(
    statusFilter === "All" ||
    sub.status === statusFilter.toLowerCase()
)
);
   return (

<div className="p-6">

<h1 className="text-3xl font-bold mb-6">
Subscription Management
</h1>

<div className="grid grid-cols-4 gap-4 mb-6">

    <div className="bg-blue-500 text-white rounded-lg p-4 shadow">
        <h3 className="text-sm">Total</h3>
        <p className="text-2xl font-bold">
            {totalSubscriptions}
        </p>
    </div>

    <div className="bg-green-500 text-white rounded-lg p-4 shadow">
        <h3 className="text-sm">Active</h3>
        <p className="text-2xl font-bold">
            {activeSubscriptions}
        </p>
    </div>

    <div className="bg-yellow-500 text-black rounded-lg p-4 shadow">
        <h3 className="text-sm">Paused</h3>
        <p className="text-2xl font-bold">
            {pausedSubscriptions}
        </p>
    </div>

    <div className="bg-red-500 text-white rounded-lg p-4 shadow">
        <h3 className="text-sm">Cancelled</h3>
        <p className="text-2xl font-bold">
            {cancelledSubscriptions}
        </p>
    </div>

</div>

<input
    type="text"
    placeholder="Search customer or email..."
    value={search}
    onChange={(e)=>setSearch(e.target.value)}
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
    <option style={{ background: "#0f1d13", color: "#eff6eb" }}>All</option>
    <option style={{ background: "#0f1d13", color: "#eff6eb" }}>Active</option>
    <option style={{ background: "#0f1d13", color: "#eff6eb" }}>Paused</option>
    <option style={{ background: "#0f1d13", color: "#eff6eb" }}>Cancelled</option>
</select>

<table className="min-w-full border border-gray-300">

<thead className="bg-gray-200">

<tr>

<th>ID</th>
<th>Customer</th>
<th>Email</th>
<th>Product</th>
<th>Variant</th>
<th>Frequency</th>
<th>Quantity</th>
<th>Price</th>
<th>Next Delivery</th>
<th>Status</th>
<th>Actions</th>
<th>Update Qty</th>
<th>Skip Delivery</th>

</tr>

</thead>

<tbody>
{
    filteredSubscriptions.length === 0
    ?
    (
        <tr>
            <td colSpan="13" className="text-center py-6">
                No subscriptions found.
            </td>
        </tr>
    )
    :
    (
        filteredSubscriptions.map(sub => (
            <tr key={sub.id}>

                <td>{sub.id}</td>

                <td>{sub.first_name} {sub.last_name}</td>

                <td>{sub.email}</td>

                <td>{sub.product_name}</td>

                <td>{sub.variety_name}</td>

                {/* Frequency */}

                <td>
                {
                    sub.status === "cancelled"
                    ?
                    (
                        <span>{sub.frequency}</span>
                    )
                    :
                    (
                        <>
                            <select
                                id={`frequency-${sub.id}`}
                                defaultValue={sub.frequency}
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Every 2 Months">Every 2 Months</option>
                            </select>

                            <button
                                onClick={() => updateFrequency(sub.id)}
                            >
                                Update
                            </button>
                        </>
                    )
                }
                </td>

                {/* Quantity */}

                <td>
                {
                    sub.status === "cancelled"
                    ?
                    (
                        <span>{sub.quantity}</span>
                    )
                    :
                    (
                        <input
                            type="number"
                            id={`quantity-${sub.id}`}
                            defaultValue={sub.quantity}
                            min="1"
                            style={{ width: "70px" }}
                        />
                    )
                }
                </td>

                <td>₹{Number(sub.price).toFixed(2)}</td>

                <td>
                    {new Date(sub.next_delivery).toLocaleDateString("en-IN")}
                </td>

                {/* Status */}

                <td>
                {
                    sub.status === "active"
                    ?
                    <span className="status active">Active</span>
                    :
                    sub.status === "paused"
                    ?
                    <span className="status paused">Paused</span>
                    :
                    <span className="status cancelled">Cancelled</span>
                }
                </td>

                {/* Actions */}

                <td>
                {
                    sub.status === "active"
                    ?
                    <>
                        <button onClick={() => pauseSubscription(sub.id)}>
                            Pause
                        </button>

                        <button onClick={() => cancelSubscription(sub.id)}>
                            Cancel
                        </button>
                    </>
                    :
                    sub.status === "paused"
                    ?
                    <>
                        <button onClick={() => resumeSubscription(sub.id)}>
                            Resume
                        </button>

                        <button onClick={() => cancelSubscription(sub.id)}>
                            Cancel
                        </button>
                    </>
                    :
                    <span>Cancelled</span>
                }
                </td>

                {/* Update Quantity */}

                <td>
                {
                    sub.status === "cancelled"
                    ?
                    (
                        <span>Cancelled</span>
                    )
                    :
                    (
                        <button
                            onClick={() => updateQuantity(sub.id, sub.price, sub.quantity)}
                        >
                            Update
                        </button>
                    )
                }
                </td>

                {/* Skip */}

                <td>
                {
                    sub.status === "cancelled"
                    ?
                    (
                        <span>Cancelled</span>
                    )
                    :
                    (
                        <button
                            onClick={() => skipDelivery(sub.id)}
                        >
                            Skip
                        </button>
                    )
                }
                </td>

            </tr>
        ))
    )
}
</tbody>
</table>

</div>

);
};

export default SubscriptionPage;