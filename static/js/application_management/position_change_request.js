/* position_change_request.js */
const empInfo = { name: "John Smith" };

// ── Mock employee directory ──
const employeeDirectory = {
    'dela cruz, juan': { id: 'EMP-001', position: 'Instructor', dept: 'CCS' },
    'santos, maria': { id: 'EMP-002', position: 'Professor', dept: 'CBA' },
    'reyes, ricardo': { id: 'EMP-003', position: 'Registrar', dept: 'COE' },
    'gomez, patricia': { id: 'EMP-004', position: 'Assistant Professor', dept: 'CAS' },
    'torres, miguel': { id: 'EMP-005', position: 'Clinical Instructor', dept: 'CON' },
    'johnson, alice': { id: 'EMP-006', position: 'Senior Instructor', dept: 'CAS' }
};

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById("sidebar");
    const logoToggle = document.getElementById("logoToggle");
    const closeBtn = document.getElementById("closeBtn");
    const menuItems = document.querySelectorAll(".menu-item");
    const empNameInput = document.getElementById('empName');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Initialize Tooltip Labels
    menuItems.forEach(item => {
        const span = item.querySelector("span");
        if (span) { item.setAttribute("data-text", span.innerText); }
    });

    if (closeBtn) closeBtn.onclick = () => sidebar.classList.add("collapsed");
    if (logoToggle) logoToggle.onclick = () => sidebar.classList.toggle("collapsed");

    // Auto-fill employee details
    empNameInput.addEventListener('blur', () => {
        const key = empNameInput.value.trim().toLowerCase();
        const emp = employeeDirectory[key];
        
        if (emp) {
            document.getElementById('empId').value = emp.id;
            document.getElementById('currentPos').value = emp.position;
            document.getElementById('currentDept').value = emp.dept;
        } else {
            document.getElementById('empId').value = '';
            document.getElementById('currentPos').value = '';
            document.getElementById('currentDept').value = '';
        }
    });

    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel? All data will be lost.')) {
                document.getElementById('positionForm').reset();
                document.getElementById('empId').value = '';
                document.getElementById('currentPos').value = '';
                document.getElementById('currentDept').value = '';
            }
        });
    }

    // Submit button
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const empName = document.getElementById('empName').value.trim();
            const requestedPos = document.getElementById('requestedPos').value;
            const effectiveDate = document.getElementById('effectiveDate').value;
            const reason = document.getElementById('reason').value.trim();

            // Validation
            if (!empName || !requestedPos || !effectiveDate || !reason) {
                alert('Please fill in all required fields.');
                return;
            }

            const empId = document.getElementById('empId').value;
            const currentPos = document.getElementById('currentPos').value;
            const currentDept = document.getElementById('currentDept').value;

            // Success message
            alert(`Position Change Request submitted!\n\nEmployee: ${empName}\nCurrent Position: ${currentPos}\nRequested Position: ${requestedPos}\nEffective Date: ${effectiveDate}`);

            // Reset form
            document.getElementById('positionForm').reset();
            document.getElementById('empId').value = '';
            document.getElementById('currentPos').value = '';
            document.getElementById('currentDept').value = '';
        });
    }
});