document.addEventListener("DOMContentLoaded", () => {
    // 1. SELECT ELEMENTS
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");
    const cvInput = document.getElementById("cv-upload");
    const fileNameDisplay = document.getElementById("file-name");
    const menuItems = document.querySelectorAll(".menu-item");

    // 2. SIDEBAR LOGIC
    // Close sidebar
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            sidebar.classList.add("collapsed");
        });
    }

    // Open sidebar via logo
    if (logoToggle) {
        logoToggle.addEventListener("click", () => {
            if (sidebar.classList.contains("collapsed")) {
                sidebar.classList.remove("collapsed");
            }
        });
    }

    // 3. FILE UPLOAD LOGIC
    // Updates the text to the chosen file name
    if (cvInput && fileNameDisplay) {
        cvInput.addEventListener("change", function() {
            if (this.files && this.files.length > 0) {
                const name = this.files[0].name;
                fileNameDisplay.textContent = name;
                fileNameDisplay.style.color = "#1a1a1a"; // Darker color to show it's set
            } else {
                fileNameDisplay.textContent = "File_Name.pdf";
                fileNameDisplay.style.color = "#666";
            }
        });
    }

    // 4. TOOLTIP SETUP (For collapsed mode)
    menuItems.forEach(item => {
        const spanText = item.querySelector("span")?.innerText;
        if (spanText) {
            item.setAttribute("data-text", spanText);
        }
    });
});