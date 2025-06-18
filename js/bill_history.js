const token = localStorage.getItem('token');

async function loadBills(year, month = "") {
    const baseURL = "https://mess-management-system-omega.vercel.app/bills/history/";
    const query = `?year=${year}` + (month ? `&month=${month}` : '');
    const url = baseURL + query;
    
    const container = document.getElementById("bills-container");
    const filterBtn = document.querySelector("button[onclick='applyFilter()']");

    container.innerHTML = `
        <div class="text-center py-5 my-5">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading bills...</span>
            </div>
            <p class="mt-3">Loading your bills...</p>
        </div>
    `;

    if (filterBtn) {
        filterBtn.disabled = true;
        filterBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Filtering...
        `;
    }

    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        container.innerHTML = "";

        if (res.ok && data.results.length > 0) {
            data.results.forEach(bill => {
                const statusClass = bill.status === 'Paid' ? 'text-success' : 'text-warning';
                container.innerHTML += `
                    <div class="border rounded p-3 mb-3 bg-light">
                        <p><strong>Type:</strong> ${bill.bill_type}</p>
                        <p><strong>Amount:</strong> ${bill.total_amount}৳</p>
                        <p><strong>Status:</strong> <span class="${statusClass}">${bill.status}</span></p>
                        <p><strong>Due Date:</strong> ${new Date(bill.due_date).toLocaleDateString()}</p>
                        <p><strong>Transaction ID:</strong>${bill.transaction_id}</p>
                    </div>
                `;
            });
        } else {
            container.innerHTML = `
                <div class="text-center py-5 my-5">
                    <i class="bi bi-receipt text-muted" style="font-size: 3rem;"></i>
                    <p class="mt-3 text-muted">No bills found for this period</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error loading bills:", error);
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle-fill"></i>
                Failed to load bills. Please try again later.
            </div>
        `;
    } finally {
        if (filterBtn) {
            filterBtn.disabled = false;
            filterBtn.innerHTML = "Filter";
        }
    }
}

function applyFilter() {
    const year = document.getElementById("year-select").value;
    const month = document.getElementById("month-select").value;
    
    if (!year) {
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-danger text-white">
                    <strong class="me-auto">Error</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    Please select a valid year
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
        return;
    }
    
    loadBills(year, month);
}

window.addEventListener("DOMContentLoaded", () => {
    const now = new Date();
    document.getElementById("year-select").value = now.getFullYear();
    document.getElementById("month-select").value = now.getMonth() + 1;
    applyFilter();
});