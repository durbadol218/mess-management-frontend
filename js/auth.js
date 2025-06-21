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

const handleRegister = (event) => {
    event.preventDefault();

    // Clear previous states
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.getElementById("registration-error-message").textContent = "";
    
    const form = document.getElementById("registrationForm");
    const formData = new FormData(form);
    const registerData = {
        username: formData.get("username"),
        email: formData.get("email"),
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        education_details: formData.get("education_details"),
        address: formData.get("address"), // This is optional
        user_type: formData.get("user_type"),
        seat_type: formData.get("seat_type"),
        contact_number: formData.get("contact_number"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    };

    // Validate all required fields
    let isValid = true;
    const errorMessage = document.getElementById("registration-error-message");

    // Check each field except address
    const requiredFields = ['username', 'email', 'first_name', 'last_name', 
                          'education_details', 'user_type', 'seat_type',
                          'contact_number', 'password', 'confirm_password'];

    requiredFields.forEach(field => {
        if (!registerData[field] || registerData[field].trim() === '') {
            isValid = false;
            document.getElementsByName(field)[0].classList.add('is-invalid');
        }
    });

    // Special password validation
    if (registerData.password !== registerData.confirm_password) {
        isValid = false;
        document.getElementById('password').classList.add('is-invalid');
        document.getElementById('confirm_password').classList.add('is-invalid');
        errorMessage.textContent = "Passwords do not match";
    }

    if (!isValid) {
        errorMessage.textContent = errorMessage.textContent || "Please fill all required fields";
        return;
    }

    // Proceed with registration if validation passes
    const spinner = document.getElementById("register-spinner");
    const registerButton = document.querySelector(".btnRegister");

    spinner.classList.remove("d-none");
    registerButton.disabled = true;

    fetch("https://mess-management-system-omega.vercel.app/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData)
    })
    .then(handleResponse)
    .then(() => {
        document.getElementById("regi-alert-success").classList.remove("d-none");
        document.getElementById("regi-alert-success").textContent = "Registration successful! Redirecting...";
        setTimeout(() => window.location.href = "login.html", 2000);
    })
    .catch(err => {
        document.getElementById("regi-alert-error").classList.remove("d-none");
        document.getElementById("regi-alert-error").textContent = 
            err.message || "Registration failed. Please try again.";
    })
    .finally(() => {
        spinner.classList.add("d-none");
        registerButton.disabled = false;
    });
};

function handleResponse(response) {
    if (!response.ok) {
        return response.json().then(data => {
            throw new Error(data.error || "Registration failed");
        });
    }
    return response.json();
}

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
    const spinner = document.getElementById("login-spinner");
    const loginBtn = document.querySelector(".btnLogin");

    successAlert.classList.add("d-none");
    errorAlert.classList.add("d-none");
    spinner.classList.remove("d-none");
    loginBtn.disabled = true;
    loginBtn.innerText = "Logging in...";

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
                    throw new Error(data.error || "Login failed");
                });
            }
            return response.json();
        })
        .then((data) => {
            if (!data.token || !data.user_id) {
                throw new Error("Invalid login response from server");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data.user_id);

            return fetch(
                `https://mess-management-system-omega.vercel.app/users/${data.user_id}/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${data.token}`,
                    },
                }
            );
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            return response.json();
        })
        .then((userData) => {
            successAlert.classList.remove("d-none");
            successAlert.innerText = "Login successful!";
            setTimeout(() => {
                if (userData.user_type === "User") {
                    window.location.href = "index.html";
                } else if (userData.user_type === "Admin") {
                    window.location.href = "admin/index.html";
                } else {
                    throw new Error(`Unexpected user type: ${userData.user_type}`);
                }
            }, 1000);
        })
        .catch((err) => {
            errorAlert.classList.remove("d-none");
            errorAlert.innerText = err.message || "Login failed. Please try again.";
        })
        .finally(() => {
            spinner.classList.add("d-none");
            loginBtn.disabled = false;
            loginBtn.innerText = "Login";
        });
};

const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("No token found in localStorage");
        return;
    }
    fetch("https://mess-management-system-omega.vercel.app/logout/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Logout response:", data);
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");

            window.location.href = "index.html";
        })
        .catch((err) => console.log("logout error:: ", err));
};
