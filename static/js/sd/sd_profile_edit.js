const sidebar = document.getElementById('sidebar');
const logoToggle = document.getElementById('logoToggle');
const closeBtn = document.getElementById('closeBtn');
const menuItems = document.querySelectorAll('.menu-item');
const cancelBtn = document.getElementById('cancelSDEditBtn');

menuItems.forEach(item => {
    const span = item.querySelector('span');
    if (span) {
        item.setAttribute('data-text', span.innerText);
    }
});

if (logoToggle) {
    logoToggle.addEventListener('click', () => sidebar.classList.toggle('close'));
}
if (closeBtn) {
    closeBtn.addEventListener('click', () => sidebar.classList.add('close'));
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        const cancelUrl = cancelBtn.dataset.cancelUrl || '/history/profile/sd/';
        Swal.fire({
            title: 'Discard changes?',
            text: 'Any unsaved information will be lost.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4a1d1d',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, discard',
            cancelButtonText: 'No',
            width: '400px',
            padding: '1rem',
            customClass: {
                title: 'small-swal-title',
                htmlContainer: 'small-swal-text',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = cancelUrl;
            }
        });
    });
}