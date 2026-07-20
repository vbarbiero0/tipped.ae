# Launch switches — do these when the project goes live for real

Interim wiring exists so everything works before the domain and mailbox are
purchased. **Each item below must be flipped at launch.** Update this list if
you add new interim wiring anywhere.

## 1. When hello@tipped.ae exists (mailbox set up)

- [ ] `lib/brand.ts` → `CONTACT_EMAIL = "hello@tipped.ae"` (one line — every
      contact surface follows: footer address, /contact cards, shop order
      mailto, receipt-card "Pay the clinic directly" mailto, rescuer join CTA,
      login "Email us" / "Forgot it?"). Decide whether
      `RESCUER_CONTACT_EMAIL` also moves or stays personal.
- [ ] Currently ALL of the above route to **vbarbiero0@gmail.com** (Vanessa's
      personal email, interim since 2026-07-20).

## 2. When the tipped.ae domain is purchased and connected

- [ ] Netlify → Domain management → add tipped.ae, follow DNS steps.
- [ ] Netlify env var `NEXT_PUBLIC_SITE_URL` → `https://tipped.ae` + redeploy
      (currently `https://tippedae.netlify.app`).
- [ ] `.env.local` `NEXT_PUBLIC_SITE_URL` likewise.
- [ ] Re-verify OG share previews in WhatsApp against the new domain
      (paste an /adopt/{ref} link into a chat).

## 3. When real rescuers consent and join

- [ ] `rescuers.email` in the database: all four placeholder rows currently
      point to **vbarbiero0@gmail.com** so inquiry buttons reach a real inbox.
      Replace with each real rescuer's own email as they join (they can also
      do it themselves via /dashboard/profile).
- [ ] Same in `lib/seed.ts` (the offline fallback data).
- [ ] `components/Footer.tsx` → `SHOW_RESCUER_CREDITS = true` once the
      credited groups have confirmed (Hard rule 5).
- [ ] Replace/retire the placeholder rescuers (Silvana/Kwagga/Fawaz/Noor) and
      their EXAMPLE PROFILE badges; unlink Vanessa's auth user from Silvana's
      row (it's linked for testing).

## 4. When the shop goes licensed (Phase 2, eTrader)

- [ ] Confirm the Instagram order flow / hosted store per CLAUDE.md's
      Selling model; shop currently points at instagram.com/tipped.ae.

## 5. Housekeeping

- [ ] Vanessa: change the test login password (`TIPPED_LOGIN_PASSWORD` in
      `.env.local`) in Supabase → Authentication.
- [ ] Revoke any outstanding Supabase access tokens and the Netlify CLI
      authorization if no longer wanted (Netlify → User settings →
      Applications).
