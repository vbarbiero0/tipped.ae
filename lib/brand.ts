// Hard rule 3: the ears never recolor. These constants are the only place
// the ear colors live — SVG fills can't read Tailwind tokens.
export const EAR_SUNSET = "#F0955B";
export const EAR_PINK = "#F58B93";
export const COCOA = "#3A2A22";
export const CREAM = "#FFF3E4";

export const TAGLINE = "The streets raised them. You take it from here.";
export const MARK_TAGLINE = "Every tipped ear is a cat someone saved.";
// Domain decision (2026-07-19): tipped.ae. Instagram handle @tipped.ae (secured).
export const CONTACT_EMAIL = "hello@tipped.ae";
export const INSTAGRAM_HANDLE = "tipped.ae";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

export const STATUS_LINE: Record<string, string> = {
  available: "looking for a home",
  pending: "adoption pending",
  adopted: "adopted",
};
