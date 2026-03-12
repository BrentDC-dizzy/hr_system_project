document.addEventListener("DOMContentLoaded", () => {
    // --- Elements ---
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");
    const mainContent = document.getElementById("mainContent");
    const menuItems = document.querySelectorAll(".menu-item");
    
    const modal = document.getElementById("trainingModal");
    const closeModal = document.getElementById("closeModal");
    const searchInput = document.getElementById("trainingSearch");
    const trainingCards = document.querySelectorAll(".training-card");

    // --- Sidebar Toggle Logic ---
    closeBtn.addEventListener("click", () => {
        sidebar.classList.add("collapsed");
        if (mainContent) mainContent.style.marginLeft = "100px";
    });

    logoToggle.addEventListener("click", () => {
        if (sidebar.classList.contains("collapsed")) {
            sidebar.classList.remove("collapsed");
            if (mainContent) mainContent.style.marginLeft = "340px";
        }
    });

    // Add tooltips for collapsed sidebar
    menuItems.forEach(item => {
        const span = item.querySelector("span");
        if (span) item.setAttribute("data-text", span.innerText);
    });

    // --- Search / Filter Logic ---
    if (searchInput) {
        searchInput.addEventListener("keyup", () => {
            const filter = searchInput.value.toLowerCase();
            trainingCards.forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(filter) ? "" : "none";
            });
        });
    }

    // --- Modal Logic (View Training Details) ---
    trainingCards.forEach(card => {
        card.addEventListener("click", (e) => {
            // 1. If the user clicks the "Register" button, handle registration instead of opening details
            if (e.target.classList.contains('btn-register')) {
                const name = card.querySelector(".training-card-title").textContent;
                alert(`Successfully registered for: ${name}`);
                return; 
            }

            // 2. Extract data from the clicked card
            const title = card.querySelector(".training-card-title").innerText;
            const category = card.querySelector(".training-card-category").innerText;
            const dateStr = card.querySelector(".training-card-date").innerText;
            const modeTag = card.querySelector(".tag-mode").innerText;

            // 3. Extract hidden data from 'data-' attributes
            const description = card.getAttribute('data-description');
            const trainer = card.getAttribute('data-trainer');
            const location = card.getAttribute('data-location');
            const email = card.getAttribute('data-email');
            const phone = card.getAttribute('data-phone');

            // 4. Update Modal Content
            document.getElementById("modalTitle").innerText = title;
            document.getElementById("modalSubtext").innerText = `${category} | ${modeTag} | ${dateStr.split(' • ')[0]}`;
            
            document.getElementById("modalDesc").innerText = description || "N/A";
            document.getElementById("modalTrainer").innerText = trainer || "N/A";
            document.getElementById("modalLocation").innerText = location || "N/A";
            document.getElementById("modalEmail").innerText = email || "N/A";
            document.getElementById("modalPhone").innerText = phone || "N/A";

            // 5. Show the Modal
            modal.classList.add("active");
        });
    });

    // --- Close Modal Logic ---
    if (closeModal) {
        closeModal.addEventListener("click", () => {
            modal.classList.remove("active");
        });
    }

    // Close when clicking the dark background overlay
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    // Close on 'Escape' key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            modal.classList.remove("active");
        }
    });
});