import { apiGet } from './api.js';

(function () {
  'use strict';

  function getStatusClass(status) {
    const s = (status || '').toLowerCase();
    if (s === 'completed') return 'proj-card-status--completed';
    if (s === 'published') return 'proj-card-status--published';
    return 'proj-card-status--ongoing';
  }

  function buildCard(project) {
    const tags = Array.isArray(project.tags) ? project.tags : [];
    const team = Array.isArray(project.teamMembers) ? project.teamMembers.join(', ') : (project.teamMembers || '');
    const links = [];
    if (project.githubLink) links.push(`<a href="${project.githubLink}" target="_blank" rel="noopener" class="proj-btn" style="margin-right:0.5rem;">GitHub</a>`);
    if (project.paperLink)  links.push(`<a href="${project.paperLink}"  target="_blank" rel="noopener" class="proj-btn">Paper</a>`);
    if (!links.length)      links.push(`<a href="#" class="proj-btn">View Details &rarr;</a>`);

    const article = document.createElement('article');
    article.className = 'proj-card';
    article.setAttribute('data-category', (project.category || '').toLowerCase().replace(/\s+/g, '-'));

    article.innerHTML = `
      <div class="proj-card-img-wrap">
        <img src="${project.thumbnail || 'bg image embs/bluebg.jpeg'}" alt="${project.title || ''}" class="proj-card-img" loading="lazy" />
        <span class="proj-card-status ${getStatusClass(project.status)}">${project.status || 'Ongoing'}</span>
        <span class="proj-card-category">${project.category || ''}</span>
      </div>
      <div class="proj-card-body">
        <h3 class="proj-card-title">${project.title || ''}</h3>
        <p class="proj-card-desc">${project.description || ''}</p>
        <div class="proj-card-meta">
          ${project.mentor ? `<div class="proj-card-meta-row"><span class="proj-meta-label">Mentor</span><span class="proj-meta-value">${project.mentor}</span></div>` : ''}
          ${team ? `<div class="proj-card-meta-row"><span class="proj-meta-label">Team</span><span class="proj-meta-value">${team}</span></div>` : ''}
        </div>
        ${tags.length ? `<div class="proj-card-tags">${tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}</div>` : ''}
        <div class="proj-card-footer">${links.join('')}</div>
      </div>`;

    return article;
  }

  function initFilters(cards) {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', function () {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');
        cards.forEach(card => {
          card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) ? '' : 'none';
        });
      });
    });
  }

  /* ── Back to Top ── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 400));
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  async function init() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    try {
      const res = await apiGet('/projects');
      const projects = (res.data || res).filter(p => p.visibility !== 'hidden');

      if (!projects.length) {
        grid.innerHTML = `<p style="color:rgba(200,210,255,0.5);text-align:center;grid-column:1/-1;padding:3rem;">No projects available yet.</p>`;
        return;
      }

      grid.innerHTML = '';
      const cards = projects.map(project => {
        const card = buildCard(project);
        grid.appendChild(card);
        return card;
      });

      initFilters(cards);
    } catch (err) {
      console.error('Failed to load projects:', err);
      grid.innerHTML = `<p style="color:rgba(200,210,255,0.5);text-align:center;grid-column:1/-1;padding:3rem;">Failed to load projects. Please try again later.</p>`;
    }
  }

  init();

})();
