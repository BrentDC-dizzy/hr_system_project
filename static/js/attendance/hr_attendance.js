/**
 * combined_attendance.js
 * Integrated logic for Attendance Log & Monitoring
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ── 1. ELEMENT SELECTORS ────────────────────────────────── */

    // Sidebar
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");
    const menuItems = document.querySelectorAll(".menu-item");

    // View Switcher Toggles
    const btnLog = document.getElementById('btnLog');
    const btnMonitoring = document.getElementById('btnMonitoring');
    const sectionLog = document.getElementById('sectionLog');
    const sectionMonitoring = document.getElementById('sectionMonitoring');
    const pageTitle = document.getElementById('pageTitle');

    // Attendance Clock (Log View)
    const clockBtn = document.getElementById("clockBtn");
    const workingTimeDisplay = document.getElementById("workingTime");
    const timeInDisplay = document.getElementById("timeInDisplay");
    const clockOutOverlay = document.getElementById("clockOutOverlay");

    // Monitoring View (HR)
    const monitoringRows = document.querySelectorAll(".monitoring-table tbody tr");
    const employeeModal = document.getElementById("employeeModal");


    /* ── 2. VIEW SWITCHER LOGIC ──────────────────────────────── */

    function switchView(view) {
        if (view === 'log') {
            btnLog.classList.add('active');
            btnMonitoring.classList.remove('active');
            sectionLog.style.display = 'block';
            sectionMonitoring.style.display = 'none';
            pageTitle.innerText = "Attendance Log";
        } else {
            btnMonitoring.classList.add('active');
            btnLog.classList.remove('active');
            sectionLog.style.display = 'none';
            sectionMonitoring.style.display = 'block';
            pageTitle.innerText = "Attendance Monitoring";
        }
    }

    btnLog.addEventListener('click', () => switchView('log'));
    btnMonitoring.addEventListener('click', () => switchView('monitoring'));


    /* ── 3. SIDEBAR LOGIC ────────────────────────────────────── */

    if (logoToggle) {
        logoToggle.addEventListener("click", () => sidebar.classList.toggle("collapsed"));
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => sidebar.classList.add("collapsed"));
    }

    // Tooltip data-text for collapsed state
    menuItems.forEach(item => {
        const spanEl = item.querySelector("span");
        if (spanEl) item.setAttribute("data-text", spanEl.innerText);
    });


    /* ── 4. REAL-TIME CLOCK TIMER (Log View) ─────────────────── */

    let timerInterval = null;
    let totalSeconds = 0;
    let isClockedIn = false;

    function formatDuration(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hrs}h ${mins.toString().padStart(2, "0")}m`;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            totalSeconds++;
            workingTimeDisplay.innerText = `Working for: ${formatDuration(totalSeconds)}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    clockBtn.addEventListener("click", () => {
        if (!isClockedIn) {
            // Clocking In
            isClockedIn = true;
            clockBtn.innerText = "Clock Out";
            clockBtn.classList.add("is-clocked-in");
            
            const now = new Date();
            timeInDisplay.innerText = `Time In: ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
            
            startTimer();
        } else {
            // Clocking Out (Logic for showing overlay/confirming)
            const confirmOut = confirm("Are you sure you want to clock out?");
            if (confirmOut) {
                isClockedIn = false;
                stopTimer();
                clockBtn.innerText = "Clock In";
                clockBtn.classList.remove("is-clocked-in");
                alert(`Shift ended. Total time: ${formatDuration(totalSeconds)}`);
                totalSeconds = 0;
                workingTimeDisplay.innerText = "Working for: 0h";
                timeInDisplay.innerText = "Time In: --";
            }
        }
    });


    /* ── 5. MONITORING MODAL LOGIC ──────────────────────────── */

    monitoringRows.forEach(row => {
        row.addEventListener("click", () => {
            const name = row.querySelector(".name").innerText;
            // You can populate your modal fields here based on the clicked row
            console.log(`Opening attendance history for: ${name}`);
            // if (employeeModal) employeeModal.classList.add("open");
        });
    });


    /* ── 6. HEADER DATE/TIME UPDATER ────────────────────────── */

    function updateHeaderTime() {
        const dateElement = document.querySelector(".date-now");
        if (dateElement) {
            const now = new Date();
            const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
            const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            dateElement.innerText = `${dateStr} | ${timeStr}`;
        }
    }

    setInterval(updateHeaderTime, 60000); // Update every minute
    updateHeaderTime(); // Initial call


    /* ── 7. RESPONSIVE HELPERS ───────────────────────────────── */

    const handleResize = () => {
        if (window.innerWidth <= 1100) {
            sidebar.classList.add("collapsed");
        }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Run on load
});