import type { Metadata } from "next";
import Link from "next/link";
import { EarPair } from "@/components/Ears";

export const metadata: Metadata = {
  title: "About",
  description:
    "tipped is a platform for the UAE's street cats and dogs. Rescuers list, you adopt or foster, clinics get paid — and the books are public.",
};

// v1 draft in the brand voice — the founder story can slot in when Vanessa
// wants to add it. No fabricated bios.
export default function AboutPage() {
  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-[84px]">
      <div className="eyebrow mb-[14px]">ABOUT</div>
      <h1 className="font-display font-extrabold text-[34px] md:text-[44px] text-cocoa m-0 mb-8 max-w-[640px]">
        Why tipped exists.
      </h1>

      <div className="max-w-[640px] flex flex-col gap-5">
        <p className="font-sans font-medium text-[16px] leading-[1.7] text-cocoa/80 m-0">
          When a street cat is trapped, neutered and returned, the vet gently
          clips the tip of one ear. It&rsquo;s the universal sign that someone
          stepped in — this animal is sterilised, vaccinated and looked after.
          That clipped ear is where our name comes from, and it carries the
          whole idea: the UAE is full of animals somebody already saved. They
          just need a home to go to next.
        </p>
        <p className="font-sans font-medium text-[16px] leading-[1.7] text-cocoa/80 m-0">
          The people doing the saving — rescuers who feed street animals every
          night, cover clinic visits, and know every cat and dog by name —
          mostly work out of Instagram messages and WhatsApp groups. tipped
          brings their pets together in one caring place: lovely profiles that
          share anywhere, honest health tags, and a button that emails the
          rescuer directly.
        </p>
        <p className="font-sans font-medium text-[16px] leading-[1.7] text-cocoa/80 m-0">
          Three simple promises shape everything here. Adoption inquiries go
          to a person, not a system — you write directly to the rescuer. The
          rescuer decides who adopts, the way they always have. And money
          never passes through tipped — when a pet needs a vet, you pay the
          clinic directly, and the receipt is published for everyone. The
          shop is the one place money changes hands, and 100% of its profit
          goes to vet bills,{" "}
          <Link href="/transparency">published weekly</Link>.
        </p>
        <p className="font-sans font-medium text-[16px] leading-[1.7] text-cocoa/80 m-0">
          tipped started in Dubai and covers all seven emirates. Adopters can
          be anywhere in the world — UAE pets travel well, and for years they
          have been welcomed into homes in London, Berlin, Toronto and beyond.
        </p>
      </div>

      <div className="flex justify-start my-10">
        <EarPair earWidth={44} gap={18} />
      </div>

      <div className="flex items-center gap-[14px] flex-wrap">
        <Link
          href="/pets"
          className="bg-cocoa text-cream no-underline font-sans font-bold text-[15px] px-7 py-[15px] rounded-[12px] hover:bg-[#241A14]"
        >
          Find your pet
        </Link>
        <Link
          href="/rescuers"
          className="text-cocoa no-underline font-sans font-bold text-[15px] px-6 py-[15px] rounded-[12px] border-[1.5px] border-cocoa/30 hover:border-cocoa"
        >
          Meet our rescuers
        </Link>
      </div>
    </div>
  );
}
