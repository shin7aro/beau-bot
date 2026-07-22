/* ─────────────────────────────────────────
   AUTH — shared across every page
   Fetches the current session from /auth/me,
   exposes window.SITE_AUTH, and renders a
   login/logout control into the header.
───────────────────────────────────────── */
window.SITE_AUTH = { loggedIn: false, role: null, username: null };

// Resolves once /auth/me has answered — pages that need to gate content
// (builds edit controls, the whole comps page) should await this before
// deciding what to render.
window.SITE_AUTH_READY = fetch('/auth/me', { credentials: 'same-origin' })
  .then(r => r.json())
  .then(data => {
    if (data.user) {
      window.SITE_AUTH = { loggedIn: true, role: data.user.role, username: data.user.username };
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
  const { role } = window.SITE_AUTH;
  document.querySelectorAll('.officer-only').forEach(el => el.classList.toggle('visible', role === 'officer' || role === 'admin'));
  document.querySelectorAll('.admin-only').forEach(el => el.classList.toggle('visible', role === 'admin'));

  const mount = document.getElementById('auth-control');
  if (!mount) return;
  const { loggedIn, username } = window.SITE_AUTH;

  if (!loggedIn) {
    mount.innerHTML = `<a class="btn" href="/auth/login?returnTo=${encodeURIComponent(location.pathname)}">
      <span class="btn-label">Officer/Admin login</span>
    </a>`;
    return;
  }

  mount.innerHTML = `
    <div class="auth-menu" id="auth-menu">
      <button class="auth-menu-trigger" id="auth-menu-trigger" type="button" aria-haspopup="true" aria-expanded="false" title="${escapeAttr(username)} — ${role}">
        <span class="auth-role-dot auth-role-${role}"></span>
        <span class="auth-menu-name">${escapeAttr(username)}</span>
        <svg class="auth-menu-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="auth-menu-dropdown" id="auth-menu-dropdown">
        <a class="auth-menu-item" href="builds.html">War Ledger</a>
        ${(role === 'officer' || role === 'admin') ? '<a class="auth-menu-item" href="comps.html">Compositions</a>' : ''}
        ${role === 'admin' ? '<a class="auth-menu-item" href="history.html">History</a>' : ''}
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

// Convenience for pages that need "officer or admin" / "admin only" checks.
function isOfficerOrAdmin() { return window.SITE_AUTH.role === 'officer' || window.SITE_AUTH.role === 'admin'; }
function isAdmin() { return window.SITE_AUTH.role === 'admin'; }
