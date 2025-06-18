// document.addEventListener("DOMContentLoaded", function () {
//     const registerForm = document.getElementById("registerUserForm");

//     registerForm.addEventListener("submit", async function (event) {
//         event.preventDefault();

//         const formData = new FormData();
//         formData.append("username", document.getElementById("username").value);
//         formData.append("first_name", document.getElementById("first_name").value);
//         formData.append("last_name", document.getElementById("last_name").value);
//         formData.append("email", document.getElementById("email").value);
//         formData.append("password", document.getElementById("password").value);
//         formData.append(
//             "confirm_password",
//             document.getElementById("confirm_password").value
//         );
//         formData.append(
//             "education_details",
//             document.getElementById("education_details").value
//         );
//         formData.append(
//             "contact_number",
//             document.getElementById("contact_number").value
//         );
//         formData.append("user_type", document.getElementById("user_type").value);
//         formData.append("address", document.getElementById("address").value);
//         formData.append(
//             "joined_date",
//             document.querySelector('input[name="joined_date"]').value
//         );
//         const profileImageInput = document.getElementById("profile_image");
//         if (profileImageInput.files.length > 0) {
//             formData.append("profile_image", profileImageInput.files[0]);
//         }

//         formData.append(
//             "is_approved",
//             document.getElementById("is_approved").checked ? "True" : "False"
//         );

//         const token = localStorage.getItem("token");
//         try {
//             const response = await fetch(
//                 "https://mess-management-system-omega.vercel.app/users/",
//                 {
//                     method: "POST",
//                     headers: {
//                         Authorization: `Token ${token}`,
//                     },
//                     body: formData,
//                 }
//             );

//             if (response.ok) {
//                 document.getElementById("success-message").style.display = "block";
//                 document.getElementById("error-message").style.display = "none";
//                 registerForm.reset();
//             } else {
//                 const errorData = await response.json();
//                 document.getElementById("error-message").innerText =
//                     errorData.detail || "Failed to register user";
//                 document.getElementById("error-message").style.display = "block";
//             }
//         } catch (error) {
//             document.getElementById("error-message").innerText =
//                 "Network error. Please try again!";
//             document.getElementById("error-message").style.display = "block";
//         }
//     });
// });



document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerUserForm");
    const submitBtn = registerForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerHTML;

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Show loader on button
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Registering...
        `;

        // Show full-page loader
        const fullPageLoader = document.createElement('div');
        fullPageLoader.className = 'full-page-loader';
        fullPageLoader.innerHTML = `
            <div class="loader-content">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Registering user...</p>
            </div>
        `;
        document.body.appendChild(fullPageLoader);

        const formData = new FormData();
        formData.append("username", document.getElementById("username").value);
        formData.append("first_name", document.getElementById("first_name").value);
        formData.append("last_name", document.getElementById("last_name").value);
        formData.append("email", document.getElementById("email").value);
        formData.append("password", document.getElementById("password").value);
        formData.append(
            "confirm_password",
            document.getElementById("confirm_password").value
        );
        formData.append(
            "education_details",
            document.getElementById("education_details").value
        );
        formData.append(
            "contact_number",
            document.getElementById("contact_number").value
        );
        formData.append("user_type", document.getElementById("user_type").value);
        formData.append("address", document.getElementById("address").value);
        formData.append(
            "joined_date",
            document.querySelector('input[name="joined_date"]').value
        );
        const profileImageInput = document.getElementById("profile_image");
        if (profileImageInput.files.length > 0) {
            formData.append("profile_image", profileImageInput.files[0]);
        }

        formData.append(
            "is_approved",
            document.getElementById("is_approved").checked ? "True" : "False"
        );

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                "https://mess-management-system-omega.vercel.app/users/",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    body: formData,
                }
            );

            if (response.ok) {
                document.getElementById("success-message").style.display = "block";
                document.getElementById("error-message").style.display = "none";
                registerForm.reset();
            } else {
                const errorData = await response.json();
                document.getElementById("error-message").innerText =
                    errorData.detail || "Failed to register user";
                document.getElementById("error-message").style.display = "block";
            }
        } catch (error) {
            document.getElementById("error-message").innerText =
                "Network error. Please try again!";
            document.getElementById("error-message").style.display = "block";
        } finally {
            // Hide loaders
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            document.body.removeChild(fullPageLoader);
        }
    });
});
