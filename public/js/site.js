/* ─────────────────────────────────────────
   SITE-WIDE — copy link button
   (used on every page that includes a
   #copy-btn / #toast pair in its header)
───────────────────────────────────────── */
(function () {
  const copyBtn = document.getElementById('copy-btn');
  const toast = document.getElementById('toast');
  if (!copyBtn || !toast) return;

  let toastTimer;
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Link copied — paste it in Discord`;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
    });
  });
})();
