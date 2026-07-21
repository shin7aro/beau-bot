# Merging the site into beau-bot — setup guide

This folder is your `beau-bot` repo with the website merged in. Copy everything
here over your repo (or diff it against your working copy — `index.js` and
`comps.js` are *patches*, not full rewrites, so check the diff if you've
changed them since).

## What changed, file by file

| File | Status | What it does |
|---|---|---|
| `web-auth.js` | **new** | Discord OAuth login, session cookies, `requireOfficer`/`requireAdmin` middleware |
| `builds-store.js` | **new** | Shared storage for the War Ledger builds (same Redis DB as the bot) |
| `home-store.js` | **new** | Storage for the home page's editable content + YouTube highlights |
| `builds-seed.json` | **new** | One-time seed data (your existing 95 builds), loaded into Redis on first run |
| `api.js` | **new** | All the HTTP routes the site needs: `/auth/*`, `/api/builds`, `/api/comps`, `/api/home` |
| `comps.js` | **patched** | Added a `buildId`/`buildTab` link on each comp item, a safeguard so editing a comp's text on Discord doesn't erase a link set on the site, and new structured create/update functions the site's editor uses |
| `index.js` | **patched** | Two lines added near the top: serve `public/` as the website, mount `api.js` |
| `package.json` | **patched** | Added `jsonwebtoken` and `cookie-parser` |
| `.env.example` | **patched** | New variables documented below |
| `public/` | **new** | The whole site — home page, builds (now shared + gated), and the new comps page |

Nothing about your Discord commands (`/comp create`, `/event post`, etc.)
changed — they still work exactly as before. The only functional change on
the Discord side is that a comp item's build link survives a `/comp edit`
if it was already linked from the site.

## 1. Discord Developer Portal

1. Open your existing application (the bot's) at
   https://discord.com/developers/applications
2. **OAuth2 → General**: copy the **Client Secret** → this is `DISCORD_CLIENT_SECRET`.
3. **OAuth2 → Redirects**: add `https://YOUR-RENDER-URL.onrender.com/auth/callback`
   (must match `PUBLIC_URL` below exactly, including no trailing slash on `PUBLIC_URL`).
4. In Discord itself, turn on **Developer Mode** (Settings → Advanced), then
   right-click your **Officer** role → *Copy Role ID* → `OFFICER_ROLE_ID`,
   and the same for **Admin** → `ADMIN_ROLE_ID`.
5. Make sure your bot already has the **Guild Members** intent enabled
   (Developer Portal → Bot → Privileged Gateway Intents) — it's required for
   `web-auth.js` to read a logged-in user's roles. If your bot already fetches
   member info elsewhere, this is likely already on.

## 2. New environment variables (Render)

Add these to your existing Render service (Settings → Environment):

```
DISCORD_CLIENT_SECRET=   # from step 1.2
PUBLIC_URL=              # e.g. https://your-app.onrender.com  (no trailing slash)
SESSION_SECRET=          # any long random string — `openssl rand -hex 32`
OFFICER_ROLE_ID=         # from step 1.4
ADMIN_ROLE_ID=           # from step 1.4
```

`GUILD_ID`, `CLIENT_ID`, `DISCORD_TOKEN`, `UPSTASH_REDIS_REST_URL`, and
`UPSTASH_REDIS_REST_TOKEN` should already be set from your current bot —
the site reuses all of them as-is.

## 3. Deploy

```
npm install
git add -A
git commit -m "Merge website into bot (shared DB, OAuth-gated editing)"
git push
```

Render will redeploy automatically. On the **first** request to `/api/builds`,
your 95 existing builds get copied from `builds-seed.json` into Redis —
after that, Redis is the only source of truth and the seed file is never
read again.

Visit `https://your-app.onrender.com/` — that's the whole site now (home,
builds, and comps), served by the same process as the bot.

## What each role can do

| | Anyone | Officer | Admin |
|---|---|---|---|
| View home, builds | ✅ | ✅ | ✅ |
| Edit a build (swap gear, add/delete) | ❌ | ✅ | ✅ |
| View/create/edit/delete compositions | ❌ | ✅ | ✅ |
| Edit home page content & highlights | ❌ | ❌ | ✅ |

## Notes on design decisions I made for you

- **Priority/tier removed everywhere** — the `#`/`Tier` column is gone from
  all three build tables, and the `prio` field was stripped out of the data
  entirely (not just hidden). Row order in the table is just insertion
  order now.
- **"Reset" button on the builds page** now means "discard my unsaved edits
  and reload the shared list from the server" — there's no more per-device
  default to fall back to, since everyone edits the same live list.
- **Comps page is admin/officer-only to *view*, not just edit** — per your
  spec. Anyone else hitting `/comps.html` sees a "log in with Discord" gate,
  and the API itself also rejects unauthenticated requests (so it's not just
  a client-side lock).
- **Build linking** — each role line in a comp has a dropdown of every build
  across every tab (`Brawl · 1H Mace (tank)`, etc.) or "No build yet". If you
  edit a comp's raw text on Discord afterward, existing links are preserved
  by matching old vs. new lines on (party, name, emoji); only genuinely new
  lines come back unlinked.
- **Home page highlights** are stored as YouTube URLs and rendered as
  responsive embeds; admins can add/remove them without touching code.

## What I didn't build (flag these if you want them)

- Drag-to-reorder builds (order is still whatever order you add them in —
  same as before, just no numeric priority label).
- Multi-party support in the comps editor beyond a simple "party #" number
  per line (the bot's fancier per-party grouping still works from Discord;
  the site editor is intentionally simpler).
- Rich text / images in the home page's editable copy — it's plain text only.
