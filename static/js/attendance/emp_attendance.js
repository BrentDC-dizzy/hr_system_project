document.addEventListener("DOMContentLoaded", () => {
    // --- SIDEBAR LOGIC ---
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");

    if (closeBtn) closeBtn.addEventListener("click", () => sidebar.classList.add("collapsed"));
    if (logoToggle) logoToggle.addEventListener("click", () => sidebar.classList.toggle("collapsed"));

    const handleResize = () => {
        if (window.innerWidth <= 1100) sidebar.classList.add("collapsed");
        else sidebar.classList.remove("collapsed");
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // --- LIVE CLOCK UPDATER ---
    const currentDateTimeEl = document.getElementById("currentDateTime");
    
    function updateClock() {
        const now = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', options);
        
        // Format time to 12-hour AM/PM
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const timeString = hours + ':' + minutes + ' ' + ampm;

        if (currentDateTimeEl) {
            currentDateTimeEl.textContent = `${dateString} | ${timeString}`;
        }
    }
    
    // Update every minute
    updateClock();
    setInterval(updateClock, 60000);

    // --- CLOCK IN / CLOCK OUT LOGIC ---
    const clockInBtn = document.getElementById("clockInBtn");
    const startTimeEl = document.getElementById("startTime");
    const sessionTimeEl = document.getElementById("sessionTime");
    
    let isClockedIn = false;
    let clockInTime = null;
    let sessionInterval = null;

    if (clockInBtn) {
        clockInBtn.addEventListener("click", () => {
            if (!isClockedIn) {
                // Clock In Action
                isClockedIn = true;
                clockInBtn.textContent = "Clock out";
                clockInBtn.classList.add("is-clocked-in");
                
                // Record time
                clockInTime = new Date();
                
                // Format display time
                let h = clockInTime.getHours();
                let m = clockInTime.getMinutes();
                const ampm = h >= 12 ? 'PM' : 'AM';
                h = h % 12; h = h ? h : 12;
                m = m < 10 ? '0' + m : m;
                
                startTimeEl.textContent = `Time In: ${h}:${m} ${ampm}`;
                
                // Start session timer
                sessionInterval = setInterval(() => {
                    const now = new Date();
                    const diffMs = now - clockInTime;
                    const diffHrs = Math.floor(diffMs / 3600000);
                    const diffMins = Math.floor((diffMs % 3600000) / 60000);
                    
                    if (diffHrs > 0) {
                        sessionTimeEl.textContent = `Working for: ${diffHrs}h ${diffMins}m`;
                    } else {
                        sessionTimeEl.textContent = `Working for: ${diffMins}m`;
                    }
                }, 60000); // Update every minute
                
                // Show initial 0m state
                sessionTimeEl.textContent = `Working for: 0m`;

            } else {
                // Clock Out Action
                isClockedIn = false;
                clockInBtn.textContent = "Clock in";
                clockInBtn.classList.remove("is-clocked-in");
                
                // Reset states
                clearInterval(sessionInterval);
                startTimeEl.textContent = "Time In: --";
                sessionTimeEl.textContent = "Working for: 0h";
            }
        });
    }
});