import TippedLogo from "./TippedLogo";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/brand";

// Hard rule 5: real rescuers appear only with their consent. Flip this to true
// once the credited groups have confirmed — the list is already wired up.
const SHOW_RESCUER_CREDITS = false;

const rescuerCredits = [
  "Dubai Street Kitties",
  "@straycatdubai",
  "@kevinofdxb",
  "Save Dubai Stray Cats",
  "@straycatsdxb",
  "@furrballs_cats",
  "Nine Lives",
  "Meow Meow Rescue",
  "Bin Kitty Collective",
  "@bubbles.petsrescue",
];

export default function Footer() {
  return (
    <footer className="bg-cocoa">
      <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-16 pb-12 grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-14">
        <div>
          <div className="mb-[14px]">
            <TippedLogo size={30} inverted />
          </div>
          <p className="font-sans font-medium text-sm leading-relaxed text-cream/60 m-0 mb-[18px] max-w-[340px]">
            For the cats and dogs of the UAE&rsquo;s streets. Rescuers list, you
            adopt, clinics get paid.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-sans font-bold text-sm text-cream no-underline hover:text-sunset"
            >
              {CONTACT_EMAIL}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans font-bold text-sm text-cream no-underline hover:text-sunset"
            >
              @{INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
        <div>
          <div className="font-sans font-bold text-xs tracking-[.14em] text-cream/45 mb-[14px]">
            BUILT WITH THE UAE&rsquo;S RESCUE COMMUNITY
          </div>
          {SHOW_RESCUER_CREDITS ? (
            <div className="flex flex-wrap gap-x-[18px] gap-y-2 font-sans font-semibold text-[13px]">
              {rescuerCredits.map((name) => (
                <span key={name} className="text-cream/75">
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="font-sans font-medium text-[13px] leading-relaxed text-cream/60 m-0 max-w-[380px]">
              Rescuer credits go up here as each group confirms. If you rescue in
              the UAE and want in, write to us.
            </p>
          )}
          <div className="font-sans font-semibold text-xs text-cream/35 mt-6">
            United Arab Emirates · every animal here is sterilised, vaccinated and known by name
          </div>
        </div>
      </div>
    </footer>
  );
}
