// The seven emirates — the only allowed values for `emirate` fields.
export const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
] as const;

export type Emirate = (typeof EMIRATES)[number];

// Ref prefixes use the full emirate name (Vanessa's call), uppercased with
// hyphens: DUBAI-001, UMM-AL-QUWAIN-001.
export function refPrefix(emirate: Emirate): string {
  return emirate.toUpperCase().replace(/ /g, "-");
}
