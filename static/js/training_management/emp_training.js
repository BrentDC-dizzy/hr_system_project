/**
 * Employee Training Management System
 * Core Logic: Sidebar, Modal Pop-ups, and Registration Flow
 */

// --- DOM ELEMENTS ---
const sidebar = document.getElementById("sidebar");
const logoToggle = document.getElementById("logoToggle");
const closeBtn = document.getElementById("closeBtn");
const menuItems = document.querySelectorAll(".menu-item");

const modalOverlay = document.getElementById("modalOverlay");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnRegisterModal = document.querySelector(".btn-register-modal");

const trainingsGrid = document.querySelector(".trainings-grid");
const myTrainingsList = document.getElementById("myTrainingsList");

// State tracker for which card is currently being viewed in the modal
let currentlySelectedCard = null;

// --- SIDEBAR LOGIC ---

// Collapse sidebar
closeBtn.addEventListener("click", () => {
    sidebar.classList.add("collapsed");
});

// Expand sidebar via logo click
logoToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
    }
});

// Active state and Tooltip handling
menuItems.forEach(item => {
    const text = item.querySelector("span")?.innerText;
    if (text) item.setAttribute("data-text", text);

    item.addEventListener("click", () => {
        document.querySelector(".menu-item.active")?.classList.remove("active");
        item.classList.add("active");
    });
});

// --- REGISTRATION LOGIC ---

/**
 * Handles the logic of registering for a training.
 * Updates the card UI, modal UI, and adds the item to the sidebar.
 */
function registerTraining(card) {
    if (!card || card.classList.contains("is-registered")) return;

    const data = card.dataset;
    const cardRegisterBtn = card.querySelector(".register-btn");

    // 1. Update the Main Card UI
    card.classList.add("is-registered");
    if (cardRegisterBtn) {
        cardRegisterBtn.classList.add("registered");
        cardRegisterBtn.innerHTML = 'Registered <i class="fas fa-check"></i>';
    }

    // 2. Update the Modal Button (if the modal is open for this card)
    btnRegisterModal.classList.add("registered");
    btnRegisterModal.innerText = "Registered";

    // 3. Add to "My Trainings" Sidebar Dynamically
    addToMyTrainings(data.title, data.date);
}

/**
 * Creates a new training item entry in the right-hand panel
 */
function addToMyTrainings(title, date) {
    const trainingItem = document.createElement("div");
    trainingItem.className = "my-training-item";
    
    trainingItem.innerHTML = `
        <div class="t-name">${title}</div>
        <div class="t-date">${date}</div>
        <span class="status-badge registered">Registered</span>
    `;
    
    myTrainingsList.appendChild(trainingItem);
}

// --- MODAL LOGIC ---

/**
 * Populates and displays the modal
 */
function openModal(card) {
    currentlySelectedCard = card;
    const data = card.dataset;

    // Mapping dataset to modal fields
    document.getElementById("modal-title").textContent = data.title;
    document.getElementById("modal-meta").innerHTML = 
        `${data.category} <span>|</span> ${data.type} <span>|</span> ${data.date}`;
    document.getElementById("modal-status").textContent = data.status;
    document.getElementById("modal-description").textContent = data.description;
    document.getElementById("modal-provider").textContent = data.provider;
    document.getElementById("modal-location").textContent = data.location;
    document.getElementById("modal-contact").textContent = data.contact;
    document.getElementById("modal-slots").textContent = data.slots;

    // Sync modal button state with the card's registration status
    if (card.classList.contains("is-registered")) {
        btnRegisterModal.classList.add("registered");
        btnRegisterModal.innerText = "Registered";
    } else {
        btnRegisterModal.classList.remove("registered");
        btnRegisterModal.innerText = "Register";
    }

    modalOverlay.classList.add("active");
}

// --- EVENT LISTENERS ---

// Training Card Clicks
document.querySelectorAll(".training-card").forEach(card => {
    card.addEventListener("click", (e) => {
        // If the user clicks the "Register" button on the card directly
        if (e.target.classList.contains("register-btn")) {
            registerTraining(card);
            return;
        }

        // If clicking anywhere else on the card, open the detailed modal
        openModal(card);
    });
});

// Modal Register Button Click
btnRegisterModal.addEventListener("click", () => {
    if (currentlySelectedCard) {
        registerTraining(currentlySelectedCard);
    }
});

// Close modal via button
btnCloseModal.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
    currentlySelectedCard = null;
});

// Close modal by clicking the darkened background overlay
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove("active");
        currentlySelectedCard = null;
    }
});