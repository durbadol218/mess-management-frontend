document.addEventListener("DOMContentLoaded", () => {
    const bookButtons = document.querySelectorAll(".book-btn");

    bookButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");

            if (!token || !userId) {
                alert("⚠️ You need to log in first.");
                window.location.href =
                    "https://mess-management-frontend-five.vercel.app/register.html";
                return;
            }
            try {
                const response = await fetch(
                    `https://mess-management-system-omega.vercel.app/users/${userId}/`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Token ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Could not fetch user data");
                }

                const user = await response.json();

                if (user.is_approved) {
                    alert("🎉 Your seat is already confirmed");
                } else {
                    alert("⏳ Your booking request is still pending admin approval.");
                }
            } catch (error) {
                console.error(error);
                alert("⚠️ Something went wrong. Please try again later.");
            }
        });
    });
});
