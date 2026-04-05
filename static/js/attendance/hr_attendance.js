/**
 * hr_attendance_combined.js
 * Place at: static/js/attendance/hr_attendance_combined.js
 * ============================================================
 * Sections:
 *   1.  Element Selectors
 *   2.  Sidebar Navigation
 *   3.  Top-Level Panel Toggle
 *   4.  Attendance Log — Real-Time Clock
 *   5.  Attendance Log — Clock Out Dialog
 *   6.  Attendance Log — Header Date/Time
 *   7.  Attendance Log — History Modal Data
 *   8.  Attendance Log — Render Weekly
 *   9.  Attendance Log — Render Monthly
 *  10.  Attendance Log — View Switcher
 *  11.  Attendance Log — Period Navigation
 *  12.  Attendance Log — Open / Close History Modal
 *  13.  Attendance Monitoring — Employee Row Modal
 *  14.  Attendance Monitoring — Modal View Switcher
 *  15.  Attendance Monitoring — Filter Tag Dismiss
 *  16.  Helpers & Init
 * ============================================================
 */


/* ── 1. ELEMENT SELECTORS ────────────────────────────────── */

// Sidebar
const sidebar    = document.getElementById("sidebar");
const logoToggle = document.getElementById("logoToggle");
const closeBtn   = document.getElementById("closeBtn");
const menuItems  = document.querySelectorAll(".menu-item");

// Top-level toggle
const btnAttLog = document.getElementById("btnAttLog");
const btnAttMon = document.getElementById("btnAttMon");
const panelLog  = document.getElementById("panelLog");
const panelMon  = document.getElementById("panelMonitoring");

// Attendance Log — clock
const clockBtn            = document.getElementById("clockBtn");
const workingTimeDisplay  = document.getElementById("workingTime");
const timeInDisplay       = document.getElementById("timeInDisplay");

// Attendance Log — clock-out dialog
const clockOutOverlay     = document.getElementById("clockOutOverlay");
const clockOutConfirmStep = document.getElementById("clockOutConfirmStep");
const clockOutSuccessStep = document.getElementById("clockOutSuccessStep");
const clockOutCancelBtn   = document.getElementById("clockOutCancel");
const clockOutConfirmBtn  = document.getElementById("clockOutConfirmBtn");
const clockOutDismissBtn  = document.getElementById("clockOutDismiss");
const clockOutDurationText= document.getElementById("clockOutDurationText");

// Attendance Log — history modal
const historyModal      = document.getElementById("historyModal");
const openHistoryBtn    = document.getElementById("openHistory");
const closeHistoryBtn   = document.getElementById("closeHistory");
const weeklyViewBtn     = document.getElementById("weeklyViewBtn");
const monthlyViewBtn    = document.getElementById("monthlyViewBtn");
const historyDateRange  = document.getElementById("historyDateRange");
const weeklyTable       = document.getElementById("weeklyTable");
const weeklyTableBody   = document.getElementById("weeklyTableBody");
const monthlyGrid       = document.getElementById("monthlyGrid");
const totalHoursCount   = document.getElementById("totalHoursCount");
const prevPeriodBtn     = document.getElementById("prevPeriod");
const nextPeriodBtn     = document.getElementById("nextPeriod");

// Attendance Monitoring — employee modal
const amModal         = document.getElementById("amModal");
const closeAmModalBtn = document.getElementById("closeAmModal");
const amTableRows     = document.querySelectorAll("#amTableBody tr");
const amWeeklyBtn     = document.getElementById("amWeeklyBtn");
const amMonthlyBtn    = document.getElementById("amMonthlyBtn");
const amModalName     = document.getElementById("amModalName");
const amDateRange     = document.getElementById("amDateRange");
const amPeriodText    = document.getElementById("amPeriodText");
const amTotalHours    = document.getElementById("amTotalHours");
const amModalTableBody= document.getElementById("amModalTableBody");
const amDetPos        = document.getElementById("amDetPos");
const amDetDept       = document.getElementById("amDetDept");


/* ── 2. SIDEBAR NAVIGATION ───────────────────────────────── */

closeBtn.addEventListener("click", () => {
    sidebar.classList.add("collapsed");
});

logoToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});

menuItems.forEach(item => {
    const spanEl = item.querySelector("span");
    if (spanEl) item.setAttribute("data-text", spanEl.innerText.trim());

    item.addEventListener("click", () => {
        document.querySelector(".menu-item.active")?.classList.remove("active");
        item.classList.add("active");
    });
});


/* ── 3. TOP-LEVEL PANEL TOGGLE ───────────────────────────── */

btnAttLog.addEventListener("click", () => {
    btnAttLog.classList.add("active");
    btnAttMon.classList.remove("active");
    panelLog.classList.add("active");
    panelMon.classList.remove("active");
});

btnAttMon.addEventListener("click", () => {
    btnAttMon.classList.add("active");
    btnAttLog.classList.remove("active");
    panelMon.classList.add("active");
    panelLog.classList.remove("active");
});


/* ── 4. ATTENDANCE LOG — REAL-TIME CLOCK ────────────────── */

let timerInterval = null;
let totalSeconds  = 0;
let isClockedIn   = false;

function formatDuration(seconds) {
    const hrs  = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${String(mins).padStart(2, "0")}m`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        totalSeconds++;
        workingTimeDisplay.innerText = `Working for: ${formatDuration(totalSeconds)}`;
    }, 1000);
}

clockBtn.addEventListener("click", () => {
    if (!isClockedIn) {
        isClockedIn = true;
        clockBtn.innerText = "Clock out";
        clockBtn.classList.add("is-clocked-in");

        const now = new Date();
        timeInDisplay.innerText = `Time In: ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

        startTimer();
    } else {
        showClockOutOverlay();
    }
});


/* ── 5. ATTENDANCE LOG — CLOCK OUT DIALOG ───────────────── */

function showClockOutOverlay() {
    clockOutConfirmStep.classList.remove("clock-out-step--hidden");
    clockOutSuccessStep.classList.add("clock-out-step--hidden");
    clockOutSuccessStep.setAttribute("hidden", "");
    clockOutOverlay.classList.add("clock-out-overlay--visible");
    clockOutOverlay.setAttribute("aria-hidden", "false");
    clockOutConfirmBtn.focus();
}

function hideClockOutOverlay() {
    clockOutOverlay.classList.remove("clock-out-overlay--visible");
    clockOutOverlay.setAttribute("aria-hidden", "true");
}

function completeClockOut() {
    const label = formatDuration(totalSeconds);

    isClockedIn = false;
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds  = 0;

    clockBtn.innerText = "Clock in";
    clockBtn.classList.remove("is-clocked-in");
    workingTimeDisplay.innerText = "Working for: 0h 00m";
    timeInDisplay.innerText      = "Time In: --";

    clockOutDurationText.innerText = `Total time: ${label}`;
    clockOutConfirmStep.classList.add("clock-out-step--hidden");
    clockOutSuccessStep.classList.remove("clock-out-step--hidden");
    clockOutSuccessStep.removeAttribute("hidden");
    clockOutDismissBtn.focus();
}

clockOutCancelBtn.addEventListener("click", hideClockOutOverlay);
clockOutConfirmBtn.addEventListener("click", completeClockOut);
clockOutDismissBtn.addEventListener("click", hideClockOutOverlay);

clockOutOverlay.addEventListener("click", (e) => {
    if (e.target === clockOutOverlay) hideClockOutOverlay();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && clockOutOverlay.classList.contains("clock-out-overlay--visible")) {
        hideClockOutOverlay();
    }
});


/* ── 6. ATTENDANCE LOG — HEADER DATE/TIME ───────────────── */

function updateHeader() {
    const el = document.getElementById("dateNow");
    if (!el) return;
    const now     = new Date();
    const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    el.innerText  = `${dateStr} | ${timeStr}`;
}

setInterval(updateHeader, 60000);
updateHeader();


/* ── 7. ATTENDANCE LOG — HISTORY MODAL DATA ─────────────── */

const weeklyData = {
    0: {
        label: "February 4 – 10, 2026",
        total: "42h 15m",
        rows: [
            { date: "February 4, 2026",  day: "Tuesday",   timeIn: "8:03 AM", timeOut: "5:02 PM", hours: "8h 59m", status: "present" },
            { date: "February 5, 2026",  day: "Wednesday", timeIn: "8:15 AM", timeOut: "5:10 PM", hours: "8h 55m", status: "present" },
            { date: "February 6, 2026",  day: "Thursday",  timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "9h 00m", status: "present" },
            { date: "February 7, 2026",  day: "Friday",    timeIn: "8:45 AM", timeOut: "5:00 PM", hours: "8h 15m", status: "late"    },
            { date: "February 8, 2026",  day: "Saturday",  timeIn: "--",      timeOut: "--",       hours: "--",     status: "leave"   },
            { date: "February 9, 2026",  day: "Sunday",    timeIn: "--",      timeOut: "--",       hours: "--",     status: "holiday" },
            { date: "February 10, 2026", day: "Monday",    timeIn: "8:03 AM", timeOut: "5:02 PM", hours: "8h 59m", status: "present" },
        ]
    },
    1: {
        label: "January 28 – February 3, 2026",
        total: "35h 49m",
        rows: [
            { date: "January 28, 2026", day: "Wednesday", timeIn: "8:10 AM", timeOut: "5:05 PM", hours: "8h 55m", status: "present" },
            { date: "January 29, 2026", day: "Thursday",  timeIn: "8:00 AM", timeOut: "5:00 PM", hours: "9h 00m", status: "present" },
            { date: "January 30, 2026", day: "Friday",    timeIn: "--",      timeOut: "--",       hours: "--",     status: "absent"  },
            { date: "January 31, 2026", day: "Saturday",  timeIn: "--",      timeOut: "--",       hours: "--",     status: "holiday" },
            { date: "February 1, 2026", day: "Sunday",    timeIn: "--",      timeOut: "--",       hours: "--",     status: "holiday" },
            { date: "February 2, 2026", day: "Monday",    timeIn: "8:03 AM", timeOut: "5:02 PM", hours: "8h 59m", status: "present" },
            { date: "February 3, 2026", day: "Tuesday",   timeIn: "8:20 AM", timeOut: "5:15 PM", hours: "8h 55m", status: "present" },
        ]
    }
};

const monthlyData = {
    0: {
        label: "February 2026",
        firstDayOfWeek: 0,
        daysInMonth: 28,
        total: "152h 30m",
        attendance: {
            3:  { status: "present", hours: "8h 59m" },
            4:  { status: "present", hours: "8h 55m" },
            5:  { status: "present", hours: "9h 00m" },
            6:  { status: "late",    hours: "8h 15m" },
            7:  { status: "leave",   hours: "--"      },
            8:  { status: "holiday", hours: "--"      },
            9:  { status: "absent",  hours: "--"      },
            10: { status: "present", hours: "8h 59m" },
            11: { status: "present", hours: "9h 00m" },
            12: { status: "present", hours: "8h 45m" },
            13: { status: "present", hours: "8h 59m" },
            14: { status: "present", hours: "9h 00m" },
            15: { status: "leave",   hours: "--"      },
            16: { status: "holiday", hours: "--"      },
        }
    },
    1: {
        label: "January 2026",
        firstDayOfWeek: 4,
        daysInMonth: 31,
        total: "148h 02m",
        attendance: {
            5:  { status: "present", hours: "9h 00m" },
            6:  { status: "present", hours: "8h 55m" },
            7:  { status: "present", hours: "8h 40m" },
            8:  { status: "present", hours: "9h 00m" },
            9:  { status: "present", hours: "8h 59m" },
            12: { status: "present", hours: "9h 00m" },
            13: { status: "present", hours: "8h 50m" },
            14: { status: "late",    hours: "8h 20m" },
            15: { status: "present", hours: "8h 59m" },
            16: { status: "present", hours: "9h 00m" },
        }
    }
};

// Modal state
let currentView = "weekly";
let weekOffset  = 0;
let monthOffset = 0;


/* ── 8. ATTENDANCE LOG — RENDER WEEKLY ──────────────────── */

function renderWeekly() {
    const data = weeklyData[weekOffset] ?? weeklyData[0];
    historyDateRange.textContent = data.label;
    totalHoursCount.textContent  = data.total;

    const rows = data.rows.map(r => `
        <tr>
            <td>${r.date}</td>
            <td>${r.day}</td>
            <td>${r.timeIn}</td>
            <td>${r.timeOut}</td>
            <td>${r.hours}</td>
            <td><span class="status-badge ${r.status}">${capitalize(r.status)}</span></td>
        </tr>
    `).join("");

    const totalRow = `
        <tr class="total-row">
            <td colspan="4">Total Hours This Week</td>
            <td colspan="2">${data.total}</td>
        </tr>
    `;

    weeklyTableBody.innerHTML = rows + totalRow;
}


/* ── 9. ATTENDANCE LOG — RENDER MONTHLY ─────────────────── */

function renderMonthly() {
    const data     = monthlyData[monthOffset] ?? monthlyData[0];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    historyDateRange.textContent = data.label;
    totalHoursCount.textContent  = data.total;

    let html = dayNames.map(d => `<div class="month-day-header">${d}</div>`).join("");

    for (let i = 0; i < data.firstDayOfWeek; i++) {
        html += `<div class="month-day-cell empty"></div>`;
    }

    for (let d = 1; d <= data.daysInMonth; d++) {
        const dayOfWeek  = (data.firstDayOfWeek + d - 1) % 7;
        const isWeekend  = dayOfWeek === 0 || dayOfWeek === 6;
        const att        = data.attendance[d];
        const statusClass= att ? att.status : (isWeekend ? "weekend" : "");
        const statusLabel= att ? capitalize(att.status) : (isWeekend ? "Off" : "");
        const hoursLabel = att ? att.hours : "";

        html += `
            <div class="month-day-cell">
                <span class="day-num-cal">${d}</span>
                ${statusClass ? `<span class="day-status ${statusClass}">${statusLabel}</span>` : ""}
                ${hoursLabel  ? `<span class="day-hours">${hoursLabel}</span>` : ""}
            </div>
        `;
    }

    monthlyGrid.innerHTML = html;
}


/* ── 10. ATTENDANCE LOG — VIEW SWITCHER ─────────────────── */

function switchHistoryView(view) {
    currentView = view;

    if (view === "weekly") {
        weeklyViewBtn.classList.add("active");
        monthlyViewBtn.classList.remove("active");
        weeklyTable.style.display = "table";
        monthlyGrid.classList.remove("active");
        renderWeekly();
    } else {
        monthlyViewBtn.classList.add("active");
        weeklyViewBtn.classList.remove("active");
        weeklyTable.style.display = "none";
        monthlyGrid.classList.add("active");
        renderMonthly();
    }
}

weeklyViewBtn.addEventListener("click",  () => switchHistoryView("weekly"));
monthlyViewBtn.addEventListener("click", () => switchHistoryView("monthly"));


/* ── 11. ATTENDANCE LOG — PERIOD NAVIGATION ─────────────── */

prevPeriodBtn.addEventListener("click", () => {
    if (currentView === "weekly") {
        weekOffset = Math.min(weekOffset + 1, Object.keys(weeklyData).length - 1);
        renderWeekly();
    } else {
        monthOffset = Math.min(monthOffset + 1, Object.keys(monthlyData).length - 1);
        renderMonthly();
    }
});

nextPeriodBtn.addEventListener("click", () => {
    if (currentView === "weekly") {
        weekOffset = Math.max(weekOffset - 1, 0);
        renderWeekly();
    } else {
        monthOffset = Math.max(monthOffset - 1, 0);
        renderMonthly();
    }
});


/* ── 12. ATTENDANCE LOG — OPEN / CLOSE HISTORY MODAL ────── */

openHistoryBtn.addEventListener("click", () => {
    historyModal.classList.add("open");
});

closeHistoryBtn.addEventListener("click", () => {
    historyModal.classList.remove("open");
});

historyModal.addEventListener("click", (e) => {
    if (e.target === historyModal) historyModal.classList.remove("open");
});


/* ── 13. ATTENDANCE MONITORING — EMPLOYEE ROW MODAL ─────── */

amTableRows.forEach(row => {
    row.style.cursor = "pointer";
    row.addEventListener("click", () => {
        amModalName.innerText  = row.querySelector(".name")?.innerText  || "";
        amDetPos.innerText     = row.querySelector(".title")?.innerText || "";
        amDetDept.innerText    = row.querySelector(".dept-badge")?.innerText || "";
        switchAmView("weekly");
        amModal.style.display = "block";
    });
});

closeAmModalBtn.onclick = () => { amModal.style.display = "none"; };

window.addEventListener("click", (e) => {
    if (e.target === amModal) amModal.style.display = "none";
});


/* ── 14. ATTENDANCE MONITORING — MODAL VIEW SWITCHER ─────── */

amWeeklyBtn.addEventListener("click",  (e) => { e.stopPropagation(); switchAmView("weekly");  });
amMonthlyBtn.addEventListener("click", (e) => { e.stopPropagation(); switchAmView("monthly"); });

function switchAmView(type) {
    if (type === "weekly") {
        amWeeklyBtn.classList.add("active");
        amMonthlyBtn.classList.remove("active");
        amDateRange.innerText   = "February 4 – 10, 2026";
        amPeriodText.innerText  = "Week";
        amTotalHours.innerText  = "42h 15m";
        renderAmRows(7);
    } else {
        amMonthlyBtn.classList.add("active");
        amWeeklyBtn.classList.remove("active");
        amDateRange.innerText   = "February 2026";
        amPeriodText.innerText  = "Month";
        amTotalHours.innerText  = "160h 00m";
        renderAmRows(20);
    }
}

function renderAmRows(rowCount) {
    if (!amModalTableBody) return;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    amModalTableBody.innerHTML = "";

    for (let i = 1; i <= rowCount; i++) {
        const dayNum = i + 3;
        amModalTableBody.innerHTML += `
            <tr>
                <td>February ${dayNum}, 2026</td>
                <td>${days[(dayNum + 1) % 7]}</td>
                <td>8:03 AM</td>
                <td>5:02 PM</td>
                <td>8h 59m</td>
                <td><span class="am-pill pill-green">Present</span></td>
            </tr>
        `;
    }
}


/* ── 15. ATTENDANCE MONITORING — FILTER TAG DISMISS ──────── */

const filterTag = document.querySelector(".filter-tag");
if (filterTag) {
    filterTag.querySelector(".fa-times")?.addEventListener("click", (e) => {
        e.stopPropagation();
        filterTag.style.display = "none";
    });
}


/* ── 16. HELPERS & INIT ──────────────────────────────────── */

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Boot history modal in weekly view
switchHistoryView("weekly");