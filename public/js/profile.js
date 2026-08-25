/* ─────────────────────────────────────────
   PROFILE page — "Field Dossier"
   Reads ?id=<discordUserId> from the URL
   (falls back to the logged-in viewer's own
   id if missing — e.g. the "My Profile" link)
   and renders one member's:
     - role in the guild (GM/Right Hand/
       Officer/Dahalo) + when they joined,
       via GET /api/profile
     - their main role (Tank/Support/DPS/
       Healer/Battlemount), derived server-side
       from what they've actually played most
       across every closed event they attended
     - PVP/PVE/Economy attendance, counted
       from closed events they signed up for
       and did NOT no-show
     - total loot earned + where that ranks
       against the rest of the guild
     - their 5 most recent closed campaigns

   Members-only, same boundary as events/loot
   (auth.requireMember) — the roster page's
   list of names is public, but the stats
   behind each name aren't.
───────────────────────────────────────── */

const TIER_LABELS = { gm: 'Guild Master', right_hand: 'Right Hand', officer: 'Officer', member: 'Dahalo' };
const TIER_TEXT_CLASS = { gm: 'tier-gold', right_hand: 'tier-silver', officer: 'tier-bronze', member: 'tier-member' };
const TIER_RING_CLASS = { gm: 'ring-gold', right_hand: 'ring-silver', officer: 'ring-bronze', member: 'ring-member' };
const TIER_BANNER_CLASS = { gm: 'banner-gold', right_hand: 'banner-silver', officer: 'banner-bronze', member: 'banner-member' };

const ROLE_ICONS = {
  Tank: '<path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"/>',
  Support: '<path d="M12 2l2.5 5.5L20 8l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/>',
  DPS: '<path d="M4 20L15 9M17 3l4 4-3 3-4-4 3-3zM9 15l-2 2 2 2 2-2"/>',
  Healer: '<path d="M12 21s-7-4.5-9.5-9C.5 8 2 4 6 4c2 0 3.5 1.2 4 2.5C10.5 5.2 12 4 14 4c4 0 5.5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z"/>',
  Battlemount: '<path d="M4 18c0-4 2-7 5-9M20 18c0-4-2-7-5-9M9 9c0-3 1.5-5 3-5s3 2 3 5M7 18h10"/>',
};
const EVENT_TYPE_EMOJI = { PVP: '⚔️', PVE: '🐉', Economy: '💰' };

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function formatSilver(n) {
  return Math.round(n || 0).toLocaleString('en-US');
}

function formatMonthYear(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatShortDate(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function roleChipHtml(role, { small } = {}) {
  if (!role || !ROLE_ICONS[role]) return '';
  const sizeClass = small ? 'role-chip-sm' : '';
  return `
    <span class="role-chip role-${role} ${sizeClass}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ROLE_ICONS[role]}</svg>
      ${small ? escapeHtml(role) : `Main role: ${escapeHtml(role)}`}
    </span>`;
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

function showError(message) {
  document.getElementById('profile-view').style.display = 'none';
  document.getElementById('profile-error-view').style.display = '';
  document.getElementById('profile-error').textContent = message;
}

function renderBanner(profile) {
  const banner = document.getElementById('profile-banner');
  const avatarUrl = window.discordAvatarUrl(profile.id, profile.avatar, 128);
  const ringClass = TIER_RING_CLASS[profile.tier] || 'ring-member';
  const bannerClass = TIER_BANNER_CLASS[profile.tier] || 'banner-member';
  const textClass = TIER_TEXT_CLASS[profile.tier] || 'tier-member';
  const tierLabel = TIER_LABELS[profile.tier] || 'Dahalo';
  const since = formatMonthYear(profile.memberSince);

  banner.className = `profile-banner ${bannerClass}`;
  banner.innerHTML = `
    <div class="profile-avatar-wrap ${ringClass}">
      <img class="profile-avatar" src="${avatarUrl}" alt="" loading="lazy">
    </div>
    <div class="profile-id">
      <div class="profile-name">${escapeHtml(profile.username)}</div>
      <div class="profile-tier-line">
        <span class="profile-tier ${textClass}">${escapeHtml(tierLabel)}</span>
        ${since ? `<span class="profile-since">since ${escapeHtml(since)}</span>` : ''}
      </div>
      ${!profile.inGuild ? '<div class="profile-flag">No longer in the Discord server</div>' : ''}
      ${profile.inactive ? '<div class="profile-flag">Marked inactive on the roster</div>' : ''}
    </div>
    ${profile.favoriteRole ? roleChipHtml(profile.favoriteRole) : ''}
  `;
}

function renderLedger(profile) {
  const ledger = document.getElementById('profile-ledger');
  const totalEvents = profile.attendance.PVP + profile.attendance.PVE + profile.attendance.Economy;

  const campaignsHtml = profile.recentCampaigns.length
    ? profile.recentCampaigns.map(c => `
        <div class="campaign-row">
          <span class="campaign-date">${formatShortDate(c.createdAt)}</span>
          <span class="campaign-title">${EVENT_TYPE_EMOJI[c.type] || '📌'} ${escapeHtml(c.title)}</span>
        </div>`).join('')
    : `<p class="empty-state-inline">No closed campaigns yet.</p>`;

  ledger.innerHTML = `
    <div class="ledger-panel">
      <div class="ledger-panel-title">Service record</div>
      <div class="ledger-row"><span class="ledger-lbl">PVP attendance</span><span class="ledger-val">${profile.attendance.PVP}</span></div>
      <div class="ledger-row"><span class="ledger-lbl">PVE attendance</span><span class="ledger-val">${profile.attendance.PVE}</span></div>
      <div class="ledger-row"><span class="ledger-lbl">Economy attendance</span><span class="ledger-val">${profile.attendance.Economy}</span></div>
      <div class="ledger-row"><span class="ledger-lbl">Total events</span><span class="ledger-val">${totalEvents}</span></div>
      <div class="ledger-row"><span class="ledger-lbl">Total loot earned</span><span class="ledger-val ledger-gold">${formatSilver(profile.totalLootEarned)}</span></div>
    </div>
    <div class="ledger-panel">
      <div class="ledger-panel-title">Recent campaigns</div>
      <div class="campaigns-list">${campaignsHtml}</div>
    </div>
  `;
}

function renderProfile(profile) {
  renderBanner(profile);
  renderLedger(profile);
}

function resolveProfileId() {
  const params = new URLSearchParams(location.search);
  return params.get('id') || (window.SITE_AUTH.loggedIn ? window.SITE_AUTH.id : null);
}

async function init() {
  await window.SITE_AUTH_READY;

  if (!window.SITE_AUTH.loggedIn) {
    // Preserve the full URL (including ?id=...) so logging in returns
    // straight to the profile that was being looked at, not a blank one.
    document.getElementById('gate-login-link').href =
      `/auth/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`;
    document.getElementById('gate-message').style.display = '';
    return;
  }

  const userId = resolveProfileId();
  if (!userId) {
    showError('No profile to show — missing a member id.');
    return;
  }

  try {
    const profile = await api(`/api/profile/${encodeURIComponent(userId)}`);
    document.getElementById('profile-view').style.display = '';
    renderProfile(profile);
  } catch (err) {
    showError(`Failed to load profile: ${err.message}`);
  }
}

init();
