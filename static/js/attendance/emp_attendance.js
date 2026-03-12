/**
 * UI Elements
 */
const sidebar = document.getElementById("sidebar");
const logoToggle = document.getElementById("logoToggle");
const closeBtn = document.getElementById("closeBtn");
const menuItems = document.querySelectorAll(".menu-item");

// Attendance Elements
const clockBtn = document.querySelector(".btn-clock-in");
const workingTimeDisplay = document.querySelector(".attendance-stats p:first-child");
const timeInDisplay = document.querySelector(".attendance-stats p:last-child");

/**
 * SIDEBAR LOGIC
 */

// Close button (only when expanded)
closeBtn.addEventListener("click", () => {
    sidebar.classList.add("collapsed");
});

// Open via logo click
logoToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
    }
});

// Active State & Tooltip Setup
menuItems.forEach(item => {
    // Grab text from span for the tooltip attribute
    const span = item.querySelector("span");
    if (span) {
        item.setAttribute("data-text", span.innerText);
    }

    item.addEventListener("click", () => {
        document.querySelector(".menu-item.active")?.classList.remove("active");
        item.classList.add("active");
    });
});


/**
 * ATTENDANCE & CLOCK-IN LOGIC
 */
let timerInterval = null;
let seconds = 0;
let isClockedIn = false;

function formatTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    // Return formatted string like "1h 05m 12s" or "0h 10m"
    return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
}

function updateClock() {
    seconds++;
    workingTimeDisplay.innerHTML = `Working for: ${formatTime(seconds)}`;
}

clockBtn.addEventListener("click", () => {
    if (!isClockedIn) {
        // Start Clocking In
        isClockedIn = true;
        clockBtn.innerText = "Clock out";
        clockBtn.style.background = "#8b0000"; // Change to dark red for "Clock out"
        
        // Record Time In
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeInDisplay.innerHTML = `Time In: ${timeString}`;

        // Start Timer
        timerInterval = setInterval(updateClock, 1000);
    } else {
        // Stop Clocking In
        isClockedIn = false;
        clearInterval(timerInterval);
        clockBtn.innerText = "Clock in";
        clockBtn.style.background = "#2d5a27"; // Reset to green
        
        alert(`Shift ended. Total time worked: ${formatTime(seconds)}`);
        
        // Reset (Optional: reset seconds to 0 for next shift)
        // seconds = 0;
    }
});