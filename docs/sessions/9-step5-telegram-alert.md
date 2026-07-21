# Session 9 — Step 5: Telegram alert on pending submissions (2026-07-21)

Optional-by-design: with `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` set, every
new pending submission pings Vanessa's Telegram (pet name, species, rescuer,
photo, /admin link); without them, silent no-op. Both vars documented in
`.env.example`, set in `.env.local` and Netlify (bot: @Tipped_bot_bot, made
by Vanessa via BotFather; chat id captured from `getUpdates` after she
/start-ed the bot — a background watcher caught it the moment she did).

## Shape

- `lib/telegram.ts` — server-only `sendPendingAlert`: `sendPhoto` when the
  first photo is an absolute URL, else `sendMessage`; errors logged and
  swallowed, never thrown.
- `app/dashboard/new/actions.ts` — `alertPendingSubmission(petId)` server
  action: re-reads the pet through the **service client** so a forged call
  can't inject message text; sends only when `approval_status='pending'` and
  the row is under 10 minutes old (replay guard). Always resolves.
- The add-a-pet form fires it after a successful insert, wrapped in a
  1.5-second `Promise.race` with all errors swallowed — the brief's hard
  rule: a notification failure must never block the submission.

## Boundaries (logged, deliberate)

- Alerts fire only through the dashboard form — a REST/service insert
  bypasses them (acceptable: the form is the only submission surface).
- Trusted-rescuer submissions auto-approve and correctly do NOT alert; the
  queue is for pending only.
- Edits never alert (edits don't reset approval status).
- Live test sent and delivered (photo + caption + admin link) against the
  real bot and chat id. The in-app path itself needs the next pending
  submission from a review-level rescuer to prove in production.
- The bot token transited chat — rotation reminder added to LAUNCH-SWITCHES
  (BotFather `/revoke` before launch).
