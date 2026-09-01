/* ─────────────────────────────────────────
   THEME — shared across every page
   The site theme ('old' | 'new') is global —
   one value for every visitor, stored server-
   side. This file confirms the current value
   on load (the inline snippet in <head> only
   guessed from localStorage, to avoid a flash)
   and exposes window.setSiteTheme() for the
   theme-switch buttons in the profile dropdown
   (auth.js only renders those for the Guild
   Master / Right Hand — see /auth/me).
───────────────────────────────────────── */
(function () {
  const STORAGE_KEY = 'rod-theme';

  function apply(theme) {
    const value = theme === 'new' ? 'new' : 'old';
    document.documentElement.setAttribute('data-theme', value);
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* ignore */ }
  }

  function notify(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(notify._t);
    notify._t = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // Confirm/refresh against the server's global value — the inline
  // snippet in <head> already applied a best guess from localStorage so
  // there's no flash, this just corrects it if it's stale.
  fetch('/api/theme', { credentials: 'same-origin' })
    .then(r => r.json())
    .then(data => apply(data.theme))
    .catch(() => { /* keep the localStorage guess if the fetch fails */ });

  // Called by the theme-switch buttons in the profile dropdown. Switching
  // is global — it changes the live theme for every visitor, not just
  // this browser.
  window.setSiteTheme = async function setSiteTheme(theme) {
    try {
      const res = await fetch('/api/theme', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to switch the site theme.');
      apply(data.theme);
      notify(data.theme === 'new' ? 'Switched the whole site to the new theme.' : 'Switched the whole site back to the old theme.');
    } catch (err) {
      notify(err.message || 'Failed to switch the site theme.');
    }
  };
})();
