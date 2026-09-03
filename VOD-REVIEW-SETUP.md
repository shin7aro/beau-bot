# VOD Review — file drop-in guide

This zip mirrors your repo's folder structure exactly, so every file here
overwrites (or adds to) the same path in `beau-bot`. New files:

- `vod-store.js`
- `vod-ws.js`
- `public/vod-review.html`
- `public/js/vod-review.js`
- `public/css/vod-review.css`

Modified files (small, targeted diffs — nothing else in them was touched):

- `package.json` — added the `ws` dependency
- `index.js` — swapped `app.listen` for `http.createServer(app)` so the
  websocket can attach to the same server/port
- `api.js` — added the `/api/vod/*` routes near the bottom, before
  `module.exports`
- `public/js/auth.js` — added "VOD Review · Beta" to the officer/admin
  profile dropdown only
- `public/css/base.css` — a few lines of styling for that dropdown's beta
  pill

## After uploading

1. Run `npm install` (or just deploy — Render/whatever runs `npm install`
   automatically) so the new `ws` package actually gets installed. I didn't
   include `package-lock.json` on purpose — regenerating it locally would
   have introduced a lot of unrelated diff noise from dependency version
   bumps, so let your own `npm install` produce a clean one.
2. No new environment variables are needed — it reuses your existing
   session cookie and (if set) Upstash Redis config; otherwise it falls
   back to a local JSON file like your other stores do.
3. Nothing else in the repo needs to change. The tool is only linked from
   the officer/admin dropdown for now, per your ask.
