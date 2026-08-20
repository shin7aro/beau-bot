# beau-bot patch — emoji picker + Events feature (combined)

This is everything from both patches, merged and re-verified together —
no leftover conflicts, nothing to reconcile yourself. Every file here is
final; just drop them into your repo at the same paths and push.

## Deploy steps

1. Copy every file below into your repo at the same relative path,
   overwriting what's there. All paths are relative to the repo root
   (e.g. `public/js/comps.js` → `<repo>/public/js/comps.js`).
2. `git add -A && git commit -m "Add emoji picker + Events page" && git push`
   (make sure you're on `live-site-test`)
3. Re-register slash commands so Discord picks up `/event edit` and the
   new PVP/PVE/Economy choices: `npm run deploy`
4. No new environment variables needed anywhere in here — `GUILD_ID` and
   `DISCORD_TOKEN` are already required for the site's login to work.

## Files in this patch (17 total)

**Backend — root:**
- `index.js` — refactored to pull shared event logic into two new modules
  (see below); adds `/event edit`
- `api.js` — has **both** patches: the `/api/discord-emojis` endpoint for
  the comp editor's emoji picker, and the full `/api/events...` REST
  surface for the new Events page
- `web-auth.js` — new `member` role tier so any Discord server member can
  log into the site (not just officers/admins)
- `deploy-commands.js` — `/event create` type choices are now
  PVP/PVE/Economy, new `mass`/`sets` options, new `edit` subcommand
- `events-store.js` **(new)** — shared event data/logic (create, edit, sign
  up, leave, close, refresh), used by both the bot and the site
- `event-render.js` **(new)** — shared Discord embed/button rendering, used
  by both the bot and the site's "Ping" action

**Frontend — pages:**
- `public/events.html` **(new)** — the Events page
- `public/index.html`, `public/builds.html`, `public/comps.html`,
  `public/history.html` — added "Events" to the nav

**Frontend — JS:**
- `public/js/events.js` **(new)** — Events page logic
- `public/js/comps.js` — adds the emoji picker box to each weapon row in
  the comp editor
- `public/js/auth.js` — login button copy, `member` role support, Events
  link in the account dropdown

**Frontend — CSS:**
- `public/css/events.css` **(new)** — Events page styling
- `public/css/comps.css` — emoji picker box/popover styling
- `public/css/base.css` — one addition: a dot color for the `member` role

## What's in this patch, functionally

**Emoji picker** (comp editor): each weapon row now has an emoji box you
can type a shortcode into, plus a picker button that pulls your server's
actual custom emojis via a new officer-gated `/api/discord-emojis` route.

**Events feature:**
- Event type is now `PVP` / `PVE` / `Economy` (replaces the old
  CTA/Group Dungeon/Tracking/Ava Dungeon/Other list) — put the specific
  activity in the title instead. Old events keep displaying fine, nothing
  to migrate.
- New `/event edit` Discord command — organizer or a server manager can
  change title/time/type/mass/sets, or swap in a different saved comp.
- New optional Mass / Sets fields, shown on both the Discord embed and the
  site.
- New `/events.html` page — public list + detail view. Anyone can view.
  Any logged-in Discord member can sign up / leave. Officers/admins (or
  the event's own organizer) can create, edit, close, refresh, and ping.
  Creating supports either picking a saved comp or pasting composition
  text in the exact same format as the Discord modal.
- Site login is no longer officer-only — any Discord server member can log
  in now (to view events and sign up). Officer/admin-gated pages
  (Compositions, editing builds, etc.) are unaffected.

## Verified before delivery

- Every JS file here passes `node --check`.
- Actually ran the merged `api.js` as a live Express server against local
  JSON fallback storage: event creation, sign-up, duplicate-slot
  rejection, and leave all round-tripped correctly, and both the
  `/api/discord-emojis` and `/api/events...` routes responded with the
  right auth gates (403 when logged out, working when authenticated).
- Actually executed `deploy-commands.js` to confirm the new `/event edit`
  subcommand and PVP/PVE/Economy choices build into valid Discord command
  schemas (it only failed on network egress in my sandbox, which is
  expected there and not a problem on your end).
- Diffed the refactored `index.js` against the original to confirm moving
  code into `events-store.js`/`event-render.js` was a pure relocation —
  no behavior change to your existing bot commands.
