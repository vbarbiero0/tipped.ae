# Session 10 — rescuer applications + Telegram (2026-07-21)

Vanessa: "Can it notify me on new rescuer submissions?" It can now — but the
notification needed a submission to exist first: joining was a bare `mailto:`
with no trace in the system. So the /rescuers#join box became a real
application flow.

## Shape

- **`rescuer_applications`** (migration 0008, applied): name, email, emirate,
  instagram, note, `handled_at`. No anon policies — inserts go through the
  server action with the service key (shop_signups pattern), admins read and
  update via RLS.
- **`JoinForm`** on /rescuers#join: name, email, emirate, IG, a-few-words
  note, honeypot field (bots get a fake success and nothing is stored).
  Success state promises a same-day reply. The mailto survives as a fallback
  link; the tagline moved from "One email" to "One message".
- **`applyAsRescuer`** server action: caps every field, validates email
  shape, inserts, then fires the Telegram alert through the generalized
  `sendAlert` (lib/telegram.ts now exposes `sendAlert(text, photo?)` +
  `siteUrl()`; `sendPendingAlert` is a thin wrapper). Fire-and-forget — an
  alert failure never fails the application.
- **Admin**: /admin/rescuers shows "APPLICATIONS · N" above the invite form —
  each row has the note, date, **Invite →** (prefills the invite form with
  name/suggested username/email/emirate) and **Dismiss** (`handled_at`).

## Telegram message

    🙋 New rescuer application
    <name> — <emirate>
    <email> · @<instagram>
    "<note>"
    Review: <site>/admin/rescuers

## Verified

End-to-end on production (deploy `74c116f`): filled the live form on
/rescuers as "E2E Verify" → success state rendered, row landed in
`rescuer_applications`, and the 🙋 Telegram alert delivered to Vanessa's
chat. Test row marked handled afterwards so the admin list starts clean —
the Telegram message stays as proof.

Also clarified for Vanessa: the bot token is one-time server config — she
never needs tokens for notifications to arrive; `sbp_` tokens are only for
agent DDL and unrelated.
