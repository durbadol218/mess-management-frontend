async function updateMealStatus(mealId, currentStatus) {
    try {
        const newStatus = !currentStatus;

        const response = await fetch(`https://mess-management-system-omega.vercel.app/meals/meals/${mealId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ is_active: newStatus })
        });

        const responseData = await response.json();
        console.log("Updated meal status:", responseData);

        if (response.status === 200) {
            alert("Meal status updated!");
            loadMeals();
        } else {
            alert("Error updating status: " + responseData.detail);
        }
    } catch (error) {
        console.error("Error updating meal status:", error);
        alert("Failed to update meal status. Please try again.");
    }
}

function addMealToTable(meal) {
    const mealTableBody = document.getElementById("meal-table-body");
    const row = document.createElement("tr");
    
    const isActiveText = meal.is_active ? "True" : "False";

    row.innerHTML = `
        <td>${meal.date}</td>
        <td>${meal.meal_choice}</td>
        <td>${meal.amount}</td>
        <td>${isActiveText}</td>
        <td><button class="btn-edit" onclick="updateMealStatus(${meal.id}, ${meal.is_active})">Update Status</button></td>
    `;
    
    mealTableBody.appendChild(row);
}

function loadMeals() {
    fetch("https://mess-management-system-omega.vercel.app/meals/meals/", {
        method: "GET",
        headers: {
            "Authorization": `Token ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const mealTableBody = document.getElementById("meal-table-body");
        mealTableBody.innerHTML = "";
        data.forEach(addMealToTable);
    })
    .catch(error => console.error("Error loading meals:", error));
}

document.addEventListener("DOMContentLoaded", function() {
    const mealForm = document.getElementById("meal-form");
    const mealTableBody = document.getElementById("meal-table-body");
    const apiURL = "https://mess-management-system-omega.vercel.app/meals/meals/";

    mealForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const date = document.getElementById("date").value;
        let mealChoice = document.getElementById("meal_choice").value;
        const userId = localStorage.getItem("user_id");
        const validMealChoices = {
            "full": "full",
            "guest": "guest",
            "lunch_breakfast": "half_day",
            "dinner_breakfast": "half_night"
        };

        mealChoice = validMealChoices[mealChoice] || "full";

        if (!userId) {
            alert("User ID is missing. Please log in again.");
            return;
        }

        let amount = mealChoice === "full" ? 70 :
                     mealChoice === "guest" ? 80 :
                     mealChoice === "half_day" ? 40 :
                     mealChoice === "half_night" ? 65 : 0;

        const action = "create";

        const mealData = {
            user: userId,
            date: date,
            meal_choice: mealChoice,
            amount: amount,
            is_active: true,
            action: action
        };

        console.log("Meal data being sent:", mealData);

        try {
            const response = await fetch(apiURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(mealData)
            });

            const responseData = await response.json();
            console.log("Response Status:", response.status, "Response Body:", responseData);

            if (response.status === 201) {
                alert("Meal added successfully!");
                mealForm.reset();
                addMealToTable(responseData);
            } else {
                alert(`Error: ${JSON.stringify(responseData)}`);
            }
        } catch (error) {
            console.error("Error adding meal:", error);
            alert("Failed to add meal. Please try again.");
        }
    });
    loadMeals();
});