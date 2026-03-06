document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
    // --- 1. SELECT ELEMENTS ---
=======

    // 1. SELECT ELEMENTS
>>>>>>> 3a8079c (fixed.)
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");
    const menuItems = document.querySelectorAll(".menu-item");
<<<<<<< HEAD
    
    // CV Upload Elements
    const cvInput = document.getElementById("cv-upload");
    const fileNameDisplay = document.getElementById("file-name");

    console.log("Application Script: Initialized");
=======

    // CV Elements
    const cvInput = document.getElementById("cv-upload");
    const fileNameDisplay = document.getElementById("file-name");

    const applicantForm = document.getElementById("applicantForm");

    console.log("Dashboard Script: Initialized");
>>>>>>> 3a8079c (fixed.)

    // --- 2. SIDEBAR LOGIC ---
    if (sidebar && closeBtn && logoToggle) {
<<<<<<< HEAD
        // Close button: Collapses the sidebar
=======

        // Collapse sidebar
>>>>>>> 3a8079c (fixed.)
        closeBtn.addEventListener("click", () => {
            sidebar.classList.add("collapsed");
            console.log("Sidebar: Collapsed");
        });

<<<<<<< HEAD
        // Logo click: Expands the sidebar if it is currently collapsed
=======
        // Expand sidebar when clicking logo
>>>>>>> 3a8079c (fixed.)
        logoToggle.addEventListener("click", () => {
            if (sidebar.classList.contains("collapsed")) {
                sidebar.classList.remove("collapsed");
                console.log("Sidebar: Expanded");
            }
        });
    }

<<<<<<< HEAD
    // --- 3. UPLOAD CV LOGIC (DYNAMIC FILE NAME) ---
    if (cvInput && fileNameDisplay) {
        // This event fires the moment the user selects a file from the system dialog
        cvInput.addEventListener("change", function() {
            // Check if at least one file was selected
            if (this.files && this.files.length > 0) {
                // Get the name of the chosen file
                const chosenName = this.files[0].name;
                
                // Update the <span> text to show the actual filename
                fileNameDisplay.textContent = chosenName;
                
                // Optional: Enhance visibility of the selected name
                fileNameDisplay.style.color = "#1a1a1a"; 
                fileNameDisplay.style.fontWeight = "600";
                
                console.log("File Selected: " + chosenName);
=======
    // 3. CV UPLOAD LOGIC
    if (cvInput && fileNameDisplay) {
        cvInput.addEventListener("change", (e) => {

            if (e.target.files && e.target.files.length > 0) {
                const name = e.target.files[0].name;
                fileNameDisplay.textContent = name;
                console.log("File Selected:", name);
>>>>>>> 3a8079c (fixed.)
            } else {
                // If the user opens the dialog but cancels, revert to default
                fileNameDisplay.textContent = "File_Name.pdf";
                fileNameDisplay.style.color = "#555";
                fileNameDisplay.style.fontWeight = "400";
            }

        });
    }

<<<<<<< HEAD
    // --- 4. MENU ACTIVE STATES & TOOLTIPS ---
    menuItems.forEach(item => {
        // Automatically set tooltip text for collapsed mode based on the span text
        const spanText = item.querySelector("span")?.innerText;
        if (spanText) {
            item.setAttribute("data-text", spanText);
        }

        item.addEventListener("click", () => {
            // Remove 'active' class from current item
=======
    // 4. MENU ACTIVE STATES & TOOLTIP TEXT
    menuItems.forEach(item => {

        const span = item.querySelector("span");

        if (span) {
            const text = span.innerText;
            item.setAttribute("data-text", text);
        }

        item.addEventListener("click", () => {

>>>>>>> 3a8079c (fixed.)
            const currentActive = document.querySelector(".menu-item.active");

            if (currentActive) {
                currentActive.classList.remove("active");
            }
<<<<<<< HEAD
            // Set clicked item as active
=======

>>>>>>> 3a8079c (fixed.)
            item.classList.add("active");

        });

    });

<<<<<<< HEAD
    // --- 5. FORM SUBMISSION ---
    const applicantForm = document.getElementById("applicantForm");
=======
    // 5. FORM SUBMISSION
>>>>>>> 3a8079c (fixed.)
    if (applicantForm) {
        applicantForm.addEventListener("submit", (e) => {
            e.preventDefault();
            // Basic validation check for the file
            if (cvInput.files.length === 0) {
                alert("Please upload your CV before saving.");
                return;
            }
            alert("Applicant information and CV saved successfully!");
        });
    }

});