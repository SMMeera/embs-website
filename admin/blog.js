/* ── Dummy Data ── */
const dummyBlogs = [
  {
    id: 1,
    title: "The Future of Neural Interfaces in Clinical Medicine",
    category: "Neural Engineering",
    author: "Dr. Arun Kumar",
    tags: ["Neural", "BCI", "Clinical"],
    status: "published",
    date: "Jun 12, 2025",
    content: "<h1>The Future of Neural Interfaces</h1><p>Neural interfaces are revolutionizing how we treat neurological disorders...</p>"
  },
  {
    id: 2,
    title: "Wearable ECG Monitors: A 2025 Overview",
    category: "Wearable Technology",
    author: "Priya Nair",
    tags: ["ECG", "Wearable", "IoT"],
    status: "published",
    date: "Jun 8, 2025",
    content: "<h2>Wearable ECG Monitors</h2><p>The latest generation of wearable ECG devices offers unprecedented accuracy...</p>"
  },
  {
    id: 3,
    title: "Deep Learning in Medical Image Segmentation",
    category: "Medical Imaging",
    author: "Rahul Menon",
    tags: ["Deep Learning", "MRI", "Segmentation"],
    status: "draft",
    date: "Jun 5, 2025",
    content: "<p>Deep learning models have achieved radiologist-level performance in segmentation tasks...</p>"
  },
  {
    id: 4,
    title: "IEEE EMBS BioSignal Workshop 2025 Recap",
    category: "Events & Recap",
    author: "Sneha Pillai",
    tags: ["Workshop", "BioSignal", "2025"],
    status: "published",
    date: "May 28, 2025",
    content: "<h1>BioSignal Workshop Recap</h1><p>Over 120 participants joined our annual BioSignal workshop...</p>"
  },
  {
    id: 5,
    title: "Soft Robotics for Minimally Invasive Surgery",
    category: "Biomedical Engineering",
    author: "Dr. Arun Kumar",
    tags: ["Robotics", "Surgery", "Innovation"],
    status: "draft",
    date: "May 20, 2025",
    content: "<p>Soft robotic actuators are enabling a new class of surgical tools...</p>"
  }
];

let blogs = [...dummyBlogs];
let editingId = null;
let deleteTargetId = null;
let nextId = blogs.length + 1;
let tags = [];

/* ── DOM Refs ── */
const blogForm       = document.getElementById('blogForm');
const blogTitle      = document.getElementById('blogTitle');
const blogCategory   = document.getElementById('blogCategory');
const blogAuthor     = document.getElementById('blogAuthor');
const editorBody     = document.getElementById('editorBody');
const tagsInput      = document.getElementById('tagsInput');
const tagsList       = document.getElementById('tagsList');
const tagsWrap       = document.getElementById('tagsWrap');
const uploadZone     = document.getElementById('uploadZone');
const coverInput     = document.getElementById('coverImageInput');
const coverPreview   = document.getElementById('coverPreview');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const saveDraftBtn   = document.getElementById('saveDraftBtn');
const publishBtn     = document.getElementById('publishBtn');
const resetFormBtn   = document.getElementById('resetFormBtn');
const blogSearch     = document.getElementById('blogSearch');
const blogTableBody  = document.getElementById('blogTableBody');
const tableEmpty     = document.getElementById('tableEmpty');
const formTitle      = document.getElementById('formTitle');
const modalOverlay   = document.getElementById('modalOverlay');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const toast          = document.getElementById('toast');

/* ── Render Table ── */
function renderTable(filter = '') {
  const q = filter.toLowerCase();
  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.category.toLowerCase().includes(q) ||
    b.tags.some(t => t.toLowerCase().includes(q))
  );

  blogTableBody.innerHTML = '';
  tableEmpty.style.display = filtered.length === 0 ? 'block' : 'none';

  filtered.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-title" title="${b.title}">${b.title}</td>
      <td>${b.category}</td>
      <td>${b.author}</td>
      <td>
        <div class="td-tags">
          ${b.tags.map(t => `<span class="td-tag">${t}</span>`).join('')}
        </div>
      </td>
      <td><span class="status-badge status-badge--${b.status}">${b.status === 'published' ? 'Published' : 'Draft'}</span></td>
      <td>${b.date}</td>
      <td>
        <div class="td-actions">
          <button class="action-btn action-btn--edit" data-id="${b.id}" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="action-btn action-btn--delete" data-id="${b.id}" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
          </button>
        </div>
      </td>
    `;
    blogTableBody.appendChild(tr);
  });

  /* Attach row action listeners */
  blogTableBody.querySelectorAll('.action-btn--edit').forEach(btn =>
    btn.addEventListener('click', () => loadEdit(parseInt(btn.dataset.id)))
  );
  blogTableBody.querySelectorAll('.action-btn--delete').forEach(btn =>
    btn.addEventListener('click', () => openDeleteModal(parseInt(btn.dataset.id)))
  );
}

/* ── Tags ── */
function renderTags() {
  tagsList.innerHTML = tags.map((t, i) => `
    <span class="tag-chip">
      ${t}
      <button class="tag-remove" data-i="${i}" type="button">×</button>
    </span>
  `).join('');
  tagsList.querySelectorAll('.tag-remove').forEach(btn =>
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

/* ── Cover Image Upload ── */
uploadZone.addEventListener('click', () => coverInput.click());
coverInput.addEventListener('change', () => {
  const file = coverInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => showPreview(e.target.result);
  reader.readAsDataURL(file);
});

uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = ev => showPreview(ev.target.result);
    reader.readAsDataURL(file);
  }
});

function showPreview(src) {
  coverPreview.src = src;
  coverPreview.classList.add('visible');
  uploadPlaceholder.style.display = 'none';
}

function clearPreview() {
  coverPreview.src = '';
  coverPreview.classList.remove('visible');
  uploadPlaceholder.style.display = '';
  coverInput.value = '';
}

/* ── Toolbar ── */
document.querySelectorAll('.tb-btn').forEach(btn => {
  btn.addEventListener('mousedown', e => {
    e.preventDefault();
    const cmd = btn.dataset.cmd;
    editorBody.focus();

    if (cmd === 'bold')   { document.execCommand('bold'); }
    else if (cmd === 'italic') { document.execCommand('italic'); }
    else if (cmd === 'h1') { wrapBlock('h1'); }
    else if (cmd === 'h2') { wrapBlock('h2'); }
    else if (cmd === 'list') { document.execCommand('insertUnorderedList'); }
    else if (cmd === 'link') {
      const url = prompt('Enter URL:');
      if (url) document.execCommand('createLink', false, url);
    }
    else if (cmd === 'image') {
      const url = prompt('Enter image URL:');
      if (url) document.execCommand('insertImage', false, url);
    }
    updateToolbarState();
  });
});

function wrapBlock(tag) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  const el = document.createElement(tag);
  try {
    range.surroundContents(el);
  } catch {
    el.appendChild(range.extractContents());
    range.insertNode(el);
  }
}

function updateToolbarState() {
  document.querySelector('[data-cmd="bold"]').classList.toggle('active', document.queryCommandState('bold'));
  document.querySelector('[data-cmd="italic"]').classList.toggle('active', document.queryCommandState('italic'));
}

editorBody.addEventListener('keyup', updateToolbarState);
editorBody.addEventListener('mouseup', updateToolbarState);

/* ── Save / Publish ── */
function collectForm(status) {
  const title    = blogTitle.value.trim();
  const category = blogCategory.value;
  const author   = blogAuthor.value.trim();
  const content  = editorBody.innerHTML.trim();

  if (!title || !category || !author || !content || content === '<p>Start writing your blog post here…</p>') {
    showToast('Please fill in all required fields.', 'error');
    return null;
  }

  const now = new Date();
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return { title, category, author, tags: [...tags], status, date, content };
}

saveDraftBtn.addEventListener('click', () => {
  const data = collectForm('draft');
  if (!data) return;
  savePost(data);
  showToast('Draft saved successfully.', 'success');
});

publishBtn.addEventListener('click', () => {
  const data = collectForm('published');
  if (!data) return;
  savePost(data);
  showToast('Blog post published!', 'success');
});

function savePost(data) {
  if (editingId !== null) {
    const idx = blogs.findIndex(b => b.id === editingId);
    if (idx !== -1) blogs[idx] = { ...blogs[idx], ...data };
  } else {
    blogs.unshift({ id: nextId++, ...data });
  }
  resetForm();
  renderTable(blogSearch.value);
}

/* ── Edit ── */
function loadEdit(id) {
  const b = blogs.find(b => b.id === id);
  if (!b) return;
  editingId = id;
  blogTitle.value    = b.title;
  blogCategory.value = b.category;
  blogAuthor.value   = b.author;
  editorBody.innerHTML = b.content;
  tags = [...b.tags];
  renderTags();
  formTitle.textContent = 'Edit Blog Post';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Delete ── */
function openDeleteModal(id) {
  deleteTargetId = id;
  modalOverlay.classList.add('active');
}

cancelDeleteBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
  deleteTargetId = null;
});

confirmDeleteBtn.addEventListener('click', () => {
  blogs = blogs.filter(b => b.id !== deleteTargetId);
  modalOverlay.classList.remove('active');
  deleteTargetId = null;
  renderTable(blogSearch.value);
  showToast('Blog post deleted.', 'error');
});

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) { modalOverlay.classList.remove('active'); deleteTargetId = null; }
});

/* ── Reset ── */
function resetForm() {
  editingId = null;
  blogForm.reset();
  editorBody.innerHTML = '<p>Start writing your blog post here…</p>';
  tags = [];
  renderTags();
  clearPreview();
  formTitle.textContent = 'Create New Blog Post';
}

resetFormBtn.addEventListener('click', resetForm);

/* ── Search ── */
blogSearch.addEventListener('input', () => renderTable(blogSearch.value));

/* ── Toast ── */
let toastTimer;
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className = `toast toast--${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── Sidebar Toggle (mobile) ── */
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
