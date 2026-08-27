/* ─────────────────────────────────────────
   HISTORY — admin-only activity log
───────────────────────────────────────── */
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function formatWhen(ts) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

async function loadHistory() {
  const tbody = document.getElementById('history-tbody');
  const empty = document.getElementById('history-empty');
  try {
    const res = await fetch('/api/history', { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const entries = await res.json();

    if (!entries.length) {
      tbody.innerHTML = '';
      empty.style.display = '';
      return;
    }
    empty.style.display = 'none';

    tbody.innerHTML = entries.map(e => `
      <tr>
        <td class="history-when">${escapeHtml(formatWhen(e.at))}</td>
        <td class="history-who">${escapeHtml(e.username)}${e.role ? `<span class="history-role">${escapeHtml(e.role)}</span>` : ''}</td>
        <td class="history-summary">${escapeHtml(e.summary)}<br><span class="history-action">${escapeHtml(e.action)}</span></td>
      </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = '';
    empty.textContent = 'Failed to load history.';
    empty.style.display = '';
  }
}

async function init() {
  await window.SITE_AUTH_READY;
  if (!isAdmin()) {
    document.getElementById('gate-message').style.display = '';
    return;
  }
  document.getElementById('history-app').style.display = '';
  await loadHistory();
}

init();
