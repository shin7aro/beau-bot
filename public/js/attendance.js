/* ─────────────────────────────────────────
   ATTENDANCE LEADERBOARD — officer/admin only
   Closed-event turnout per member, same
   attendance rule as the profile page's
   service record (GET /api/attendance-leaderboard,
   auth.requireOfficer server-side too — this
   page's gate below is a UX nicety, not the
   real boundary).
───────────────────────────────────────── */
const TIER_LABELS = { gm: 'Guild Master', right_hand: 'Right Hand', officer: 'Officer', member: 'Dahalo' };

let leaderboard = [];
let currentRange = 'all';
let currentSort = 'total'; // 'total' | 'PVP' | 'PVE' | 'Gank'

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderRows(rows) {
  const tbody = document.getElementById('attendance-tbody');
  const empty = document.getElementById('attendance-empty');

  if (!rows.length) {
    tbody.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = rows.map((m, i) => {
    const avatarUrl = window.discordAvatarUrl(m.id, m.avatar, 48);
    const tierLabel = TIER_LABELS[m.tier] || 'Dahalo';
    const stats = m[currentRange];
    return `
      <tr>
        <td class="attendance-rank">${i + 1}</td>
        <td>
          <a class="attendance-member" href="profile.html?id=${encodeURIComponent(m.id)}">
            <img class="attendance-avatar" src="${avatarUrl}" alt="" loading="lazy">
            <span class="attendance-name">${escapeHtml(m.username)}</span>
            <span class="attendance-tier">${escapeHtml(tierLabel)}</span>
          </a>
        </td>
        <td class="num" data-label="PVP">${stats.PVP}</td>
        <td class="num" data-label="PVE">${stats.PVE}</td>
        <td class="num" data-label="Gank">${stats.Gank}</td>
        <td class="num attendance-total" data-label="Total">${stats.total}</td>
      </tr>`;
  }).join('');
}

function applyFilter() {
  const query = document.getElementById('attendance-search').value.trim().toLowerCase();
  const filtered = query ? leaderboard.filter(m => m.username.toLowerCase().includes(query)) : leaderboard.slice();
  // Re-rank for whichever range is selected — the server only pre-sorts
  // by all-time total, since that's the default view.
  // Ties fall back to total, then name, so the order stays stable.
  filtered.sort((a, b) =>
    b[currentRange][currentSort] - a[currentRange][currentSort] ||
    b[currentRange].total - a[currentRange].total ||
    a.username.localeCompare(b.username));
  updateSortUi();
  renderRows(filtered);
  const label = document.getElementById('attendance-count-label');
  label.textContent = query ? `${filtered.length} of ${leaderboard.length} members` : `${leaderboard.length} members`;
}

function updateSortUi() {
  document.querySelectorAll('.attendance-table th.sortable').forEach(th => {
    th.classList.toggle('active', th.dataset.sort === currentSort);
  });
  document.querySelectorAll('#attendance-sort-toggle .filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sort === currentSort);
  });
}

function setSort(key) {
  if (!key) return;
  // Clicking the active type column again goes back to the Total ranking.
  currentSort = (key === currentSort && key !== 'total') ? 'total' : key;
  applyFilter();
}

async function loadLeaderboard() {
  const res = await fetch('/api/attendance-leaderboard', { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  leaderboard = await res.json();
  applyFilter();
}

async function init() {
  const loading = document.getElementById('attendance-loading-view');
  await window.SITE_AUTH_READY;
  if (!isOfficerOrAdmin()) {
    if (loading) loading.style.display = 'none';
    document.getElementById('gate-message').style.display = '';
    return;
  }

  try {
    await loadLeaderboard();
    document.getElementById('attendance-search').addEventListener('input', applyFilter);
    document.querySelector('.attendance-table thead').addEventListener('click', (e) => {
      const th = e.target.closest('th.sortable');
      if (th) setSort(th.dataset.sort);
    });
    document.getElementById('attendance-sort-toggle').addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (btn) setSort(btn.dataset.sort);
    });
    const rangeToggle = document.getElementById('attendance-range-toggle');
    rangeToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      rangeToggle.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      currentRange = btn.dataset.range;
      applyFilter();
    });
  } catch (err) {
    document.getElementById('attendance-empty').textContent = 'Failed to load the attendance leaderboard.';
    document.getElementById('attendance-empty').style.display = '';
  }

  if (loading) loading.style.display = 'none';
  document.getElementById('attendance-app').style.display = '';
}

init();
