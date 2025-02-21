const API_BASE_URL = "https://mess-management-system-omega.vercel.app/";
let usersData = {};
async function fetchUsernames() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const users = await response.json();
        const nameDropdown = document.getElementById("name");
        nameDropdown.innerHTML = `<option value="" disabled selected>Select a user</option>`;

        users.forEach(user => {
            usersData[user.username] = user;
            const option = document.createElement("option");
            option.value = user.username;
            option.textContent = user.username;
            nameDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}
document.getElementById("name").addEventListener("change", function() {
    const selectedUser = this.value;
    const phoneInput = document.getElementById("phone");

    if (selectedUser && usersData[selectedUser]) {
        phoneInput.value = usersData[selectedUser].contact_number || "";
    } else {
        phoneInput.value = "";
    }
});

async function fetchBazarSchedules() {
    try {
        const response = await fetch(`${API_BASE_URL}/meals/bazar-schedule/view/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch schedules");
        }
        const schedules = await response.json();
        const tableBody = document.getElementById("bazarScheduleTable");
        tableBody.innerHTML = "";
        if (schedules.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No schedules available</td></tr>`;
            return;
        }
        schedules.forEach(schedule => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${schedule.name}</td>
                <td>${schedule.mobile_number}</td>
                <td>${schedule.schedule_date}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching schedules:", error);
        document.getElementById("bazarScheduleTable").innerHTML = `<tr><td colspan="3" class="text-danger text-center">Error loading schedules</td></tr>`;
    }
}

document.getElementById("bazarScheduleForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value.trim();
    const date = document.getElementById("date").value;

    if (!name || !phone || !date) {
        document.getElementById("error-message").innerText = "All fields are required!";
        document.getElementById("error-message").style.display = "block";
        return;
    }

    const scheduleData = {
        name: name,
        mobile_number: phone,
        schedule_date: date
    };

    try {
        const response = await fetch(`${API_BASE_URL}/meals/bazar-schedule/create/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(scheduleData)
        });

        if (!response.ok) {
            throw new Error("Failed to add schedule");
        }
        document.getElementById("success-message").innerText = "Bazar schedule added successfully!";
        document.getElementById("success-message").style.display = "block";
        document.getElementById("bazarScheduleForm").reset();
        setTimeout(() => {
            document.getElementById("success-message").style.display = "none";
        }, 3000);
        fetchBazarSchedules();
    } catch (error) {
        console.error("Error adding schedule:", error);
        document.getElementById("error-message").innerText = "Failed to add schedule!";
        document.getElementById("error-message").style.display = "block";
        setTimeout(() => {
            document.getElementById("error-message").style.display = "none";
        }, 3000);
    }
});

fetchBazarSchedules();
fetchUsernames();
