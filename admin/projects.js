'use strict';

let projects = [
  {
    id: 1,
    title: 'NeuroSense - EEG-Based Emotion Detector',
    category: 'Neural Engineering',
    faculty: 'Dr. Allwyn Gnanadas',
    team: 'Arun Kumar, Priya Nair, Rahul Menon',
    desc: 'A real-time emotion recognition system using EEG signals and a lightweight CNN model deployed on a Raspberry Pi.',
    github: 'https://github.com/ieee-embs/neurosense',
    paper: 'https://arxiv.org/abs/example1',
    thumb: '',
    projStatus: 'completed',
    visibility: 'published'
  },
  {
    id: 2,
    title: 'CardioWatch - Wearable ECG Monitor',
    category: 'Wearable Technology',
    faculty: 'Dr. Priya Ramesh',
    team: 'Sneha Pillai, Kiran Raj',
    desc: 'A low-power wearable ECG patch with Bluetooth LE connectivity and a companion mobile app for real-time arrhythmia alerts.',
    github: 'https://github.com/ieee-embs/cardiowatch',
    paper: '',
    thumb: '',
    projStatus: 'ongoing',
    visibility: 'published'
  },
  {
    id: 3,
    title: 'RetinaScan - Diabetic Retinopathy Grader',
    category: 'Medical Imaging',
    faculty: 'Dr. Karthik Suresh',
    team: 'Meera Iyer, Ananya Krishnan, Rohan Das',
    desc: 'Deep learning pipeline using ResNet-50 to grade diabetic retinopathy from fundus images with 94% accuracy on the APTOS dataset.',
    github: 'https://github.com/ieee-embs/retinascan',
    paper: 'https://doi.org/10.1109/example3',
    thumb: '',
    projStatus: 'completed',
    visibility: 'published'
  },
  {
    id: 4,
    title: 'SoftGrip - Pneumatic Prosthetic Hand',
    category: 'Robotics & Prosthetics',
    faculty: 'Dr. Sneha Pillai',
    team: 'Vikram Nair, Divya Menon',
    desc: 'A 3D-printed soft robotic prosthetic hand actuated by pneumatic chambers, controlled via EMG signals from residual limb muscles.',
    github: '',
    paper: '',
    thumb: '',
    projStatus: 'ongoing',
    visibility: 'draft'
  },
  {
    id: 5,
    title: 'BioImpedance Body Composition Analyzer',
    category: 'Biomedical Instrumentation',
    faculty: 'Prof. Meera Iyer',
    team: 'Arjun Pillai, Sana Sheikh',
    desc: 'A portable 4-electrode bioimpedance analyzer for estimating body fat percentage, muscle mass, and hydration levels.',
    github: 'https://github.com/ieee-embs/bioimpedance',
    paper: 'https://arxiv.org/abs/example5',
    thumb: '',
    projStatus: 'completed',
    visibility: 'published'
  },
  {
    id: 6,
    title: 'GaitAssist - Stroke Rehabilitation Exoskeleton',
    category: 'Rehabilitation Engineering',
    faculty: 'Dr. Allwyn Gnanadas',
    team: 'Nisha Thomas, Ravi Kumar, Pooja Sharma',
    desc: 'A lower-limb exoskeleton with adaptive impedance control to assist post-stroke patients in gait rehabilitation therapy.',
    github: '',
    paper: 'https://doi.org/10.1109/example6',
    thumb: '',
    projStatus: 'on-hold',
    visibility: 'draft'
  }
];

let editingId    = null;
let deleteTarget = null;
let activeFilter = 'all';
let nextId       = 7;

const catClassMap = {
  'Neural Engineering':         '',
  'Medical Imaging':            'imaging',
  'Wearable Technology':        'wearable',
  'Biomedical Instrumentation': 'instrumentation',
  'Rehabilitation Engineering': 'rehab',
  'Bioinformatics':             'bio',
  'Robotics & Prosthetics':     'robotics',
  'Other':                      ''
};

function catClass(cat) { return catClassMap[cat] || ''; }

function updateStats() {
  document.getElementById('statTotal').textContent     = projects.length;
  document.getElementById('statPublished').textContent = projects.filter(p => p.visibility === 'published').length;
  document.getElementById('statDraft').textContent     = projects.filter(p => p.visibility === 'draft').length;
  document.getElementById('statOngoing').textContent   = projects.filter(p => p.projStatus === 'ongoing').length;
  document.getElementById('statCompleted').textContent = projects.filter(p => p.projStatus === 'completed').length;
}

function renderTable() {
  const q      = document.getElementById('tableSearch').value.toLowerCase();
  const tbody  = document.getElementById('projectTableBody');
  const empty  = document.getElementById('tableEmpty');
  const count  = document.getElementById('tableCount');

  const filtered = projects.filter(p => {
    const matchFilter =
      activeFilter === 'all' ||
      p.visibility === activeFilter ||
      p.projStatus === activeFilter;
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q)    ||
      p.category.toLowerCase().includes(q) ||
      p.faculty.toLowerCase().includes(q)  ||
      p.team.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  count.textContent = 'Showing ' + filtered.length + ' project' + (filtered.length !== 1 ? 's' : '');

  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(p => {
    const cc = catClass(p.category);
    const thumbCell = p.thumb
      ? '<img class="td-thumb" src="' + p.thumb + '" alt="thumb" />'
      : '<div class="td-thumb-placeholder"><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.3"/><polyline points="21,15 16,10 5,21" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';

    const githubBtn = '<a class="td-link-btn td-link-btn--github ' + (p.github ? '' : 'disabled') + '" ' + (p.github ? 'href="' + p.github + '" target="_blank" rel="noopener"' : '') + ' title="GitHub"><svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>';

    const paperBtn = '<a class="td-link-btn td-link-btn--paper ' + (p.paper ? '' : 'disabled') + '" ' + (p.paper ? 'href="' + p.paper + '" target="_blank" rel="noopener"' : '') + ' title="Research Paper"><svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></a>';

    const pLabel = p.projStatus.charAt(0).toUpperCase() + p.projStatus.slice(1).replace('-', ' ');

    return '<tr data-id="' + p.id + '">' +
      '<td class="col-proj-thumb">' + thumbCell + '</td>' +
      '<td><div class="td-proj-title" title="' + p.title + '">' + p.title + '</div><div class="td-proj-faculty">' + (p.faculty || '-') + '</div></td>' +
      '<td><span class="cat-badge ' + (cc ? 'cat-badge--' + cc : '') + '">' + p.category + '</span></td>' +
      '<td><span class="td-team" title="' + p.team + '">' + (p.team || '-') + '</span></td>' +
      '<td><div class="td-links">' + githubBtn + paperBtn + '</div></td>' +
      '<td><span class="pstatus-badge pstatus-badge--' + p.projStatus + '">' + pLabel + '</span></td>' +
      '<td><span class="status-badge status-badge--' + p.visibility + '">' + (p.visibility === 'published' ? 'Published' : 'Draft') + '</span></td>' +
      '<td><div class="action-btns">' +
        '<button class="action-btn action-btn--edit" onclick="editProject(' + p.id + ')"><svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> Edit</button>' +
        '<button class="action-btn action-btn--delete" onclick="openDeleteModal(' + p.id + ')"><svg viewBox="0 0 24 24" fill="none" width="12" height="12"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> Delete</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

/* Thumbnail */
const thumbInput   = document.getElementById('thumbInput');
const thumbInner   = document.getElementById('thumbInner');
const thumbPreview = document.getElementById('thumbPreview');
const thumbImg     = document.getElementById('thumbImg');
const thumbRemove  = document.getElementById('thumbRemove');
const thumbZone    = document.getElementById('thumbZone');

thumbInput.addEventListener('change', () => {
  const file = thumbInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    thumbImg.src = e.target.result;
    thumbInner.style.display   = 'none';
    thumbPreview.style.display = 'flex';
  };
  reader.readAsDataURL(file);
});

thumbRemove.addEventListener('click', e => {
  e.stopPropagation();
  thumbInput.value           = '';
  thumbImg.src               = '';
  thumbPreview.style.display = 'none';
  thumbInner.style.display   = 'flex';
});

thumbZone.addEventListener('dragover',  e => { e.preventDefault(); thumbZone.classList.add('drag-over'); });
thumbZone.addEventListener('dragleave', ()  => thumbZone.classList.remove('drag-over'));
thumbZone.addEventListener('drop', e => {
  e.preventDefault();
  thumbZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = ev => {
      thumbImg.src = ev.target.result;
      thumbInner.style.display   = 'none';
      thumbPreview.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }
});

/* Form collapse */
const formPanel   = document.getElementById('projectFormPanel');
const collapseBtn = document.getElementById('collapseFormBtn');
const toggleBtn   = document.getElementById('toggleFormBtn');

collapseBtn.addEventListener('click', () => formPanel.classList.toggle('collapsed'));
toggleBtn.addEventListener('click', () => {
  resetForm();
  formPanel.classList.remove('collapsed');
  formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function resetForm() {
  document.getElementById('projectForm').reset();
  thumbInput.value           = '';
  thumbImg.src               = '';
  thumbPreview.style.display = 'none';
  thumbInner.style.display   = 'flex';
  editingId = null;
  document.getElementById('formPanelTitle').textContent = 'Add New Project';
  document.getElementById('publishBtn').textContent     = 'Publish Project';
}

document.getElementById('resetFormBtn').addEventListener('click', resetForm);

function getFormData(visibility) {
  return {
    title:      document.getElementById('projTitle').value.trim(),
    category:   document.getElementById('projCategory').value,
    faculty:    document.getElementById('projFaculty').value.trim(),
    team:       document.getElementById('projTeam').value.trim(),
    desc:       document.getElementById('projDesc').value.trim(),
    github:     document.getElementById('projGithub').value.trim(),
    paper:      document.getElementById('projPaper').value.trim(),
    projStatus: document.getElementById('projStatus').value || 'ongoing',
    thumb:      thumbImg.src && thumbImg.src !== window.location.href ? thumbImg.src : '',
    visibility
  };
}

/* Save Draft */
document.getElementById('saveDraftBtn').addEventListener('click', () => {
  const title = document.getElementById('projTitle').value.trim();
  if (!title) { showToast('Please enter a project title.', 'error'); return; }
  const data = getFormData('draft');
  if (editingId) {
    Object.assign(projects.find(p => p.id === editingId), data);
  } else {
    projects.unshift({ id: nextId++, ...data });
  }
  showToast('"' + data.title + '" saved as draft.', 'draft');
  resetForm();
  renderTable();
  updateStats();
});

/* Publish */
document.getElementById('publishBtn').addEventListener('click', () => {
  const title    = document.getElementById('projTitle').value.trim();
  const category = document.getElementById('projCategory').value;
  if (!title || !category) { showToast('Title and Category are required.', 'error'); return; }
  const data = getFormData('published');
  if (editingId) {
    Object.assign(projects.find(p => p.id === editingId), data);
    showToast('"' + data.title + '" updated successfully.', 'success');
  } else {
    projects.unshift({ id: nextId++, ...data });
    showToast('"' + data.title + '" published successfully.', 'success');
  }
  resetForm();
  formPanel.classList.add('collapsed');
  renderTable();
  updateStats();
});

/* Edit */
function editProject(id) {
  const p = projects.find(p => p.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('projTitle').value    = p.title;
  document.getElementById('projCategory').value = p.category;
  document.getElementById('projFaculty').value  = p.faculty;
  document.getElementById('projTeam').value     = p.team;
  document.getElementById('projDesc').value     = p.desc;
  document.getElementById('projGithub').value   = p.github;
  document.getElementById('projPaper').value    = p.paper;
  document.getElementById('projStatus').value   = p.projStatus;
  if (p.thumb) {
    thumbImg.src = p.thumb;
    thumbInner.style.display   = 'none';
    thumbPreview.style.display = 'flex';
  }
  document.getElementById('formPanelTitle').textContent = 'Edit Project';
  document.getElementById('publishBtn').textContent     = 'Update Project';
  formPanel.classList.remove('collapsed');
  formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Delete */
function openDeleteModal(id) {
  deleteTarget = id;
  const p = projects.find(p => p.id === id);
  document.getElementById('deleteProjectName').textContent = p ? p.title : 'this project';
  document.getElementById('deleteModal').style.display = 'flex';
}

document.getElementById('cancelDelete').addEventListener('click', () => {
  document.getElementById('deleteModal').style.display = 'none';
  deleteTarget = null;
});

document.getElementById('confirmDelete').addEventListener('click', () => {
  if (deleteTarget === null) return;
  const p = projects.find(p => p.id === deleteTarget);
  projects = projects.filter(p => p.id !== deleteTarget);
  document.getElementById('deleteModal').style.display = 'none';
  showToast('"' + (p ? p.title : 'Project') + '" deleted.', 'delete');
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

/* Search */
document.getElementById('tableSearch').addEventListener('input', renderTable);

/* Filter pills */
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', function () {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    activeFilter = this.dataset.filter;
    renderTable();
  });
});

/* Toast */
function showToast(msg, type) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = 'toast toast--' + (type || 'success') + ' show';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* Sidebar toggle */
const sidebar = document.getElementById('sidebar');
const toggle  = document.getElementById('sidebarToggle');
const overlay = document.getElementById('sidebarOverlay');

toggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
});
overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
});

/* Init */
renderTable();
updateStats();
