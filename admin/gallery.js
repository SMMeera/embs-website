'use strict';

/* ── Dummy gradient colours for placeholder cards ── */
const GRADIENTS = [
  'linear-gradient(135deg,#1a0533,#0a2a2a)',
  'linear-gradient(135deg,#0d1f3c,#0a2a1a)',
  'linear-gradient(135deg,#1f0d3c,#0a1a2a)',
  'linear-gradient(135deg,#2a1a0a,#0a1a2a)',
  'linear-gradient(135deg,#0a2a1f,#1a0a2a)',
  'linear-gradient(135deg,#1a2a0a,#2a0a1a)',
  'linear-gradient(135deg,#0a1a2a,#2a1a0a)',
  'linear-gradient(135deg,#2a0a2a,#0a2a0a)',
];

/* ── Dummy Data ── */
let images = [
  { id:1,  name:'Opening Ceremony',       album:'EMBS Annual Meet 2024',    category:'Events',     event:'EMBS Annual Meet 2024',    src:'', gradient:GRADIENTS[0], initials:'EM' },
  { id:2,  name:'Keynote Speaker',         album:'EMBS Annual Meet 2024',    category:'Events',     event:'EMBS Annual Meet 2024',    src:'', gradient:GRADIENTS[1], initials:'KS' },
  { id:3,  name:'Team Photo',              album:'EMBS Annual Meet 2024',    category:'Team',       event:'EMBS Annual Meet 2024',    src:'', gradient:GRADIENTS[2], initials:'TP' },
  { id:4,  name:'Hands-on Session',        album:'BioSignal Workshop 2024',  category:'Workshops',  event:'BioSignal Workshop 2024',  src:'', gradient:GRADIENTS[3], initials:'HS' },
  { id:5,  name:'EEG Demo',                album:'BioSignal Workshop 2024',  category:'Workshops',  event:'BioSignal Workshop 2024',  src:'', gradient:GRADIENTS[4], initials:'ED' },
  { id:6,  name:'Group Discussion',        album:'BioSignal Workshop 2024',  category:'Workshops',  event:'BioSignal Workshop 2024',  src:'', gradient:GRADIENTS[5], initials:'GD' },
  { id:7,  name:'Hackathon Kickoff',       album:'MedTech Hackathon 2024',   category:'Hackathons', event:'MedTech Hackathon 2024',   src:'', gradient:GRADIENTS[6], initials:'HK' },
  { id:8,  name:'Prototype Showcase',      album:'MedTech Hackathon 2024',   category:'Hackathons', event:'MedTech Hackathon 2024',   src:'', gradient:GRADIENTS[7], initials:'PS' },
  { id:9,  name:'Winners Announcement',    album:'MedTech Hackathon 2024',   category:'Hackathons', event:'MedTech Hackathon 2024',   src:'', gradient:GRADIENTS[0], initials:'WA' },
  { id:10, name:'Best Paper Award',        album:'Research Symposium 2023',  category:'Awards',     event:'Research Symposium 2023',  src:'', gradient:GRADIENTS[1], initials:'BP' },
  { id:11, name:'Certificate Distribution',album:'Research Symposium 2023', category:'Awards',     event:'Research Symposium 2023',  src:'', gradient:GRADIENTS[2], initials:'CD' },
  { id:12, name:'Neural Interfaces Talk',  album:'Neural Interfaces Seminar',category:'Seminars',   event:'Neural Interfaces Seminar',src:'', gradient:GRADIENTS[3], initials:'NI' },
  { id:13, name:'Q&A Session',             album:'Neural Interfaces Seminar',category:'Seminars',   event:'Neural Interfaces Seminar',src:'', gradient:GRADIENTS[4], initials:'QA' },
  { id:14, name:'Core Team 2024',          album:'Team Photos',              category:'Team',       event:'',                         src:'', gradient:GRADIENTS[5], initials:'CT' },
  { id:15, name:'Executive Board',         album:'Team Photos',              category:'Team',       event:'',                         src:'', gradient:GRADIENTS[6], initials:'EB' },
  { id:16, name:'Wearables Demo Booth',    album:'Wearables Expo 2024',      category:'Events',     event:'Wearables Expo 2024',      src:'', gradient:GRADIENTS[7], initials:'WD' },
];

let nextId       = 17;
let deleteTarget = null;
let activeFilter = 'all';
let lbIndex      = 0;
let lbFiltered   = [];

/* pending upload files */
let pendingFiles = [];

/* ── Stats ── */
function updateStats() {
  const albums     = new Set(images.map(i => i.album)).size;
  const events     = new Set(images.map(i => i.event).filter(Boolean)).size;
  const categories = new Set(images.map(i => i.category)).size;
  document.getElementById('statTotal').textContent      = images.length;
  document.getElementById('statAlbums').textContent     = albums;
  document.getElementById('statEvents').textContent     = events;
  document.getElementById('statCategories').textContent = categories;
}

/* ── Category CSS class ── */
function catClass(cat) {
  return 'gal-cat-badge--' + cat.toLowerCase();
}

/* ── Render Gallery Grid ── */
function renderGallery() {
  const q       = document.getElementById('gallerySearch').value.toLowerCase();
  const grid    = document.getElementById('galleryGrid');
  const empty   = document.getElementById('galleryEmpty');
  const counter = document.getElementById('galleryCount');

  const filtered = images.filter(img => {
    const matchCat = activeFilter === 'all' || img.category === activeFilter;
    const matchQ   = !q ||
      img.name.toLowerCase().includes(q)     ||
      img.album.toLowerCase().includes(q)    ||
      img.category.toLowerCase().includes(q) ||
      img.event.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  lbFiltered = filtered;
  counter.textContent = 'Showing ' + filtered.length + ' image' + (filtered.length !== 1 ? 's' : '');

  if (!filtered.length) {
    grid.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = filtered.map((img, idx) => {
    const imgContent = img.src
      ? '<img src="' + img.src + '" alt="' + img.name + '" loading="lazy" />'
      : '<div class="gal-card-img-placeholder" style="background:' + img.gradient + '">' + img.initials + '</div>';

    return '<div class="gal-card" data-id="' + img.id + '" data-idx="' + idx + '">' +
      '<div class="gal-card-img-wrap">' +
        imgContent +
        '<div class="gal-card-overlay">' +
          '<button class="gal-card-action gal-card-action--view" onclick="openLightbox(' + idx + ');event.stopPropagation();" title="View">' +
            '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>' +
          '</button>' +
          '<button class="gal-card-action gal-card-action--delete" onclick="openDeleteModal(' + img.id + ');event.stopPropagation();" title="Delete">' +
            '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="gal-card-body">' +
        '<div class="gal-card-name" title="' + img.name + '">' + img.name + '</div>' +
        '<div class="gal-card-meta">' +
          '<span class="gal-cat-badge ' + catClass(img.category) + '">' + img.category + '</span>' +
          '<span class="gal-album-tag">' + img.album + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ── Upload Panel toggle ── */
const uploadPanel  = document.getElementById('uploadPanel');
const collapseBtn  = document.getElementById('collapseUploadBtn');
const toggleUpload = document.getElementById('toggleUploadBtn');

collapseBtn.addEventListener('click', () => uploadPanel.classList.toggle('collapsed'));
toggleUpload.addEventListener('click', () => {
  uploadPanel.classList.remove('collapsed');
  uploadPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ── Drop Zone ── */
const dropZone   = document.getElementById('dropZone');
const fileInput  = document.getElementById('fileInput');
const previewStrip = document.getElementById('previewStrip');
const previewGrid  = document.getElementById('previewGrid');
const previewCount = document.getElementById('previewCount');

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  addFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
});
fileInput.addEventListener('change', () => {
  addFiles(Array.from(fileInput.files));
  fileInput.value = '';
});

function addFiles(files) {
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      pendingFiles.push({ file, src: e.target.result });
      renderPreview();
    };
    reader.readAsDataURL(file);
  });
}

function renderPreview() {
  if (!pendingFiles.length) {
    previewStrip.style.display = 'none';
    return;
  }
  previewStrip.style.display = 'flex';
  previewCount.textContent = pendingFiles.length + ' image' + (pendingFiles.length !== 1 ? 's' : '') + ' selected';
  previewGrid.innerHTML = pendingFiles.map((pf, i) =>
    '<div class="gal-preview-item">' +
      '<img src="' + pf.src + '" alt="preview" />' +
      '<button class="gal-preview-remove" onclick="removePreview(' + i + ')">x</button>' +
    '</div>'
  ).join('');
}

function removePreview(idx) {
  pendingFiles.splice(idx, 1);
  renderPreview();
}

document.getElementById('clearFilesBtn').addEventListener('click', () => {
  pendingFiles = [];
  renderPreview();
});

/* ── Reset Upload Form ── */
function resetUpload() {
  document.getElementById('upAlbum').value    = '';
  document.getElementById('upCategory').value = '';
  document.getElementById('upEvent').value    = '';
  pendingFiles = [];
  renderPreview();
}
document.getElementById('resetUploadBtn').addEventListener('click', resetUpload);

/* ── Submit Upload ── */
document.getElementById('uploadSubmitBtn').addEventListener('click', () => {
  const album    = document.getElementById('upAlbum').value.trim();
  const category = document.getElementById('upCategory').value;
  const event    = document.getElementById('upEvent').value;

  if (!album)    { showToast('Please enter an album name.', 'error'); return; }
  if (!category) { showToast('Please select a category.', 'error'); return; }
  if (!pendingFiles.length) { showToast('Please select at least one image.', 'error'); return; }

  const grad = GRADIENTS[nextId % GRADIENTS.length];
  pendingFiles.forEach(pf => {
    const name = pf.file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    images.unshift({
      id: nextId++,
      name,
      album,
      category,
      event,
      src: pf.src,
      gradient: grad,
      initials: name.slice(0, 2).toUpperCase()
    });
  });

  showToast(pendingFiles.length + ' image' + (pendingFiles.length !== 1 ? 's' : '') + ' uploaded to "' + album + '".', 'success');
  resetUpload();
  uploadPanel.classList.add('collapsed');
  renderGallery();
  updateStats();
});

/* ── Search ── */
document.getElementById('gallerySearch').addEventListener('input', renderGallery);

/* ── Filter Pills ── */
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', function () {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    activeFilter = this.dataset.filter;
    renderGallery();
  });
});

/* ── Lightbox ── */
function openLightbox(idx) {
  lbIndex = idx;
  showLbImage();
  document.getElementById('lightbox').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function showLbImage() {
  const img = lbFiltered[lbIndex];
  if (!img) return;
  const lbImg = document.getElementById('lbImg');
  if (img.src) {
    lbImg.src = img.src;
    lbImg.style.display = 'block';
  } else {
    lbImg.src = '';
    lbImg.style.display = 'none';
  }
  document.getElementById('lbTitle').textContent = img.name;
  document.getElementById('lbMeta').textContent  = img.album + (img.event ? ' · ' + img.event : '') + ' · ' + img.category;
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = '';
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});
document.getElementById('lbPrev').addEventListener('click', () => {
  lbIndex = (lbIndex - 1 + lbFiltered.length) % lbFiltered.length;
  showLbImage();
});
document.getElementById('lbNext').addEventListener('click', () => {
  lbIndex = (lbIndex + 1) % lbFiltered.length;
  showLbImage();
});
document.addEventListener('keydown', e => {
  if (document.getElementById('lightbox').style.display === 'none') return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + lbFiltered.length) % lbFiltered.length; showLbImage(); }
  if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbFiltered.length; showLbImage(); }
});

/* ── Delete ── */
function openDeleteModal(id) {
  deleteTarget = id;
  const img = images.find(i => i.id === id);
  document.getElementById('deleteImgName').textContent = img ? img.name : 'this image';
  document.getElementById('deleteModal').style.display = 'flex';
}

document.getElementById('cancelDelete').addEventListener('click', () => {
  document.getElementById('deleteModal').style.display = 'none';
  deleteTarget = null;
});

document.getElementById('confirmDelete').addEventListener('click', () => {
  if (deleteTarget === null) return;
  const img = images.find(i => i.id === deleteTarget);
  images = images.filter(i => i.id !== deleteTarget);
  document.getElementById('deleteModal').style.display = 'none';
  showToast('"' + (img ? img.name : 'Image') + '" deleted.', 'delete');
  deleteTarget = null;
  renderGallery();
  updateStats();
});

document.getElementById('deleteModal').addEventListener('click', e => {
  if (e.target === document.getElementById('deleteModal')) {
    document.getElementById('deleteModal').style.display = 'none';
    deleteTarget = null;
  }
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
renderGallery();
updateStats();
