# Handoff: tipped — brand identity

## Overview
Brand identity for **tipped**, a platform for Dubai's street cats: rescuers list cats with stories and photos, adopters anywhere email rescuers directly, and helping with a cat's vet bill means paying the vet clinic directly (never the platform). The site also sells products whose purchases pay real vet bills.

The name and mark reference the **ear-tip**: the clipped ear that marks a rescued/TNR'd street cat. In every brand application, the clipped ear is the point of color/interruption.

## About the Design Files
The file in this bundle (`Tipped Logo Explorations.dc.html`) is a **design reference created in HTML** — an exploration canvas, not production code. Recreate the locked identity in your target codebase's environment (React, Vue, native, etc.) using its established patterns; if no environment exists yet, choose the most appropriate framework and implement there. Do not ship the HTML directly.

## Fidelity
**High-fidelity** for the locked identity (section 5a in the canvas): exact colors, typography, and geometry below. Earlier sections (turns 1–4, 6) are rejected/superseded explorations kept for provenance.

## The locked identity (canvas section 5a)

### Primary lockup
- Wordmark: `tipped`, all lowercase, **Nunito ExtraBold (800)**, letter-spacing normal, color Cocoa `#3A2A22` on Cream `#FFF3E4`.
- Two cat ears sit **centered on the second p** (the 4th character), bases touching the p's bowl (x-height line).
- Left ear = plain triangle, **Sunset `#F0955B`**, rotated −12°.
- Right ear = **tipped** (top cut off), **Tip pink `#F58B93`**, rotated +12°.
- Ears never recolor: orange plain, pink tipped, always — including on dark surfaces.

### Ear geometry (SVG, viewBox `0 0 36 52`)
Rounded corners come from a thick stroke with round joins, matching Nunito's rounded terminals:
- Plain ear: `<path d="M8,44 L18,12 L28,44 Z" fill="#F0955B" stroke="#F0955B" stroke-width="9" stroke-linejoin="round"/>`
- Tipped ear: `<path d="M8,44 L12,24 L24,20 L28,44 Z" fill="#F58B93" stroke="#F58B93" stroke-width="9" stroke-linejoin="round"/>`

### Proportions (relative to wordmark font-size F)
- Rendered ear width ≈ `0.33 × F` (each), height keeps the 36:52 aspect.
- Gap between ears ≈ `0.07 × F`.
- Vertical: ear pair's top ≈ `0.21 × F` **above** the ascender line (in the HTML: absolutely positioned `top: -0.21em` relative to a wrapper span around the second p; pair centered with `left:50%; translateX(-50%)`).
- Example at F=84px: ears 28×40px, gap 6px, top −17px.

### Monogram / avatar / favicon
A **head silhouette wearing the brand ears** (same colors, never recolored) on a Cocoa circle (avatar) or Cocoa rounded square, ~27% radius (favicon). Cream head, Cocoa eyes; left ear filled Sunset with curved edges (matching the logo’s rounded ears), right ear fully Tip pink with the flat tipped cut.\n\nSVG (viewBox `0 0 120 110`, one cream head path with both ears; colored ear fills drawn on top):\n```svg\n<svg viewBox="0 0 120 110"><path d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 C57,30 63,30 68,32 L74,18 L86,14 L92,52 C96,60 96,70 92,78 C84,96 36,96 28,78 C24,70 24,60 28,52 Z" fill="#FFF3E4"/><path d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 Z" fill="#F0955B"/><path d="M68,32 L74,18 L86,14 L92,52 Z" fill="#F58B93"/><circle cx="46" cy="64" r="5" fill="#3A2A22"/><circle cx="74" cy="64" r="5" fill="#3A2A22"/></svg>\n```\nScales: 96px circle / 60px-wide mark; 56px / 37px; 30px square / 19px.

### Inverted lockup
Same lockup with Cream `#FFF3E4` type on Cocoa `#3A2A22`; ears unchanged.

## Design Tokens
Colors:
- **Cream** `#FFF3E4` — backgrounds
- **Cocoa** `#3A2A22` — type, dark surfaces
- **Sunset** `#F0955B` — the plain ear, accents
- **Tip pink** `#F58B93` — the tipped ear, highlights
- Canvas/off-white surfaces used in the board: `#FBF7F0`, `#FAF7F2`

Typography:
- Display: **Nunito 800** (Google Fonts, variable 400–900 loaded)
- Text/UI: **Quicksand 500–600** (Google Fonts)
- Sample display line: "Every street cat deserves a name."

Radii/shape language: rounded — circles for avatars, ~27% radius favicon tile, thick round-joined strokes.

## Voice
Honest and direct about street life; no sob stories. Trust message ("you pay the vet clinic, not us") explained plainly where relevant, not shouted. Example body copy: "Rescuers across Dubai list their cats here. You adopt by talking to the rescuer directly — and when a cat needs care, you pay the vet clinic, not us."

## UI patterns (from the homepage)
- Page background Paper #FBF7F0; cards white, radius 18–20px, shadow 0 1px 3px rgba(58,42,34,.08).
- Buttons: pill (999px). Primary = Cocoa fill, Cream text; secondary = 1.5px rgba(58,42,34,.3) outline; on dark = Sunset fill, Cocoa text.
- Links #B5643A, hover #8F4C2B. Eyebrow labels: Quicksand 700, 12.5px, .16em tracking, #B5643A.
- "ear-tipped" badge: tipped-ear SVG + text, #C4525C on rgba(245,139,147,.16), pill.
- Numbers/receipts in ui-monospace (AED amounts, bill numbers); receipt card = off-white #FFFDF8, dashed dividers, slight rotate(-1deg); progress bar Sunset on Cream.
- Dark sections use Cocoa bg, Cream type at 60–75% for body.
- Type scale: H1 54/1.08, H2 34, card title 22, body 14–17/1.6+, meta 12–12.5 at 50–60% opacity.
- Max two background colors per page (Paper/Cream + Cocoa).

## Interactions & Behavior
Identity + homepage designed. Cat profile, shop page, rescuer profile not designed yet.
Shop framing: purchases buy rescuer needs (food, medicine, supplies) and help pay vet bills — NOT pinned to a specific cat's bill.
Vet bills: paid to the clinic directly, platform never holds money, receipts public.

## State Management
N/A (static identity).

## Assets
No raster assets. Ears/monogram are inline SVG (paths above). Fonts from Google Fonts: Nunito, Quicksand (plus exploration-only families: Baloo 2, Fredoka, Varela Round, Comfortaa, Grandstander, Outfit, Space Grotesk, Bree Serif, Shantell Sans, Quicksand).

## Files
- `Tipped Logo Explorations.dc.html` — exploration canvas. **Section 5a (turn 5) is the locked identity**; turn 6 = font alternatives (6b Nunito chosen), turn 4 = ear-placement comparison (4b chosen), turns 1–3 = earlier directions (rejected).
