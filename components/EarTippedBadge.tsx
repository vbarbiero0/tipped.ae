import { TippedEar } from "./Ears";

// Marks every fixed cat — appears on every cat card.
export default function EarTippedBadge() {
  return (
    <span className="inline-flex items-center gap-[5px] bg-tip-pink/[.16] text-badge-text font-sans font-bold text-[11px] px-[10px] py-1 rounded-[7px]">
      <TippedEar width={9} />
      ear-tipped
    </span>
  );
}
