document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const loginButton = document.querySelector(".login-button");
    const registerButton = document.querySelector(".register-button");
    const profileLink = document.querySelector(".profile-link");
    const logoutButton = document.querySelector(".logout-button");

    if (token) {
        if (loginButton) loginButton.classList.add("d-none");
        if (registerButton) registerButton.classList.add("d-none");
        if (profileLink) profileLink.classList.remove("d-none");
        if (logoutButton) logoutButton.classList.remove("d-none");
    } else {
        if (loginButton) loginButton.classList.remove("d-none");
        if (registerButton) registerButton.classList.remove("d-none");
        if (profileLink) profileLink.classList.add("d-none");
        if (logoutButton) logoutButton.classList.add("d-none");
    }
});



// const handleLogin = (event) => {
//     event.preventDefault();

//     const form = document.getElementById("loginForm");
//     const formData = new FormData(form);
//     const loginData = {
//         username: formData.get("username"),
//         password: formData.get("password"),
//     };
//     const successAlert = document.getElementById("login-alert-success");
//     const errorAlert = document.getElementById("login-alert-error");
//     successAlert.classList.add("d-none");
//     errorAlert.classList.add("d-none");

//     fetch("https://flowerworld.onrender.com/user/login/", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(loginData),
//     })
//     .then((response) => {
//         console.log(response); // Log the response to see what's coming back
//         if (!response.ok) {
//             return response.json().then((data) => {
//                 throw new Error(data.error || "Invalid username or password");
//             });
//         }
//         return response.json();
//     })
//     .then((data) => {
//         console.log(data); // Log the data to see what is returned from the backend
//         if (!data.token || !data.user_id) {
//             throw new Error("Invalid login response from server");
//         }
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user_id", data.user_id);
//         successAlert.classList.remove("d-none");
//         setTimeout(() => {
//             window.location.href = "index.html";
//         }, 3000);
//     })
//     .catch((err) => {
//         console.error("Login error:", err);
//         errorAlert.classList.remove("d-none");
//         errorAlert.innerText = err.message || "Invalid username or password. Please try again.";
//     });
// };



const handleRegister = (event) => {
    event.preventDefault();

    const form = document.getElementById("registrationForm");
    const formData = new FormData(form);
    const registerData = {
        username: formData.get("username"),
        email: formData.get("email"),
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        education_details: formData.get("education_details"),
        address: formData.get("address"),
        user_type: formData.get("user_type"),
        contact_number: formData.get("contact_number"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    };

    const successAlert = document.getElementById("regi-alert-success");
    const errorAlert = document.getElementById("regi-alert-error");
    successAlert.classList.add("d-none");
    errorAlert.classList.add("d-none");

    console.log("Register Data: ", registerData);

    fetch("https://mess-management-system-omega.vercel.app/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
    })
    .then((response) => {
        console.log("Response Status: ", response.status);
        if (!response.ok) {
            return response.json().then((data) => {
                throw new Error(data.error || "Registration failed");
            });
        }
        return response.json();
    })
    .then((data) => {
        console.log("Response Data: ", data);
        successAlert.classList.remove("d-none");
        successAlert.innerText = "Registration successful! Redirecting...";
        setTimeout(() => {
            window.location.href = "login.html";
        }, 3000);
    })
    .catch((err) => {
        console.error("Registration error:", err.message);
        errorAlert.classList.remove("d-none");
        errorAlert.innerText = err.message || "Registration failed. Please try again.";
    });
};

const handleLogin = (event) => {
    event.preventDefault();

    const form = document.getElementById("loginForm");
    const formData = new FormData(form);
    const loginData = {
        username: formData.get("username"),
        password: formData.get("password"),
    };

    const successAlert = document.getElementById("login-alert-success");
    const errorAlert = document.getElementById("login-alert-error");
    successAlert.classList.add("d-none");
    errorAlert.classList.add("d-none");

    console.log("Login Data: ", loginData);

    fetch("https://mess-management-system-omega.vercel.app/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    })
    .then((response) => {
        if (!response.ok) {
            return response.json().then((data) => {
                console.error("Login Error Data: ", data);
                throw new Error(data.error || "Login failed");
            });
        }
        return response.json();
    })
    .then((data) => {
        console.log("Login Response Data: ", data);
        if (!data.token || !data.user_id) {
            throw new Error("Invalid login response from server");
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);

        return fetch(`https://mess-management-system-omega.vercel.app/users/${data.user_id}/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${data.token}`,
            }
        });
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        return response.json();
    })
    .then((userData) => {
        console.log("User Data: ", userData);
        if (userData.user_type === "User") {
            window.location.href = "index.html";
        } else if (userData.user_type === "Admin") {
            window.location.href = "admin/index.html";
        } else {
            throw new Error(`Unexpected user type: ${userData.user_type}`);
        }
    })
    .catch((err) => {
        console.error("Login error:", err.message);
        errorAlert.classList.remove("d-none");
        errorAlert.innerText = err.message || "Login failed. Please try again.";
    });
};



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


