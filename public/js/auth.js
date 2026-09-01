/* ─────────────────────────────────────────
   AUTH — shared across every page
   Fetches the current session from /auth/me,
   exposes window.SITE_AUTH, and renders a
   login/logout control into the header.
───────────────────────────────────────── */
window.SITE_AUTH = { loggedIn: false, role: null, username: null, id: null, avatar: null, rosterAdmin: false, emojiAdmin: false, themeManager: false };

// Builds a Discord CDN avatar URL from a user id + the avatar hash Discord
// gave us at login (stored in the session). Falls back to Discord's own
// default avatar (a solid-color circle with a Discord glyph) when there's
// no hash yet, or when we're rendering an avatar for someone whose hash we
// don't have (e.g. an events roster row before the server resolved one).
window.discordAvatarUrl = function discordAvatarUrl(id, avatarHash, size = 64) {
  if (avatarHash) {
    const ext = avatarHash.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${id}/${avatarHash}.${ext}?size=${size}`;
  }
  try {
    const index = Number((BigInt(id) >> 22n) % 6n);
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  } catch {
    return `https://cdn.discordapp.com/embed/avatars/0.png`;
  }
};

// Resolves once /auth/me has answered — pages that need to gate content
// (builds edit controls, the events page's manage buttons, the whole comps
// page) should await this before deciding what to render.
window.SITE_AUTH_READY = fetch('/auth/me', { credentials: 'same-origin' })
  .then(r => r.json())
  .then(data => {
    if (data.user) {
      window.SITE_AUTH = {
        loggedIn: true,
        role: data.user.role,
        username: data.user.username,
        id: data.user.id,
        avatar: data.user.avatar,
        rosterAdmin: Boolean(data.user.rosterAdmin),
        emojiAdmin: Boolean(data.user.emojiAdmin),
        themeManager: Boolean(data.user.themeManager),
      };
    }
    renderAuthControl();
    document.dispatchEvent(new CustomEvent('site-auth-ready'));
    return window.SITE_AUTH;
  })
  .catch(() => {
    renderAuthControl();
    document.dispatchEvent(new CustomEvent('site-auth-ready'));
    return window.SITE_AUTH;
  });

function renderAuthControl() {
  const { role, loggedIn } = window.SITE_AUTH;
  document.querySelectorAll('.officer-only').forEach(el => el.classList.toggle('visible', role === 'officer' || role === 'admin'));
  document.querySelectorAll('.admin-only').forEach(el => el.classList.toggle('visible', role === 'admin'));
  document.querySelectorAll('.logged-in-only').forEach(el => el.classList.toggle('visible', loggedIn));
  document.querySelectorAll('.roster-admin-only').forEach(el => el.classList.toggle('visible', window.SITE_AUTH.rosterAdmin));
  document.querySelectorAll('.emoji-admin-only').forEach(el => el.classList.toggle('visible', window.SITE_AUTH.emojiAdmin));

  const mount = document.getElementById('auth-control');
  if (!mount) return;
  const { username, id, avatar } = window.SITE_AUTH;

  if (!loggedIn) {
    mount.innerHTML = `<a class="btn" href="/auth/login?returnTo=${encodeURIComponent(location.pathname)}">
      <span class="btn-label">Log in with Discord</span>
    </a>`;
    return;
  }

  const avatarUrl = discordAvatarUrl(id, avatar, 48);
  mount.innerHTML = `
    <div class="auth-menu" id="auth-menu">
      <button class="auth-menu-trigger" id="auth-menu-trigger" type="button" aria-haspopup="true" aria-expanded="false" title="${escapeAttr(username)} — ${role}">
        <img class="auth-avatar auth-role-${role}" src="${avatarUrl}" alt="" loading="lazy">
        <span class="auth-menu-name">${escapeAttr(username)}</span>
        <svg class="auth-menu-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="auth-menu-dropdown" id="auth-menu-dropdown">
        <a class="auth-menu-item" href="profile.html?id=${encodeURIComponent(id)}">My Profile</a>
        <a class="auth-menu-item" href="builds.html">War Ledger</a>
        <a class="auth-menu-item" href="roster.html">Roster</a>
        <a class="auth-menu-item" href="events.html">Events</a>
        ${(role === 'officer' || role === 'admin') ? '<a class="auth-menu-item" href="comps.html">Compositions</a>' : ''}
        ${(role === 'officer' || role === 'admin') ? '<a class="auth-menu-item" href="attendance.html">Attendance</a>' : ''}
        ${role === 'admin' ? '<a class="auth-menu-item" href="history.html">History</a>' : ''}
        ${window.SITE_AUTH.emojiAdmin ? '<a class="auth-menu-item" href="emoji-linking.html">Emoji Linking</a>' : ''}
        ${window.SITE_AUTH.themeManager ? `
        <div class="auth-menu-divider"></div>
        <div class="auth-menu-section-label">Site theme</div>
        <button class="auth-menu-item auth-menu-theme-btn" type="button" data-theme-option="old" onclick="setSiteTheme('old')">Old theme</button>
        <button class="auth-menu-item auth-menu-theme-btn" type="button" data-theme-option="new" onclick="setSiteTheme('new')">New theme</button>
        ` : ''}
        <div class="auth-menu-divider"></div>
        <a class="auth-menu-item auth-menu-danger" href="/auth/logout">Log out</a>
      </div>
    </div>`;

  const trigger = document.getElementById('auth-menu-trigger');
  const dropdown = document.getElementById('auth-menu-dropdown');
  const closeMenu = () => { dropdown.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); };
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', (e) => {
    if (!mount.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}

function escapeAttr(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Convenience for pages that need role checks.
function isOfficerOrAdmin() { return window.SITE_AUTH.role === 'officer' || window.SITE_AUTH.role === 'admin'; }
function isAdmin() { return window.SITE_AUTH.role === 'admin'; }
function isLoggedIn() { return window.SITE_AUTH.loggedIn; }
function isEmojiAdmin() { return window.SITE_AUTH.emojiAdmin; }
