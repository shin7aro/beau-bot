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
    <span class="auth-badge" title="${escapeAttr(username)} — ${role}">
      <span class="auth-role-dot auth-role-${role}"></span>${escapeAttr(username)}
    </span>
    <a class="btn" href="/auth/logout"><span class="btn-label">Log out</span></a>`;
}

function escapeAttr(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Convenience for pages that need "officer or admin" / "admin only" checks.
function isOfficerOrAdmin() { return window.SITE_AUTH.role === 'officer' || window.SITE_AUTH.role === 'admin'; }
function isAdmin() { return window.SITE_AUTH.role === 'admin'; }
