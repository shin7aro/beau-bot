/* ─────────────────────────────────────────
   HOME PAGE — CMS content, live ledger
   preview, YouTube highlights, admin edit
───────────────────────────────────────── */
let homeContent = null;
let editMode = false;

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setPath(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] == null) cur[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
}

function youtubeEmbedUrl(url) {
  const m = String(url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function renderTextFields() {
  document.querySelectorAll('[data-cms]').forEach(el => {
    if (editMode) return; // don't clobber in-progress edits
    const key = el.dataset.cms;
    const val = getPath(homeContent, key);
    if (val !== undefined) el.textContent = val;
  });
  const discordLink = document.getElementById('discord-invite-link');
  if (discordLink && homeContent.discordInviteUrl) discordLink.href = homeContent.discordInviteUrl;
  const footerDiscordLink = document.getElementById('footer-discord-link');
  if (footerDiscordLink && homeContent.discordInviteUrl) footerDiscordLink.href = homeContent.discordInviteUrl;
}

function renderStats() {
  const grid = document.getElementById('stats-grid');
  if (!grid) return;
  grid.innerHTML = (homeContent.stats || []).map((s, i) => `
    <div class="stat">
      <div class="stat-num" data-cms="stats.${i}.num">${escapeHtml(s.num)}</div>
      <div class="stat-label" data-cms="stats.${i}.label">${escapeHtml(s.label)}</div>
    </div>`).join('');
  if (editMode) grid.querySelectorAll('[data-cms]').forEach(el => el.contentEditable = 'true');
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderHighlights() {
  const grid = document.getElementById('highlights-grid');
  if (!grid) return;
  const highlights = homeContent.highlights || [];
  if (!highlights.length) {
    grid.innerHTML = `<p class="section-sub">No highlights posted yet.</p>`;
    return;
  }
  const adminVisible = typeof isAdmin === 'function' && isAdmin();
  grid.innerHTML = highlights.map(h => {
    const embed = youtubeEmbedUrl(h.youtubeUrl);
    return `<div class="highlight-card">
      ${embed
        ? `<div class="highlight-frame"><iframe src="${embed}" title="${escapeHtml(h.title)}" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`
        : `<div class="highlight-frame highlight-broken">Invalid YouTube URL</div>`}
      <div class="highlight-title">${escapeHtml(h.title || 'Untitled')}</div>
      <button class="btn admin-only${adminVisible ? ' visible' : ''}" data-id="${h.id}" style="margin-top:6px">Remove</button>
    </div>`;
  }).join('');
  grid.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Remove this highlight?')) return;
      homeContent.highlights = homeContent.highlights.filter(h => h.id !== btn.dataset.id);
      await saveHome();
    });
  });
}

async function saveHome() {
  const res = await fetch('/api/home', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(homeContent),
  });
  if (res.ok) {
    homeContent = await res.json();
    renderAll();
  } else {
    alert('Could not save — you may need to log in again.');
  }
}

function renderAll() {
  renderTextFields();
  renderStats();
  renderHighlights();
}

async function init() {
  const res = await fetch('/api/home');
  homeContent = await res.json();
  renderAll();

  await window.SITE_AUTH_READY;
  renderHighlights();

  const editBtn = document.getElementById('edit-home-btn');
  const editBar = document.getElementById('edit-bar');
  const saveBtn = document.getElementById('save-home-btn');
  const cancelBtn = document.getElementById('cancel-edit-btn');
  const discordUrlInput = document.getElementById('discord-url-input');

  editBtn && editBtn.addEventListener('click', () => {
    editMode = true;
    editBar.style.display = 'flex';
    document.querySelectorAll('[data-cms]').forEach(el => el.contentEditable = 'true');
    if (discordUrlInput) discordUrlInput.value = homeContent.discordInviteUrl || '';
  });

  cancelBtn && cancelBtn.addEventListener('click', () => {
    editMode = false;
    editBar.style.display = 'none';
    document.querySelectorAll('[data-cms]').forEach(el => el.contentEditable = 'false');
    renderAll();
  });

  saveBtn && saveBtn.addEventListener('click', async () => {
    document.querySelectorAll('[data-cms]').forEach(el => {
      setPath(homeContent, el.dataset.cms, el.textContent.trim());
    });
    if (discordUrlInput) homeContent.discordInviteUrl = discordUrlInput.value.trim();
    editMode = false;
    editBar.style.display = 'none';
    document.querySelectorAll('[data-cms]').forEach(el => el.contentEditable = 'false');
    await saveHome();
  });

  const addBtn = document.getElementById('highlight-add-btn');
  addBtn && addBtn.addEventListener('click', async () => {
    const title = document.getElementById('highlight-title-input').value.trim();
    const url = document.getElementById('highlight-url-input').value.trim();
    if (!youtubeEmbedUrl(url)) { alert('That doesn\'t look like a valid YouTube URL.'); return; }
    homeContent.highlights = homeContent.highlights || [];
    homeContent.highlights.push({ id: crypto.randomUUID(), title: title || 'Untitled', youtubeUrl: url, addedAt: Date.now() });
    document.getElementById('highlight-title-input').value = '';
    document.getElementById('highlight-url-input').value = '';
    await saveHome();
  });
}

init();
