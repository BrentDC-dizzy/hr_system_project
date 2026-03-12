document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");
    const menuItems = document.querySelectorAll(".menu-item");

    /**
     * SIDEBAR TOGGLE LOGIC
     */
    
    // Collapses the sidebar when the chevron (left arrow) is clicked
    closeBtn.addEventListener("click", () => {
        sidebar.classList.add("collapsed");
    });

    // Expands the sidebar when clicking the logo while it is collapsed
    logoToggle.addEventListener("click", () => {
        if (sidebar.classList.contains("collapsed")) {
            sidebar.classList.remove("collapsed");
        }
    });

    /**
     * MENU INTERACTION LOGIC
     */

    menuItems.forEach(item => {
        // 1. Tooltip Setup: Sets the 'data-text' attribute used by the CSS 
        // for tooltips when the sidebar is in collapsed mode.
        const span = item.querySelector("span");
        if (span) {
            const text = span.innerText;
            item.setAttribute("data-text", text);
        }

        // 2. Active State Toggle: Updates which menu item is highlighted
        item.addEventListener("click", function() {
            // Remove 'active' class from whatever was previously selected
            const currentActive = document.querySelector(".menu-item.active");
            if (currentActive) {
                currentActive.classList.remove("active");
            }
            
            // Add 'active' class to the clicked item
            this.classList.add("active");
        });
    });

    /**
     * OPTIONAL: WINDOW RESIZE HANDLER
     * Automatically collapses the sidebar on smaller screens for better UX
     */
    const handleResize = () => {
        if (window.innerWidth <= 1024) {
            sidebar.classList.add("collapsed");
        } else {
            sidebar.classList.remove("collapsed");
        }
    };

    window.addEventListener("resize", handleResize);
    
    // Run once on load to check initial screen size
    handleResize();
});