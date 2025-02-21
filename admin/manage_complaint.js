document.addEventListener("DOMContentLoaded", function () {
    fetchAllComplaints();
});

function fetchAllComplaints(status = "") {
    let url = "https://mess-management-system-omega.vercel.app/complaints/admin/";
    if (status) {
        url += `?status=${status}`;
    }

    fetch(url, {
        headers: {
            "Authorization": `Token ${localStorage.getItem("token")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        let complaintTableBody = document.getElementById("admin-complaint-list");
        complaintTableBody.innerHTML = "";
        
        if (data.results.length === 0) {
            complaintTableBody.innerHTML = "<tr><td colspan='6' class='text-center'>No complaints found.</td></tr>";
            return;
        }

        data.results.forEach(complaint => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${complaint.id}</td>
                <td>${complaint.user || "N/A"}</td>
                <td>${complaint.category}</td>
                <td>${complaint.description}</td>
                <td>
                    <span class="badge ${complaint.status === 'resolved' ? 'bg-success' : 'bg-warning'}">
                        ${complaint.status}
                    </span>
                </td>
                <td>
                    ${complaint.status === 'pending' ? `
                        <input type="text" id="reply-${complaint.id}" placeholder="Enter reply" class="form-control mb-2">
                        <button class="btn btn-success btn-sm" onclick="resolveComplaint(${complaint.id})">Resolve</button>
                    ` : `<small>${complaint.admin_reply}</small>`}
                </td>
            `;
            complaintTableBody.appendChild(row);
        });
    })
    .catch(error => console.error("Error fetching complaints:", error));
}

function resolveComplaint(complaintId) {
    let replyMessage = document.getElementById(`reply-${complaintId}`).value.trim();
    if (!replyMessage) {
        alert("Admin reply is required to resolve the complaint.");
        return;
    }

    fetch(`https://mess-management-system-omega.vercel.app/complaints/admin/resolve/${complaintId}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ admin_reply: replyMessage })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchAllComplaints();
    })
    .catch(error => console.error("Error resolving complaint:", error));
}
