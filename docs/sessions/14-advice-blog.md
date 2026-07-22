# Session 14 — the Tips & Advice blog (2026-07-22)

Autonomous brief: build `/advice` (MDX blog, no DB), write 6 launch posts,
generate branded SVG covers, wire nav, update CLAUDE.md. Lint + build green;
verified locally (routes, filter, OG, cover-vs-route shadow) before shipping.

## Built

- `lib/advice.ts` — fs loader over `content/advice/*.mdx` (gray-matter
  frontmatter; slug = filename; related = same-category first).
- `/advice` — warm intro + `AdviceGrid` client filter (only categories with
  posts render as buttons, so no filter ever lands on an empty grid — with 6
  posts, "Adopting & travel" stays hidden until its first post exists).
- `/advice/[slug]` — cover, category tag, title, date, MDX body styled to
  the type scale via component overrides (no global CSS), "Keep reading"
  related row, italic-adjacent closing line inviting readers to /pets.
  `generateStaticParams` prerenders all posts.
- OG: `opengraph-image.tsx` renders a branded PNG per post (paper/cream
  card, ear pair, category, title). Deliberate call: the SVG covers are
  on-page only — WhatsApp/Telegram don't render SVG og:images, and WhatsApp
  sharing is the distribution model.
- Covers: one Python generator emitted 6 consistent SVGs into
  `public/advice/` — brand tokens, rounded squares, ear-pair anchor, per-post
  glyph (drop, sun, paw, car, moon; TNR post gets the big ear pair). No
  stock photos.
- Nav: header dropdown row (new HeartIcon in Sunset/Tip-pink), desktop bar
  "Advice" link at lg+, footer quiet link. Mobile reaches it via the
  dropdown, which renders on all sizes.
- Deps: `next-mdx-remote@6` + `gray-matter` (first content deps in the
  project).

## The six posts

Summer-weighted for a July launch, dated Jun 26 → Jul 19: community cats
through a UAE summer (ceramic-not-metal, deep bowls, morning refresh, shade
that stays shade, dawn/dusk feeding, wet food spoils in an hour at 45°C,
airflow-not-insulation shelters) · heatstroke signs and first steps · hot
pavement and the 7-second back-of-hand test (balcony tiles count) · cats
under cars (bonnet knock, AC condensation isn't safe water) · UAE winter
nights (shelters that don't become heat traps in summer) · the ear-tip and
TNR (the brand-story post, linking the name to the mark).

All in the warm voice; safety content follows the "know the danger signs"
pattern; every medical thread ends at "get to a vet now" — no dosages, no
protocols. Each closes with an italic line carrying one gentle action.

## Judgment calls

- The brief's "approved reference post" doesn't exist anywhere in the repo —
  used the brief's own structural description as the reference and noted it
  in CLAUDE.md.
- Heatstroke + pavement filed under Dogs, cars + TNR under Cats, summer +
  winter community pieces under Community care; category buttons are
  data-driven so the empty "Adopting & travel" bucket simply doesn't show.
- Route-shadow landmine checked explicitly: `/advice/why-clipped-ear-tnr.svg`
  serves as image/svg+xml while `/advice/why-clipped-ear-tnr` serves the
  page — no redirects touch `/advice`, filesystem wins.
