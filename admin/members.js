'use strict';

/* ── Avatar gradient palette ── */
const AVATAR_COLORS = [
  ['#6B2D8B','#00A99D'], ['#1a6b8b','#00A99D'], ['#8b2d6b','#a99d00'],
  ['#2d6b1a','#00A99D'], ['#6b1a2d','#8b6b00'], ['#1a2d6b','#6b8b00'],
  ['#8b6b1a','#2d8b6b'], ['#6b8b2d','#1a6b8b'],
];

/* ── Dummy Data ── */
let members = [
  { id:1,  name:'Arun Kumar',       email:'arun.kumar@embs.edu',      phone:'+91 98765 43210', position:'Chairperson',       dept:'Biomedical Engineering',       year:'3rd Year', status:'active',   linkedin:'https://linkedin.com/in/arunkumar',    photo:'' },
  { id:2,  name:'Priya Nair',        email:'priya.nair@embs.edu',       phone:'+91 87654 32109', position:'Vice Chairperson',  dept:'Electronics & Communication',  year:'3rd Year', status:'active',   linkedin:'https://linkedin.com/in/priyanair',     photo:'' },
  { id:3,  name:'Rahul Menon',       email:'rahul.menon@embs.edu',      phone:'+91 76543 21098', position:'Secretary',         dept:'Biomedical Engineering',       year:'2nd Year', status:'active',   linkedin:'',                                     photo:'' },
  { id:4,  name:'Sneha Pillai',      email:'sneha.pillai@embs.edu',     phone:'+91 65432 10987', position:'Treasurer',         dept:'Computer Science',             year:'3rd Year', status:'active',   linkedin:'https://linkedin.com/in/snehapillai',   photo:'' },
  { id:5,  name:'Kiran Raj',         email:'kiran.raj@embs.edu',        phone:'+91 54321 09876', position:'Technical Lead',    dept:'Electronics & Communication',  year:'4th Year', status:'active',   linkedin:'https://linkedin.com/in/kiranraj',      photo:'' },
  { id:6,  name:'Meera Iyer',        email:'meera.iyer@embs.edu',       phone:'+91 43210 98765', position:'Events Lead',       dept:'Biomedical Engineering',       year:'2nd Year', status:'active',   linkedin:'',                                     photo:'' },
  { id:7,  name:'Ananya Krishnan',   email:'ananya.k@embs.edu',         phone:'+91 32109 87654', position:'Design Lead',       dept:'Computer Science',             year:'2nd Year', status:'active',   linkedin:'https://linkedin.com/in/ananyak',       photo:'' },
  { id:8,  name:'Rohan Das',         email:'rohan.das@embs.edu',        phone:'+91 21098 76543', position:'Content Lead',      dept:'Information Technology',       year:'3rd Year', status:'active',   linkedin:'',                                     photo:'' },
  { id:9,  name:'Vikram Nair',       email:'vikram.nair@embs.edu',      phone:'+91 10987 65432', position:'Research Lead',     dept:'Biomedical Engineering',       year:'4th Year', status:'inactive', linkedin:'https://linkedin.com/in/vikramnair',    photo:'' },
  { id:10, name:'Divya Menon',       email:'divya.menon@embs.edu',      phone:'+91 98760 12345', position:'Core Member',       dept:'Electrical Engineering',       year:'2nd Year', status:'active',   linkedin:'',                                     photo:'' },
  { id:11, name:'Arjun Pillai',      email:'arjun.pillai@embs.edu',     phone:'+91 87651 23456', position:'Technical Member',  dept:'Electronics & Communication',  year:'1st Year', status:'active',   linkedin:'',                                     photo:'' },
  { id:12, name:'Sana Sheikh',       email:'sana.sheikh@embs.edu',      phone:'+91 76542 34567', position:'Events Member',     dept:'Biomedical Engineering',       year:'1st Year', status:'active',   linkedin:'',                                     photo:'' },
  { id:13, name:'Nisha Thomas',      email:'nisha.thomas@embs.edu',     phone:'+91 65433 45678', position:'Design Member',     dept:'Computer Science',             year:'2nd Year', status:'inactive', linkedin:'',                                     photo:'' },
  { id:14, name:'Ravi Kumar',        email:'ravi.kumar@embs.edu',       phone:'+91 54324 56789', position:'Volunteer',         dept:'Mechanical Engineering',       year:'1st Year', status:'active',   linkedin:'',                                     photo:'' },
  { id:15, name:'Pooja Sharma',      email:'pooja.sharma@embs.edu',     phone:'+91 43215 67890', position:'Volunteer',         dept:'Information Technology',       year:'1st Year', status:'active',   linkedin:'',                                     photo:'' },
  { id:16, name:'Dr. Allwyn G.',     email:'allwyn.g@embs.edu',         phone:'+91 32106 78901', position:'Associate Member',  dept:'Biomedical Engineering',       year:'Alumni',   status:'active',   linkedin:'https://linkedin.com/in/allwyng',       photo:'' },
  { id:17, name:'Kavya Reddy',       email:'kavya.reddy@embs.edu',      phone:'+91 21097 89012', position:'Social Media Lead', dept:'Computer Science',             year:'3rd Year', status:'active',   linkedin:'https://linkedin.com/in/kavyareddy',    photo:'' },
  { id:18, name:'Suresh Babu',       email:'suresh.babu@embs.edu',      phone:'+91 10988 90123', position:'Core Member',       dept:'Electrical Engineering',       year:'4th Year', status:'inactive', linkedin:'',                                     photo:'' },
];

let editingId    = null;
let deleteTarget = null;
let nextId       = 19;

/* ── Role classification ── */
const EXEC_POSITIONS = ['Chairperson','Vice Chairperson','Secretary','Treasurer','Technical Lead','Events Lead','Design Lead','Content Lead','Social Media Lead','Research Lead'];
const CORE_POSITIONS = ['Core Member','Technical Member','Events Member','Design Member','Content Member'];

function roleOf(position) {
  if (EXEC_POSITIONS.includes(position)) return 'executive';
  if (CORE_POSITIONS.includes(position)) return 'core';
  return 'volunteer';
}

/* ── Stats ── */
function updateStats() {
  document.getElementById('statTotal').textContent    = members.length;
  document.getElementById('statActive').textContent   = members.filter(m => m.status === 'active').length;
  document.getElementById('statInactive').textContent = members.filter(m => m.status === 'inactive').length;
  document.getElementById('statExec').textContent     = members.filter(m => roleOf(m.position) === 'executive').length;
  document.getElementById('statVolunteer').textContent= members.filter(m => roleOf(m.position) === 'volunteer').length;
}

/* ── Avatar ── */
function avatarHTML(m) {
  if (m.photo) return '<img class="mem-avatar" src="' + m.photo + '" alt="' + m.name + '" />';
  const colors = AVATAR_COLORS[m.id % AVATAR_COLORS.length];
  const initials = m.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
  return '<div class="mem-avatar-placeholder" style="background:linear-gradient(135deg,' + colors[0] + ',' + colors[1] + ')">' + initials + '</div>';
}

/* ── Render Table ── */
function renderTable() {
  const q      = document.getElementById('tableSearch').value.toLowerCase();
  const dept   = document.getElementById('filterDept').value;
  const year   = document.getElementById('filterYear').value;
  const role   = document.getElementById('filterRole').value;
  const status = document.getElementById('filterStatus').value;
  const tbody  = document.getElementById('membersTableBody');
  const empty  = document.getElementById('tableEmpty');
  const count  = document.getElementById('tableCount');

  const filtered = members.filter(m => {
    if (dept   && m.dept !== dept)           return false;
    if (year   && m.year !== year)           return false;
    if (role   && roleOf(m.position) !== role) return false;
    if (status && m.status !== status)       return false;
    if (q && !(
      m.name.toLowerCase().includes(q)     ||
      m.email.toLowerCase().includes(q)    ||
      m.position.toLowerCase().includes(q) ||
      m.dept.toLowerCase().includes(q)
    )) return false;
    return true;
  });

  count.textContent = 'Showing ' + filtered.length + ' member' + (filtered.length !== 1 ? 's' : '');

  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(m => {
    const role = roleOf(m.position);
    const linkedinLink = m.linkedin
      ? '<a class="td-mem-linkedin" href="' + m.linkedin + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" width="10" height="10"><rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.6"/><line x1="7" y1="17" x2="7" y2="10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="7" y1="7" x2="7" y2="7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M11 17v-4a2 2 0 0 1 4 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="11" y1="10" x2="11" y2="17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg> LinkedIn</a>'
      : '';

    return '<tr data-id="' + m.id + '">' +
      '<td class="col-mem-photo">' + avatarHTML(m) + '</td>' +
      '<td>' +
        '<div class="td-mem-name">' + m.name + '</div>' +
        '<div class="td-mem-phone">' + (m.phone || '') + '</div>' +
      '</td>' +
      '<td><span class="pos-badge pos-badge--' + role + '">' + m.position + '</span></td>' +
      '<td><span style="font-size:0.78rem;color:var(--text-muted)">' + m.dept + '</span></td>' +
      '<td><span style="font-size:0.78rem;color:var(--text-muted)">' + m.year + '</span></td>' +
      '<td>' +
        '<div class="td-mem-email" title="' + m.email + '">' + m.email + '</div>' +
        linkedinLink +
      '</td>' +
      '<td><span class="status-badge status-badge--' + m.status + '">' + (m.status === 'active' ? 'Active' : 'Inactive') + '</span></td>' +
      '<td><div class="action-btns">' +
        '<button class="action-btn action-btn--edit" onclick="editMember(' + m.id + ')">' +
          '<svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
          ' Edit' +
        '</button>' +
        '<button class="action-btn action-btn--delete" onclick="openDeleteModal(' + m.id + ')">' +
          '<svg viewBox="0 0 24 24" fill="none" width="12" height="12"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
          ' Delete' +
        '</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

/* ── Photo Upload ── */
const photoInput   = document.getElementById('photoInput');
const photoInner   = document.getElementById('photoInner');
const photoPreview = document.getElementById('photoPreview');
const photoImg     = document.getElementById('photoImg');
const photoRemove  = document.getElementById('photoRemove');

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    photoImg.src = e.target.result;
    photoInner.style.display   = 'none';
    photoPreview.style.display = 'flex';
  };
  reader.readAsDataURL(file);
});
photoRemove.addEventListener('click', e => {
  e.stopPropagation();
  photoInput.value           = '';
  photoImg.src               = '';
  photoPreview.style.display = 'none';
  photoInner.style.display   = 'flex';
});

/* ── Form Panel ── */
const formPanel  = document.getElementById('memberFormPanel');
const collapseBtn = document.getElementById('collapseFormBtn');
const toggleBtn   = document.getElementById('toggleFormBtn');

collapseBtn.addEventListener('click', () => formPanel.classList.toggle('collapsed'));
toggleBtn.addEventListener('click', () => {
  resetForm();
  formPanel.classList.remove('collapsed');
  formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function resetForm() {
  document.getElementById('memberForm').reset();
  photoInput.value           = '';
  photoImg.src               = '';
  photoPreview.style.display = 'none';
  photoInner.style.display   = 'flex';
  editingId = null;
  document.getElementById('formPanelTitle').textContent = 'Add New Member';
  document.getElementById('saveMemberBtn').textContent  = 'Save Member';
}
document.getElementById('resetFormBtn').addEventListener('click', resetForm);

/* ── Save Member ── */
document.getElementById('saveMemberBtn').addEventListener('click', () => {
  const name     = document.getElementById('memName').value.trim();
  const email    = document.getElementById('memEmail').value.trim();
  const position = document.getElementById('memPosition').value;
  const dept     = document.getElementById('memDept').value;
  const year     = document.getElementById('memYear').value;

  if (!name || !email || !position || !dept || !year) {
    showToast('Name, Email, Position, Department and Year are required.', 'error');
    return;
  }

  const data = {
    name,
    email,
    position,
    dept,
    year,
    status:   document.getElementById('memStatus').value,
    phone:    document.getElementById('memPhone').value.trim(),
    linkedin: document.getElementById('memLinkedin').value.trim(),
    photo:    photoImg.src && photoImg.src !== window.location.href ? photoImg.src : '',
  };

  if (editingId) {
    Object.assign(members.find(m => m.id === editingId), data);
    showToast('"' + data.name + '" updated successfully.', 'success');
  } else {
    members.unshift({ id: nextId++, ...data });
    showToast('"' + data.name + '" added to the chapter.', 'success');
  }

  resetForm();
  formPanel.classList.add('collapsed');
  renderTable();
  updateStats();
});

/* ── Edit ── */
function editMember(id) {
  const m = members.find(m => m.id === id);
  if (!m) return;
  editingId = id;

  document.getElementById('memName').value     = m.name;
  document.getElementById('memEmail').value    = m.email;
  document.getElementById('memPosition').value = m.position;
  document.getElementById('memDept').value     = m.dept;
  document.getElementById('memYear').value     = m.year;
  document.getElementById('memStatus').value   = m.status;
  document.getElementById('memPhone').value    = m.phone;
  document.getElementById('memLinkedin').value = m.linkedin;

  if (m.photo) {
    photoImg.src = m.photo;
    photoInner.style.display   = 'none';
    photoPreview.style.display = 'flex';
  }

  document.getElementById('formPanelTitle').textContent = 'Edit Member';
  document.getElementById('saveMemberBtn').textContent  = 'Update Member';
  formPanel.classList.remove('collapsed');
  formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Delete ── */
function openDeleteModal(id) {
  deleteTarget = id;
  const m = members.find(m => m.id === id);
  document.getElementById('deleteMemberName').textContent = m ? m.name : 'this member';
  document.getElementById('deleteModal').style.display = 'flex';
}

document.getElementById('cancelDelete').addEventListener('click', () => {
  document.getElementById('deleteModal').style.display = 'none';
  deleteTarget = null;
});

document.getElementById('confirmDelete').addEventListener('click', () => {
  if (deleteTarget === null) return;
  const m = members.find(m => m.id === deleteTarget);
  members = members.filter(m => m.id !== deleteTarget);
  document.getElementById('deleteModal').style.display = 'none';
  showToast('"' + (m ? m.name : 'Member') + '" removed.', 'delete');
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

/* ── Search & Filters ── */
document.getElementById('tableSearch').addEventListener('input', renderTable);
['filterDept','filterYear','filterRole','filterStatus'].forEach(id =>
  document.getElementById(id).addEventListener('change', renderTable)
);

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
