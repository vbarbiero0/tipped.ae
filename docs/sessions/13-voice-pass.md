# Session 13 — the warm-voice pass (2026-07-22)

Vanessa changed the brand voice: **warm, sincere, simple** (reference:
spca.com) — invite, don't perform; gratitude welcome; no cleverness, irony,
punchy fragments or copywriter attitude. She supplied the new rule + rewritten
homepage copy + warm seed stories by pasting a full CLAUDE.md.

## The catch: her paste was built on a pre-July-19 copy

It would have silently reverted four of her own later decisions. NOT applied,
flagged in chat, and recorded in CLAUDE.md's voice-pass note:
1. Domain → `hello@tipped.cat` (stays **tipped.ae** + interim Gmail routing)
2. Shape language → pills/circles (stays **rounded squares only**; she also
   said "layout unchanged")
3. Shop framing → food/medicine/supplies (stays **100% of profit to vet
   bills, updated weekly**)
4. Footer "vetted by the rescuer" (**"vetted" is banned** by her own rule —
   reworded without it)

## What changed (copy only, zero layout)

- `lib/brand.ts`: TAGLINE → "Help a rescued animal find their home.";
  MARK_TAGLINE → "Every tipped ear is an animal someone saved."
- Homepage: eyebrow RESCUED ACROSS THE UAE, new hero subcopy, "Meet the
  pets" / "How adoption works" buttons, "Waiting for a home", warm 3 steps,
  vet-bill section "Every contribution helps rescuers do more.", shop "The
  shop gives back".
- /pets, /adopted (grammar-safe singular), /rescuers (+ join pitch),
  /how-it-works (steps + tags intro), /contact + both form success/error
  states, /shop, /about, /transparency intro, 404, header dropdown, footer
  tagline lines, pet profile ("the person who knows {name} best"),
  email templates in lib/mailto.ts, CONDITION_NOTES in lib/health.ts
  (titles "About FIV/FeLV/heartworm"; facts kept, wisecracks removed),
  admin ledger's "Weekly, remember." line.
- **Seed data**: her three cat stories verbatim; Loomi/Chapati/Simsim and
  all four rescuer blurbs rewritten in the same register — in `lib/seed.ts`,
  `supabase/seed.sql`, **and the live DB rows** (6 pets + 4 rescuers;
  Vanessa's own row still carried the old Silvana blurb — replaced with a
  true-to-her warm one).
- CLAUDE.md: rule 4 replaced (dated, supersession noted), taglines + seed
  section updated, voice-pass note records the four kept decisions.

Functional labels (status pills, health tag names, buttons like "Sign out")
untouched. Layout, classes and structure untouched throughout.
