/* --- UI Elements Initialization --- */
const sidebar = document.getElementById("sidebar");
const logoToggle = document.getElementById("logoToggle");
const closeBtn = document.getElementById("closeBtn");
const modal = document.getElementById("viewModal");
const closeModal = document.getElementById("modalClose");

/* --- Slide Elements (Frame View) --- */
const nextBtn = document.getElementById("nextSlide");
const prevBtn = document.getElementById("prevSlide");
const slide1 = document.getElementById("slide1");
const slide2 = document.getElementById("slide2");
const docImg = document.querySelector(".doc-image");

/* --- Sidebar Logic --- */

// Collapse Sidebar
closeBtn.addEventListener("click", () => {
    sidebar.classList.add("collapsed");
});

// Expand Sidebar (Clicking logo area when collapsed)
logoToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
    }
});

// Set tooltips for collapsed state based on menu text
document.querySelectorAll(".menu-item").forEach(item => {
    const spanText = item.querySelector("span")?.innerText || "";
    item.setAttribute("data-text", spanText);
});

/* --- Slide Navigation Logic --- */

/**
 * Toggles between Applicant Info (Slide 1) and Document Preview (Slide 2)
 * @param {number} slideNumber 
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

// Event Listeners for Pagination Arrows
if (nextBtn) nextBtn.addEventListener("click", () => showSlide(2));
if (prevBtn) prevBtn.addEventListener("click", () => showSlide(1));

/* --- Image Handling (Slide 2) --- */

/**
 * Ensures no "broken image" icon appears if the source is missing or invalid.
 */
if (docImg) {
    // If the image fails to load, hide the element entirely
    docImg.onerror = function() {
        this.style.display = "none";
        console.warn("Document image failed to load or path is incorrect.");
    };

    // If no src is set yet, keep it hidden
    if (!docImg.getAttribute('src') || docImg.getAttribute('src') === "") {
        docImg.style.display = "none";
    } else {
        docImg.style.display = "block";
    }
}

/* --- Modal Control Logic --- */

/**
 * Opens the "Frame View" Modal
 */
document.querySelectorAll(".view-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        showSlide(1); // Reset to first slide every time it opens
        modal.style.display = "flex";
    });
});

/**
 * Closes the Modal
 */
const closeViewModal = () => {
    modal.style.display = "none";
};

if (closeModal) {
    closeModal.addEventListener("click", closeViewModal);
}

// Close modal if user clicks on the dark overlay background
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeViewModal();
    }
});

// Close modal when pressing the Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
        closeViewModal();
    }
});

/* --- Modal Action Buttons --- */

// Approve Button Logic
document.querySelector(".modal-approve")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to approve this application?")) {
        alert("Application has been approved.");
        closeViewModal();
        // You would typically trigger a database update here
    }
});

// Reject Button Logic
document.querySelector(".modal-reject")?.addEventListener("click", () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason !== null && reason.trim() !== "") {
        alert("Application has been rejected.");
        closeViewModal();
    } else if (reason !== null) {
        alert("Rejection requires a reason.");
    }
});