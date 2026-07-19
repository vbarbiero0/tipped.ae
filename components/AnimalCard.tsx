import Link from "next/link";
import AnimalPhoto from "./AnimalPhoto";
import { CardBadges } from "./HealthTags";
import EmailRescuerButton from "./EmailRescuerButton";
import FosterPill from "./FosterPill";
import type { Animal } from "@/lib/types";

export default function AnimalCard({ animal }: { animal: Animal }) {
  const rescuer = animal.rescuer;
  const meta = [animal.sex?.toLowerCase(), animal.age, animal.emirate]
    .filter(Boolean)
    .join(" · ");
  return (
    // Clipping lives on the photo, not the card — the email popover must be
    // free to overflow the card edge.
    <div className="bg-white rounded-[20px] shadow-card">
      <Link
        href={`/adopt/${animal.ref}`}
        className="block h-[240px] no-underline rounded-t-[20px] overflow-hidden"
      >
        <AnimalPhoto animal={animal} />
      </Link>
      <div className="px-5 pt-[18px] pb-5">
        <div className="flex items-center flex-wrap gap-x-[10px] gap-y-[6px] mb-1">
          <Link
            href={`/adopt/${animal.ref}`}
            className="font-display font-extrabold text-[22px] text-cocoa no-underline hover:text-link"
          >
            {animal.name}
          </Link>
          <CardBadges animal={animal} />
          <FosterPill animal={animal} />
        </div>
        <div className="font-sans font-semibold text-[12.5px] text-cocoa/50 mb-[10px]">
          {meta}
        </div>
        <p className="font-sans font-medium text-sm leading-[1.6] text-cocoa/80 m-0 mb-4 line-clamp-3">
          {animal.story}
        </p>
        {rescuer && (
          <div className="flex items-center justify-between gap-[10px]">
            <span className="font-sans font-semibold text-xs text-cocoa/55">
              with {rescuer.name}
              {rescuer.instagram ? ` · @${rescuer.instagram}` : ""}
            </span>
            <EmailRescuerButton animal={animal} rescuer={rescuer} />
          </div>
        )}
      </div>
    </div>
  );
}
