async function loadMeals() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`https://mess-management-system-omega.vercel.app/meals/meals/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const meals = await response.json();
        
        const usersResponse = await fetch('https://mess-management-system-omega.vercel.app/users/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        });

        if (!usersResponse.ok) {
            throw new Error(`HTTP error! Status: ${usersResponse.status}`);
        }

        const users = await usersResponse.json();
        const userMap = {};
        users.forEach(user => userMap[user.id] = user.username);

        const mealList = document.getElementById('mealList');
        mealList.innerHTML = '';

        for (const meal of meals) {
            const username = userMap[meal.user] || 'Unknown';
            const statusText = meal.is_active ? 'Active' : 'Inactive';
            const statusClass = meal.is_active ? 'btn-success' : 'btn-secondary';

            mealList.innerHTML += `
                <tr>
                    <td>${username}</td>
                    <td>${meal.meal_choice}</td>
                    <td>${meal.date}</td>
                    <td>${meal.amount}</td>
                    <td>
                        <button class="btn ${statusClass}" onclick="toggleMealStatus(${meal.id}, ${meal.is_active})">${statusText}</button>
                    </td>
                    <td data-label="Actions">
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-outline-warning" onclick="openEditMealModal(${meal.id})" title="Edit">
                                <i class="bi bi-pencil"></i>
                                <span class="d-none d-lg-inline ms-1">Edit</span>
                            </button>
                            <button class="btn btn-outline-danger" onclick="deleteMeal(${meal.id})" title="Delete">
                                <i class="bi bi-trash"></i>
                                <span class="d-none d-lg-inline ms-1">Delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading meals:', error);
        alert('Failed to load meal plans.');
    }
}


async function toggleMealStatus(mealId, currentStatus) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`https://mess-management-system-omega.vercel.app/meals/meals/${mealId}/update_status/`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({ is_active: !currentStatus })
        });

        if (response.ok) {
            loadMeals();
        } else {
            const errorData = await response.json();
            console.error('Update failed:', errorData);
            alert('Error updating meal status.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    }
}


async function deleteMeal(mealId) {
    if (!confirm("Are you sure you want to delete this meal plan?")) return;

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://mess-management-system-omega.vercel.app/meals/meals/${mealId}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            alert("Meal deleted successfully.");
            loadMeals();
        } else if (response.status === 403) {
            alert("You don't have permission to delete this meal.");
        } else if (response.status === 404) {
            alert("Meal not found.");
        } else {
            alert("Error deleting meal.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Network error while deleting meal.");
    }
}

function openMealModal() {
    const modal = new bootstrap.Modal(document.getElementById('mealModal'));
    modal.show();
}

function openEditMealModal(mealId) {
    const token = localStorage.getItem('token');

    fetch(`https://mess-management-system-omega.vercel.app/meals/meals/${mealId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error fetching meal details (Status: ${response.status})`);
        }
        return response.json();
    })
    .then(meal => {
        const mealChoiceInput = document.getElementById('mealChoice');
        const mealDateInput = document.getElementById('mealDate');
        const mealIdInput = document.getElementById('mealId');

        if (mealChoiceInput && mealDateInput && mealIdInput) {
            mealChoiceInput.value = meal.meal_choice;
            mealDateInput.value = meal.date;
            mealIdInput.value = meal.id;
            openMealModal();
        } else {
            console.error('One or more modal elements not found');
        }
    })
    .catch(error => {
        console.error('Error fetching meal details:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const userSelect = document.getElementById('userSelect');
    const mealChoice = document.getElementById('mealChoice');
    const amountInput = document.getElementById('amount');

    const mealPrices = {
        full: 65,
        guest: 60,
        half_day: 40,
        half_night: 40
    };
    fetchUsers();

    function fetchUsers() {
        fetch('https://mess-management-system-omega.vercel.app/users/')
            .then(response => response.json())
            .then(users => {
                if (users.length === 0) {
                    alert('No users available');
                    return;
                }
                userSelect.innerHTML = '';
                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = `${user.first_name} ${user.last_name}`;
                    userSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                alert('Error loading users');
            });
    }

    mealChoice.addEventListener('change', () => {
        const selectedMeal = mealChoice.value;
        amountInput.value = mealPrices[selectedMeal] || 0;
    });
});

document.getElementById('mealForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const mealId = document.getElementById('mealId') ? document.getElementById('mealId').value : null;
    const userId = document.getElementById('userSelect').value;
    const mealChoice = document.getElementById('mealChoice').value;
    const mealDate = document.getElementById('mealDate').value;
    const amount = document.getElementById('amount').value;

    // Validate form fields
    if (!mealChoice || !mealDate || !userId || !amount) {
        alert("All fields are required.");
        return;
    }

    // Validate meal date format
    if (!isValidDate(mealDate)) {
        alert("Please enter a valid date (YYYY-MM-DD).");
        return;
    }

    // Validate meal choice value
    if (!mealChoice.trim()) {
        alert("Please select a valid meal choice.");
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert("You must be logged in to perform this action.");
        window.location.href = '/login';
        return;
    }
    const submitButton = document.getElementById('mealSubmit');
    submitButton.disabled = true;
    try {
        const method = mealId ? 'PATCH' : 'POST';
        const url = mealId ? `https://mess-management-system-omega.vercel.app/meals/meals/${mealId}/` : 'https://mess-management-system-omega.vercel.app/meals/meals/';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                user: userId,
                meal_choice: mealChoice,
                date: mealDate,
                amount: amount
            }),
        });

        if (response.status === 403) {
            alert('You do not have permission to modify this meal.');
        } else if (response.status === 400) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            alert('Bad Request: ' + (errorData.detail || 'Please check the form data.'));
        } else if (response.ok) {
            loadMeals();
            const modal = bootstrap.Modal.getInstance(document.getElementById('mealModal'));
            modal.hide();
        } else {
            alert('Error creating or updating meal plan. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    } finally {
        submitButton.disabled = false;
    }
});

function isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    return dateString.match(regEx) != null;
}


function filterMeals() {
    const userFilterElement = document.getElementById("filterUser");
    const dateFilterElement = document.getElementById("filterDate");

    const userFilter = userFilterElement ? userFilterElement.value : "";
    const dateFilter = dateFilterElement ? dateFilterElement.value : "";

    let apiUrl = "https://mess-management-system-omega.vercel.app/meals/meals/";
    const params = new URLSearchParams();
    
    if (userFilter) params.append("user", userFilter);
    if (dateFilter) params.append("date", dateFilter);

    if (params.toString()) {
        apiUrl += `?${params.toString()}`;
    }

    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (!token) {
        console.error("Error: No authentication token found. Please log in.");
        return;
    }

    fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Token ${token}`
        }
    })
    .then(response => {
        console.log("Response Status:", response.status);
        if (response.status === 403) {
            throw new Error("Forbidden: Check authentication token and permissions.");
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetched Data:", data);
        renderMealTable(data);
    })
    .catch(error => console.error("Error fetching meals:", error));
}

function renderMealTable(meals) {
    const tableBody = document.getElementById("mealList");

    if (!tableBody) {
        console.error("Error: Element with ID 'mealTableBody' not found!");
        return;
    }

    tableBody.innerHTML = "";

    meals.forEach(meal => {
        const row = `
            <tr>
                <td>${meal.username}</td>
                <td>${meal.meal_choice}</td>
                <td>${meal.date}</td>
                <td>${meal.amount || "N/A"}</td>
                <td>
                    <button class="btn ${meal.is_active ? 'btn-success' : 'btn-secondary'}" onclick="toggleMealStatus(${meal.id}, ${meal.is_active})">${meal.is_active ? 'Active' : 'Inactive'}</button>
                </td>
                <td>
                    <button class="btn btn-warning btn-sm">Edit</button>
                    <button class="btn btn-danger btn-sm">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}


window.onload = loadMeals;