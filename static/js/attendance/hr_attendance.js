/**
 * ATTENDANCE MONITORING LOGIC
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Sidebar Elements
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");
    
    // 2. Modal Elements
    const modal = document.getElementById("detailModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const btnWeekly = document.getElementById("btnWeekly");
    const btnMonthly = document.getElementById("btnMonthly");
    const periodLabel = document.getElementById("periodLabel");
    const viewDateRange = document.getElementById("viewDateRange");

    /* --- SIDEBAR LOGIC --- */
    closeBtn.addEventListener("click", () => {
        sidebar.classList.add("collapsed");
    });

    logoToggle.addEventListener("click", () => {
        if (sidebar.classList.contains("collapsed")) {
            sidebar.classList.remove("collapsed");
        }
    });

    /* --- MODAL LOGIC --- */
    window.openEmployeeDetail = function(name) {
        document.getElementById('modalEmployeeName').innerText = name;
        modal.style.display = 'block';
    };

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = 'none';
    });

    // Close modal if user clicks outside the content box
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    /* --- VIEW SWITCHER (Weekly vs Monthly) --- */
    btnWeekly.addEventListener("click", () => {
        btnWeekly.classList.add('active');
        btnMonthly.classList.remove('active');
        periodLabel.innerText = "Week";
        viewDateRange.innerText = "February 4 - 10";
        // Logic to refresh table data for weekly view would go here
    });

    btnMonthly.addEventListener("click", () => {
        btnMonthly.classList.add('active');
        btnWeekly.classList.remove('active');
        periodLabel.innerText = "Month";
        viewDateRange.innerText = "February 2026";
        // Logic to refresh table data for monthly view would go here
    });

    /* --- SEARCH ANIMATION (Optional) --- */
    const searchInput = document.getElementById("employeeSearch");
    searchInput.addEventListener("focus", () => {
        searchInput.parentElement.style.boxShadow = "0 4px 20px rgba(128, 0, 0, 0.15)";
    });
    searchInput.addEventListener("blur", () => {
        searchInput.parentElement.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
    });
});