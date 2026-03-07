/* --- UI Elements Initialization --- */
// Sidebar
const sidebar = document.getElementById("sidebar");
const logoToggle = document.getElementById("logoToggle");
const closeBtn = document.getElementById("closeBtn");

// Applicant View Modal (Applications Management)
const viewModal = document.getElementById("viewModal");
const closeModal = document.getElementById("modalClose");
const nextBtn = document.getElementById("nextSlide");
const prevBtn = document.getElementById("prevSlide");
const slide1 = document.getElementById("slide1");
const slide2 = document.getElementById("slide2");

// Log New Request Modal (Position Change Request)
const posModal = document.getElementById("positionChangeModal");
const posBtn = document.getElementById("posRequestBtn"); // Sidebar item
const logNewBtn = document.querySelector(".plus-log-btn"); // + Log New Request button
const cancelReq = document.getElementById("cancelRequest");
const posForm = document.getElementById("positionChangeForm");

// Table & Search
const searchInput = document.querySelector('.search-input-wrapper input');
const tableRows = document.querySelectorAll('tbody tr');

/* --- Sidebar Logic --- */
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        sidebar.classList.add("collapsed");
    });
}

if (logoToggle) {
    logoToggle.addEventListener("click", () => {
        if (sidebar.classList.contains("collapsed")) {
            sidebar.classList.remove("collapsed");
        }
    });
}

/* --- Search Functionality --- */
// Filters table rows based on Name, ID, Dept, or Position
if (searchInput) {
    searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase().trim();
        tableRows.forEach((row) => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(searchTerm) ? "" : "none";
        });
    });
}

/* --- Modal Navigation & Logic --- */

// Helper to close all open modals
const closeAllModals = () => {
    if (viewModal) viewModal.style.display = "none";
    if (posModal) posModal.style.display = "none";
};

/** * Applicant View Slide Control 
 * Swaps between details (1/2) and document view (2/2)
 */
function showSlide(slideNumber) {
    if (slideNumber === 1) {
        slide1.classList.add("active");
        slide2.classList.remove("active");
    } else {
        slide1.classList.remove("active");
        slide2.classList.add("active");
    }
}

// Event Listeners for Applicant View
if (nextBtn) nextBtn.addEventListener("click", () => showSlide(2));
if (prevBtn) prevBtn.addEventListener("click", () => showSlide(1));

document.querySelectorAll(".view-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        showSlide(1); 
        viewModal.style.display = "flex";
    });
});

/* --- Position Change Request Logic --- */

// Open Log New Request Modal
const openPosModal = (e) => {
    if (e) e.preventDefault();
    if (posModal) posModal.style.display = "flex";
};

if (posBtn) posBtn.addEventListener("click", openPosModal);
if (logNewBtn) logNewBtn.addEventListener("click", openPosModal);

// Close triggers
if (closeModal) closeModal.addEventListener("click", closeAllModals);
if (cancelReq) cancelReq.addEventListener("click", closeAllModals);

// Form Submission Action
if (posForm) {
    posForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Here you would typically handle the data transmission
        alert("Success: The position change request has been logged.");
        closeAllModals();
        posForm.reset();
    });
}

/* --- Global Listeners --- */

// Close on outside click
window.addEventListener("click", (e) => {
    if (e.target === viewModal || e.target === posModal) {
        closeAllModals();
    }
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeAllModals();
    }
});