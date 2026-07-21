# Session 11 — the mobile pass (2026-07-21)

Vanessa: "we will have to work on the mobile version." Audited every surface
at 375×812 with an in-page overflow probe (iframe sweeps measuring
scrollWidth + offending elements), then fixed by root cause.

## What the audit found

- **Public site: already clean.** Every public page measured exactly 375px —
  the responsive classes from the original build held up. One exception: the
  homepage hero collage (fixed 528px composition at scale .68 = 359px) poked
  ~13px past the edge and made the whole page wiggle sideways.
- **Dashboard + admin: structurally broken.** Both shells rendered the fixed
  230px sidebar BESIDE the content at every width — at 375px the content was
  squeezed/clipped, and every "page overflow" the probe found on /dashboard/new,
  /admin/pets, /admin/rescuers, /admin/ledger traced back to that one layout.
  The forms themselves were already `md:`-responsive.
- Rename stragglers in table headers: "ANIMAL" / "ANIMALS" → "PET" / "PETS".

## The fixes

- **Both shells** (`components/dashboard/Sidebar.tsx`,
  `components/admin/AdminShell.tsx`): the aside is now `hidden md:flex`; on
  phones a sticky top bar takes over — logo, Sign out (+ Admin → link for
  admins), and a horizontally scrollable row of nav pills (the Approvals
  pending badge survives). Page wrappers went `flex-col md:flex-row`; main
  padding tightens to 16px on phones.
- **Tables → wrap-cards on phones.** My Pets, All pets, and Rescuers rows are
  `flex flex-wrap md:grid`: photo + name block + primary chip stay on line
  one, actions get a full-width right-aligned row beneath. Column headers and
  secondary columns (species / rescuer / status / emirate / joined) are
  desktop-only — the phone rows keep exactly what she taps.
- **Hero collage**: scale .62 (fits 375 fully) + `overflow-x-clip` as
  belt-and-braces for 320px devices.

## Verified

Screenshots at 375×812: dashboard My Pets (card rows, all three actions
tappable), /admin/pets (filters wrap, per-pet action row), /admin/ledger
(forms stack full-width — the phone-first brief intent finally true on an
actual phone), homepage scrollWidth back to exactly 375. All 19 routes
re-probed clean after the shell fix.
