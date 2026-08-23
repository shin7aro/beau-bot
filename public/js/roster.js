/* ─────────────────────────────────────────
   ROSTER — family-tree hierarchy page
   Public read (GET /api/roster): GM > Right
   Hand > Officers rendered as a connected
   tree, then every other active member as a
   searchable grid below. Anyone marked
   inactive by a roster manager is already
   excluded server-side.

   Roster managers (Shin7aro / Erdan — see
   web-auth.js's isRosterAdmin) additionally
   get a "Manage hierarchy" button opening an
   editor over GET/PUT /api/roster/admin/*.
───────────────────────────────────────── */

let rosterData = null;      // { gm, rightHand, officers, members } — active only
let hierarchyData = null;   // full list incl. inactive, roster-admin only — local
                             // working copy; edits are staged here and only
                             // sent to the server when Save is clicked.
let hierarchyFilter = 'all';
let pendingUserPatches = {}; // userId -> { tier?, inactive? } staged for Save
let pendingReorderTiers = new Set(); // tiers whose order was changed locally

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

const TIER_LABELS = { gm: 'GM', right_hand: 'Right Hand', officer: 'Officer', member: 'Member' };

/* ---------- tree rendering ---------- */

function nodeCardHtml(member, kind) {
  const avatarUrl = window.discordAvatarUrl(member.id, member.avatar, 96);
  return `
    <div class="tree-node tree-node-${kind}">
      <img class="tree-node-avatar" src="${avatarUrl}" alt="" loading="lazy">
      <div class="tree-node-name">${escapeHtml(member.username)}</div>
      <div class="tree-node-tag">${kind === 'gm' ? 'Guild Master' : kind === 'rh' ? 'Right Hand' : 'Officer'}</div>
    </div>`;
}

function renderTree() {
  const wrap = document.getElementById('roster-tree');
  if (!rosterData) return;

  const gm = rosterData.gm[0];
  const rightHand = rosterData.rightHand[0];
  const officers = rosterData.officers;

  const cols = [];

  if (gm) {
    cols.push(`<div class="tree-col tree-col-gm">${nodeCardHtml(gm, 'gm')}</div>`);
  }
  if (rightHand) {
    cols.push(`<div class="tree-col tree-col-rh">${nodeCardHtml(rightHand, 'rh')}</div>`);
  }
  if (officers.length > 0) {
    cols.push(`
      <div class="tree-col tree-col-officers">
        <div class="tree-branch">
          ${officers.map(o => nodeCardHtml(o, 'officer')).join('')}
        </div>
      </div>`);
  }

  if (cols.length === 0) {
    wrap.innerHTML = `<div class="empty-state">Leadership hasn't been set yet. Check back soon.</div>`;
    return;
  }

  wrap.innerHTML = cols.join('');
}

/* ---------- member grid ---------- */

function renderMemberGrid() {
  const grid = document.getElementById('roster-member-grid');
  const empty = document.getElementById('roster-members-empty');
  const countLabel = document.getElementById('roster-members-count');
  const query = (document.getElementById('roster-member-search').value || '').trim().toLowerCase();

  const members = rosterData.members;
  countLabel.textContent = `${members.length} member${members.length === 1 ? '' : 's'}`;

  const matches = query ? members.filter(m => m.username.toLowerCase().includes(query)) : members;

  if (matches.length === 0) {
    grid.innerHTML = '';
    empty.style.display = '';
    empty.textContent = members.length === 0 ? 'No members found.' : 'No matches.';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = matches.map(m => `
    <div class="roster-member-chip">
      <img src="${window.discordAvatarUrl(m.id, m.avatar, 64)}" alt="" loading="lazy">
      <span>${escapeHtml(m.username)}</span>
    </div>`).join('');
}

async function loadRoster() {
  try {
    rosterData = await api('/api/roster');
    renderTree();
    renderMemberGrid();
  } catch (err) {
    document.getElementById('roster-tree').innerHTML = `<div class="empty-state">Failed to load the roster: ${escapeHtml(err.message)}</div>`;
  }
}

/* ---------- hierarchy editor (roster admins only) ---------- */

function openHierarchyModal() {
  document.getElementById('hierarchy-modal-overlay').style.display = '';
  pendingUserPatches = {};
  pendingReorderTiers = new Set();
  loadHierarchy();
}

function closeHierarchyModal() {
  document.getElementById('hierarchy-modal-overlay').style.display = 'none';
}

// Discards any staged edits and closes without touching the server.
function cancelHierarchyChanges() {
  pendingUserPatches = {};
  pendingReorderTiers = new Set();
  closeHierarchyModal();
}

async function saveHierarchyChanges() {
  const saveBtn = document.getElementById('save-hierarchy-btn');
  const originalLabel = saveBtn.textContent;
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving…';

  try {
    for (const [userId, patch] of Object.entries(pendingUserPatches)) {
      const member = hierarchyData.find((m) => m.id === userId);
      await api(`/api/roster/admin/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        body: JSON.stringify({ ...patch, username: member ? member.username : undefined }),
      });
    }
    for (const tier of pendingReorderTiers) {
      const orderedIds = hierarchyData
        .filter((m) => m.tier === tier && !m.inactive)
        .sort((a, b) => a.order - b.order || a.username.localeCompare(b.username))
        .map((m) => m.id);
      await api('/api/roster/admin/reorder', {
        method: 'PUT',
        body: JSON.stringify({ tier, orderedIds }),
      });
    }

    showToast('Roster changes saved.');
    pendingUserPatches = {};
    pendingReorderTiers = new Set();
    closeHierarchyModal();
    await loadRoster();
  } catch (err) {
    showToast(`Failed to save: ${err.message}`);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = originalLabel;
  }
}

async function loadHierarchy() {
  const list = document.getElementById('hierarchy-list');
  list.innerHTML = `<p class="empty-state">Loading…</p>`;
  try {
    hierarchyData = await api('/api/roster/admin');
    renderHierarchyList();
  } catch (err) {
    list.innerHTML = `<p class="empty-state">Failed to load: ${escapeHtml(err.message)}</p>`;
  }
}

function markUserPatch(userId, patch) {
  pendingUserPatches[userId] = { ...(pendingUserPatches[userId] || {}), ...patch };
}

function renderHierarchyList() {
  const list = document.getElementById('hierarchy-list');
  // Re-rendering rebuilds the whole list's innerHTML, which would
  // otherwise reset this panel's internal scroll to the top on every
  // single edit — preserve it manually so editing several rows in a row
  // doesn't keep bouncing you back to the top of a long roster.
  const scrollTop = list.scrollTop;
  const query = (document.getElementById('hierarchy-search').value || '').trim().toLowerCase();

  let rows = hierarchyData;
  if (hierarchyFilter === 'active') rows = rows.filter(m => !m.inactive);
  if (hierarchyFilter === 'inactive') rows = rows.filter(m => m.inactive);
  if (query) rows = rows.filter(m => m.username.toLowerCase().includes(query));

  if (rows.length === 0) {
    list.innerHTML = `<p class="empty-state">No matches.</p>`;
    return;
  }

  list.innerHTML = rows.map(m => `
    <div class="roster-editor-row ${m.inactive ? 'inactive' : ''}" data-user-id="${escapeHtml(m.id)}">
      <img src="${window.discordAvatarUrl(m.id, m.avatar, 48)}" alt="" loading="lazy">
      <div class="roster-editor-row-name">
        ${escapeHtml(m.username)}
        ${m.inactive ? '<span class="roster-editor-inactive-tag">Inactive</span>' : ''}
      </div>
      <select class="roster-editor-tier-select" ${m.inactive ? 'disabled' : ''}>
        ${rosterStoreTiers().map(t => `<option value="${t}" ${m.tier === t ? 'selected' : ''}>${TIER_LABELS[t]}</option>`).join('')}
      </select>
      <div class="roster-editor-order-btns">
        <button type="button" class="roster-editor-order-btn" data-dir="up" title="Move up" ${m.inactive ? 'disabled' : ''}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
        <button type="button" class="roster-editor-order-btn" data-dir="down" title="Move down" ${m.inactive ? 'disabled' : ''}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>
      <button type="button" class="btn roster-editor-inactive-btn" data-inactive="${m.inactive ? '0' : '1'}">
        <span class="btn-label">${m.inactive ? 'Reactivate' : 'Move to inactive'}</span>
      </button>
    </div>`).join('');

  list.querySelectorAll('.roster-editor-row').forEach(row => {
    const userId = row.dataset.userId;
    const member = hierarchyData.find(m => m.id === userId);

    row.querySelector('.roster-editor-tier-select').addEventListener('change', (e) => {
      handleTierChange(userId, e.target.value);
    });
    row.querySelectorAll('.roster-editor-order-btn').forEach(btn => {
      btn.addEventListener('click', () => handleReorder(userId, member.tier, btn.dataset.dir));
    });
    row.querySelector('.roster-editor-inactive-btn').addEventListener('click', () => {
      handleInactiveToggle(userId);
    });
  });

  list.scrollTop = scrollTop;
}

function rosterStoreTiers() {
  return ['gm', 'right_hand', 'officer', 'member'];
}

// All three handlers below only mutate the local, in-memory hierarchyData
// and stage a patch in pendingUserPatches/pendingReorderTiers — nothing
// hits the server until "Save" is clicked, and "Cancel" just throws this
// staged state away. That also means there's nothing destructive here to
// confirm: moving someone to inactive is fully reversible right up until
// Save, so no confirmation dialog is needed.

function handleTierChange(userId, tier) {
  const member = hierarchyData.find(m => m.id === userId);
  if (!member) return;

  // Mirror the server's "only one GM / one Right Hand" rule locally so
  // the staged preview matches what Save will actually produce.
  if (tier === 'gm' || tier === 'right_hand') {
    hierarchyData.forEach((other) => {
      if (other.id !== userId && other.tier === tier) {
        other.tier = 'officer';
        markUserPatch(other.id, { tier: 'officer' });
      }
    });
  }

  member.tier = tier;
  markUserPatch(userId, { tier });
  renderHierarchyList();
}

function handleInactiveToggle(userId) {
  const member = hierarchyData.find(m => m.id === userId);
  if (!member) return;
  member.inactive = !member.inactive;
  markUserPatch(userId, { inactive: member.inactive });
  renderHierarchyList();
}

function handleReorder(userId, tier, dir) {
  // Recompute the whole tier's order locally; the actual API call (and
  // the order values below) only get sent once Save is clicked.
  const tierMembers = hierarchyData
    .filter(m => m.tier === tier && !m.inactive)
    .sort((a, b) => a.order - b.order || a.username.localeCompare(b.username));

  const idx = tierMembers.findIndex(m => m.id === userId);
  if (idx === -1) return;
  const swapWith = dir === 'up' ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= tierMembers.length) return;

  [tierMembers[idx], tierMembers[swapWith]] = [tierMembers[swapWith], tierMembers[idx]];
  tierMembers.forEach((m, i) => { m.order = i; }); // same object refs as hierarchyData entries
  pendingReorderTiers.add(tier);
  renderHierarchyList();
}

/* ---------- boot ---------- */

async function init() {
  await window.SITE_AUTH_READY;
  await loadRoster();

  document.getElementById('roster-member-search').addEventListener('input', renderMemberGrid);

  if (window.SITE_AUTH.rosterAdmin) {
    document.getElementById('manage-hierarchy-btn').addEventListener('click', openHierarchyModal);
    document.getElementById('cancel-hierarchy-btn').addEventListener('click', cancelHierarchyChanges);
    document.getElementById('save-hierarchy-btn').addEventListener('click', saveHierarchyChanges);
    document.getElementById('hierarchy-modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'hierarchy-modal-overlay') cancelHierarchyChanges();
    });
    document.getElementById('hierarchy-search').addEventListener('input', renderHierarchyList);
    document.querySelectorAll('#hierarchy-filter-group .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        hierarchyFilter = btn.dataset.filter;
        document.querySelectorAll('#hierarchy-filter-group .filter-btn').forEach(b => b.classList.toggle('active', b === btn));
        renderHierarchyList();
      });
    });
  }
}

init();
