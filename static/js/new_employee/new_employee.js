document.addEventListener("DOMContentLoaded", () => {
    // --- UI Elements ---
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");

    const viewModal = document.getElementById("viewModal");
    const posModal = document.getElementById("positionChangeModal");
    const posForm = document.getElementById("positionChangeForm");

    // Tab Buttons
    const newEmpTabBtn = document.getElementById("newEmpTabBtn");
    const posChangeTabBtn = document.getElementById("posChangeTabBtn");

    const positionSelect = document.querySelector('#positionChangeForm select');
    const statusBanner = document.querySelector(".timeline-status-banner");
    const timelineList = document.querySelector(".timeline-list");
    const statusTimelineBox = document.getElementById("statusTimelineBox");
    const submissionTimestamp = document.getElementById("submissionTimestamp");

    /* --- Tab Switching Logic --- */
    const setActiveTab = (clickedBtn, otherBtn) => {
        clickedBtn.classList.add("active");
        clickedBtn.classList.remove("secondary");
        
        otherBtn.classList.add("secondary");
        otherBtn.classList.remove("active");
    };

    if (newEmpTabBtn) {
        newEmpTabBtn.addEventListener("click", (e) => {
            e.preventDefault();
            setActiveTab(newEmpTabBtn, posChangeTabBtn);
            // Add logic here if you want to filter the table for New Employees
        });
    }

    if (posChangeTabBtn) {
        posChangeTabBtn.addEventListener("click", (e) => {
            e.preventDefault();
            setActiveTab(posChangeTabBtn, newEmpTabBtn);
            openPosModal(); // Opens the modal as requested
        });
    }

    /* --- Sidebar Logic --- */
    if (closeBtn) {
        closeBtn.addEventListener("click", () => sidebar.classList.add("collapsed"));
    }
    if (logoToggle) {
        logoToggle.addEventListener("click", () => {
            if (sidebar.classList.contains("collapsed")) sidebar.classList.remove("collapsed");
        });
    }

    /* --- Modal Navigation --- */
    const openViewModal = () => {
        if (viewModal) {
            showSlide(1); 
            viewModal.style.display = "flex";
        }
    };

    const openPosModal = () => {
        if (posModal) posModal.style.display = "flex";
    };

    const closeAllModals = () => {
        if (viewModal) viewModal.style.display = "none";
        if (posModal) posModal.style.display = "none";
    };

    document.querySelectorAll(".view-link").forEach(link => link.addEventListener("click", (e) => {
        e.preventDefault();
        openViewModal();
    }));

    document.getElementById("modalClose")?.addEventListener("click", closeAllModals);
    document.getElementById("posClose")?.addEventListener("click", closeAllModals);
    document.getElementById("cancelRequest")?.addEventListener("click", closeAllModals);

    /* --- Slide Control --- */
    function showSlide(n) {
        const s1 = document.getElementById("slide1");
        const s2 = document.getElementById("slide2");
        if (n === 1) {
            s1?.classList.add("active");
            s2?.classList.remove("active");
        } else {
            s1?.classList.remove("active");
            s2?.classList.add("active");
        }
    }

    document.getElementById("nextSlide")?.addEventListener("click", () => showSlide(2));
    document.getElementById("prevSlide")?.addEventListener("click", () => showSlide(1));

    /* --- Form Submission --- */
    if (posForm) {
        posForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                               .replace("AM", "A.M.").replace("PM", "P.M.");
            
            const fullTimestamp = `${dateStr} - ${timeStr}`;

            if (statusTimelineBox && submissionTimestamp) {
                submissionTimestamp.innerText = fullTimestamp;
                statusTimelineBox.style.display = "block"; 
            }

            const selectedPos = positionSelect.value;
            if (statusBanner) {
                statusBanner.innerHTML = `<i class="fas fa-exclamation-circle"></i> Pending - For ${selectedPos} Approval`;
            }

            alert("Success: The position change request has been logged.");
            closeAllModals();
        });
    }

    // Global Close
    window.addEventListener("click", (e) => {
        if (e.target === viewModal || e.target === posModal) closeAllModals();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeAllModals();
    });
});