# Session 15 — rescuers page redesign + the policy-privilege incident (2026-07-22)

Vanessa: implement `Tipped Rescuers Page.dc.html` on /rescuers, "keep the
instagram". Design read via DesignSync from her claude.ai project, and
confirmed byte-identical to the handoff zip she attached mid-flight.

## The redesign (design → live)

Hero: intro left; right, an overlapping avatar cluster (46px rounded squares,
paper borders) + "{total} pets saved · {n} rescuers" — live sums. Cards:
photo cover (their first pet's photo; brand-gradient + ear pair fallback),
64px rounded-square avatar overlapping the cover (avatar_url or monogram),
name, "emirate · N pets saved" (count in link color), blurb, cream chips
(socials + clinics, max 3), "Their pets & wishlist →" + "Email {First}"
outline button (hover fills cocoa). Rescuers with no pets and no saves get
the tip-pink "new rescuer" badge + "just joined" (Jack Gong's card, exactly
as the design anticipated). Dashed invite tile ends the grid; cream trust
note below. InstagramGrid + the join section with the application form kept
below, untouched.

Implementation deltas from the design file (logged per the standing pattern):
live data replaces mock numbers (they happened to match — the design was
mocked from the same seed); invite tile routes to `#join` (the application
form is her own feature; the design's mailto pointed at the retired
hello@tipped.cat); no "vetted" wording ("just joined", plain counts);
EXAMPLE PROFILE chips kept per Hard rule 5. `getRescuers` now selects
`avatar_url`.

## The incident: 0011 broke anon pets reads (~24h, masked)

While verifying, every card cover fell back to the gradient — because
**anon couldn't read pets at all**: `permission denied for table rescuers`.
Root cause: Postgres evaluates every applicable permissive policy;
`animals_own_all` on pets subqueries `rescuers.auth_user_id`, which anon
deliberately lost in 0011's grant lockdown. Cross-table policy references
are privilege-checked against the caller; same-table references are exempt —
which is why rescuers reads kept working and the break hid. It hid further
because `lib/data.ts` falls back to seed on error, and the voice pass had
synced seed with live content. Production served seed pets for ~a day with
no visible difference.

**Fix (migration 0013, applied):** `my_rescuer_id()` SECURITY DEFINER helper;
`animals_own_all` and `stats_owner_read` recreated on top of it. Verified:
anon plain + embedded-join pets reads 200 with live data; phone still 401.

**Rule for this codebase (now bitten twice by grant/policy interplay):**
a policy expression that references ANOTHER table must only do so through a
SECURITY DEFINER helper — never inline subqueries — because the weakest
role's column grants apply to it. And after any grant change, verify with
real anon requests against every table whose policies mention the changed
table, not just the table itself.
