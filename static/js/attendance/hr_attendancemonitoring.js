/**
 * hr_attendance.js
 * Logic for the Attendance Monitoring Portal
 */

document.addEventListener("DOMContentLoaded", () => {
    /* ── 1. ELEMENT SELECTORS ── */
    
    // Sidebar
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");
    const menuItems = document.querySelectorAll(".menu-item");

    // Search and Filtering
    const searchInput = document.querySelector(".search-pill input");
    const tableRows = document.querySelectorAll(".attendance-table tbody tr");

    // Modal Elements
    const employeeModal = document.getElementById("employeeModal");
    const closeModal = document.querySelector(".close-modal");
    const modalTableBody = document.getElementById("modalTableBody");
    const weeklyViewBtn = document.getElementById("weeklyViewBtn");
    const monthlyViewBtn = document.getElementById("monthlyViewBtn");

    /* ── 2. SIDEBAR LOGIC ── */
    
    // Collapse/Expand Sidebar
    if (closeBtn) {
        closeBtn.addEventListener("click", () => sidebar.classList.add("collapsed"));
    }

    if (logoToggle) {
        logoToggle.addEventListener("click", () => sidebar.classList.toggle("collapsed"));
    }

    // Set active state for menu items
    menuItems.forEach(item => {
        const span = item.querySelector("span");
        if (span) item.setAttribute("data-text", span.innerText);

        item.addEventListener("click", function() {
            menuItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");
        });
    });

    /* ── 3. SEARCH / FILTER LOGIC ── */

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase();

            tableRows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(searchTerm) ? "" : "none";
            });
        });
    }

    /* ── 4. MODAL & DATA RENDERING ── */

    // Sample Data for Modal
    const attendanceData = [
        { date: "Feb 10, 2026", day: "Monday", in: "08:03 AM", out: "05:02 PM", hours: "8h 59m", status: "present" },
        { date: "Feb 09, 2026", day: "Sunday", in: "--", out: "--", hours: "--", status: "holiday" },
        { date: "Feb 08, 2026", day: "Saturday", in: "--", out: "--", hours: "--", status: "leave" },
        { date: "Feb 07, 2026", day: "Friday", in: "08:45 AM", out: "05:00 PM", hours: "8h 15m", status: "late" },
        { date: "Feb 06, 2026", day: "Thursday", in: "08:00 AM", out: "05:00 PM", hours: "9h 00m", status: "present" }
    ];

    function populateModalTable(data) {
        modalTableBody.innerHTML = "";
        data.forEach(item => {
            const row = `
                <tr>
                    <td>${item.date}</td>
                    <td>${item.day}</td>
                    <td>${item.in}</td>
                    <td>${item.out}</td>
                    <td>${item.hours}</td>
                    <td><span class="status-badge ${item.status}">${item.status.toUpperCase()}</span></td>
                </tr>
            `;
            modalTableBody.insertAdjacentHTML("beforeend", row);
        });
    }

    // Open Modal when clicking an employee name or row
    tableRows.forEach(row => {
        row.addEventListener("click", () => {
            const empName = row.querySelector(".name").innerText;
            document.getElementById("modalEmployeeName").innerText = empName;
            populateModalTable(attendanceData);
            employeeModal.style.display = "block";
        });
    });

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener("click", () => {
            employeeModal.style.display = "none";
        });
    }

    // Close Modal on outside click
    window.addEventListener("click", (e) => {
        if (e.target === employeeModal) {
            employeeModal.style.display = "none";
        }
    });

    /* ── 5. MODAL VIEW TOGGLES ── */

    if (weeklyViewBtn && monthlyViewBtn) {
        weeklyViewBtn.addEventListener("click", () => {
            weeklyViewBtn.classList.add("active");
            monthlyViewBtn.classList.remove("active");
            document.getElementById("periodText").innerText = "Week";
            // Logic to switch to weekly data goes here
        });

        monthlyViewBtn.addEventListener("click", () => {
            monthlyViewBtn.classList.add("active");
            weeklyViewBtn.classList.remove("active");
            document.getElementById("periodText").innerText = "Month";
            // Logic to switch to monthly data goes here
        });
    }

    /* ── 6. HEADER CLOCK (Optional) ── */
    function updateHeaderClock() {
        const dateNow = document.getElementById("dateNow");
        if (dateNow) {
            const now = new Date();
            const options = { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            dateNow.innerText = now.toLocaleDateString('en-US', options).replace(',', ' |');
        }
    }
    
    setInterval(updateHeaderClock, 60000);
    updateHeaderClock();
});