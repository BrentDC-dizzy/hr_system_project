document.addEventListener("DOMContentLoaded", () => {
    // Select core elements
    const cvInput = document.getElementById("cv-upload");
    const fileNameDisplay = document.getElementById("file-name");
    const dropZone = document.getElementById("drop-zone");
    const applicantForm = document.getElementById("applicantForm");

    /**
     * 1. Drag and Drop Functionality
     * Implements the interactive dashed zone from the drawing
     */
    if (dropZone && cvInput) {
        
        // Clicking the dashed box triggers the hidden file input
        dropZone.addEventListener("click", () => {
            cvInput.click();
        });

        // Visual feedback when dragging a file over the zone
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("over");
        });

        // Remove feedback when dragging leaves the zone
        ["dragleave", "dragend"].forEach(type => {
            dropZone.addEventListener(type, () => {
                dropZone.classList.remove("over");
            });
        });

        // Handle the drop event
        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("over");

            if (e.dataTransfer.files.length) {
                cvInput.files = e.dataTransfer.files;
                handleFileDisplay(e.dataTransfer.files[0]);
            }
        });

        // Handle standard file selection via browser dialog
        cvInput.addEventListener("change", (e) => {
            if (e.target.files.length) {
                handleFileDisplay(e.target.files[0]);
            }
        });
    }

    /**
     * 2. File Display Helper
     * Updates the UI to show the name of the uploaded file
     */
    function handleFileDisplay(file) {
        if (file) {
            fileNameDisplay.textContent = `Selected: ${file.name}`;
            fileNameDisplay.style.display = "block";
            fileNameDisplay.style.color = "#5c2b2b"; // Matches the submit button theme
            fileNameDisplay.style.fontWeight = "bold";
        } else {
            fileNameDisplay.textContent = "No file chosen";
            fileNameDisplay.style.display = "none";
        }
    }

    /**
     * 3. Form Submission
     * Provides feedback for the "SUBMIT" action
     */
    if (applicantForm) {
        applicantForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const submitBtn = document.querySelector(".btn-save");
            const originalText = submitBtn.innerText;
            
            // Visual feedback for submission
            submitBtn.innerText = "SUBMITTING...";
            submitBtn.disabled = true;

            // Simulate server delay
            setTimeout(() => {
                alert("Application Submitted Successfully!");
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                
                // Optional: Reset form after success
                // applicantForm.reset();
                // handleFileDisplay(null);
            }, 1500);
        });
    }

    // "Cancel" button functionality
    const cancelBtn = document.querySelector(".btn-cancel");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear the form?")) {
                applicantForm.reset();
                handleFileDisplay(null);
            }
        });
    }
});