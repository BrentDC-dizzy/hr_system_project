document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");
    const menuItems = document.querySelectorAll(".menu-item");
    const uploadBtn = document.getElementById("uploadBtn");
    const cvInput = document.getElementById("cvInput");
    const fileNameDisplay = document.getElementById("fileNameDisplay");

    console.log("JS Loaded. Sidebar state:", sidebar ? "Found" : "Not Found");

    // 1. Sidebar Toggle Logic
    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevents click bubbling
            console.log("Close button clicked");
            sidebar.classList.add("collapsed");
        });
    }

    if (logoToggle) {
        logoToggle.addEventListener("click", () => {
            if (sidebar.classList.contains("collapsed")) {
                console.log("Opening sidebar");
                sidebar.classList.remove("collapsed");
            }
        });
    }

    // 2. Tooltips & Active States
    menuItems.forEach(item => {
        const span = item.querySelector("span");
        if (span) item.setAttribute("data-text", span.innerText);

        item.addEventListener("click", () => {
            document.querySelector(".menu-item.active")?.classList.remove("active");
            item.classList.add("active");
        });
    });

    // 3. File Upload
    if (uploadBtn && cvInput) {
        uploadBtn.addEventListener("click", () => cvInput.click());
        cvInput.addEventListener("change", () => {
            fileNameDisplay.textContent = cvInput.files[0] ? cvInput.files[0].name : "File_Name.pdf";
        });
    }
});