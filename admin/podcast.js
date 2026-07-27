'use strict';

/* ── Dummy Data ── */
const dummyEpisodes = [
  {
    id: 1, number: 24,
    title: "Neural Interfaces & the Future of Brain-Computer Communication",
    guest: "Dr. Allwyn Gnanadas", designation: "Professor, IIT Madras — Biomedical Dept.",
    spotify: "https://open.spotify.com/episode/example1",
    duration: "48:22", status: "published",
    tags: ["Neural", "BCI", "Research"],
    desc: "We explore the cutting edge of brain-computer interfaces and what they mean for medicine.",
    cover: ""
  },
  {
    id: 2, number: 23,
    title: "Wearable Biosensors: From Lab to Clinic",
    guest: "Dr. Priya Nair", designation: "Research Scientist, AIIMS Delhi",
    spotify: "https://open.spotify.com/episode/example2",
    duration: "39:10", status: "published",
    tags: ["Wearable", "Biosensors", "Clinical"],
    desc: "A deep dive into how wearable biosensors are making the leap from research labs to clinical use.",
    cover: ""
  },
  {
    id: 3, number: 22,
    title: "AI in Medical Imaging: Opportunities & Challenges",
    guest: "Rahul Menon", designation: "ML Engineer, Siemens Healthineers",
    spotify: "",
    duration: "52:05", status: "published",
    tags: ["AI", "Medical Imaging", "Deep Learning"],
    desc: "Rahul walks us through how AI is transforming radiology and the hurdles still ahead.",
    cover: ""
  },
  {
    id: 4, number: 21,
    title: "Soft Robotics in Minimally Invasive Surgery",
    guest: "Dr. Sneha Pillai", designation: "Robotics Researcher, IISc Bangalore",
    spotify: "https://open.spotify.com/episode/example4",
    duration: "44:50", status: "published",
    tags: ["Robotics", "Surgery", "Innovation"],
    desc: "How soft robotic actuators are enabling a new class of surgical tools.",
    cover: ""
  },
  {
    id: 5, number: 25,
    title: "Bioelectronic Medicine: Hacking the Nervous System",
    guest: "Dr. Kiran Raj", designation: "Neuromodulation Lead, Medtronic India",
    spotify: "",
    duration: "37:15", status: "draft",
    tags: ["Bioelectronics", "Neuromodulation"],
    desc: "An upcoming episode on how bioelectronic devices are treating chronic diseases.",
    cover: ""
  }
];

let episodes = [...dummyEpisodes];
let editingId = null;
let deleteTargetId = null;
let nextId = episodes.length + 1;
let tags = [];
let activeFilter = 'all';

/* ── DOM ── */
const episodeForm      = document.getElementById('episodeForm');
const epNumber         = document.getElementById('epNumber');
const epTitle          = document.getElementById('epTitle');
const epDuration       = document.getElementById('epDuration');
const epGuest          = document.getElementById('epGuest');
const epDesignation    = document.getElementById('epDesignation');
const epSpotify        = document.getElementById('epSpotify');
const epDesc           = document.getElementById('epDesc');
const coverInput       = document.getElementById('coverInput');
const coverZone        = document.getElementById('coverZone');
const coverPreview     = document.getElementById('coverPreview');
const coverImg         = document.getElementById('coverImg');
const coverInner       = document.getElementById('coverInner');
const coverRemove      = document.getElementById('coverRemove');
const tagsWrap         = document.getElementById('tagsWrap');
const tagsList         = document.getElementById('tagsList');
const tagsInput        = document.getElementById('tagsInput');
const saveDraftBtn     = document.getElementById('saveDraftBtn');
const publishBtn       = document.getElementById('publishBtn');
const resetFormBtn     = document.getElementById('resetFormBtn');
const formPanelTitle   = document.getElementById('formPanelTitle');
const episodeFormPanel = document.getElementById('episodeFormPanel');
const collapseFormBtn  = document.getElementById('collapseFormBtn');
const toggleFormBtn    = document.getElementById('toggleFormBtn');
const tableSearch      = document.getElementById('tableSearch');
const episodeTableBody = document.getElementById('episodeTableBody');
const tableCount       = document.getElementById('tableCount');
const tableEmpty       = document.getElementById('tableEmpty');
const deleteModal      = document.getElementById('deleteModal');
const deleteEpName     = document.getElementById('deleteEpName');
const cancelDelete     = document.getElementById('cancelDelete');
const confirmDelete    = document.getElementById('confirmDelete');
const toast            = document.getElementById('toast');

/* ── Stats ── */
function updateStats() {
  const pub     = episodes.filter(e => e.status === 'published').length;
  const draft   = episodes.filter(e => e.status === 'draft').length;
  const guests  = new Set(episodes.map(e => e.guest.trim().toLowerCase())).size;
  document.getElementById('statTotal').textContent     = episodes.length;
  document.getElementById('statPublished').textContent = pub;
  document.getElementById('statDraft').textContent     = draft;
  document.getElementById('statGuests').textContent    = guests;
}

/* ── Render Table ── */
function renderTable() {
  const q = tableSearch.value.toLowerCase();
  let filtered = episodes.filter(e => {
    const matchFilter = activeFilter === 'all' || e.status === activeFilter;
    const matchSearch = !q ||
      e.title.toLowerCase().includes(q) ||
      e.guest.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  // Sort by episode number descending
  filtered.sort((a, b) => b.number - a.number);

  episodeTableBody.innerHTML = '';
  tableEmpty.style.display = filtered.length === 0 ? 'flex' : 'none';
  tableCount.textContent = `Showing ${filtered.length} episode${filtered.length !== 1 ? 's' : ''}`;

  filtered.forEach(ep => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="td-ep-num">${ep.number}</span></td>
      <td>
        <div class="td-title">${ep.title}</div>
        ${ep.spotify
          ? `<a class="td-spotify-link" href="${ep.spotify}" target="_blank" rel="noopener">
               <svg viewBox="0 0 24 24" fill="none" width="11" height="11"><circle cx="12" cy="12" r="10" stroke="#1DB954" stroke-width="1.6"/><polygon points="10,8.5 17,12 10,15.5" fill="#1DB954"/></svg>
               Spotify
             </a>`
          : ''}
      </td>
      <td>
        <div class="td-guest-name">${ep.guest}</div>
        <div class="td-guest-desig">${ep.designation}</div>
      </td>
      <td>
        <span class="td-duration">
          <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><polyline points="12,7 12,12 15,14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          ${ep.duration}
        </span>
      </td>
      <td><span class="status-badge status-badge--${ep.status}">${ep.status === 'published' ? 'Published' : 'Draft'}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn action-btn--edit" data-id="${ep.id}">
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Edit
          </button>
          <button class="action-btn action-btn--delete" data-id="${ep.id}">
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
            Delete
          </button>
        </div>
      </td>
    `;
    episodeTableBody.appendChild(tr);
  });

  episodeTableBody.querySelectorAll('.action-btn--edit').forEach(btn =>
    btn.addEventListener('click', () => loadEdit(parseInt(btn.dataset.id)))
  );
  episodeTableBody.querySelectorAll('.action-btn--delete').forEach(btn =>
    btn.addEventListener('click', () => openDeleteModal(parseInt(btn.dataset.id)))
  );
}

/* ── Tags ── */
function renderTags() {
  tagsList.innerHTML = tags.map((t, i) => `
    <span class="tag-chip">
      ${t}
      <button class="tag-chip-remove" data-i="${i}" type="button">×</button>
    </span>
  `).join('');
  tagsList.querySelectorAll('.tag-chip-remove').forEach(btn =>
    btn.addEventListener('click', () => { tags.splice(parseInt(btn.dataset.i), 1); renderTags(); })
  );
}

tagsInput.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ',') && tagsInput.value.trim()) {
    e.preventDefault();
    const val = tagsInput.value.trim().replace(/,$/, '');
    if (val && !tags.includes(val)) { tags.push(val); renderTags(); }
    tagsInput.value = '';
  }
  if (e.key === 'Backspace' && !tagsInput.value && tags.length) {
    tags.pop(); renderTags();
  }
});
tagsWrap.addEventListener('click', () => tagsInput.focus());

/* ── Cover Upload ── */
coverInput.addEventListener('change', () => handleCoverFile(coverInput.files[0]));

coverZone.addEventListener('dragover', e => { e.preventDefault(); coverZone.classList.add('drag-over'); });
coverZone.addEventListener('dragleave', () => coverZone.classList.remove('drag-over'));
coverZone.addEventListener('drop', e => {
  e.preventDefault();
  coverZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) handleCoverFile(file);
});

function handleCoverFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    coverImg.src = e.target.result;
    coverPreview.style.display = 'flex';
    coverInner.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

coverRemove.addEventListener('click', e => {
  e.stopPropagation();
  coverImg.src = '';
  coverPreview.style.display = 'none';
  coverInner.style.display = 'flex';
  coverInput.value = '';
});

/* ── Collect Form ── */
function collectForm(status) {
  const num   = parseInt(epNumber.value);
  const title = epTitle.value.trim();
  const dur   = epDuration.value.trim();
  const guest = epGuest.value.trim();

  if (!num || !title || !dur || !guest) {
    showToast('Please fill in all required fields.', 'error');
    return null;
  }

  return {
    number:      num,
    title,
    guest,
    designation: epDesignation.value.trim(),
    spotify:     epSpotify.value.trim(),
    duration:    dur,
    desc:        epDesc.value.trim(),
    tags:        [...tags],
    cover:       coverImg.src || '',
    status
  };
}

/* ── Save ── */
saveDraftBtn.addEventListener('click', () => {
  const data = collectForm('draft');
  if (!data) return;
  saveEpisode(data);
  showToast('Draft saved successfully.', 'draft');
});

publishBtn.addEventListener('click', () => {
  const data = collectForm('published');
  if (!data) return;
  saveEpisode(data);
  showToast(`EP ${data.number} published!`, 'success');
});

function saveEpisode(data) {
  if (editingId !== null) {
    const idx = episodes.findIndex(e => e.id === editingId);
    if (idx !== -1) episodes[idx] = { ...episodes[idx], ...data };
  } else {
    episodes.unshift({ id: nextId++, ...data });
  }
  resetForm();
  renderTable();
  updateStats();
}

/* ── Edit ── */
function loadEdit(id) {
  const ep = episodes.find(e => e.id === id);
  if (!ep) return;
  editingId = id;
  epNumber.value      = ep.number;
  epTitle.value       = ep.title;
  epDuration.value    = ep.duration;
  epGuest.value       = ep.guest;
  epDesignation.value = ep.designation;
  epSpotify.value     = ep.spotify;
  epDesc.value        = ep.desc;
  tags = [...ep.tags];
  renderTags();
  if (ep.cover) {
    coverImg.src = ep.cover;
    coverPreview.style.display = 'flex';
    coverInner.style.display = 'none';
  }
  formPanelTitle.textContent = `Edit Episode — EP ${ep.number}`;
  episodeFormPanel.classList.remove('collapsed');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Delete ── */
function openDeleteModal(id) {
  const ep = episodes.find(e => e.id === id);
  if (!ep) return;
  deleteTargetId = id;
  deleteEpName.textContent = `EP ${ep.number}: ${ep.title}`;
  deleteModal.style.display = 'flex';
}

cancelDelete.addEventListener('click', () => { deleteModal.style.display = 'none'; deleteTargetId = null; });
deleteModal.addEventListener('click', e => { if (e.target === deleteModal) { deleteModal.style.display = 'none'; deleteTargetId = null; } });

confirmDelete.addEventListener('click', () => {
  episodes = episodes.filter(e => e.id !== deleteTargetId);
  deleteModal.style.display = 'none';
  deleteTargetId = null;
  renderTable();
  updateStats();
  showToast('Episode deleted.', 'delete');
});

/* ── Reset ── */
function resetForm() {
  editingId = null;
  episodeForm.reset();
  tags = [];
  renderTags();
  coverImg.src = '';
  coverPreview.style.display = 'none';
  coverInner.style.display = 'flex';
  coverInput.value = '';
  formPanelTitle.textContent = 'Add New Episode';
}

resetFormBtn.addEventListener('click', resetForm);

/* ── Collapse / Toggle Form ── */
collapseFormBtn.addEventListener('click', () => episodeFormPanel.classList.toggle('collapsed'));
toggleFormBtn.addEventListener('click', () => {
  episodeFormPanel.classList.remove('collapsed');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Search & Filter ── */
tableSearch.addEventListener('input', renderTable);

document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeFilter = pill.dataset.filter;
    renderTable();
  });
});

/* ── Toast ── */
let toastTimer;
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className = `toast toast--${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── Sidebar Toggle ── */
const sidebar        = document.getElementById('sidebar');
const sidebarToggle  = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  });
  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });
}

/* ── Init ── */
renderTable();
updateStats();
