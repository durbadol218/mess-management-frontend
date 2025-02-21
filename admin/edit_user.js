document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user_id");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
        alert("Invalid user or authentication error!");
        window.location.href = "all_users.html";
        return;
    }

    fetch(`https://mess-management-system-omega.vercel.app/users/${userId}/`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((user) => {
        document.getElementById("username").value = user.username;
        document.getElementById("email").value = user.email;
        document.getElementById("education").value = user.education_details || "";
        document.getElementById("phone").value = user.contact_number || "";
        document.getElementById("address").value = user.address || "";
    })
    .catch((error) => {
        console.error("Error fetching user:", error);
        alert("Error fetching user details.");
    });

    document.getElementById("editUserForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const updatedData = {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            education_details: document.getElementById("education").value,
            contact_number: document.getElementById("phone").value,
            address: document.getElementById("address").value,
        };

        fetch(`https://mess-management-system-omega.vercel.app/users/${userId}/`, {
            method: "PATCH",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        })
        .then((res) => res.json())
        .then((data) => {
            alert("User updated successfully!");
            window.location.href = "all_users.html";
        })
        .catch((error) => {
            console.error("Update error:", error);
            alert("Error updating user.");
        });
    });
});
