document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const logoToggle = document.getElementById('logoToggle');
    const closeBtn = document.getElementById('closeBtn');
    const searchInput = document.getElementById('tableSearch');

    document.querySelectorAll('.menu-item').forEach((item) => {
        const span = item.querySelector('span');
        if (span) {
            item.setAttribute('data-text', span.innerText.trim());
        }
    });

    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.add('collapsed');
        });
    }

    if (logoToggle && sidebar) {
        logoToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchValue = (event.target.value || '').toLowerCase();
            const tableRows = document.querySelectorAll('tbody tr');

            tableRows.forEach((row) => {
                row.style.display = row.innerText.toLowerCase().includes(searchValue) ? '' : 'none';
            });
        });
    }
});