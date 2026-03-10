document.addEventListener("DOMContentLoaded", () => {
    // --- UI Elements ---
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");

    const searchInput = document.getElementById("tableSearch");
    const tableBody = document.getElementById("applicationTableBody");
    const noResultsRow = document.getElementById("noResultsRow");
    const rows = tableBody.querySelectorAll("tr:not(#noResultsRow)");

    const viewModal = document.getElementById("viewModal");
    const posModal = document.getElementById("positionChangeModal");
    const posForm = document.getElementById("positionChangeForm");

    const newEmpTabBtn = document.getElementById("newEmpTabBtn");
    const posChangeTabBtn = document.getElementById("posChangeTabBtn");

    // --- Search Functionality ---
    if (searchInput) {
        searchInput.addEventListener("keyup", () => {
            const filter = searchInput.value.toLowerCase();
            let visibleCount = 0;

            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                if (text.includes(filter)) {
                    row.style.display = "";
                    visibleCount++;
                } else {
                    row.style.display = "none";
                }
            });

            // Toggle "No Results" row
            if (noResultsRow) {
                noResultsRow.style.display = visibleCount === 0 ? "" : "none";
            }
        });
    }

    // --- Sidebar Toggle & Expansion Logic ---
    // Closes the sidebar when the chevron-left is clicked
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            sidebar.classList.add("collapsed");
        });
    }

    // Re-opens/Expands the sidebar when clicking the logo/wrapper while collapsed
    if (logoToggle) {
        logoToggle.addEventListener("click", () => {
            if (sidebar.classList.contains("collapsed")) {
                sidebar.classList.remove("collapsed");
            }
        });
    }

    // --- Modal Management ---
    const openModal = (modal) => {
        if (modal) {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden"; // Prevent background scroll
        }
    };

    const closeAllModals = () => {
        [viewModal, posModal].forEach(m => { 
            if (m) m.style.display = "none"; 
        });
        document.body.style.overflow = ""; // Restore scroll
    };

    // View Modal Trigger
    document.querySelectorAll(".view-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            showSlide(1);
            openModal(viewModal);
        });
    });

    // Close Buttons
    document.querySelectorAll(".modal-close, #cancelRequest, #modalClose, #posClose").forEach(btn => {
        btn.addEventListener("click", closeAllModals);
    });

    // Close on clicking the darkened overlay
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });

    // --- Tab Switching ---
    const setActiveTab = (clicked, other) => {
        clicked.classList.add("active");
        clicked.classList.remove("secondary");
        other.classList.add("secondary");
        other.classList.remove("active");
    };

    if (newEmpTabBtn && posChangeTabBtn) {
        newEmpTabBtn.addEventListener("click", () => {
            setActiveTab(newEmpTabBtn, posChangeTabBtn);
        });

        posChangeTabBtn.addEventListener("click", () => {
            setActiveTab(posChangeTabBtn, newEmpTabBtn);
            openModal(posModal);
        });
    }

    // --- Slide Control (View Modal) ---
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

    // --- Form Submission (Mock) ---
    if (posForm) {
        posForm.addEventListener("submit", (e) => {
            e.preventDefault();
            // You can add your AJAX call here to save to MySQL
            console.log("Position Change Data Submitted");
            closeAllModals();
        });
    }
});