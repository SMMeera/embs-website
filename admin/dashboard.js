/* ── Auth Guard ── */
if (localStorage.getItem('embs_admin_auth') !== 'true') {
  window.location.href = 'index.html';
}

/* ── Sidebar toggle ── */
const sidebar = document.getElementById('sidebar');
const toggle  = document.getElementById('sidebarToggle');
const overlay = document.getElementById('sidebarOverlay');

function openSidebar()  { sidebar.classList.add('open');    overlay.classList.add('active'); }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }

toggle.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
overlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', function () {
    if (window.innerWidth <= 768) closeSidebar();
  });
});

/* ── Date display ── */
const dateEl = document.getElementById('dashDate');
if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

/* ── Events Per Month Chart ── */
const ctx = document.getElementById('eventsChart').getContext('2d');

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const data   = [2, 3, 5, 4, 6, 8, 5, 7, 9, 6, 4, 3];

const gradientFill = ctx.createLinearGradient(0, 0, 0, 260);
gradientFill.addColorStop(0,   'rgba(107,45,139,0.55)');
gradientFill.addColorStop(0.6, 'rgba(0,169,157,0.18)');
gradientFill.addColorStop(1,   'rgba(0,169,157,0)');

const gradientBar = ctx.createLinearGradient(0, 0, 0, 260);
gradientBar.addColorStop(0, '#6B2D8B');
gradientBar.addColorStop(1, '#00A99D');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: months,
    datasets: [{
      label: 'Events',
      data,
      backgroundColor: gradientBar,
      borderRadius: 6,
      borderSkipped: false,
      barPercentage: 0.55,
      categoryPercentage: 0.7,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(13,10,31,0.92)',
        borderColor: 'rgba(107,45,139,0.4)',
        borderWidth: 1,
        titleColor: '#e8eaf6',
        bodyColor: 'rgba(200,210,230,0.7)',
        titleFont: { family: "'Syne', sans-serif", size: 12, weight: '700' },
        bodyFont:  { family: "'DM Sans', sans-serif", size: 11 },
        padding: 10,
        callbacks: {
          label: ctx => ` ${ctx.parsed.y} event${ctx.parsed.y !== 1 ? 's' : ''}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: 'rgba(200,210,230,0.4)',
          font: { family: "'DM Sans', sans-serif", size: 11 }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107,45,139,0.1)',
          drawBorder: false
        },
        border: { display: false, dash: [4,4] },
        ticks: {
          color: 'rgba(200,210,230,0.4)',
          font: { family: "'DM Sans', sans-serif", size: 11 },
          stepSize: 2,
          maxTicksLimit: 6
        }
      }
    }
  }
});
