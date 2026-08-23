/* ─────────────────────────────────────────
   LOOT MANAGER — automated split page
   Reads/writes the same loot-splits data the
   Discord bot's /loot commands use (see
   loot-store.js / loot-render.js on the
   server). Any logged-in member can view and
   create splits — there's no officer gate
   here, unlike events.
───────────────────────────────────────── */

let lootRecent = [];
let lootTotals = null;
let showClaimedSplits = false;
let membersCache = null; // lazy-loaded [{id,username,avatar}]
let selectedParticipantIds = new Set();

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function api(path, opts) {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) { alert(message); return; }
  toast.innerHTML = escapeHtml(message);
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}

function formatSilver(n) {
  return `${Math.round(n).toLocaleString('en-US')} silver`;
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  window.SITE_AUTH_READY.then(init);
});

async function init() {
  if (!isLoggedIn()) {
    document.getElementById('gate-message').style.display = '';
    return;
  }
  document.getElementById('loot-view').style.display = '';

  document.getElementById('new-loot-btn').addEventListener('click', openLootForm);
  document.getElementById('toggle-loot-closed-btn').addEventListener('click', () => {
    showClaimedSplits = !showClaimedSplits;
    document.getElementById('toggle-loot-closed-btn').textContent = showClaimedSplits ? 'Hide claimed splits' : 'Show claimed splits';
    document.getElementById('toggle-loot-closed-btn').classList.toggle('active', showClaimedSplits);
    renderList();
  });
  wireModalOverlay();

  await loadLoot();
}

async function loadLoot() {
  try {
    const data = await api('/api/loot');
    lootRecent = data.recent;
    lootTotals = data.totals;
  } catch (err) {
    showToast('Failed to load loot splits: ' + err.message);
    lootRecent = [];
    lootTotals = { totalLootValue: 0, totalGuildTax: 0, totalMemberShare: 0, splitCount: 0 };
  }
  renderStats();
  renderList();
  loadLeaderboard();
}

async function loadLeaderboard() {
  const section = document.getElementById('loot-leaderboard-section');
  const body = document.getElementById('loot-leaderboard-body');
  try {
    const data = await api('/api/loot/stats');
    if (!data.leaderboard || data.leaderboard.length === 0) {
      section.style.display = 'none';
      return;
    }
    body.innerHTML = data.leaderboard.map((m, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(m.username)}</td>
        <td>${formatSilver(m.totalReceived)}</td>
        <td>${m.splitsParticipated}</td>
      </tr>`).join('');
    section.style.display = '';
  } catch {
    section.style.display = 'none';
  }
}

function renderStats() {
  const grid = document.getElementById('loot-stats-grid');
  grid.innerHTML = `
    <div class="stat"><div class="stat-num">${formatSilver(lootTotals.totalLootValue)}</div><div class="stat-label">Total loot</div></div>
    <div class="stat"><div class="stat-num">${formatSilver(lootTotals.totalGuildTax)}</div><div class="stat-label">Guild tax</div></div>
    <div class="stat"><div class="stat-num">${formatSilver(lootTotals.totalMemberShare)}</div><div class="stat-label">Paid to members</div></div>
    <div class="stat"><div class="stat-num">${lootTotals.splitCount}</div><div class="stat-label">Splits recorded</div></div>`;
}

function renderList() {
  const grid = document.getElementById('loot-card-grid');
  const empty = document.getElementById('loot-empty');
  const countLabel = document.getElementById('loot-count-label');

  const list = showClaimedSplits ? lootRecent : lootRecent.filter(s => !s.closed);
  countLabel.textContent = `${list.length} split${list.length === 1 ? '' : 's'}`;

  if (list.length === 0) {
    grid.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = list.map(renderLootCard).join('');

  grid.querySelectorAll('[data-remind-id]').forEach(btn => {
    btn.addEventListener('click', () => sendReminder(btn.dataset.remindId));
  });
  grid.querySelectorAll('.mark-claim-btn').forEach(btn => {
    btn.addEventListener('click', () => markParticipantClaimed(btn.dataset.splitId, btn.dataset.userId, btn.dataset.username));
  });
  grid.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', () => deleteSplit(btn.dataset.deleteId, btn.dataset.deleteName));
  });
}

async function deleteSplit(id, name) {
  if (!confirm(`Delete the split for "${name}"? This removes it (and its totals) permanently — mainly for clearing out test splits.`)) return;
  try {
    await api(`/api/loot/${encodeURIComponent(id)}`, { method: 'DELETE' });
    showToast(`Deleted "${name}".`);
    await loadLoot();
  } catch (err) {
    showToast('Failed to delete split: ' + err.message);
  }
}

function renderLootCard(s) {
  const unclaimed = s.participants.filter(p => !p.claimed).length;
  const canManageSplit = s.createdBy?.id === window.SITE_AUTH.id || window.SITE_AUTH.role === 'officer' || window.SITE_AUTH.role === 'admin';
  const canRemind = !s.closed && unclaimed > 0 && canManageSplit;
  const canDelete = window.SITE_AUTH.role === 'officer' || window.SITE_AUTH.role === 'admin';

  return `
    <div class="loot-card ${s.closed ? 'closed' : ''}">
      <div class="loot-card-head">
        <h3>${escapeHtml(s.lootName)}</h3>
        <span class="loot-status-badge ${s.closed ? 'done' : 'pending'}">${s.closed ? 'All claimed' : `${unclaimed} pending`}</span>
      </div>
      ${s.lootLocation ? `<p class="loot-location">📍 ${escapeHtml(s.lootLocation)}</p>` : ''}
      <div class="loot-numbers">
        <div><span class="loot-num-label">Loot value</span><span class="loot-num-val">${formatSilver(s.lootValue)}</span></div>
        <div><span class="loot-num-label">Guild tax (5%)</span><span class="loot-num-val">${formatSilver(s.taxAmount)}</span></div>
        <div><span class="loot-num-label">Each share</span><span class="loot-num-val">${formatSilver(s.shareAmount)}</span></div>
      </div>
      <div class="loot-participants">
        ${s.participants.map(p => {
          const label = `${p.claimed ? '✅' : '⏳'} ${escapeHtml(p.username || p.userId)}`;
          if (!p.claimed && canManageSplit) {
            return `<button type="button" class="loot-participant-chip mark-claim-btn" data-split-id="${escapeHtml(s.id)}" data-user-id="${escapeHtml(p.userId)}" data-username="${escapeHtml(p.username || p.userId)}" title="Mark as claimed — they took it but forgot to react">${label}</button>`;
          }
          return `<span class="loot-participant-chip ${p.claimed ? 'claimed' : ''}">${label}</span>`;
        }).join('')}
      </div>
      <div class="loot-card-foot">
        <span class="loot-card-date">${new Date(s.createdAt).toLocaleDateString()}</span>
        <div class="loot-card-foot-actions">
          ${canRemind ? `<button class="event-action-btn" data-remind-id="${escapeHtml(s.id)}">Send reminder</button>` : ''}
          ${canDelete ? `<button class="event-action-btn danger" data-delete-id="${escapeHtml(s.id)}" data-delete-name="${escapeHtml(s.lootName)}">Delete</button>` : ''}
        </div>
      </div>
    </div>`;
}

async function markParticipantClaimed(splitId, userId, username) {
  if (!confirm(`Mark ${username} as having taken their share? Use this if they already took it but forgot to react.`)) return;
  try {
    await api(`/api/loot/${encodeURIComponent(splitId)}/claim`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    showToast(`Marked ${username} as claimed.`);
    await loadLoot();
  } catch (err) {
    showToast('Failed to mark as claimed: ' + err.message);
  }
}

async function sendReminder(id) {
  try {
    await api(`/api/loot/${encodeURIComponent(id)}/remind`, { method: 'POST' });
    showToast('Reminder sent in the split thread.');
  } catch (err) {
    showToast('Failed to send reminder: ' + err.message);
  }
}

/* ---------- create-split form ---------- */

function wireModalOverlay() {
  const overlay = document.getElementById('loot-form-overlay');
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

function closeModal() {
  document.getElementById('loot-form-overlay').style.display = 'none';
}

async function ensureMembersLoaded() {
  if (membersCache) return membersCache;
  membersCache = await api('/api/loot/members');
  return membersCache;
}

async function openLootForm() {
  let members = [];
  try {
    members = await ensureMembersLoaded();
  } catch (err) {
    showToast('Failed to load member list: ' + err.message);
    return;
  }

  selectedParticipantIds = new Set();

  const overlay = document.getElementById('loot-form-overlay');
  const card = document.getElementById('loot-form-card');
  card.innerHTML = `
    <h2>New loot split</h2>
    <div class="modal-field">
      <label>Loot name</label>
      <input type="text" id="lf-name">
    </div>
    <div class="modal-field">
      <label>Loot location</label>
      <input type="text" id="lf-location">
    </div>
    <div class="modal-field">
      <label>Loot value <span style="font-weight:400;text-transform:none">(silver)</span></label>
      <input type="number" id="lf-value" min="1" step="1">
    </div>
    <div class="modal-field">
      <label>Participants <span id="lf-participant-count" style="font-weight:400;text-transform:none">(0 selected)</span></label>
      <input type="text" id="lf-participant-search" placeholder="Search members…" autocomplete="off">
      <div class="loot-member-picker" id="lf-member-picker">
        ${members.map(m => `
          <label class="loot-member-row" data-username="${escapeHtml(m.username.toLowerCase())}">
            <input type="checkbox" class="lf-participant-cb" value="${escapeHtml(m.id)}">
            ${escapeHtml(m.username)}
          </label>`).join('')}
      </div>
      <p class="modal-hint">5% of the loot value goes to the guild; the rest splits evenly across everyone checked.</p>
    </div>
    <div class="modal-actions">
      <button class="event-action-btn" id="lf-cancel">Cancel</button>
      <button class="event-action-btn" id="lf-submit">Post split</button>
    </div>`;

  overlay.style.display = 'flex';
  document.getElementById('lf-cancel').addEventListener('click', closeModal);
  document.getElementById('lf-submit').addEventListener('click', submitLootForm);

  document.getElementById('lf-participant-search').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('#lf-member-picker .loot-member-row').forEach(row => {
      row.style.display = row.dataset.username.includes(q) ? '' : 'none';
    });
  });

  document.querySelectorAll('.lf-participant-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) selectedParticipantIds.add(cb.value);
      else selectedParticipantIds.delete(cb.value);
      document.getElementById('lf-participant-count').textContent = `(${selectedParticipantIds.size} selected)`;
    });
  });
}

async function submitLootForm() {
  const lootName = document.getElementById('lf-name').value.trim();
  const lootLocation = document.getElementById('lf-location').value.trim();
  const lootValue = Number(document.getElementById('lf-value').value);
  const participantIds = [...selectedParticipantIds];

  if (!lootName) return showToast('Loot name is required.');
  if (!Number.isFinite(lootValue) || lootValue <= 0) return showToast('Loot value has to be a positive number.');
  if (participantIds.length === 0) return showToast('Pick at least one participant.');

  const submitBtn = document.getElementById('lf-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Posting…';

  try {
    await api('/api/loot', {
      method: 'POST',
      body: JSON.stringify({ lootName, lootLocation, lootValue, participantIds }),
    });
    closeModal();
    showToast('Split posted to #payout.');
    await loadLoot();
  } catch (err) {
    showToast('Failed to post split: ' + err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Post split';
  }
}
