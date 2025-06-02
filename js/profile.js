document.addEventListener("DOMContentLoaded", () => {
  displayProfile();
});

const displayProfile = () => {
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No authentication token found. Please log in.");
    return;
  }

  fetch(`https://mess-management-system-omega.vercel.app/users/${user_id}/`, {
    method: "GET",
    headers: { Authorization: `Token ${token}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return res.json();
    })
    .then((user) => {
      document.getElementById("profile-info").innerHTML = `
            <div class="card-body pt-5 px-4 pb-4 text-center">
            <!-- Profile image with shadow and border -->
            <div class="profile-image-container mx-auto mb-4">
                <img src="${user.profile_image || "../image/young.avif"}" 
                    class="img-fluid rounded-circle border-white border-4 shadow" 
                    alt="${user.first_name}'s profile picture">
            </div>
            
            <!-- User name with subtle decoration -->
            <h2 class="card-title mb-3 fw-bold text-gradient">${
              user.first_name
            } ${user.last_name}</h2>
            <p class="text-muted mb-4">${user.user_type || "Member"}</p>
            
            <!-- Profile details in a clean layout -->
            <div class="profile-details-container">
                <div class="detail-row">
                    <span class="detail-label">Username</span>
                    <span class="detail-value">${user.username}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${user.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Registration No</span>
                    <span class="detail-value">${user.reg_no}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Education</span>
                    <span class="detail-value">${
                      user.education_details || "N/A"
                    }</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Address</span>
                    <span class="detail-value">${user.address || "N/A"}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value badge ${
                      user.is_approved ? "bg-success" : "bg-warning"
                    }">
                        ${user.is_approved ? "Approved" : "Pending"}
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone</span>
                    <span class="detail-value">${
                      user.contact_number || "N/A"
                    }</span>
                </div>
            </div>
            
            <!-- Action buttons with better spacing and hover effects -->
            <div class="profile-actions mt-4 d-flex flex-column flex-md-row justify-content-center gap-3">
                <button class="btn btn-outline-secondary px-4 py-2 rounded-pill fw-medium update-profile" onclick="updateProfile()">
                    <i class="bi bi-pencil-square me-2"></i>Update Profile
                </button>
                <button class="btn btn-outline-secondary px-4 py-2 rounded-pill fw-medium change-password" onclick="changePassword()">
                    <i class="bi bi-key me-2"></i>Change Password
                </button>
            </div>
        `;
    })
    .catch((error) => {
      console.error("Error fetching profile:", error);
      document.getElementById(
        "profile-info"
      ).innerHTML = `<p class="text-danger">Failed to load profile information.</p>`;
    });
};

const updateProfile = () => {
  const newEducation = prompt("Enter your updated education details:");
  const newPhone = prompt("Enter your new contact number:");
  const newAddress = prompt("Enter your new address:");

  if (!newEducation || !newPhone || !newAddress) {
    alert("Update canceled. Fields cannot be empty.");
    return;
  }

  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("User is not authenticated.");
    return;
  }

  fetch(
    `https://mess-management-system-omega.vercel.app/users/${user_id}/update/`,
    {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        education_details: newEducation,
        contact_number: newPhone,
        address: newAddress,
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        alert("Profile updated successfully!");
        displayProfile();
      } else {
        alert("Error updating profile: " + JSON.stringify(data));
      }
    })
    .catch((error) => console.error("Error updating profile:", error));
};

const user_id = localStorage.getItem("user_id");
const changePassword = () => {
  const modal = document.createElement("div");
  modal.innerHTML = `
        <div style="
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 20px; border-radius: 10px; 
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); text-align: center;">
            
            <h3>Change Password</h3>
            <input type="password" id="oldPassword" placeholder="Enter old password" 
                required style="width: 100%; padding: 8px; margin: 5px 0;"><br>
            <input type="password" id="newPassword" placeholder="Enter new password" 
                required style="width: 100%; padding: 8px; margin: 5px 0;"><br>
            <input type="password" id="confirmPassword" placeholder="Confirm new password" 
                required style="width: 100%; padding: 8px; margin: 5px 0;"><br>
            
            <button id="submitPassword" style="margin-top: 10px; padding: 8px 15px;">Change Password</button>
            <button id="cancelPassword" style="margin-top: 10px; padding: 8px 15px;">Cancel</button>
        </div>
    `;

  document.body.appendChild(modal);

  document.getElementById("submitPassword").addEventListener("click", () => {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Fields cannot be empty.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Try again.");
      return;
    }

    changePasswordAPI(oldPassword, newPassword, confirmPassword, modal);
  });

  document.getElementById("cancelPassword").addEventListener("click", () => {
    document.body.removeChild(modal);
  });
};

const changePasswordAPI = (
  oldPassword,
  newPassword,
  confirmPassword,
  modal
) => {
  const token = localStorage.getItem("token");

  fetch(
    `https://mess-management-system-omega.vercel.app/users/${user_id}/change-password/`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        alert("Password changed successfully!");
        document.body.removeChild(modal);
      } else {
        alert("Error: " + JSON.stringify(data));
      }
    })
    .catch((error) => console.error("Error changing password:", error));
};

document.addEventListener("DOMContentLoaded", function () {
  fetchUserComplaints();
});

function toggleComplaintSection() {
  let section = document.getElementById("complaint-section");
  section.style.display = section.style.display === "none" ? "block" : "none";
}

function fetchUserComplaints() {
  fetch("https://mess-management-system-omega.vercel.app/complaints/user/", {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let complaintList = document.getElementById("complaint-list");
      complaintList.innerHTML = "";
      if (data.results.length === 0) {
        complaintList.innerHTML =
          "<p class='text-center'>No complaints found.</p>";
        return;
      }
      data.results.forEach((complaint) => {
        let item = document.createElement("li");
        item.classList.add("list-group-item");
        item.innerHTML = `<strong>${complaint.category}</strong>: ${
          complaint.description
        } 
                              <span class="badge ${
                                complaint.status === "resolved"
                                  ? "bg-success"
                                  : "bg-warning"
                              }">
                              ${complaint.status}</span>`;
        complaintList.appendChild(item);
      });
    })
    .catch((error) => console.error("Error fetching complaints:", error));
}

function openComplaintForm() {
  $("#complaint-form-modal").modal("show");
}

function submitComplaint() {
  let category = document.getElementById("complaint-category").value;
  let description = document.getElementById("complaint-description").value;

  fetch("https://mess-management-system-omega.vercel.app/complaints/create/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ category, description }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert("Complaint submitted successfully!");
        $("#complaint-form-modal").modal("hide");
        fetchUserComplaints();
      } else {
        alert("Error submitting complaint.");
      }
    })
    .catch((error) => console.error("Error submitting complaint:", error));
}
