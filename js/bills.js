// function fetchBillSummary(month) {
//     const year = new Date().getFullYear();

//     console.log(localStorage.getItem("token"));
//     fetch(`http://127.0.0.1:8000/bills/summary/${year}/${month}/`, {
//         method: "GET",
//         headers: {
//             "Authorization": `Token ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json"
//         }
//     })
//         .then(response => {
//             if (response.status === 403) {
//                 throw new Error("Access denied. Please log in.");
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (!data || !data.fixed_bills || !data.meal_bills) {
//                 throw new Error("No bill data available.");
//             }

//             const fixedBills = data.fixed_bills;
//             let fixedBillHtml = "<h5 class='fw-bold'>Fixed Bills:</h5>";
//             fixedBillHtml += `<p>Mess Rent: ${fixedBills.mess_rent} TK</p>`;
//             fixedBillHtml += `<p>Water Bill: ${fixedBills.water} TK</p>`;
//             fixedBillHtml += `<p>Khala Bill: ${fixedBills.khala} TK</p>`;
//             fixedBillHtml += `<p>Net Bill: ${fixedBills.net} TK</p>`;
//             fixedBillHtml += `<p>Current Bill: ${fixedBills.current} TK</p>`;
//             fixedBillHtml += `<p>Other: ${fixedBills.other} TK</p>`;
//             fixedBillHtml += "<hr>";

//             const mealData = data.meal_bills;
//             let mealBreakdownHtml = "<h5 class='fw-bold'>Meal Breakdown:</h5>";
//             Object.entries(mealData.meals).forEach(([mealType, quantity]) => {
//                 mealBreakdownHtml += `<p>${mealType}: ${quantity} times</p>`;
//             });
//             mealBreakdownHtml += `<p class='fw-bold'>Meal Total: ${mealData.total} TK</p>`;
//             mealBreakdownHtml += "<hr>";

//             let totalAmount = data.total_bill;
//             let billDetailsHtml = `
//                 ${fixedBillHtml}
//                 ${mealBreakdownHtml}
//                 <h5 class="text-primary fw-bold">Total Bill: ${totalAmount} TK</h5>
//             `;

//             document.getElementById("flowers-container").innerHTML = billDetailsHtml;
//             document.querySelector(".total-amount").innerText = `${totalAmount} TK`;
//         })
//         .catch(error => {
//             console.error("Error fetching bill data:", error.message);
//             document.getElementById("flowers-container").innerHTML = `<p class='text-danger'>${error.message}</p>`;
//         });
// }

// fetchBillSummary(new Date().getMonth() + 1);

// document.getElementById("month-select").addEventListener("change", function() {
//     const selectedMonth = this.value;
//     fetchBillSummary(selectedMonth);
// });

// function fetchBillSummary(month) {
//     const year = new Date().getFullYear();

//     console.log(localStorage.getItem("token"));
//     fetch(`http://127.0.0.1:8000/bills/summary/${year}/${month}/`, {
//         method: "GET",
//         headers: {
//             "Authorization": `Token ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json"
//         }
//     })
//         .then(response => {
//             if (response.status === 403) {
//                 throw new Error("Access denied. Please log in.");
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (!data || !data.fixed_bills || !data.meal_bills) {
//                 throw new Error("No bill data available.");
//             }

//             const fixedBills = data.fixed_bills;
//             let fixedBillHtml = "<h5 class='fw-bold'>Fixed Bills:</h5>";
//             fixedBillHtml += `<p>Mess Rent: ${fixedBills.mess_rent} TK</p>`;
//             fixedBillHtml += `<p>Water Bill: ${fixedBills.water} TK</p>`;
//             fixedBillHtml += `<p>Khala Bill: ${fixedBills.khala} TK</p>`;
//             fixedBillHtml += `<p>Net Bill: ${fixedBills.net} TK</p>`;
//             fixedBillHtml += `<p>Current Bill: ${fixedBills.current} TK</p>`;
//             fixedBillHtml += `<p>Other: ${fixedBills.other} TK</p>`;
//             fixedBillHtml += "<hr>";

//             const mealData = data.meal_bills;
//             let mealBreakdownHtml = "<h5 class='fw-bold'>Meal Breakdown:</h5>";
//             Object.entries(mealData.meals).forEach(([mealType, quantity]) => {
//                 mealBreakdownHtml += `<p>${mealType}: ${quantity} times</p>`;
//             });
//             mealBreakdownHtml += `<p class='fw-bold'>Meal Total: ${mealData.total} TK</p>`;
//             mealBreakdownHtml += "<hr>";

//             let totalAmount = data.total_bill;
//             let billDetailsHtml = `
//                 ${fixedBillHtml}
//                 ${mealBreakdownHtml}
//                 <h5 class="text-primary fw-bold">Total Bill: ${totalAmount} TK</h5>
//             `;

//             document.getElementById("flowers-container").innerHTML = billDetailsHtml;
//             document.querySelector(".total-amount").innerText = `${totalAmount} TK`;
//         })
//         .catch(error => {
//             console.error("Error fetching bill data:", error.message);
//             document.getElementById("flowers-container").innerHTML = `<p class='text-danger'>${error.message}</p>`;
//         });
// }

// fetchBillSummary(new Date().getMonth() + 1);

// document.getElementById("month-select").addEventListener("change", function() {
//     const selectedMonth = this.value;
//     fetchBillSummary(selectedMonth);
// });

// document.getElementById("pay-now").addEventListener("click", function() {
//     const billId = new URLSearchParams(window.location.search).get("bill_id") || localStorage.getItem("billId");
//     const token = localStorage.getItem("token");

//     if (!billId) {
//         alert("No bill ID found. Please try again.");
//         return;
//     }

//     const paymentApiUrl = "http://127.0.0.1:8000/api/payment/initiate/";

//     fetch(paymentApiUrl, {
//         method: "POST",
//         headers: {
//             'Authorization': `Token ${token}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             bill_id: billId
//         }),
//     })
//     .then((response) => {
//         if (!response.ok) {
//             throw new Error("Failed to initiate payment");
//         }
//         return response.json();
//     })
//     .then((data) => {
//         const paymentUrl = data.payment_url;
//         if (paymentUrl) {
//             alert("Redirecting to payment gateway...");
//             window.location.href = paymentUrl;
//         } else {
//             throw new Error("Payment URL not found");
//         }
//     })
//     .catch((error) => {
//         console.error("Error initiating payment:", error);
//         alert("Failed to initiate payment. Please try again later.");
//     });
// });


function fetchBillSummary(month) {
    const year = new Date().getFullYear();
    console.log(localStorage.getItem("token"));
    fetch(`https://mess-management-system-omega.vercel.app/bills/summary/${year}/${month}/`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (response.status === 403) {
                throw new Error("Access denied. Please log in.");
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.fixed_bills || !data.meal_bills) {
                throw new Error("No bill data available.");
            }

            const fixedBills = data.fixed_bills;
            let fixedBillHtml = "<h5 class='fw-bold'>Fixed Bills:</h5>";
            fixedBillHtml += `<p>Mess Rent: ${fixedBills.mess_rent} TK</p>`;
            fixedBillHtml += `<p>Water Bill: ${fixedBills.water} TK</p>`;
            fixedBillHtml += `<p>Khala Bill: ${fixedBills.khala} TK</p>`;
            fixedBillHtml += `<p>Net Bill: ${fixedBills.net} TK</p>`;
            fixedBillHtml += `<p>Current Bill: ${fixedBills.current} TK</p>`;
            fixedBillHtml += `<p>Other: ${fixedBills.other} TK</p>`;
            fixedBillHtml += "<hr>";

            const mealData = data.meal_bills;
            let mealBreakdownHtml = "<h5 class='fw-bold'>Meal Breakdown:</h5>";
            Object.entries(mealData.meals).forEach(([mealType, quantity]) => {
                mealBreakdownHtml += `<p>${mealType}: ${quantity} times</p>`;
            });
            mealBreakdownHtml += `<p class='fw-bold'>Meal Total: ${mealData.total} TK</p>`;
            mealBreakdownHtml += "<hr>";

            let totalAmount = data.total_bill;
            let billDetailsHtml = `
                ${fixedBillHtml}
                ${mealBreakdownHtml}
                <h5 class="text-dark fw-bold">Total Bill: ${totalAmount} TK</h5>
            `;
            document.getElementById("flowers-container").innerHTML = billDetailsHtml;
            document.querySelector(".total-amount").innerText = `${totalAmount} TK`;
            if (data.bill_id) {
                localStorage.setItem("billId", data.bill_id);
            }
        })
        .catch(error => {
            console.error("Error fetching bill data:", error.message);
            document.getElementById("flowers-container").innerHTML = `<p class='text-danger'>${error.message}</p>`;
        });
}
fetchBillSummary(new Date().getMonth() + 1);

document.getElementById("month-select").addEventListener("change", function() {
    const selectedMonth = this.value;
    fetchBillSummary(selectedMonth);
});

document.getElementById("pay-now").addEventListener("click", function() {
    const billId = localStorage.getItem("billId");
    const token = localStorage.getItem("token");

    if (!billId) {
        alert("No bill ID found. Please try again.");
        return;
    }

    const paymentApiUrl = "https://mess-management-system-omega.vercel.app/api/payment/initiate/";
    fetch(paymentApiUrl, {
        method: "POST",
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bill_id: billId
        }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to initiate payment");
        }
        return response.json();
    })
    .then((data) => {
        const paymentUrl = data.payment_url;
        if (paymentUrl) {
            alert("Redirecting to payment gateway...");
            window.location.href = paymentUrl;
        } else {
            throw new Error("Payment URL not found");
        }
    })
    .catch((error) => {
        console.error("Error initiating payment:", error);
        alert("Failed to initiate payment. Please try again later.");
    });
});
