function loadAllUsers() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  fetch("https://mess-management-system-omega.vercel.app/users/", {
    method: "GET",
    headers: { Authorization: `Token ${token}` },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "/login.html";
      } else if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const parent = document.getElementById("user_table");
      parent.innerHTML = "";

      if (data && Array.isArray(data)) {
        data.forEach((user, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.first_name || "-"}</td>
            <td>${user.last_name || "-"}</td>
            <td>${user.email}</td>
            <td>${user.reg_no || "-"}</td>
            <td>${user.education_details || "-"}</td>
            <td>${user.contact_number || "-"}</td>
            <td>${user.user_type || "Unknown"}</td>
            <td>${user.joined_date}</td>
            <td>${user.address || "-"}</td>
            <td>
                  ${
                    user.is_approved
                      ? `<span class="badge bg-success">✔ Approved</span>`
                      : `<span class="badge bg-danger">❌ Not Approved</span>`
                  }
                </td>
                <td class="text-center">
                  <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-sm btn-outline-success d-flex align-items-center" onclick="approveUser(${user.id})">
                      <i class="fas fa-check-circle me-1"></i> Approve
                    </button>
                    <button class="btn btn-sm btn-outline-primary d-flex align-items-center" onclick="editUser(${user.id})">
                      <i class="fas fa-edit me-1"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger d-flex align-items-center" onclick="deleteUser(${user.id})">
                      <i class="fas fa-trash me-1"></i> Delete
                    </button>
                  </div>
                </td>
          `;
          parent.appendChild(row);
        });
      } else {
        parent.innerHTML =
          "<tr><td colspan='12' class='text-center'>No users found.</td></tr>";
      }
    })
    .catch((error) => console.error("Fetch error:", error));
}

function approveUser(userId) {
  const token = localStorage.getItem("token");
  fetch(
    `https://mess-management-system-omega.vercel.app/users/${userId}/approve/`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error("Approval failed.");
      return response.json();
    })
    .then(() => {
      alert("User approved successfully!");
      loadAllUsers();
    })
    .catch((error) => console.error("Approval error:", error));
}

function deleteUser(userId) {
  const token = localStorage.getItem("token");
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`https://mess-management-system-omega.vercel.app/users/${userId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Delete failed.");
        return response.text();
      })
      .then(() => {
        alert("User deleted successfully!");
        loadAllUsers();
      })
      .catch((error) => console.error("Delete error:", error));
  }
}


function editUser(userId) {
  window.location.href = `edit_user.html?user_id=${userId}`;
}


window.onload = loadAllUsers;

const handleLogout = () => {
  const token = localStorage.getItem('token')
  if(!token) {
      console.log('No token found in localStorage');
      return;
  }
  fetch("https://mess-management-system-omega.vercel.app/logout/", {
      method : "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization : `Token ${token}`,
      }
  })
  .then((res)=> res.json())
  .then((data)=> {
      console.log('Logout response:',data);
      localStorage.removeItem("token")
      localStorage.removeItem("user_id")

      window.location.href ="index.html"
  })
  .catch((err)=> console.log("logout error:: ",err))

}
