const sidebar = document.getElementById("sidebar");
const logoToggle = document.getElementById("logoToggle");
const closeBtn = document.getElementById("closeBtn");
const menuItems = document.querySelectorAll(".menu-item");
const modalOverlay = document.getElementById("modalOverlay");
const modalBox = document.getElementById("modalBox");
const btnCloseModal = document.getElementById("btnCloseModal");

// NEW: Elements for Registration logic
const btnRegisterModal = document.querySelector(".btn-register-modal");
const myTrainingsList = document.getElementById("myTrainingsList");
let currentlySelectedCard = null; // Tracks which card is open in the modal

// Sidebar: close button
closeBtn.addEventListener("click", () => {
    sidebar.classList.add("collapsed");
});

// Sidebar: open via logo click when collapsed
logoToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
    }
});

// Sidebar: tooltip text + active state
menuItems.forEach(item => {
    const text = item.querySelector("span")?.innerText;
    if (text) item.setAttribute("data-text", text);

    item.addEventListener("click", () => {
        document.querySelector(".menu-item.active")?.classList.remove("active");
        item.classList.add("active");
    });
});

// --- REGISTRATION LOGIC ---

function registerTraining(card) {
    // Prevent double registration
    if (card.classList.contains("is-registered")) return;

    const data = card.dataset;
    const cardBtn = card.querySelector(".register-btn");

    // 1. Update Card UI (Green border and Button change)
    card.classList.add("is-registered");
    if (cardBtn) {
        cardBtn.classList.add("registered");
        cardBtn.innerHTML = 'Registered <i class="fas fa-check"></i>';
    }

    // 2. Update Modal Button UI
    btnRegisterModal.classList.add("registered");
    btnRegisterModal.innerText = "Registered";

    // 3. Add to "My Trainings" Sidebar List
    const trainingItem = document.createElement("div");
    trainingItem.className = "my-training-item";
    trainingItem.innerHTML = `
        <div class="t-name">${data.title}</div>
        <div class="t-date">${data.date}</div>
        <span class="status-badge registered">Registered</span>
    `;
    myTrainingsList.appendChild(trainingItem);
}

// Training cards: handle click
document.querySelectorAll(".training-card").forEach(card => {
    card.addEventListener("click", (e) => {
        // If clicking the register button directly
        if (e.target.classList.contains("register-btn")) {
            registerTraining(card);
            return;
        }

        // Open modal and store reference to this card
        currentlySelectedCard = card;
        openModal(card.dataset);
    });
});

// Modal Register Button: handle click
btnRegisterModal.addEventListener("click", () => {
    if (currentlySelectedCard) {
        registerTraining(currentlySelectedCard);
    }
});

// Open modal and populate with card data
function openModal(data) {
    document.getElementById("modal-title").textContent = data.title;
    document.getElementById("modal-meta").innerHTML =
        `${data.category} <span>|</span> ${data.type} <span>|</span> ${data.date}`;
    document.getElementById("modal-status").textContent = data.status;
    document.getElementById("modal-description").textContent = data.description;
    document.getElementById("modal-provider").textContent = data.provider;
    document.getElementById("modal-location").textContent = data.location;
    document.getElementById("modal-contact").textContent = data.contact;
    document.getElementById("modal-slots").textContent = data.slots;

    // Check if the card is already registered to update modal button style
    if (currentlySelectedCard.classList.contains("is-registered")) {
        btnRegisterModal.classList.add("registered");
        btnRegisterModal.innerText = "Registered";
    } else {
        btnRegisterModal.classList.remove("registered");
        btnRegisterModal.innerText = "Register";
    }

    modalOverlay.classList.add("active");
}

// Close modal via Close button
btnCloseModal.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
    currentlySelectedCard = null;
});

// Close modal by clicking outside (on overlay)
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove("active");
        currentlySelectedCard = null;
    }
});