/* ─────────────────────────────────────────
   THEME LOADER — loads and applies the
   current site theme before page render
   to prevent flash of unstyled content
───────────────────────────────────────── */

(async function loadTheme() {
  try {
    const res = await fetch('/api/theme');
    const data = await res.json();
    const theme = data.theme || 'default';
    if (theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (err) {
    console.error('Failed to load theme:', err);
    // Silently fail - defaults to original theme
  }
})();
