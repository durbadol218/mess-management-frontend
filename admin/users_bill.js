const token = localStorage.getItem("token");
    const baseUrl = "https://mess-management-system-omega.vercel.app/bills/history/";
    let currentPage = 1;
    let totalItems = 0;
    const itemsPerPage = 10;

    const filterUser = document.getElementById("filterUser");
    const filterYear = document.getElementById("filterYear");
    const filterMonth = document.getElementById("filterMonth");
    const filterBtn = document.getElementById("filterBtn");
    const resetBtn = document.getElementById("resetBtn");
    const loadingIndicator = document.getElementById("loadingIndicator");
    const paginationInfo = document.getElementById("paginationInfo");
    const paginationControls = document.getElementById("paginationControls");
    if (!token) {
        window.location.href = "login.html";
    }
    document.addEventListener("DOMContentLoaded", async () => {
        await fetchUsers();
        await fetchAvailableYears();
        loadBills();
        
        filterBtn.addEventListener("click", () => {
            currentPage = 1;
            loadBills();
        });
        
        resetBtn.addEventListener("click", resetFilters);
    });

    async function fetchUsers() {
        try {
            const res = await fetch("https://mess-management-system-omega.vercel.app/users/", {
                headers: { Authorization: `Token ${token}` }
            });
            const users = await res.json();
            
            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user.id;
                option.textContent = `${user.username} (${user.email})`;
                filterUser.appendChild(option);
            });
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    }

    async function fetchAvailableYears() {
        try {
            const res = await fetch(`${baseUrl}?limit=1`, {
                headers: { Authorization: `Token ${token}` }
            });
            const data = await res.json();
            const years = [...new Set(data.results.map(bill => bill.year))].sort((a, b) => b - a);
            years.forEach(year => {
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                filterYear.appendChild(option);
            });
        } catch (err) {
            console.error("Error fetching years:", err);
        }
    }

    async function loadBills(page = 1) {
        currentPage = page;
        const userId = filterUser.value;
        const year = filterYear.value;
        const month = filterMonth.value;

        loadingIndicator.style.display = "block";
        document.getElementById("bill_table").innerHTML = "";

        const params = new URLSearchParams();
        if (userId) params.append("user_id", userId);
        if (year) params.append("year", year);
        if (month) params.append("month", month);
        params.append("page", page);

        try {
            const res = await fetch(`${baseUrl}?${params.toString()}`, {
                headers: { Authorization: `Token ${token}` }
            });
            const data = await res.json();

            totalItems = data.count;
            renderTable(data.results);
            renderPagination(data);
        } catch (err) {
            console.error("Error loading bills:", err);
            showError("Failed to load bills. Please try again.");
        } finally {
            loadingIndicator.style.display = "none";
        }
    }

    function renderTable(bills) {
        const tbody = document.getElementById("bill_table");
        tbody.innerHTML = "";

        if (!bills.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center py-4">No bills found matching your criteria</td>
                </tr>`;
            return;
        }

        bills.forEach(bill => {
            const row = document.createElement("tr");
            
            let mealDetails = "No meals";
            if (bill.meal_bill && Object.keys(bill.meal_bill.meals).length > 0) {
                mealDetails = Object.entries(bill.meal_bill.meals)
                    .map(([type, count]) => `${type}: ${count}`)
                    .join(", ");
            }

            row.innerHTML = `
                <td>${bill.user?.username || "-"}</td>
                <td>${bill.user?.email || "-"}</td>
                <td>${bill.month} ${bill.year}</td>
                <td>${formatBillType(bill.bill_type)}</td>
                <td class="meal-details">${mealDetails}</td>
                <td>৳${bill.total_amount.toFixed(2)}</td>
                <td><span class="status-badge status-${bill.status}">${bill.status}</span></td>
                <td>${bill.payment_date ? new Date(bill.payment_date).toLocaleDateString() : "-"}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewBillDetails(${bill.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function formatBillType(type) {
        return type.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    function renderPagination(data) {
        paginationInfo.innerHTML = `
            Showing ${data.results.length} of ${totalItems} bills
        `;
        paginationControls.innerHTML = "";
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (data.previous) {
            const prevBtn = document.createElement("button");
            prevBtn.className = "btn btn-outline-primary";
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.onclick = () => loadBills(currentPage - 1);
            paginationControls.appendChild(prevBtn);
        }

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.className = `btn ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => loadBills(i);
            paginationControls.appendChild(pageBtn);
        }
        
        if (data.next) {
            const nextBtn = document.createElement("button");
            nextBtn.className = "btn btn-outline-primary";
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.onclick = () => loadBills(currentPage + 1);
            paginationControls.appendChild(nextBtn);
        }
    }

    function resetFilters() {
        filterUser.value = "";
        filterYear.value = "";
        filterMonth.value = "";
        currentPage = 1;
        loadBills();
    }

    function viewBillDetails(billId) {
        console.log("Viewing bill details for:", billId);
    }

    function showError(message) {
        const alert = document.createElement("div");
        alert.className = "alert alert-danger alert-dismissible fade show";
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector(".container-fluid");
        container.insertBefore(alert, container.firstChild);
        
        setTimeout(() => alert.remove(), 5000);
    }