/* ─────────────────────────────────────────
   PROFILE page
   Reads ?id=<discordUserId> from the URL
   (falls back to the logged-in viewer's own
   id if missing — e.g. the "My Profile" link)
   and renders one member's:
     - role in the guild (GM/Right Hand/
       Officer/Dahalo), via GET /api/profile
     - PVP/PVE/Economy attendance, counted
       from closed events they signed up for
       and did NOT no-show
     - total loot earned, from the loot
       manager's lifetime totals

   Members-only, same boundary as events/loot
   (auth.requireMember) — the roster page's
   list of names is public, but the stats
   behind each name aren't.
───────────────────────────────────────── */

const TIER_LABELS = { gm: 'Guild Master', right_hand: 'Right Hand', officer: 'Officer', member: 'Dahalo' };
const TIER_CARD_CLASS = { gm: 'roster-card-gm', right_hand: 'roster-card-rh', officer: 'roster-card-officer', member: 'roster-card-member' };

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function formatSilver(n) {
  return Math.round(n || 0).toLocaleString('en-US');
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

function renderProfile(profile) {
  const card = document.getElementById('profile-card');
  const avatarUrl = window.discordAvatarUrl(profile.id, profile.avatar, 160);
  const tierClass = TIER_CARD_CLASS[profile.tier] || 'roster-card-member';
  const tierLabel = TIER_LABELS[profile.tier] || 'Dahalo';

  card.innerHTML = `
    <div class="profile-avatar-wrap ${tierClass}">
      <img class="profile-avatar" src="${avatarUrl}" alt="" loading="lazy">
    </div>
    <div class="profile-name">${escapeHtml(profile.username)}</div>
    <div class="profile-tag ${tierClass}">${escapeHtml(tierLabel)}</div>
    ${!profile.inGuild ? '<div class="profile-flag">No longer in the Discord server</div>' : ''}
    ${profile.inactive ? '<div class="profile-flag">Marked inactive on the roster</div>' : ''}
  `;

  const stats = document.getElementById('profile-stats');
  stats.innerHTML = `
    <div class="stat"><div class="stat-num">${profile.attendance.PVP}</div><div class="stat-label">PVP attendance</div></div>
    <div class="stat"><div class="stat-num">${profile.attendance.PVE}</div><div class="stat-label">PVE attendance</div></div>
    <div class="stat"><div class="stat-num">${profile.attendance.Economy}</div><div class="stat-label">Economy attendance</div></div>
    <div class="stat"><div class="stat-num">${formatSilver(profile.totalLootEarned)}</div><div class="stat-label">Total loot earned</div></div>
  `;
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
