document.addEventListener("DOMContentLoaded", () => {

    // --- 1. SELECT ELEMENTS ---
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");
    const menuItems = document.querySelectorAll(".menu-item");
    const logoutBtn = document.querySelector(".logout");

    // Table & Search Elements
    const searchInput = document.getElementById('searchInput');
    const trainingTableBody = document.querySelector('#trainingTable tbody');

    // Modal Elements
    const modal = document.getElementById('trainingModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addForm = document.getElementById('addTrainingForm');

    console.log("System Initialized: All modules active.");

    // --- 2. SIDEBAR LOGIC ---
    if (sidebar && closeBtn && logoToggle) {
        // Collapse sidebar
        closeBtn.addEventListener("click", () => {
            sidebar.classList.add("collapsed");
        });

        // Expand sidebar via logo
        logoToggle.addEventListener("click", () => {
            if (sidebar.classList.contains("collapsed")) {
                sidebar.classList.remove("collapsed");
            }
        });
    }

    // --- 3. MENU INTERACTION ---
    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            if (item.classList.contains("logout")) return;

            const currentActive = document.querySelector(".menu-item.active");
            if (currentActive) {
                currentActive.classList.remove("active");
            }
            item.classList.add("active");
        });
    });

    // --- 4. LOGOUT LOGIC ---
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault(); 
            window.location.href = "../login/login.html";
        });
    }

    // --- 5. MODAL TOGGLE ---
    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // --- 6. ADD TRAINING (DYNAMICAL TABLE UPDATE) ---
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('newTrainingName').value;
            const category = document.getElementById('newCategory').value;
            const date = document.getElementById('newDate').value;
            const mode = document.getElementById('newMode').value;

            // Generate ID based on current row count
            const rowCount = trainingTableBody.getElementsByTagName('tr').length;
            const nextID = (rowCount + 1).toString().padStart(3, '0');

            // Format date (convert yyyy-mm-dd to mm/dd/yyyy if needed)
            const dateObj = new Date(date);
            const formattedDate = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

            // Create new row HTML string
            const newRowHTML = `
                <tr>
                    <td>${nextID}</td>
                    <td>${name}</td>
                    <td>${category}</td>
                    <td>${formattedDate}</td>
                    <td>${mode}</td>
                    <td>0 / 30</td>
                    <td><span class="status open">Open</span></td>
                    <td class="actions">
                        <a href="#" class="view-link">View</a>
                        <a href="#" class="edit-link">Edit</a>
                        <a href="#" class="close-link">Close</a>
                    </td>
                </tr>
            `;

            // Append new row to table body
            trainingTableBody.insertAdjacentHTML('beforeend', newRowHTML);

            // UI Feedback and Reset
            addForm.reset();
            modal.style.display = 'none';
            console.log(`Training "${name}" added successfully.`);
        });
    }

    // --- 7. SEARCH LOGIC ---
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const rows = trainingTableBody.querySelectorAll('tr');

            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    // --- 8. DELETE ROW LOGIC (Delegated Event) ---
    trainingTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-link')) {
            e.preventDefault();
            if (confirm("Are you sure you want to remove this training?")) {
                e.target.closest('tr').remove();
            }
        }
    });
});