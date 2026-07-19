# Session 2 — Cats & dogs (2026-07-18)

Vanessa: "I think this needs to be for both cats and dogs." Extended the whole stack to two species.

## What changed

- **Types/data:** `Cat` → `Animal` with `species: 'cat' | 'dog'`; `getCats/getCat` → `getAnimals/getAnimal` reading an `animals` table; `bills_paid.cat_ref` → `animal_ref`. Migration 0001 rewritten in place (never applied, so no rename migration needed).
- **Routes:** `/cats` + `/cats/[ref]` moved to `/adopt` + `/adopt/[ref]` with 301 redirects. **Gotcha caught:** Next redirects run before `public/` files, so `/cats/:ref` would have swallowed `public/cats/*.jpg` — photos moved to `public/animals/`.
- **Components:** `CatCard`/`CatPhoto` → `AnimalCard`/`AnimalPhoto`; new `VettedBadge` (cats → ear-tipped badge, dogs → paw + "fixed & vetted", never "ear-tipped" on a dog); new `DogHead` mark in `TippedMonogram.tsx` (floppy Sunset/Tip-pink ears, same language) used for dog photo fallbacks and the dog OG card. The brand mark itself stays the cat head.
- **Filters:** `/adopt` grid now filters species (All/Cats/Dogs) + status + area.
- **Seed:** placeholder dog-rescuer Noor (Al Warqa) + two dogs in voice — Chapati (DXB-004, saluki mix) and Simsim (DXB-005, construction-site dog). Homepage features 2 cats + 1 dog.
- **Copy sweep:** every "cats"-only surface updated (header pill "Meet the animals", hero, how-it-works, rescuers, transparency, shop tag description, dashboard, 404, metadata, sitemap). The "why the tipped ear?" explainer gained the honest dog line: microchip + collar tag, same promise.

## Verified

- `next build` clean; `/adopt`, dog profile (DXB-005), homepage mix, and both redirects checked in the browser. Badge wrap bug found on dog cards and fixed (`whitespace-nowrap`).

## Addendum — email popover (same day)

"Email {Rescuer}" buttons now open a small popover instead of firing `mailto:` directly: a Cocoa "Open your email app" pill (the same pre-filled mailto), the rescuer's address in plain text with a Copy button, and the "no forms, nothing stored" caption. Built for desktop visitors with no default mail app — Hard rule 2 intact (still direct email, no forms, nothing stored). `EmailRescuerButton` became a client component (outside-click + Escape close). `AnimalCard` moved its `overflow-hidden` from the card root to the photo container so the popover isn't clipped at the card edge.

## Addendum — adopt & foster (same day)

Nav now reads "Adopt & foster", backed by the real feature:
- `animals` gains `for_adoption` / `for_foster` (what the rescuer is open to — any combination) and `in_foster` (orthogonal to `status`: a fostered animal is usually still looking for a forever home). Migration 0001 updated in place.
- The email popover forks by intent: "Ask about adopting" / "Ask about fostering" pills, each with its own pre-filled template (`fosterMailto` in `lib/mailto.ts` — asks where in the UAE, how long, home setup, vet runs). Foster-only animals get a "Foster {name}" button. Caption notes fostering is UAE-local.
- `FosterPill` (quiet Cream): "open to fostering" / "in a foster home" on cards + profiles. Card badge row now wraps instead of overflowing. *(Update, session 3: the "open to fostering" pill was cut — availability is carried by the popover, the Foster filter, and the "Foster {name}" button. Only "in a foster home" remains as a pill.)*
- `/adopt` grid gained an Adopt/Foster intent filter; `/adopt?intent=foster` deep-links to it (homepage line: "Can't adopt? Foster. Two weeks of your sofa changes everything.").
- Seed demo states: Karak/Chapati adopt-only, Batata adopt-or-foster, Simsim foster-only, Mango in a foster home.

Still pending discussion → build: areas as the 7 emirates (+ UAE-wide copy, ref prefixes) and the health-tag system (sterilised / vaccinated / microchipped / tested / conditions).

## Open

- Domain: `.cat` now reads cat-only — `tipped.ae` probably the better candidate; `CONTACT_EMAIL` in `lib/brand.ts` is the single switch point.
- Instagram handle TODO unchanged.
- First commit still pending approval (covers sessions 1 + 2).
