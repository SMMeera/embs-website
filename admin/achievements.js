/* ══════════════════════════════════════════
   achievements.js
   ══════════════════════════════════════════ */

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

/* ══════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════ */

/* Pending student submissions */
let pending = [
  { id: 101, title: '1st Place — National BioHack 2024',          student: 'Arun Kumar',      category: 'Competition',   year: '2024', issuer: 'National BioHack Committee',       desc: 'Won first place in the national-level biomedical hackathon competing against 80+ teams.' },
  { id: 102, title: 'IEEE EMBC Paper Acceptance',                  student: 'Priya Nair',      category: 'Publication',   year: '2024', issuer: 'IEEE EMBC 2024',                    desc: 'Research paper on EEG-based emotion recognition accepted at IEEE EMBC 2024.' },
  { id: 103, title: 'Google Developer Student Club Lead',          student: 'Rahul Menon',     category: 'Leadership',    year: '2025', issuer: 'Google DSC',                        desc: 'Selected as GDSC Lead for the academic year 2024–25.' },
  { id: 104, title: 'AWS Certified Cloud Practitioner',            student: 'Sneha Pillai',    category: 'Certification', year: '2024', issuer: 'Amazon Web Services',               desc: 'Cleared the AWS Cloud Practitioner certification exam with a score of 890/1000.' },
  { id: 105, title: 'Best Poster — KPRIET Research Symposium',     student: 'Karthik Suresh',  category: 'Research',      year: '2024', issuer: 'KPRIET Research Cell',              desc: 'Awarded best poster for work on low-cost ECG monitoring using Arduino.' },
];

/* Approved / manually added achievements */
let achievements = [
  { id: 1,  title: 'Best Student Chapter Award',                   person: 'IEEE EMBS Chapter',  category: 'Award',         year: '2024', issuer: 'IEEE Region 10 Conference',         desc: 'Recognised as the best student chapter in IEEE Region 10 for 2024.' },
  { id: 2,  title: 'Research Paper on Neural Signal Classification',person: 'Dr. Allwyn Gnanadas',category: 'Publication',   year: '2024', issuer: 'IEEE EMBC Journal',                 desc: 'Published in the IEEE EMBC journal on neural signal classification using CNNs.' },
  { id: 3,  title: '1st Place — MedTech Hackathon',                person: 'Team NeuroSense',    category: 'Competition',   year: '2024', issuer: 'National MedTech Challenge 2024',   desc: 'First place in the national MedTech challenge for a wearable seizure detector.' },
  { id: 4,  title: 'Outstanding Volunteer Award',                  person: 'Meera Iyer',         category: 'Award',         year: '2023', issuer: 'IEEE India Council',                 desc: 'Awarded for exceptional volunteer contributions to IEEE activities.' },
  { id: 5,  title: 'Patent Filed — Smart Prosthetic Limb',         person: 'Ananya Krishnan',    category: 'Research',      year: '2024', issuer: 'Indian Patent Office',              desc: 'Patent filed for a low-cost myoelectric prosthetic limb design.' },
  { id: 6,  title: 'Certified Biomedical Engineer (CBE)',          person: 'Vikram Rajan',       category: 'Certification', year: '2023', issuer: 'AAMI Foundation',                   desc: 'Achieved CBE certification from the Association for the Advancement of Medical Instrumentation.' },
];

let editingId    = null;
let deleteTarget = null;
let activeFilter = 'all';

/* ══════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════ */
function catClass(cat) {
  const map = { Award:'award', Publication:'publication', Competition:'competition',
    Certification:'certification', Research:'research', Leadership:'leadership' };
  return map[cat] || 'other';
}

/* ══════════════════════════════════════════
   SUMMARY CHIPS
   ══════════════════════════════════════════ */
function renderSummary() {
  document.getElementById('achSummary').innerHTML = `
    <span class="ach-summary-chip ach-summary-chip--total">
      <span class="chip-dot chip-dot--purple"></span>${achievements.length} Total
    </span>
    <span class="ach-summary-chip ach-summary-chip--pending">
      <span class="chip-dot chip-dot--amber"></span>${pending.length} Pending
    </span>
    <span class="ach-summary-chip ach-summary-chip--approved">
      <span class="chip-dot chip-dot--teal"></span>${achievements.length} Approved
    </span>`;
  document.getElementById('pendingCountBadge').textContent = pending.length;
}

/* ══════════════════════════════════════════
   PENDING CARDS
   ══════════════════════════════════════════ */
function renderPending() {
  const grid  = document.getElementById('pendingGrid');
  const empty = document.getElementById('pendingEmpty');

  if (!pending.length) {
    grid.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = pending.map(p => `
    <div class="pending-card" id="pcard-${p.id}">
      <div class="pending-card-header">
        <div class="pending-card-meta">
          <div class="pending-card-title">${p.title}</div>
          <div class="pending-card-student">
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            ${p.student} &mdash; ${p.year}
          </div>
        </div>
      </div>
      <div class="pending-card-body">${p.desc}</div>
      <div class="pending-card-footer">
        <div class="pending-card-tags">
          <span class="pending-tag cat--${catClass(p.category)}">${p.category}</span>
          <span class="pending-tag" style="font-size:0.63rem;color:rgba(200,210,230,0.35);border:none;background:none;">${p.issuer}</span>
        </div>
        <div class="pending-card-actions">
          <button class="btn-approve" onclick="approveAch(${p.id})">
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Approve
          </button>
          <button class="btn-reject" onclick="rejectAch(${p.id})">
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Reject
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ── Approve ── */
function approveAch(id) {
  const idx = pending.findIndex(p => p.id === id);
  if (idx === -1) return;
  const p = pending[idx];

  /* Animate out */
  const card = document.getElementById(`pcard-${id}`);
  if (card) { card.style.opacity = '0'; card.style.transform = 'scale(0.95)'; card.style.transition = 'all 0.25s ease'; }

  setTimeout(() => {
    achievements.unshift({ id: Date.now(), title: p.title, person: p.student,
      category: p.category, year: p.year, issuer: p.issuer, desc: p.desc });
    pending.splice(idx, 1);
    renderPending();
    renderTable();
    renderSummary();
    showToast(`"${p.title}" approved and published.`, 'approve');
  }, 260);
}

/* ── Reject ── */
function rejectAch(id) {
  const idx = pending.findIndex(p => p.id === id);
  if (idx === -1) return;
  const p = pending[idx];

  const card = document.getElementById(`pcard-${id}`);
  if (card) { card.style.opacity = '0'; card.style.transform = 'scale(0.95)'; card.style.transition = 'all 0.25s ease'; }

  setTimeout(() => {
    pending.splice(idx, 1);
    renderPending();
    renderSummary();
    showToast(`"${p.title}" rejected.`, 'reject');
  }, 260);
}

/* ══════════════════════════════════════════
   ACHIEVEMENTS TABLE
   ══════════════════════════════════════════ */
function renderTable() {
  const query  = document.getElementById('achSearch').value.toLowerCase();
  const tbody  = document.getElementById('achTableBody');
  const empty  = document.getElementById('achTableEmpty');
  const count  = document.getElementById('achTableCount');

  let filtered = achievements.filter(a => {
    const matchCat    = activeFilter === 'all' || a.category === activeFilter;
    const matchSearch = !query ||
      a.title.toLowerCase().includes(query)  ||
      a.person.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  count.textContent = `Showing ${filtered.length} achievement${filtered.length !== 1 ? 's' : ''}`;

  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(a => `
    <tr data-id="${a.id}">
      <td>
        <div class="td-title">${a.title}</div>
        <div class="td-sub">${a.issuer || '—'}</div>
      </td>
      <td>${a.person}</td>
      <td><span class="pending-tag cat--${catClass(a.category)}">${a.category}</span></td>
      <td>${a.year}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn action-btn--edit" onclick="editAch(${a.id})">
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Edit
          </button>
          <button class="action-btn action-btn--delete" onclick="openDeleteModal(${a.id})">
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ── Edit ── */
function editAch(id) {
  const a = achievements.find(x => x.id === id);
  if (!a) return;
  editingId = id;

  document.getElementById('achTitle').value    = a.title;
  document.getElementById('achPerson').value   = a.person;
  document.getElementById('achCategory').value = a.category;
  document.getElementById('achYear').value     = a.year;
  document.getElementById('achIssuer').value   = a.issuer || '';
  document.getElementById('achDesc').value     = a.desc   || '';

  document.getElementById('manualFormTitle').textContent  = 'Edit Achievement';
  document.getElementById('saveAchBtnLabel').textContent  = 'Update Achievement';

  document.getElementById('manualFormPanel').classList.remove('collapsed');
  document.getElementById('manualFormPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Reset form ── */
function resetManualForm() {
  document.getElementById('manualForm').reset();
  editingId = null;
  document.getElementById('manualFormTitle').textContent = 'Add Achievement Manually';
  document.getElementById('saveAchBtnLabel').textContent = 'Save Achievement';
}

document.getElementById('resetManualBtn').addEventListener('click', resetManualForm);

/* ── Save / Update ── */
document.getElementById('saveAchBtn').addEventListener('click', () => {
  const title    = document.getElementById('achTitle').value.trim();
  const person   = document.getElementById('achPerson').value.trim();
  const category = document.getElementById('achCategory').value;
  const year     = document.getElementById('achYear').value;

  if (!title || !person || !category || !year) {
    showToast('Title, Person, Category and Year are required.', 'error');
    return;
  }

  const data = {
    title, person, category, year,
    issuer: document.getElementById('achIssuer').value.trim(),
    desc:   document.getElementById('achDesc').value.trim(),
  };

  if (editingId) {
    const a = achievements.find(x => x.id === editingId);
    Object.assign(a, data);
    showToast(`"${title}" updated successfully.`, 'success');
  } else {
    achievements.unshift({ id: Date.now(), ...data });
    showToast(`"${title}" saved successfully.`, 'success');
  }

  resetManualForm();
  document.getElementById('manualFormPanel').classList.add('collapsed');
  renderTable();
  renderSummary();
});

/* ── Delete Modal ── */
function openDeleteModal(id) {
  deleteTarget = id;
  const a = achievements.find(x => x.id === id);
  document.getElementById('deleteAchName').textContent = a ? a.title : 'this achievement';
  document.getElementById('deleteModal').style.display = 'flex';
}

document.getElementById('cancelDelete').addEventListener('click', () => {
  document.getElementById('deleteModal').style.display = 'none';
  deleteTarget = null;
});

document.getElementById('confirmDelete').addEventListener('click', () => {
  if (deleteTarget === null) return;
  const a = achievements.find(x => x.id === deleteTarget);
  achievements = achievements.filter(x => x.id !== deleteTarget);
  document.getElementById('deleteModal').style.display = 'none';
  showToast(`"${a?.title}" deleted.`, 'delete');
  deleteTarget = null;
  renderTable();
  renderSummary();
});

document.getElementById('deleteModal').addEventListener('click', e => {
  if (e.target === document.getElementById('deleteModal')) {
    document.getElementById('deleteModal').style.display = 'none';
    deleteTarget = null;
  }
});

/* ── Search ── */
document.getElementById('achSearch').addEventListener('input', renderTable);

/* ── Filter pills ── */
document.querySelectorAll('#achFilterBar .filter-pill').forEach(pill => {
  pill.addEventListener('click', function () {
    document.querySelectorAll('#achFilterBar .filter-pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    activeFilter = this.dataset.cat;
    renderTable();
  });
});

/* ── Form collapse ── */
document.getElementById('collapseManualBtn').addEventListener('click', () => {
  document.getElementById('manualFormPanel').classList.toggle('collapsed');
});

/* ── Toast ── */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = `toast toast--${type} show`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ── Init ── */
renderPending();
renderTable();
renderSummary();
