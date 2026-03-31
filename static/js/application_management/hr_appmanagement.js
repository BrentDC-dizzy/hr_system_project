document.addEventListener("DOMContentLoaded", () => {

    // --- ELEMENTS ---
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");

    const searchInput = document.getElementById("tableSearch");
    const tableBody = document.getElementById("applicationTableBody");

    const viewModal = document.getElementById("viewModal");
    const posModal = document.getElementById("positionChangeModal");

    const tabNew = document.getElementById("tab-new");
    const tabPosition = document.getElementById("tab-position");

    // =========================
    // SIDEBAR TOGGLE
    // =========================
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            sidebar.classList.add("collapsed");
        });
    }

    if (logoToggle) {
        logoToggle.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }

    // =========================
    // SEARCH FILTER
    // =========================
    if (searchInput && tableBody) {
        searchInput.addEventListener("keyup", () => {
            const filter = searchInput.value.toLowerCase();

            tableBody.querySelectorAll("tr").forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(filter) ? "" : "none";
            });
        });
    }

    // =========================
    // TAB SWITCHING
    // =========================
    if (tabNew && tabPosition) {
        tabNew.addEventListener("click", () => {
            tabNew.classList.add("active");
            tabPosition.classList.remove("active");
        });

        tabPosition.addEventListener("click", () => {
            tabPosition.classList.add("active");
            tabNew.classList.remove("active");

            openModal(posModal);
        });
    }

    // =========================
    // MODAL FUNCTIONS
    // =========================
    function openModal(modal) {
        if (modal) modal.style.display = "flex";
    }

    function closeModal(modal) {
        if (modal) modal.style.display = "none";
    }

    function closeAllModals() {
        closeModal(viewModal);
        closeModal(posModal);
    }

    // =========================
    // VIEW BUTTON (TABLE)
    // =========================
    document.addEventListener("click", (e) => {

        // VIEW CLICK
        if (e.target.classList.contains("view-link")) {
            e.preventDefault();

            const row = e.target.closest("tr");
            const cells = row.querySelectorAll("td");

            // Fill modal
            document.getElementById("modalSubmitDate").innerText = cells[4]?.innerText || "---";
            document.getElementById("modalDepartment").innerText = cells[2]?.innerText || "---";
            document.getElementById("modalPosition").innerText = cells[3]?.innerText || "---";
            document.getElementById("modalProgress").innerText = cells[5]?.innerText || "---";

            document.getElementById("modalRemarks").innerText = "Awaiting review.";
            document.getElementById("modalFileName").innerText = "Document.pdf";

            // STATUS COPY
            const statusPill = cells[6]?.querySelector(".status-pill");
            const container = document.getElementById("modalStatusContainer");

            container.innerHTML = statusPill ? statusPill.outerHTML : "<span>---</span>";

            // SHOW/HIDE ACTIONS
            const statusText = statusPill?.innerText || "";
            const isFinal = statusText.includes("Approved") || statusText.includes("Rejected");

            document.getElementById("modalActions").style.display = isFinal ? "none" : "flex";

            openModal(viewModal);
        }

        // APPROVE CLICK (DROPDOWN)
        if (e.target.classList.contains("approve-option")) {
            e.preventDefault();

            const row = e.target.closest("tr");
            updateRowStatus(row, "Approved", "approved");
        }

        // REJECT CLICK (DROPDOWN)
        if (e.target.classList.contains("reject-option")) {
            e.preventDefault();

            const row = e.target.closest("tr");
            updateRowStatus(row, "Rejected", "rejected");
        }
    });

    // =========================
    // UPDATE ROW STATUS
    // =========================
    function updateRowStatus(row, text, className) {
        const statusCell = row.children[6];

        statusCell.innerHTML = `<span class="status-pill ${className}">${text}</span>`;

        const progressCell = row.children[5];
        progressCell.innerText = "Completed";
    }

    // =========================
    // MODAL BUTTONS
    // =========================
    document.querySelector(".btn-approve")?.addEventListener("click", () => {
        document.getElementById("modalStatusContainer").innerHTML =
            `<span class="status-pill approved">Approved</span>`;

        document.getElementById("modalActions").style.display = "none";
        document.getElementById("modalRemarks").innerText =
            `Approved on ${new Date().toLocaleDateString()}`;
    });

    document.querySelector(".btn-reject")?.addEventListener("click", () => {
        document.getElementById("modalStatusContainer").innerHTML =
            `<span class="status-pill rejected">Rejected</span>`;

        document.getElementById("modalActions").style.display = "none";
        document.getElementById("modalRemarks").innerText =
            `Rejected on ${new Date().toLocaleDateString()}`;
    });

    // =========================
    // CLOSE BUTTONS
    // =========================
    document.getElementById("closeViewModal")?.addEventListener("click", closeAllModals);

    document.getElementById("cancelRequest")?.addEventListener("click", closeAllModals);

    // =========================
    // CLICK OUTSIDE MODAL
    // =========================
    window.addEventListener("click", (e) => {
        if (e.target === viewModal || e.target === posModal) {
            closeAllModals();
        }
    });

    // =========================
    // ESC KEY CLOSE
    // =========================
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAllModals();
        }
    });

});