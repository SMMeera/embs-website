'use strict';

/* ── Dummy Data ── */
let announcements = [
  {
    id: 1,
    title: 'Registration Open: MedTech Hackathon 2025',
    body: 'Registrations are now open for the MedTech Hackathon 2025. Teams of 2-4 members can register via the link below. Last date: 25th January 2025.',
    priority: 'urgent', audience: 'all',
    expiry: '2025-01-25', attachment: 'hackathon_brochure.pdf',
    status: 'published', createdAt: '2025-01-10'
  },
  {
    id: 2,
    title: 'Executive Team Meeting - 15th January',
    body: 'Mandatory meeting for all executive team members on 15th January at 4:00 PM in the Seminar Hall. Agenda: Q1 planning and event calendar review.',
    priority: 'high', audience: 'executive',
    expiry: '2025-01-15', attachment: 'meeting_agenda.pdf',
    status: 'published', createdAt: '2025-01-08'
  },
  {
    id: 3,
    title: 'New IEEE EMBS Membership Benefits 2025',
    body: 'IEEE has announced updated membership benefits for 2025 including free access to 200+ journals, discounted conference registrations, and new online learning resources.',
    priority: 'normal', audience: 'all',
    expiry: '', attachment: '',
    status: 'published', createdAt: '2025-01-05'
  },
  {
    id: 4,
    title: 'Volunteer Orientation Session',
    body: 'All new volunteers are required to attend the orientation session on 20th January. Details will be shared via WhatsApp group.',
    priority: 'normal', audience: 'volunteers',
    expiry: '2025-01-20', attachment: '',
    status: 'published', createdAt: '2025-01-04'
  },
  {
    id: 5,
    title: 'BioSignal Workshop - Seat Confirmation',
    body: 'Students who registered for the BioSignal Workshop must confirm their seats by paying the registration fee of Rs. 200 before 10th January.',
    priority: 'high', audience: 'all',
    expiry: '2025-01-10', attachment: 'payment_details.pdf',
    status: 'published', createdAt: '2025-01-02'
  },
  {
    id: 6,
    title: 'Core Team Project Submission Deadline',
    body: 'All core team members must submit their project progress reports by 31st January. Use the shared Google Drive folder for submissions.',
    priority: 'high', audience: 'core',
    expiry: '2025-01-31', attachment: '',
    status: 'draft', createdAt: '2025-01-01'
  },
  {
    id: 7,
    title: 'Annual Report 2024 Published',
    body: 'The IEEE EMBS Chapter Annual Report for 2024 has been published. It highlights all events, achievements, and milestones of the year.',
    priority: 'low', audience: 'public',
    expiry: '', attachment: 'annual_report_2024.pdf',
    status: 'published', createdAt: '2024-12-31'
  },
  {
    id: 8,
    title: 'Holiday Notice - Winter Break',
    body: 'The chapter office will remain closed from 24th December to 1st January. All queries will be addressed after the break.',
    priority: 'low', audience: 'all',
    expiry: '2025-01-01', attachment: '',
    status: 'published', createdAt: '2024-12-22'
  },
  {
    id: 9,
    title: 'Research Symposium Abstract Submission',
    body: 'Abstracts for the Research Symposium 2025 are now being accepted. Submit your 300-word abstract by 15th February via the submission portal.',
    priority: 'normal', audience: 'all',
    expiry: '2025-02-15', attachment: 'abstract_guidelines.pdf',
    status: 'draft', createdAt: '2024-12-20'
  },
];

let editingId    = null;
let deleteTarget = null;
let activeFilter = 'all';
let nextId       = 10;
let attachedFile = '';

/* ── Helpers ── */
function isExpired(expiry) {
  if (!expiry) return false;
  return new Date(expiry) < new Date(new Date().toDateString());
}
function isExpiringSoon(expiry) {
  if (!expiry) return false;
  const diff = (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 3;
}
function fmtDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[+m - 1] + ' ' + +day + ', ' + y;
}
function audienceLabel(a) {
  return { all:'All Members', executive:'Executive', core:'Core', volunteers:'Volunteers', public:'Public' }[a] || a;
}

/* ── Stats ── */
function updateStats() {
  const today = new Date(new Date().toDateString());
  document.getElementById('statTotal').textContent     = announcements.length;
  document.getElementById('statPublished').textContent = announcements.filter(a => a.status === 'published').length;
  document.getElementById('statDraft').textContent     = announcements.filter(a => a.status === 'draft').length;
  document.getElementById('statUrgent').textContent    = announcements.filter(a => a.priority === 'urgent' && a.status === 'published').length;
  document.getElementById('statExpired').textContent   = announcements.filter(a => a.expiry && new Date(a.expiry) < today).length;
}

/* ── Render Table ── */
function renderTable() {
  const q      = document.getElementById('tableSearch').value.toLowerCase();
  const tbody  = document.getElementById('annTableBody');
  const empty  = document.getElementById('tableEmpty');
  const count  = document.getElementById('tableCount');
  const today  = new Date(new Date().toDateString());

  const filtered = announcements.filter(a => {
    if (activeFilter === 'published' && a.status !== 'published') return false;
    if (activeFilter === 'draft'     && a.status !== 'draft')     return false;
    if (activeFilter === 'urgent'    && a.priority !== 'urgent')  return false;
    if (activeFilter === 'expired'   && !(a.expiry && new Date(a.expiry) < today)) return false;
    if (q && !(
      a.title.toLowerCase().includes(q) ||
      a.body.toLowerCase().includes(q)  ||
      a.audience.toLowerCase().includes(q)
    )) return false;
    return true;
  });

  count.textContent = 'Showing ' + filtered.length + ' announcement' + (filtered.length !== 1 ? 's' : '');

  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(a => {
    /* expiry cell */
    let expiryHTML;
    if (!a.expiry) {
      expiryHTML = '<span class="td-expiry td-expiry--none">No expiry</span>';
    } else if (new Date(a.expiry) < today) {
      expiryHTML = '<span class="td-expiry td-expiry--past">' + fmtDate(a.expiry) + '</span>';
    } else if (isExpiringSoon(a.expiry)) {
      expiryHTML = '<span class="td-expiry td-expiry--soon">' + fmtDate(a.expiry) + '</span>';
    } else {
      expiryHTML = '<span class="td-expiry">' + fmtDate(a.expiry) + '</span>';
    }

    /* attachment cell */
    const attachHTML = a.attachment
      ? '<a class="td-attach-link" href="#" title="' + a.attachment + '"><svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></a>'
      : '<span class="td-no-attach">-</span>';

    /* visibility badge */
    const expired = a.expiry && new Date(a.expiry) < today;
    const visClass = expired ? 'status-badge--draft' : (a.status === 'published' ? 'status-badge--published' : 'status-badge--draft');
    const visLabel = expired ? 'Expired' : (a.status === 'published' ? 'Published' : 'Draft');

    return '<tr data-id="' + a.id + '">' +
      '<td>' +
        '<div class="td-ann-title" title="' + a.title + '">' + a.title + '</div>' +
        '<div class="td-ann-body">' + a.body.slice(0, 80) + (a.body.length > 80 ? '...' : '') + '</div>' +
      '</td>' +
      '<td><span class="priority-badge priority-badge--' + a.priority + '">' + a.priority.charAt(0).toUpperCase() + a.priority.slice(1) + '</span></td>' +
      '<td><span class="audience-badge audience-badge--' + a.audience + '">' + audienceLabel(a.audience) + '</span></td>' +
      '<td>' + expiryHTML + '</td>' +
      '<td>' + attachHTML + '</td>' +
      '<td><span class="status-badge ' + visClass + '">' + visLabel + '</span></td>' +
      '<td><div class="action-btns">' +
        '<button class="action-btn action-btn--edit" onclick="editAnn(' + a.id + ')">' +
          '<svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
          ' Edit' +
        '</button>' +
        '<button class="action-btn action-btn--delete" onclick="openDeleteModal(' + a.id + ')">' +
          '<svg viewBox="0 0 24 24" fill="none" width="12" height="12"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
          ' Delete' +
        '</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

/* ── Attachment ── */
const attachInput  = document.getElementById('attachInput');
const attachInner  = document.getElementById('attachInner');
const attachFile   = document.getElementById('attachFile');
const attachName   = document.getElementById('attachFileName');
const attachRemove = document.getElementById('attachRemove');

attachInput.addEventListener('change', () => {
  const file = attachInput.files[0];
  if (!file) return;
  attachedFile = file.name;
  attachName.textContent     = file.name;
  attachInner.style.display  = 'none';
  attachFile.style.display   = 'flex';
});
attachRemove.addEventListener('click', e => {
  e.stopPropagation();
  attachInput.value          = '';
  attachedFile               = '';
  attachFile.style.display   = 'none';
  attachInner.style.display  = 'flex';
});

/* ── Form Panel ── */
const formPanel  = document.getElementById('annFormPanel');
const collapseBtn = document.getElementById('collapseFormBtn');
const toggleBtn   = document.getElementById('toggleFormBtn');

collapseBtn.addEventListener('click', () => formPanel.classList.toggle('collapsed'));
toggleBtn.addEventListener('click', () => {
  resetForm();
  formPanel.classList.remove('collapsed');
  formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function resetForm() {
  document.getElementById('annForm').reset();
  attachInput.value         = '';
  attachedFile              = '';
  attachFile.style.display  = 'none';
  attachInner.style.display = 'flex';
  editingId = null;
  document.getElementById('formPanelTitle').textContent = 'New Announcement';
  document.getElementById('publishBtn').textContent     = 'Publish';
}
document.getElementById('resetFormBtn').addEventListener('click', resetForm);

function getFormData(status) {
  return {
    title:      document.getElementById('annTitle').value.trim(),
    body:       document.getElementById('annBody').value.trim(),
    priority:   document.getElementById('annPriority').value,
    audience:   document.getElementById('annAudience').value,
    expiry:     document.getElementById('annExpiry').value,
    attachment: attachedFile,
    status,
    createdAt:  new Date().toISOString().slice(0, 10),
  };
}

function validate() {
  const title    = document.getElementById('annTitle').value.trim();
  const body     = document.getElementById('annBody').value.trim();
  const priority = document.getElementById('annPriority').value;
  const audience = document.getElementById('annAudience').value;
  if (!title)    { showToast('Please enter a title.', 'error'); return false; }
  if (!body)     { showToast('Please enter the announcement content.', 'error'); return false; }
  if (!priority) { showToast('Please select a priority.', 'error'); return false; }
  if (!audience) { showToast('Please select an audience.', 'error'); return false; }
  return true;
}

/* ── Save Draft ── */
document.getElementById('saveDraftBtn').addEventListener('click', () => {
  if (!validate()) return;
  const data = getFormData('draft');
  if (editingId) {
    Object.assign(announcements.find(a => a.id === editingId), data);
    showToast('"' + data.title + '" saved as draft.', 'draft');
  } else {
    announcements.unshift({ id: nextId++, ...data });
    showToast('"' + data.title + '" saved as draft.', 'draft');
  }
  resetForm();
  renderTable();
  updateStats();
});

/* ── Publish ── */
document.getElementById('publishBtn').addEventListener('click', () => {
  if (!validate()) return;
  const data = getFormData('published');
  if (editingId) {
    Object.assign(announcements.find(a => a.id === editingId), data);
    showToast('"' + data.title + '" updated and published.', 'success');
  } else {
    announcements.unshift({ id: nextId++, ...data });
    showToast('"' + data.title + '" published successfully.', 'success');
  }
  resetForm();
  formPanel.classList.add('collapsed');
  renderTable();
  updateStats();
});

/* ── Edit ── */
function editAnn(id) {
  const a = announcements.find(a => a.id === id);
  if (!a) return;
  editingId = id;

  document.getElementById('annTitle').value    = a.title;
  document.getElementById('annBody').value     = a.body;
  document.getElementById('annPriority').value = a.priority;
  document.getElementById('annAudience').value = a.audience;
  document.getElementById('annExpiry').value   = a.expiry;

  if (a.attachment) {
    attachedFile               = a.attachment;
    attachName.textContent     = a.attachment;
    attachInner.style.display  = 'none';
    attachFile.style.display   = 'flex';
  }

  document.getElementById('formPanelTitle').textContent = 'Edit Announcement';
  document.getElementById('publishBtn').textContent     = 'Update';
  formPanel.classList.remove('collapsed');
  formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Delete ── */
function openDeleteModal(id) {
  deleteTarget = id;
  const a = announcements.find(a => a.id === id);
  document.getElementById('deleteAnnName').textContent = a ? a.title : 'this announcement';
  document.getElementById('deleteModal').style.display = 'flex';
}

document.getElementById('cancelDelete').addEventListener('click', () => {
  document.getElementById('deleteModal').style.display = 'none';
  deleteTarget = null;
});

document.getElementById('confirmDelete').addEventListener('click', () => {
  if (deleteTarget === null) return;
  const a = announcements.find(a => a.id === deleteTarget);
  announcements = announcements.filter(a => a.id !== deleteTarget);
  document.getElementById('deleteModal').style.display = 'none';
  showToast('"' + (a ? a.title : 'Announcement') + '" deleted.', 'delete');
  deleteTarget = null;
  renderTable();
  updateStats();
});

document.getElementById('deleteModal').addEventListener('click', e => {
  if (e.target === document.getElementById('deleteModal')) {
    document.getElementById('deleteModal').style.display = 'none';
    deleteTarget = null;
  }
});

/* ── Search & Filter ── */
document.getElementById('tableSearch').addEventListener('input', renderTable);

document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', function () {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    activeFilter = this.dataset.filter;
    renderTable();
  });
});

/* ── Toast ── */
function showToast(msg, type) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = 'toast toast--' + (type || 'success') + ' show';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ── Sidebar Toggle ── */
const sidebar = document.getElementById('sidebar');
const toggle  = document.getElementById('sidebarToggle');
const overlay = document.getElementById('sidebarOverlay');
toggle.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('active'); });
overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('active'); });

/* ── Init ── */
renderTable();
updateStats();
