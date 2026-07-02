async function loadSubscriptions() {

    try {

        const response = await fetch("/api/subscription-details");
        const subscriptions = await response.json();

        console.log(subscriptions);

        const tbody = document.getElementById("subscriptionTable");

        tbody.innerHTML = "";

        subscriptions.forEach(sub => {

         tbody.innerHTML += `
<tr>
    <td>${sub.id}</td>
    <td>${sub.product_name}</td>
    <td>${sub.variety_name}</td>
    <td>${sub.frequency}</td>

<td>
${
sub.status === "cancelled"
?
`Cancelled`
:
`
<select id="frequency-${sub.id}">
    <option value="Monthly"
        ${sub.frequency === "Monthly" ? "selected" : ""}>
        Monthly
    </option>

    <option value="Every 2 Months"
        ${sub.frequency === "Every 2 Months" ? "selected" : ""}>
        Every 2 Months
    </option>
</select>

<button onclick="updateFrequency(${sub.id})">
    Update
</button>
`
}
</td>
   <td>
${
sub.status === "cancelled"
?
sub.quantity
:
`
<input
type="number"
id="quantity-${sub.id}"
value="${sub.quantity}"
min="1"
style="width:60px;"
>
`
}
</td>

<td>
${
sub.status === "cancelled"
?
"Cancelled"
:
`
<button onclick="updateQuantity(${sub.id}, ${sub.price})">
Update Qty
</button>
`
}
</td>
    <td>₹${sub.price}</td>
    <td>${sub.next_delivery.substring(0,10)}</td>
   <td>
${
sub.status === "cancelled"
?
"Cancelled"
:
`
<button onclick="skipDelivery(${sub.id})">
Skip
</button>
`
}
</td>
    <td>${sub.stock_quantity}</td>
    <td>
${
sub.status === "active"
?
`<span class="status active">Active</span>`
:
sub.status === "paused"
?
`<span class="status paused">Paused</span>`
:
`<span class="status cancelled">Cancelled</span>`
}
</td>
    <td>
${
sub.status === "active"
?
`
<button onclick="pauseSubscription(${sub.id})">
Pause
</button>

<button onclick="cancelSubscription(${sub.id})">
Cancel
</button>
`
:
sub.status === "paused"
?
`
<button onclick="resumeSubscription(${sub.id})">
Resume
</button>

<button onclick="cancelSubscription(${sub.id})">
Cancel
</button>
`
:
`
Cancelled
`
}
</td>
</tr>
`;
        });

    }
    catch(err){

        console.error(err);

    }

}

loadSubscriptions();

async function pauseSubscription(id){

    try{

        const response = await fetch(
            "/api/subscriptions/pause",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    id:id
                })
            }
        );

        const result = await response.json();

        if(response.ok && result.success){

    alert("Subscription Paused Successfully");

    loadSubscriptions();

}else{

    alert("Pause Failed");

}
    }catch(err){

        console.error(err);

        alert("Server Error");

    }

}
async function resumeSubscription(id){

    try{

        const response = await fetch(
            "/api/subscriptions/resume",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    id:id
                })
            }
        );

        const result = await response.json();

        if(response.ok && result.success){

            alert("Subscription Resumed Successfully");

            loadSubscriptions();

        }else{

            alert("Resume Failed");

        }

    }catch(err){

        console.error(err);

        alert("Server Error");

    }

}

async function updateQuantity(id, currentPrice){

    const quantity = Number(
        document.getElementById(`quantity-${id}`).value
    );

    const unitPrice = currentPrice / 1;

    const newPrice = unitPrice * quantity;

    try{

        const response = await fetch(
            "/api/subscriptions/update-quantity",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    id:id,

                    quantity:quantity,

                    price:newPrice

                })
            }
        );

        const result = await response.json();

        if(response.ok && result.success){

            alert("Quantity Updated Successfully");

            loadSubscriptions();

        }else{

            alert("Update Failed");

        }

    }catch(err){

        console.error(err);

        alert("Server Error");

    }

}

async function skipDelivery(id){

    try{

        const response = await fetch(
            "/api/subscriptions/skip",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    id:id
                })
            }
        );

        const result = await response.json();

        if(response.ok && result.success){

            alert("Next Delivery Skipped Successfully");

            loadSubscriptions();

        }else{

            alert("Skip Failed");

        }

    }catch(err){

        console.error(err);

        alert("Server Error");

    }

}

async function updateFrequency(id){

    const frequency = document.getElementById(`frequency-${id}`).value;

    try{

        const response = await fetch(
            "/api/subscriptions/update-frequency",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    id:id,
                    frequency:frequency
                })
            }
        );

        const result = await response.json();

        if(response.ok && result.success){

            alert("Frequency Updated Successfully");

            loadSubscriptions();

        }else{

            alert("Update Failed");

        }

    }catch(err){

        console.error(err);

        alert("Server Error");

    }

}

async function cancelSubscription(id){

    const confirmCancel = confirm(
        "Are you sure you want to cancel this subscription?"
    );

    if(!confirmCancel){
        return;
    }

    try{

        const response = await fetch(
            "/api/subscriptions/cancel",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    id:id
                })
            }
        );

        const result = await response.json();

        if(response.ok && result.success){

            alert("Subscription Cancelled Successfully");

            loadSubscriptions();

        }else{

            alert("Cancel Failed");

        }

    }catch(err){

        console.error(err);

        alert("Server Error");

    }

}