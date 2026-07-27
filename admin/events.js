/* ══════════════════════════════════════
   events.js — Events Management Logic
   ══════════════════════════════════════ */

/* ── Sidebar toggle ── */
const sidebar = document.getElementById('sidebar');
const toggle  = document.getElementById('sidebarToggle');
const overlay = document.getElementById('sidebarOverlay');

toggle.addEventListener('click', () => sidebar.classList.contains('open')
  ? (sidebar.classList.remove('open'), overlay.classList.remove('active'))
  : (sidebar.classList.add('open'),    overlay.classList.add('active')));
overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
});

/* ── Dummy Data ── */
let events = [
  { id: 1, title: 'Biomedical Signal Processing Workshop', type: 'Workshop',    date: '2025-01-15', venue: 'Engineering Block, Room 204', mode: 'In-Person', speaker: 'Dr. Allwyn Gnanadas',   regLink: 'https://forms.gle/example1', tags: ['ECG','Signal Processing','Hands-on'], desc: 'Hands-on session covering ECG analysis and filtering techniques.', status: 'upcoming'  },
  { id: 2, title: 'MedTech Innovation Hackathon 2025',    type: 'Hackathon',    date: '2025-02-03', venue: 'Main Auditorium',             mode: 'In-Person', speaker: 'Panel of Judges',        regLink: 'https://forms.gle/example2', tags: ['AI','Embedded Systems','Healthcare'], desc: '48-hour challenge to design innovative healthcare solutions.', status: 'upcoming'  },
  { id: 3, title: 'Guest Lecture: AI in Medical Imaging', type: 'Guest Lecture', date: '2024-12-10', venue: 'Seminar Hall B',              mode: 'Hybrid',    speaker: 'Dr. Priya Ramesh',       regLink: '',                           tags: ['AI','Imaging','Deep Learning'],  desc: 'Insightful session on deep learning in diagnostic imaging.', status: 'completed' },
  { id: 4, title: 'Neural Interface Symposium',           type: 'Seminar',      date: '2024-11-22', venue: 'Online — Zoom',               mode: 'Online',    speaker: 'Dr. Karthik Suresh',     regLink: 'https://zoom.us/example',    tags: ['Neuroscience','BCI'],            desc: 'Symposium on brain-computer interface research.', status: 'completed' },
  { id: 5, title: 'Wearable Health Tech Expo',            type: 'Workshop',     date: '2025-03-08', venue: 'Innovation Lab',              mode: 'In-Person', speaker: 'Ms. Ananya Krishnan',    regLink: 'https://forms.gle/example5', tags: ['Wearables','IoT','Health'],      desc: 'Expo showcasing student-built wearable health devices.', status: 'published' },
  { id: 6, title: 'EMBS Annual Research Showcase',        type: 'Competition',  date: '2025-04-12', venue: 'Main Auditorium',             mode: 'In-Person', speaker: 'Multiple Presenters',    regLink: 'https://forms.gle/example6', tags: ['Research','Poster','Awards'],    desc: 'Annual showcase of student research projects.', status: 'draft'     },
  { id: 7, title: 'Bioethics in Engineering Webinar',     type: 'Webinar',      date: '2024-10-05', venue: 'Online — Google Meet',        mode: 'Online',    speaker: 'Prof. Meera Iyer',       regLink: '',                           tags: ['Ethics','Policy'],               desc: 'Discussion on ethical considerations in biomedical engineering.', status: 'completed' },
  { id: 8, title: 'PCB Design for Biomedical Devices',    type: 'Workshop',     date: '2025-05-20', venue: 'Electronics Lab',             mode: 'In-Person', speaker: 'Mr. Rahul Nair',         regLink: 'https://forms.gle/example8', tags: ['PCB','Hardware','Biomedical'],   desc: 'Practical workshop on designing PCBs for medical applications.', status: 'draft'     },
];

let editingId    = null;
let deleteTarget = null;
let activeTags   = [];
let activeFilter = 'all';

/* ── Helpers ── */
function typeClass(type) {
  const map = { Workshop:'workshop', Hackathon:'hackathon', Seminar:'seminar',
    'Guest Lecture':'lecture', Competition:'competition', Webinar:'webinar' };
  return map[type] || 'other';
}

function modeClass(mode) {
  return mode === 'In-Person' ? 'inperson' : mode === 'Online' ? 'online' : 'hybrid';
}

function fmtDate(d) {
  if (!d) return '—';
  const [y,m,day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[+m-1]} ${+day}, ${y}`;
}

/* ── Render Table ── */
function renderTable() {
  const query  = document.getElementById('tableSearch').value.toLowerCase();
  const tbody  = document.getElementById('eventsTableBody');
  const empty  = document.getElementById('tableEmpty');
  const count  = document.getElementById('tableCount');

  let filtered = events.filter(ev => {
    const matchFilter = activeFilter === 'all' || ev.status === activeFilter;
    const matchSearch = !query ||
      ev.title.toLowerCase().includes(query) ||
      ev.type.toLowerCase().includes(query)  ||
      ev.speaker.toLowerCase().includes(query);
    return matchFilter && matchSearch;
  });

  count.textContent = `Showing ${filtered.length} event${filtered.length !== 1 ? 's' : ''}`;

  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(ev => `
    <tr data-id="${ev.id}">
      <td>
        <div class="td-title">${ev.title}</div>
        <div class="td-speaker">${ev.speaker}</div>
      </td>
      <td><span class="type-badge type-badge--${typeClass(ev.type)}">${ev.type}</span></td>
      <td>${fmtDate(ev.date)}</td>
      <td>
        <span class="mode-badge">
          <span class="mode-dot mode-dot--${modeClass(ev.mode)}"></span>
          ${ev.mode}
        </span>
      </td>
      <td><span class="status-badge status-badge--${ev.status}">${ev.status.charAt(0).toUpperCase()+ev.status.slice(1)}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn action-btn--edit" onclick="editEvent(${ev.id})">
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Edit
          </button>
          <button class="action-btn action-btn--delete" onclick="openDeleteModal(${ev.id})">
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ── Tags ── */
function renderTags() {
  const list = document.getElementById('tagsList');
  list.innerHTML = activeTags.map((t, i) => `
    <span class="tag-chip">
      ${t}
      <button type="button" class="tag-chip-remove" onclick="removeTag(${i})">✕</button>
    </span>
  `).join('');
}

function removeTag(i) {
  activeTags.splice(i, 1);
  renderTags();
}

document.getElementById('tagsInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.replace(',','').trim();
    if (val && !activeTags.includes(val)) {
      activeTags.push(val);
      renderTags();
    }
    e.target.value = '';
  }
});

document.getElementById('tagsWrap').addEventListener('click', () => {
  document.getElementById('tagsInput').focus();
});

/* ── Image Upload Previews ── */
function setupUpload(inputId, innerId, previewId, imgId, removeId) {
  const input   = document.getElementById(inputId);
  const inner   = document.getElementById(innerId);
  const preview = document.getElementById(previewId);
  const img     = document.getElementById(imgId);
  const remove  = document.getElementById(removeId);

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
      inner.style.display   = 'none';
      preview.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  });

  remove.addEventListener('click', e => {
    e.stopPropagation();
    input.value           = '';
    img.src               = '';
    preview.style.display = 'none';
    inner.style.display   = 'flex';
  });
}

setupUpload('thumbInput',   'thumbInner',   'thumbPreview',   'thumbImg',   'thumbRemove');
setupUpload('speakerInput', 'speakerInner', 'speakerPreview', 'speakerImg', 'speakerRemove');

/* ── Drag-over styling ── */
['thumbZone','speakerZone'].forEach(id => {
  const zone = document.getElementById(id);
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', ()  => zone.classList.remove('drag-over'));
  zone.addEventListener('drop',      e => { e.preventDefault(); zone.classList.remove('drag-over'); });
});

/* ── Form Collapse ── */
const formPanel     = document.getElementById('eventFormPanel');
const collapseBtn   = document.getElementById('collapseFormBtn');
const toggleFormBtn = document.getElementById('toggleFormBtn');

collapseBtn.addEventListener('click', () => formPanel.classList.toggle('collapsed'));
toggleFormBtn.addEventListener('click', () => {
  resetForm();
  formPanel.classList.remove('collapsed');
  formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ── Reset Form ── */
function resetForm() {
  document.getElementById('eventForm').reset();
  activeTags = [];
  renderTags();
  ['thumbInput','speakerInput'].forEach(id => document.getElementById(id).value = '');
  ['thumbPreview','speakerPreview'].forEach(id => document.getElementById(id).style.display = 'none');
  ['thumbInner','speakerInner'].forEach(id => document.getElementById(id).style.display = 'flex');
  document.getElementById('thumbImg').src   = '';
  document.getElementById('speakerImg').src = '';
  editingId = null;
  document.getElementById('formPanelTitle').textContent = 'Add New Event';
  document.getElementById('publishBtn').textContent     = 'Publish Event';
}

document.getElementById('resetFormBtn').addEventListener('click', resetForm);

/* ── Edit Event ── */
function editEvent(id) {
  const ev = events.find(e => e.id === id);
  if (!ev) return;
  editingId = id;

  document.getElementById('evTitle').value   = ev.title;
  document.getElementById('evType').value    = ev.type;
  document.getElementById('evDate').value    = ev.date;
  document.getElementById('evVenue').value   = ev.venue;
  document.getElementById('evMode').value    = ev.mode;
  document.getElementById('evSpeaker').value = ev.speaker;
  document.getElementById('evRegLink').value = ev.regLink;
  document.getElementById('evDesc').value    = ev.desc;

  activeTags = [...ev.tags];
  renderTags();

  document.getElementById('formPanelTitle').textContent = 'Edit Event';
  document.getElementById('publishBtn').textContent     = 'Update Event';

  formPanel.classList.remove('collapsed');
  formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Save Draft ── */
document.getElementById('saveDraftBtn').addEventListener('click', () => {
  const title = document.getElementById('evTitle').value.trim();
  if (!title) { showToast('Please enter an event title.', 'error'); return; }

  if (editingId) {
    const ev = events.find(e => e.id === editingId);
    Object.assign(ev, getFormData('draft'));
    showToast(`"${ev.title}" saved as draft.`, 'draft');
  } else {
    const newEv = { id: Date.now(), ...getFormData('draft') };
    events.unshift(newEv);
    showToast(`"${newEv.title}" saved as draft.`, 'draft');
  }
  resetForm();
  renderTable();
});

/* ── Publish Event ── */
document.getElementById('publishBtn').addEventListener('click', () => {
  const title = document.getElementById('evTitle').value.trim();
  const type  = document.getElementById('evType').value;
  const date  = document.getElementById('evDate').value;
  if (!title || !type || !date) {
    showToast('Title, Type and Date are required.', 'error');
    return;
  }

  const status = new Date(date) > new Date() ? 'upcoming' : 'published';

  if (editingId) {
    const ev = events.find(e => e.id === editingId);
    Object.assign(ev, getFormData(status));
    showToast(`"${ev.title}" updated successfully.`, 'success');
  } else {
    const newEv = { id: Date.now(), ...getFormData(status) };
    events.unshift(newEv);
    showToast(`"${newEv.title}" published successfully.`, 'success');
  }
  resetForm();
  formPanel.classList.add('collapsed');
  renderTable();
});

function getFormData(status) {
  return {
    title:   document.getElementById('evTitle').value.trim(),
    type:    document.getElementById('evType').value,
    date:    document.getElementById('evDate').value,
    venue:   document.getElementById('evVenue').value.trim(),
    mode:    document.getElementById('evMode').value || 'In-Person',
    speaker: document.getElementById('evSpeaker').value.trim(),
    regLink: document.getElementById('evRegLink').value.trim(),
    tags:    [...activeTags],
    desc:    document.getElementById('evDesc').value.trim(),
    status,
  };
}

/* ── Delete Modal ── */
function openDeleteModal(id) {
  deleteTarget = id;
  const ev = events.find(e => e.id === id);
  document.getElementById('deleteEventName').textContent = ev ? ev.title : 'this event';
  document.getElementById('deleteModal').style.display = 'flex';
}

document.getElementById('cancelDelete').addEventListener('click', () => {
  document.getElementById('deleteModal').style.display = 'none';
  deleteTarget = null;
});

document.getElementById('confirmDelete').addEventListener('click', () => {
  if (deleteTarget === null) return;
  const ev = events.find(e => e.id === deleteTarget);
  events = events.filter(e => e.id !== deleteTarget);
  document.getElementById('deleteModal').style.display = 'none';
  showToast(`"${ev?.title}" deleted.`, 'delete');
  deleteTarget = null;
  renderTable();
});

document.getElementById('deleteModal').addEventListener('click', e => {
  if (e.target === document.getElementById('deleteModal')) {
    document.getElementById('deleteModal').style.display = 'none';
    deleteTarget = null;
  }
});

/* ── Search ── */
document.getElementById('tableSearch').addEventListener('input', renderTable);

/* ── Filter Pills ── */
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', function () {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    activeFilter = this.dataset.filter;
    renderTable();
  });
});

/* ── Toast ── */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = `toast toast--${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ── Init ── */
renderTable();
