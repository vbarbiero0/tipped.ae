import type { Animal } from "@/lib/types";

// Quiet Cream pill — a fostering fact is a neutral state, not an alert.
// Only the current state gets a pill; foster *availability* is carried by the
// email popover, the Foster filter, and the "Foster {name}" button instead.
export default function FosterPill({ animal }: { animal: Animal }) {
  if (!animal.in_foster) return null;
  const label = "in a foster home";
  return (
    <span className="inline-flex items-center bg-cream text-cocoa/70 font-sans font-bold text-[11px] px-[10px] py-1 rounded-[7px] whitespace-nowrap">
      {label}
    </span>
  );
}
