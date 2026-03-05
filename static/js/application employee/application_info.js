document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");
    const menuItems = document.querySelectorAll(".menu-item");
    const fileInput = document.getElementById("cv-upload");
    const fileNameDisplay = document.getElementById("file-name");

    // Fix: Sidebar Close
    closeBtn.addEventListener("click", () => {
        sidebar.classList.add("collapsed");
    });

    // Fix: Sidebar Open (Clicking logo while collapsed)
    logoToggle.addEventListener("click", () => {
        if (sidebar.classList.contains("collapsed")) {
            sidebar.classList.remove("collapsed");
        }
    });

    // Fix: File Upload Display
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            fileNameDisplay.innerText = e.target.files[0].name;
        } else {
            fileNameDisplay.innerText = "File_Name.pdf";
        }
    });

    // Menu Active State & Tooltips
    menuItems.forEach(item => {
        const span = item.querySelector("span");
        if (span) {
            item.setAttribute("data-text", span.innerText);
        }

        item.addEventListener("click", () => {
            document.querySelector(".menu-item.active")?.classList.remove("active");
            item.classList.add("active");
        });
    });
});