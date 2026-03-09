let activeRowId = null;
let currentType = "";
let currentDays = 0;

let sickCredits = { "row-1": 15, "row-2": 15 };

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const handleToggle = () => { if (sidebar) sidebar.classList.toggle('close'); };
    document.getElementById('closeBtn').addEventListener('click', handleToggle);
    document.getElementById('logoToggle').addEventListener('click', handleToggle);

    const tabRequests = document.getElementById('tab-requests');
    const tabHistory = document.getElementById('tab-history');
    const requestsContent = document.getElementById('requests-content');
    const historyContent = document.getElementById('history-content');

    tabRequests.addEventListener('click', () => {
        tabRequests.classList.add('active'); tabHistory.classList.remove('active');
        requestsContent.style.display = 'block'; historyContent.style.display = 'none';
    });

    tabHistory.addEventListener('click', () => {
        tabHistory.classList.add('active'); tabRequests.classList.remove('active');
        requestsContent.style.display = 'none'; historyContent.style.display = 'block';
    });

    // --- SEARCH BAR LOGIC ---
    // Selects the input field inside your search-wrapper
    const searchInput = document.querySelector('.search-wrapper input');
    
    searchInput.addEventListener('keyup', () => {
        const filter = searchInput.value.toLowerCase();
        // Selects all rows with the class 'table-row' in both tables
        const allRows = document.querySelectorAll('.table-row');

        allRows.forEach(row => {
            // Converts all text inside the row to lowercase for easier matching
            const rowText = row.innerText.toLowerCase();
            
            // Shows the row if it matches the search query, hides it if not
            if (rowText.includes(filter)) {
                row.style.display = ""; 
            } else {
                row.style.display = "none";
            }
        });
    });
});

function openViewModal(rowId, type, days) { 
    activeRowId = rowId; currentType = type; currentDays = days;
    const row = document.getElementById(rowId);
    const statusText = row.querySelector('.status-pill').textContent.trim();

    document.getElementById('modalActions').style.display = 'flex';
    document.getElementById('decisionBanner').style.display = 'none';
    document.getElementById('modalFileName').innerText = type.replace(" ", "_") + "_.pdf";

    // 1. Leave Balance Visibility (Sick Leave Only)
    document.getElementById('balanceContainer').style.display = (type === "Sick Leave") ? 'block' : 'none';
    if(type === "Sick Leave") document.getElementById('creditVal').innerText = sickCredits[rowId];

    // 2. Pending Status logic
    const label = document.getElementById('modalStatusLabel');
    if (statusText === "Pending") {
        label.className = "status-pill pending";
        label.innerHTML = `<i class="fas fa-exclamation-circle"></i> Pending`;
        document.getElementById('reviewerDetails').innerHTML = `<small>Reviewed by: ---</small>`;
    } else {
        showFinalStateInModal(statusText.includes("Approved") ? "Approved" : "Rejected");
    }

    document.getElementById('viewModal').style.display = 'flex'; 
}

function processRequest(status) {
    const row = document.getElementById(activeRowId);
    if (row) {
        if (status === 'Approved' && currentType === "Sick Leave") sickCredits[activeRowId] -= currentDays;
        showFinalStateInModal(status);
        row.querySelector('.status-cell').innerHTML = `<span class="status-pill ${status.toLowerCase()}"><i class="fas fa-${status === 'Approved' ? 'check' : 'times'}-circle"></i> ${status}</span>`;
        row.querySelector('.reviewer-cell').innerHTML = `<strong>HR Manager</strong><br><small>${new Date().toLocaleDateString()}</small>`;
        row.querySelector('td:last-child').innerHTML = `<button class="view-btn" onclick="openViewModal('${activeRowId}', '${currentType}', ${currentDays})">View</button>`;
        document.getElementById('history-table-body').appendChild(row);
    }
}

function showFinalStateInModal(status) {
    const label = document.getElementById('modalStatusLabel');
    label.className = `status-pill ${status.toLowerCase()}`;
    label.innerHTML = `<i class="fas fa-${status === 'Approved' ? 'check' : 'times'}-circle"></i> ${status}`;
    if (currentType === "Sick Leave") document.getElementById('creditVal').innerText = sickCredits[activeRowId];
    const pill = document.getElementById('decisionPill');
    pill.className = `banner-pill ${status.toLowerCase()}-banner`;
    pill.innerText = status;
    document.getElementById('modalActions').style.display = 'none';
    document.getElementById('decisionBanner').style.display = 'block';
    document.getElementById('reviewerDetails').innerHTML = `<small>Reviewed by: HR Manager</small>`;
}

function closeViewModal() { document.getElementById('viewModal').style.display = 'none'; }