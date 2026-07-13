# Albion Event Bot

A Discord bot for posting sign-up forms for guild activities (CTA, Group Dungeon,
Tracking, Ava Dungeon, or anything else you name), with role buttons and
build-slot tracking — similar to the "Albion Gasy" bot example.

## What it does

- `/event create` posts an embed with buttons: **Tank / DPS / Healer / Support /
  Leave**. Where the composition comes from depends on the activity type:
  - **CTA** — pulls the "Brawl" build list live from
    https://shin7aro.github.io/Rise-of-Dahalo. Every build on the site becomes
    its own sign-up slot (same style as your ZvZ example screenshot).
  - **Tracking** — pulls the Tracking build list live, with a fixed **1 Tank /
    1 Healer / 3 DPS** quota. Members pick which build they're bringing from a
    dropdown; the role fills up by headcount, not by specific weapon.
  - **Group Dungeon** — same 1 Tank / 1 Healer / 3 DPS quota. The site doesn't
    have Group Dungeon builds published yet, so until it does, this borrows the
    Tracking build pool as a placeholder and says so in the event's footer and
    in a note to you. The moment you add a `BUILDS_GROUP_DUNGEON` array to the
    site (same format as `BUILDS_TRACKING`), new events switch to the real
    thing automatically — no bot code changes needed.
  - **Ava Dungeon / Other** — no data published yet, so these open the manual
    composition form (a text box you fill in each time) like the original
    design.
- Every weapon shown gets an emoji based on its weapon type (⚔️ swords, 🏹 bows,
  ✨ holy staves, 🌿 nature staves, 🔨 maces/hammers, 🔪 daggers, etc.), worked
  out from the real item IDs in the site's `ITEM_MAP`.
- If a role has several possible builds, members get a dropdown to pick the
  specific one. If a build allows more than one person (e.g. the same weapon
  appears twice for CTA), it tracks how many slots are filled, like `(1/2)`.
- `/event close` locks an event so no one can sign up anymore (organizer or a
  server manager only).
- Data is saved to a local `events.json` file, so sign-ups survive a bot restart.
- Live comp data is cached for 10 minutes so the bot doesn't re-fetch your site
  on every single `/event create`.

**A note on how the live fetch works:** the site is a single HTML file with the
build data stored as plain JavaScript (`const BUILDS = [...]`, `const ITEM_MAP =
{...}`). The bot fetches that raw file from GitHub and evaluates just those two
pieces as JavaScript to turn them into data. That's simple and reliable as long
as you're the one maintaining the site — just keep in mind it does execute
whatever's inside those `const` declarations, so don't point `RAW_URL` in
`live-comps.js` at a repo you don't control.

## 1. Create the Discord application

1. Go to https://discord.com/developers/applications and click **New
   Application**. Name it whatever you like (e.g. "Albion Event Bot").
2. Go to the **Bot** tab → **Reset Token** → copy the token. This is your
   `DISCORD_TOKEN`. Keep it secret — anyone with it can control your bot.
3. On the same **Bot** page, you do NOT need any privileged intents (Message
   Content, Presence, Server Members) for this bot — it only uses slash
   commands and buttons.
4. Go to **General Information** and copy the **Application ID** — this is
   your `CLIENT_ID`.

## 2. Invite the bot to your server

1. Go to **OAuth2 → URL Generator**.
2. Under **Scopes**, check `bot` and `applications.commands`.
3. Under **Bot Permissions**, check: `Send Messages`, `Embed Links`,
   `Read Message History`, `Use Slash Commands`.
4. Copy the generated URL, open it in your browser, and select your server
   (you need "Manage Server" permission there).

## 3. Get the code running locally (to test before hosting)

You'll need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
cd albion-event-bot
npm install
cp .env.example .env
```

Open `.env` and fill in:
```
DISCORD_TOKEN=your-bot-token
CLIENT_ID=your-application-id
GUILD_ID=your-server-id     # optional, but recommended while testing
```

To get `GUILD_ID`: in Discord, go to **User Settings → Advanced → Developer
Mode** (turn it on), then right-click your server icon and **Copy Server ID**.
Setting `GUILD_ID` makes the `/event` command appear instantly in that one
server; leaving it blank registers it globally (takes up to an hour to show
everywhere, but works in all servers the bot joins).

Register the slash command, then start the bot:
```bash
npm run deploy
npm start
```

You should see `Logged in as YourBot#1234` in the console. In Discord, type
`/event create` in a channel the bot can see.

## 4. How to fill in the composition form (Ava Dungeon / Other only)

CTA, Tracking, and Group Dungeon build themselves automatically from the live
site — you'll only see the manual text box for **Ava Dungeon** and **Other**
(or if the site can't be reached for some reason). When you do see it, pick a
**type** and **time**, then Discord opens a text box. Type one item per line,
grouping with a category header:

```
Tank
1H Mace: 1
Polehammer
Dreadstorm Monarch
DPS
Carving Sword: 1
Bear Paws
Healer
Hallowfall: 2
Exalted Staff
Support
Rootbound Staff
```

Rules:
- A line that's just `Tank`, `DPS`, `Healer`, or `Support` starts a new
  section.
- Every following line is one build/item. Add `: N` at the end to allow N
  people in that slot (e.g. `Hallowfall: 2`). No number = 1 slot.
- Order doesn't matter beyond grouping; the bot always displays Tank → DPS →
  Healer → Support.

## 5. Hosting it for free, 24/7

A quick, honest rundown of the realistic free options as of mid-2026 — the
Discord-bot-hosting space is full of small, short-lived third-party hosts, so
I'd stick to well-known providers:

**Option A — Oracle Cloud "Always Free" VM (most reliable, genuinely free forever)**
- Sign up at oracle.com/cloud/free, create an "Always Free" ARM-based compute
  instance (Ubuntu). It never sleeps and isn't a trial.
- SSH in, install Node.js, `git clone` or `scp` this folder up, then run it
  with `pm2` (`npm i -g pm2 && pm2 start index.js --name albion-bot && pm2 save && pm2 startup`)
  so it survives reboots.
- Downside: takes ~20-30 minutes to set up the first time, and free-tier ARM
  instances can occasionally be reclaimed if left completely idle for a long
  time — keeping the bot running counts as activity.

**Option B — Railway (easiest, small free credit rather than truly unlimited)**
- Push this folder to a GitHub repo, then at railway.app create a new project
  from that repo. Railway gives a small monthly free credit, usually enough
  for one small bot, then bills per usage after that.
- Add your `.env` values under the project's **Variables** tab (not as a
  committed file).
- Set the start command to `npm start` and, once, run `npm run deploy`
  from the Railway shell (or run it locally once with the same token) to
  register the slash command.

**Option C — Render free Web Service (free but sleeps when idle)**
- Similar GitHub-based deploy to Railway. Render's free tier spins the
  service down after inactivity, which would disconnect the bot — you'd need
  to add a tiny built-in HTTP server plus an uptime pinger (e.g.
  UptimeRobot) to keep it awake. More moving parts, so I'd treat this as a
  fallback rather than the first choice.

I'd start with **Option A** if you're comfortable following a step-by-step
guide once (it's the only one of the three that's free with no time limit or
sleep behavior), or **Option B** if you want something click-and-go and don't
mind it possibly needing a few dollars a month down the line.

There are also smaller third-party "free Discord bot hosting" sites that show
up in search results — I'd be cautious with those: several require manual
renewal every 24 hours, and reliability/longevity varies a lot since these are
often small operations. Worth avoiding for something your guild depends on.

## 6. Files in this project

- `index.js` — the bot itself (commands, modal, buttons, select menus, storage)
- `live-comps.js` — fetches and parses builds/`ITEM_MAP` from your site, plus
  the weapon → emoji lookup
- `deploy-commands.js` — one-time/whenever-you-change-it script to register `/event`
- `package.json` — dependencies (`discord.js`, `dotenv`)
- `.env.example` — template for your secrets, copy to `.env`
- `events.json` — created automatically once you post your first event

## 7. Extending it later

Ideas if you want to grow this further:
- Auto-close events at their scheduled time.
- `/event list` to see all currently open events.
- Reminder pings 15 minutes before the event time.
- Per-role @mention pings when a category fills up.

Happy to build any of these in — just let me know which one.
