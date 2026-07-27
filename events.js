/* ============================================
   events.js — Search, Filter, Pagination, Back-to-Top
   Does NOT modify navbar.js. Extends cleanly.
   ============================================ */

(function () {
  'use strict';

  var CARDS_PER_PAGE = 9;
  var currentPage = 1;
  var activeFilter = 'all';
  var searchQuery = '';

  var grid       = document.getElementById('eventsGrid');
  var emptyState = document.getElementById('eventsEmpty');
  var pagination = document.getElementById('eventsPagination');
  var searchInput = document.getElementById('eventsSearch');
  var filterChips = document.querySelectorAll('.filter-chip');
  var backToTop   = document.getElementById('backToTop');

  if (!grid) return;

  var allCards = Array.from(grid.querySelectorAll('.ev-card'));

  /* ── Filter + Search ── */
  function getVisibleCards() {
    return allCards.filter(function (card) {
      var cat   = (card.getAttribute('data-category') || '').toLowerCase();
      var text  = (card.getAttribute('data-search') || '').toLowerCase();
      var matchFilter = activeFilter === 'all' || cat === activeFilter;
      var matchSearch = searchQuery === '' || text.indexOf(searchQuery) !== -1;
      return matchFilter && matchSearch;
    });
  }

  function renderPage() {
    var visible = getVisibleCards();
    var totalPages = Math.max(1, Math.ceil(visible.length / CARDS_PER_PAGE));

    if (currentPage > totalPages) currentPage = 1;

    var start = (currentPage - 1) * CARDS_PER_PAGE;
    var end   = start + CARDS_PER_PAGE;

    /* Show/hide all cards */
    allCards.forEach(function (card) { card.classList.add('hidden'); });
    visible.forEach(function (card, i) {
      if (i >= start && i < end) card.classList.remove('hidden');
    });

    /* Empty state */
    if (visible.length === 0) {
      emptyState.classList.add('visible');
    } else {
      emptyState.classList.remove('visible');
    }

    renderPagination(totalPages);
  }

  /* ── Pagination ── */
  function renderPagination(totalPages) {
    if (!pagination) return;
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    /* Prev */
    var prev = makePgBtn('← Prev', currentPage === 1);
    prev.classList.add('pg-btn--nav');
    prev.addEventListener('click', function () {
      if (currentPage > 1) { currentPage--; renderPage(); scrollToGrid(); }
    });
    pagination.appendChild(prev);

    /* Page numbers */
    for (var i = 1; i <= totalPages; i++) {
      (function (page) {
        var btn = makePgBtn(page, false);
        if (page === currentPage) btn.classList.add('active');
        btn.addEventListener('click', function () {
          currentPage = page;
          renderPage();
          scrollToGrid();
        });
        pagination.appendChild(btn);
      })(i);
    }

    /* Next */
    var next = makePgBtn('Next →', currentPage === totalPages);
    next.classList.add('pg-btn--nav');
    next.addEventListener('click', function () {
      if (currentPage < totalPages) { currentPage++; renderPage(); scrollToGrid(); }
    });
    pagination.appendChild(next);
  }

  function makePgBtn(label, disabled) {
    var btn = document.createElement('button');
    btn.className = 'pg-btn';
    btn.textContent = label;
    btn.disabled = disabled;
    return btn;
  }

  function scrollToGrid() {
    var target = document.getElementById('eventsGridSection');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ── Search ── */
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = this.value.trim().toLowerCase();
      currentPage = 1;
      renderPage();
    });
  }

  /* ── Filter chips ── */
  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      filterChips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      activeFilter = chip.getAttribute('data-filter') || 'all';
      currentPage = 1;
      renderPage();
    });
  });

  /* ── Back to Top ── */
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Init ── */
  renderPage();

})();
