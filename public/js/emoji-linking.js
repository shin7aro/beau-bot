/* ─────────────────────────────────────────
   EMOJI LINKING — one-time weapon->emoji setup
   Lets Shin7aro link each of the 136 weapons in
   window.WEAPON_NAMES (item-map.js) to a bot
   emoji. Saved to /api/weapon-emojis, which the
   comp editor (comps.js) reads on every load to
   auto-fill a line's emoji — nobody has to pick
   one per comp line anymore.
───────────────────────────────────────── */
let serverEmojis = [];   // [{ id, name, animated, tag, url }] from /api/discord-emojis
let weaponEmojiMap = {}; // { "Broadsword": "<:tag:id>", ... } from /api/weapon-emojis

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

/* ---------- emoji preview + popover (same shape as the one the comp
   editor used to have — see comps.js's history — but this is now the
   only place on the site that still needs it) ---------- */
function emojiPreviewHtml(value) {
  if (!value) return '<span class="emoji-preview-empty">+</span>';
  const m = value.match(/^<a?:(\w+):(\d+)>$/);
  if (m) {
    const known = serverEmojis.find(e => e.id === m[2]);
    const url = known ? known.url : `https://cdn.discordapp.com/emojis/${m[2]}.${value.startsWith('<a:') ? 'gif' : 'png'}?size=32`;
    return `<img class="emoji-preview-img" src="${url}" alt="${escapeHtml(m[1])}">`;
  }
  return `<span class="emoji-preview-char">${escapeHtml(value)}</span>`;
}

function closeEmojiPopover() {
  const pop = document.getElementById('emoji-popover');
  if (pop) pop.remove();
  document.removeEventListener('mousedown', handleEmojiPopoverOutsideClick, true);
}

function handleEmojiPopoverOutsideClick(e) {
  const pop = document.getElementById('emoji-popover');
  if (pop && !pop.contains(e.target)) closeEmojiPopover();
}

function openEmojiPopover(anchorBtn, weaponName) {
  closeEmojiPopover();
  const pop = document.createElement('div');
  pop.id = 'emoji-popover';
  pop.className = 'emoji-popover';
  pop.innerHTML = `
    <input type="text" class="emoji-popover-search" placeholder="Search emoji…" autocomplete="off">
    <div class="emoji-popover-grid"></div>
    ${serverEmojis.length === 0 ? '<p class="section-sub" style="padding:0 2px">No custom server emojis found — check the bot has emoji permissions and GUILD_ID is set.</p>' : ''}`;
  document.body.appendChild(pop);

  const rect = anchorBtn.getBoundingClientRect();
  pop.style.top = `${window.scrollY + rect.bottom + 6}px`;
  pop.style.left = `${window.scrollX + rect.left}px`;

  const grid = pop.querySelector('.emoji-popover-grid');
  const renderGrid = (filter = '') => {
    const q = filter.toLowerCase();
    const list = serverEmojis.filter(e => !q || e.name.toLowerCase().includes(q));
    const clearTile = `<button type="button" class="emoji-popover-item emoji-popover-clear" data-tag="" title="No emoji">✕</button>`;
    grid.innerHTML = clearTile + list.map(e =>
      `<button type="button" class="emoji-popover-item" data-tag="${escapeHtml(e.tag)}" title="${escapeHtml(e.name)}">
         <img src="${e.url}" alt="${escapeHtml(e.name)}">
       </button>`
    ).join('');

    grid.querySelectorAll('.emoji-popover-item').forEach(btn => btn.addEventListener('click', async () => {
      const tag = btn.dataset.tag || null;
      closeEmojiPopover();
      try {
        weaponEmojiMap = await api(`/api/weapon-emojis/${encodeURIComponent(weaponName)}`, {
          method: 'PUT',
          body: JSON.stringify({ emoji: tag }),
        });
        renderList(document.getElementById('weapon-search').value);
      } catch (err) {
        alert(err.message);
      }
    }));
  };
  renderGrid();
  pop.querySelector('.emoji-popover-search').addEventListener('input', e => renderGrid(e.target.value));
  pop.querySelector('.emoji-popover-search').focus();

  setTimeout(() => document.addEventListener('mousedown', handleEmojiPopoverOutsideClick, true), 0);
}

/* ---------- weapon list ---------- */
function weaponRowHtml(name) {
  const url = window.imgUrl ? window.imgUrl(name) : null;
  const linked = Boolean(weaponEmojiMap[name]);
  return `
    <div class="el-row${linked ? ' el-row-linked' : ''}" data-name="${escapeHtml(name)}">
      ${url ? `<img class="el-row-icon" src="${url}" alt="">` : '<span class="el-row-icon el-row-icon-blank"></span>'}
      <span class="el-row-name">${escapeHtml(name)}</span>
      <button type="button" class="el-row-emoji-pick" title="Pick a server emoji">${emojiPreviewHtml(weaponEmojiMap[name])}</button>
    </div>`;
}

function renderList(filter = '') {
  const allNames = (window.WEAPON_NAMES || []).slice().sort((a, b) => a.localeCompare(b));
  const q = filter.toLowerCase();
  let matches = q ? allNames.filter(n => n.toLowerCase().includes(q)) : allNames;

  const hideLinked = document.getElementById('hide-linked-toggle')?.checked;
  if (hideLinked) matches = matches.filter(n => !weaponEmojiMap[n]);

  const linkedCount = allNames.filter(n => weaponEmojiMap[n]).length;
  document.getElementById('linked-count-label').textContent = `${linkedCount} / ${allNames.length} linked`;

  const list = document.getElementById('weapon-emoji-list');
  list.innerHTML = matches.length
    ? matches.map(weaponRowHtml).join('')
    : `<p class="el-empty">${hideLinked ? 'All matching weapons are linked.' : 'No matching weapons.'}</p>`;

  list.querySelectorAll('.el-row-emoji-pick').forEach(btn => btn.addEventListener('click', () => {
    const row = btn.closest('.el-row');
    openEmojiPopover(btn, row.dataset.name);
  }));
}

/* el-list now scrolls internally (see emoji-linking.css) instead of the
   whole page scrolling, so an open popover's saved position would drift
   out from under its anchor button as the list scrolls. Just close it. */
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('weapon-emoji-list');
  if (list) list.addEventListener('scroll', closeEmojiPopover, { passive: true });
});

async function init() {
  await window.SITE_AUTH_READY;
  if (!isEmojiAdmin()) {
    document.getElementById('gate-message').style.display = '';
    return;
  }
  document.getElementById('emoji-linking-app').style.display = '';

  try {
    [serverEmojis, weaponEmojiMap] = await Promise.all([
      api('/api/discord-emojis').catch(() => []),
      api('/api/weapon-emojis').catch(() => ({})),
    ]);
  } catch (err) {
    alert('Failed to load emoji data: ' + err.message);
  }
  renderList();

  document.getElementById('weapon-search').addEventListener('input', e => renderList(e.target.value));
  document.getElementById('hide-linked-toggle').addEventListener('change', () => renderList(document.getElementById('weapon-search').value));
}

init();
