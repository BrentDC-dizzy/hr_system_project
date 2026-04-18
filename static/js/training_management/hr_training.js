const coordinatorName = 'HR Training';

let activeTrainingId = null;
let trainingData = Array.isArray(window.hrTrainingData) ? window.hrTrainingData : [];
const participantStatusChoices = Array.isArray(window.hrParticipantStatusChoices)
    ? window.hrParticipantStatusChoices
    : [];
let createTrainingAction = '';

function buildTrainingUrl(template, trainingId) {
    return String(template || '').replace('/0/', '/' + trainingId + '/');
}

function buildParticipantStatusUrl(template, trainingId, participantId) {
    return String(template || '')
        .replace('/0/', '/' + trainingId + '/')
        .replace('/0/', '/' + participantId + '/');
}

function isFinalTrainingStatus(status) {
    return status === 'closed' || status === 'cancelled';
}

function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
        approved: 'fas fa-check-circle',
        rejected: 'fas fa-times-circle',
        info: 'fas fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML =
        '<i class="' + icons[type] + ' toast-icon"></i>' +
        '<div class="toast-body">' +
        '<div class="toast-title">' + title + '</div>' +
        '<div class="toast-msg">' + message + '</div>' +
        '</div>' +
        '<button class="toast-close" type="button"><i class="fas fa-times"></i></button>' +
        '<div class="toast-progress"></div>';

    toast.querySelector('.toast-close').addEventListener('click', function () {
        removeToast(toast);
    });

    container.appendChild(toast);
    setTimeout(function () {
        removeToast(toast);
    }, 4000);
}

function removeToast(el) {
    if (!el || !el.parentElement) return;
    el.style.animation = 'toastOut 0.35s ease forwards';
    setTimeout(function () {
        el.remove();
    }, 340);
}

function findTrainingById(id) {
    return trainingData.find(function (row) {
        return row.id === id;
    });
}

function renderTable() {
    const body = document.getElementById('trainingTableBody');
    const template = document.getElementById('trainingRowTemplate');
    if (!body || !template) return;

    body.innerHTML = '';

    if (trainingData.length === 0) {
        body.innerHTML = '<tr><td colspan="9" class="no-records">No records found.</td></tr>';
        return;
    }

    trainingData.forEach(function (training) {
        const clone = template.content.cloneNode(true);
        const isFinal = isFinalTrainingStatus(training.status);

        clone.querySelector('.col-id').innerText = training.display_id || training.id;
        clone.querySelector('.col-tname').innerText = training.name;
        clone.querySelector('.col-category').innerText = training.category;
        clone.querySelector('.col-date').innerText = training.date;
        clone.querySelector('.col-mode').innerText = training.mode;
        clone.querySelector('.col-slots').innerText = training.slots_text;
        clone.querySelector('.col-progress').innerText = training.progress;
        clone.querySelector('.col-status').innerHTML =
            '<span class="status-pill ' + training.status + '">' + training.status_label + '</span>';

        const actionsCell = clone.querySelector('.col-actions');
        if (!actionsCell) return;

        let actionsHtml =
            '<div class="actions-cell">' +
            '<span class="action-link view-link-btn">View Details</span>' +
            '<span class="action-link edit-link-btn">Edit</span>';

        if (!isFinal) {
            actionsHtml +=
                '<div class="dropdown">' +
                '<button type="button" class="update-link">Update <i class="fas fa-caret-down"></i></button>' +
                '<div class="dropdown-content">' +
                '<a href="#" class="close-option" data-id="' + training.id + '">Close Registration</a>' +
                '<a href="#" class="cancel-option" data-id="' + training.id + '">Cancel Training</a>' +
                '</div>' +
                '</div>';
        }

        actionsHtml += '</div>';
        actionsCell.innerHTML = actionsHtml;

        actionsCell.querySelector('.view-link-btn').addEventListener('click', function () {
            openModal(training.id);
        });

        actionsCell.querySelector('.edit-link-btn').addEventListener('click', function () {
            openEditModal(training.id);
        });

        const closeOption = actionsCell.querySelector('.close-option');
        if (closeOption) {
            closeOption.addEventListener('click', function (event) {
                event.preventDefault();
                processTraining(training.id, 'CLOSED');
            });
        }

        const cancelOption = actionsCell.querySelector('.cancel-option');
        if (cancelOption) {
            cancelOption.addEventListener('click', function (event) {
                event.preventDefault();
                processTraining(training.id, 'CANCELLED');
            });
        }

        body.appendChild(clone);
    });
}

function renderParticipants(rows) {
    const participantsTableBody = document.getElementById('participantsTableBody');
    if (!participantsTableBody) return;

    participantsTableBody.innerHTML = '';
    if (!Array.isArray(rows) || rows.length === 0) {
        participantsTableBody.innerHTML = '<tr><td colspan="4" class="no-records">No participants yet.</td></tr>';
        return;
    }

    rows.forEach(function (participant) {
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + participant.employee_name + '</td>' +
            '<td>' + participant.department + '</td>' +
            '<td>' +
            '<select class="participant-status" data-participant-id="' + participant.id + '">' +
            participantStatusChoices
                .map(function (choice) {
                    const selected = choice.value === participant.status ? ' selected' : '';
                    return '<option value="' + choice.value + '"' + selected + '>' + choice.label + '</option>';
                })
                .join('') +
            '</select>' +
            '</td>' +
            '<td><button type="button" class="btn-save participant-save" data-participant-id="' + participant.id + '">Save</button></td>';

        const saveButton = tr.querySelector('.participant-save');
        saveButton.addEventListener('click', function () {
            const select = tr.querySelector('.participant-status');
            if (!select || !activeTrainingId) return;
            submitParticipantStatus(activeTrainingId, participant.id, select.value);
        });

        participantsTableBody.appendChild(tr);
    });
}

function loadParticipants(trainingId, fallbackTraining) {
    if (!window.hrTrainingParticipantsUrlTemplate) {
        renderParticipants([]);
        return;
    }

    const participantsUrl = buildTrainingUrl(window.hrTrainingParticipantsUrlTemplate, trainingId);
    fetch(participantsUrl)
        .then(function (response) {
            return response.ok ? response.json() : null;
        })
        .then(function (payload) {
            if (!payload || !payload.training) {
                renderParticipants([]);
                return;
            }

            const participants = Array.isArray(payload.participants) ? payload.participants : [];
            const count = participants.length;
            const total = payload.training.max_participants || fallbackTraining.total;
            const slotsLeft = Math.max(total - count, 0);

            document.getElementById('modalSlots').innerText = count + ' / ' + total;
            document.getElementById('modalProgress').innerText =
                slotsLeft === 0 && fallbackTraining.status === 'open' ? 'At capacity' : fallbackTraining.progress;

            renderParticipants(participants);
        })
        .catch(function () {
            renderParticipants([]);
        });
}

function openModal(id) {
    activeTrainingId = id;
    const training = findTrainingById(id);
    if (!training) return;

    document.getElementById('modalTrainingTitle').innerText = training.name;
    document.getElementById('trainingPlaceholder').innerHTML =
        '<i class="fas fa-chalkboard-teacher"></i><p>' + training.name + '</p>';
    document.getElementById('modalDate').innerText = training.date;
    document.getElementById('modalCategory').innerText = training.category;
    document.getElementById('modalMode').innerText = training.mode;
    document.getElementById('modalSlots').innerText = training.slots_text;
    document.getElementById('modalProgress').innerText = training.progress;
    document.getElementById('modalRemarks').innerText = training.remarks;
    document.getElementById('modalCoordinatorText').innerHTML =
        '<small>Coordinator: ' + coordinatorName + '</small>';
    document.getElementById('modalStatusContainer').innerHTML =
        '<span class="status-pill ' + training.status + '">' + training.status_label + '</span>';

    document.getElementById('modalActions').style.display =
        isFinalTrainingStatus(training.status) ? 'none' : 'flex';

    loadParticipants(id, training);
    document.getElementById('viewModal').style.display = 'flex';
}

function closeViewModal() {
    document.getElementById('viewModal').style.display = 'none';
}

function processTraining(id, statusCode) {
    const statusForm = document.getElementById('statusTrainingForm');
    const statusValue = document.getElementById('statusValue');
    if (!statusForm || !statusValue || !window.hrTrainingStatusUrlTemplate) return;

    statusForm.action = buildTrainingUrl(window.hrTrainingStatusUrlTemplate, id);
    statusValue.value = statusCode;
    statusForm.submit();
}

function submitParticipantStatus(trainingId, participantId, statusCode) {
    const participantForm = document.getElementById('participantStatusForm');
    const participantStatusValue = document.getElementById('participantStatusValue');
    if (!participantForm || !participantStatusValue || !window.hrParticipantStatusUrlTemplate) return;

    participantForm.action = buildParticipantStatusUrl(
        window.hrParticipantStatusUrlTemplate,
        trainingId,
        participantId
    );
    participantStatusValue.value = statusCode;
    participantForm.submit();
}

function resetAddTrainingForm() {
    document.getElementById('tTrainingId').value = '';
    document.getElementById('tName').value = '';
    document.getElementById('tCategory').selectedIndex = 0;
    document.getElementById('tMode').selectedIndex = 0;
    document.getElementById('tDate').value = '';
    document.getElementById('tTotalSlots').value = '';
    document.getElementById('tVenue').value = '';
    document.getElementById('tTrainer').value = '';
    document.getElementById('tRemarks').value = '';
    document.getElementById('trainingModalTitle').innerText = 'Add New Training';
    document.getElementById('saveTraining').innerText = 'Save';

    ['tName', 'tCategory', 'tMode', 'tDate', 'tTotalSlots'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.style.borderColor = '';
    });
}

function openCreateModal() {
    resetAddTrainingForm();
    document.getElementById('addTrainingModal').style.display = 'flex';
}

function openEditModal(trainingId) {
    const training = findTrainingById(trainingId);
    if (!training) return;

    document.getElementById('tTrainingId').value = String(training.id);
    document.getElementById('tName').value = training.name || '';
    document.getElementById('tCategory').value = training.category || '';
    document.getElementById('tMode').value = training.mode || '';
    document.getElementById('tDate').value = training.date_for_form || '';
    document.getElementById('tTotalSlots').value = training.total || '';
    document.getElementById('tTrainer').value = training.trainer_name || training.trainer || '';
    document.getElementById('tRemarks').value = training.remarks || '';
    document.getElementById('tVenue').value = '';

    document.getElementById('trainingModalTitle').innerText = 'Edit Training';
    document.getElementById('saveTraining').innerText = 'Update';
    document.getElementById('addTrainingModal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const logoToggle = document.getElementById('logoToggle');
    const closeBtn = document.getElementById('closeBtn');
    const openAddTrainingModal = document.getElementById('openAddTrainingModal');
    const addModal = document.getElementById('addTrainingModal');
    const viewModal = document.getElementById('viewModal');
    const createForm = document.getElementById('createTrainingForm');
    if (createForm) {
        createTrainingAction = createForm.getAttribute('action') || '';
    }

    document.querySelectorAll('.menu-item').forEach(function (item) {
        const span = item.querySelector('span');
        if (span) item.setAttribute('data-text', span.textContent.trim());
    });

    if (closeBtn) {
        closeBtn.onclick = function () {
            sidebar.classList.add('collapsed');
        };
    }
    if (logoToggle) {
        logoToggle.onclick = function () {
            sidebar.classList.toggle('collapsed');
        };
    }

    if (openAddTrainingModal) {
        openAddTrainingModal.addEventListener('click', openCreateModal);
    }

    document.getElementById('modalCompleteBtn').addEventListener('click', function () {
        processTraining(activeTrainingId, 'CLOSED');
    });
    document.getElementById('modalCancelBtn').addEventListener('click', function () {
        processTraining(activeTrainingId, 'CANCELLED');
    });
    document.getElementById('modalCloseBtn').addEventListener('click', closeViewModal);

    document.getElementById('cancelAddTraining').addEventListener('click', function () {
        addModal.style.display = 'none';
        resetAddTrainingForm();
    });

    document.getElementById('saveTraining').addEventListener('click', function () {
        const createForm = document.getElementById('createTrainingForm');
        const trainingId = document.getElementById('tTrainingId').value.trim();
        const name = document.getElementById('tName').value.trim();
        const category = document.getElementById('tCategory').value;
        const mode = document.getElementById('tMode').value;
        const dateVal = document.getElementById('tDate').value;
        const totalSlots = parseInt(document.getElementById('tTotalSlots').value, 10);
        const venue = document.getElementById('tVenue').value.trim();
        const trainer = document.getElementById('tTrainer').value.trim();
        const remarks = document.getElementById('tRemarks').value.trim();

        let valid = true;
        [
            { id: 'tName', val: name },
            { id: 'tCategory', val: category },
            { id: 'tMode', val: mode },
            { id: 'tDate', val: dateVal },
            { id: 'tTotalSlots', val: totalSlots > 0 ? String(totalSlots) : '' }
        ].forEach(function (field) {
            const el = document.getElementById(field.id);
            if (!field.val) {
                el.style.borderColor = '#dc3545';
                valid = false;
            } else if (el) {
                el.style.borderColor = '';
            }
        });

        if (!valid) {
            showToast('info', 'Incomplete Form', 'Please fill in all required fields.');
            return;
        }

        if (!createForm) {
            showToast('rejected', 'Save Failed', 'Training form endpoint is not available.');
            return;
        }

        const descriptionParts = [];
        if (remarks) descriptionParts.push(remarks);
        if (venue) descriptionParts.push('Venue/Platform: ' + venue);

        document.getElementById('formName').value = name;
        document.getElementById('formCategory').value = category;
        document.getElementById('formDate').value = dateVal;
        document.getElementById('formMode').value = mode.toUpperCase();
        document.getElementById('formMaxParticipants').value = String(totalSlots);
        document.getElementById('formDescription').value = descriptionParts.join('\n');
        document.getElementById('formTrainerName').value = trainer;

        if (trainingId) {
            const current = findTrainingById(Number(trainingId));
            document.getElementById('formStatus').value = current && current.status_code ? current.status_code : 'ACTIVE';
            createForm.action = buildTrainingUrl(window.hrTrainingEditUrlTemplate, trainingId);
        } else {
            document.getElementById('formStatus').value = 'ACTIVE';
            createForm.action = createTrainingAction;
        }

        createForm.submit();
    });

    window.addEventListener('click', function (event) {
        if (event.target === viewModal) closeViewModal();
        if (event.target === addModal) {
            addModal.style.display = 'none';
            resetAddTrainingForm();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeViewModal();
            addModal.style.display = 'none';
            resetAddTrainingForm();
        }
    });

    document.getElementById('tableSearch').addEventListener('keyup', function (event) {
        const val = event.target.value.toLowerCase();
        document.querySelectorAll('#trainingTableBody tr').forEach(function (row) {
            row.style.display = row.innerText.toLowerCase().includes(val) ? '' : 'none';
        });
    });

    renderTable();
});