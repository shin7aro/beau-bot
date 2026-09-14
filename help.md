# Beau Bot — what it actually does

This is reference material, not something to recite. Only pull from this when
someone is genuinely asking how to use a command, sign up, create an event,
etc. Normal chat and banter should never turn into a command dump.

## Signing up for an event

Every posted event has role buttons — **Tank, Support, DPS, Healer,
Battlemount** — plus a **Leave** button.

- Click a role button. If there's only one open build left in that role,
  you're signed up immediately. If there's more than one option, a dropdown
  pops up so you pick which specific build you're taking.
- You can only hold one slot per event — picking a new role/build moves you
  there and frees up your old spot.
- **Leave** removes you from whatever slot you're in.
- If an event has multiple parties (raid split into groups of ~20), the
  roster just shows which party each row belongs to — no need to pick a
  party yourself, that's baked into the comp.

## `/event create`

- `type` — CTA, Group Dungeon, Tracking, Ava Dungeon, or Other (just affects
  the title/emoji).
- `time` — free text, e.g. "21h Mada".
- `comp` — optional. Pick a saved composition to auto-fill roles/builds. If
  you leave it blank, you get a text box to type the composition manually.
- `title` — optional custom title.

### Manual composition format (when not using a saved comp)

Type it as plain text, one item per line, grouped under role headers:

```
Tank
1H Mace
Polehammer
DPS
Carving Sword: 2
Healer
Hallowfall
```

- A line that's just `Tank`, `Support`, `DPS`, `Healer`, or `Battlemount`
  (case-insensitive) starts a new role section.
- Each following line is one open slot for that weapon. Add `: N` at the end
  to open N identical slots at once (e.g. `Hallowfall: 2` = two Hallowfall
  slots).
- You can lead a line with an emoji — either paste an actual emoji, or type
  a server custom emoji's name as `:emojiname:` and Beau will match it to
  the real emoji on the server automatically.
- For big comps that need more than one raid party, write `Party 1`, then
  its roles, then `Party 2`, then its roles, and so on. If you never write a
  `Party` line, everything's treated as one single party.

## Saved compositions (`/comp`)

- `/comp create` — opens a form: give it a label and the same composition
  text format as above. Saves it for reuse.
- `/comp edit` — pick an existing saved comp and change its label or
  contents.
- `/comp delete` — remove a saved comp.
- `/comp list` — see every saved comp and its full roster.
- Editing a saved comp does **not** change any event that's already been
  posted from it — events keep whatever comp they were created with.

## `/event refresh`

If you edit a saved comp after posting an event from it, `/event refresh
event_id:<id>` re-applies the *current* version of that comp onto the
already-posted event. People already signed up keep their exact slot
wherever it still matches (same role + same build); only people whose
specific slot got removed or changed in the edit get bumped, and the
organizer's told exactly who. Organizer or a server manager only. Only
works on events that were created from a saved comp in the first place.

## `/event close`

Organizer or a server manager only. Locks the event so nobody can sign up
or leave anymore. You'll get a dropdown listing everyone currently signed
up — pick anyone who didn't show, or just hit "No no-shows — close now" if
everyone attended. A message gets posted announcing the event is closed and
listing the no-shows (or saying there were none).

## Managing sign-ups for someone who isn't online

If you're the organizer (or a server manager), you can add or remove
someone from a role without them touching a button themselves: create a
Discord thread directly from the event's posted message, then inside that
thread, mention the bot along with the player and the role, e.g.:

```
@Beau Bot @PlayerName Tank
@Beau Bot remove @PlayerName from DPS
```

Adding someone shows the same slot picker as a normal sign-up (so you pick
exactly which build for them, if there's more than one option). Words like
*remove, delete, cancel, drop, leave, out* trigger a removal instead.

## `/giveaway`

`/giveaway event_id:<id> prize:"whatever" winners:N` — draws N random
winners from the people who actually **attended** a specific event (signed
up and not marked as a no-show). The event has to be closed first, since
that's what finalizes who showed up.

## Just chatting

Mentioning Beau anywhere else is just talking to Beau — Albion questions,
banter, whatever. He doesn't have live access to this guild's current
build roster, prices, or patch notes beyond general knowledge, and he'll
say so instead of making things up.
