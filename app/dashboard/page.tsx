import type { Metadata } from "next";
import TippedMonogram from "@/components/TippedMonogram";
import { CONTACT_EMAIL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Rescuer dashboard",
  robots: { index: false },
};

// The self-serve dashboard ships with rescuer accounts (needs the Supabase
// project + auth). Until then, listings are managed for rescuers by hand.
export default function DashboardPage() {
  return (
    <div className="max-w-[560px] mx-auto px-6 pt-20 pb-28 text-center">
      <div className="flex justify-center mb-6">
        <TippedMonogram size={72} />
      </div>
      <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0 mb-3">
        The dashboard is coming.
      </h1>
      <p className="font-sans font-medium text-[15px] leading-[1.65] text-cocoa/75 m-0 mb-6">
        Rescuer accounts — add your cats and dogs, update statuses, all from
        your phone — ship next. Until then, we do it for you: email photos and a
        few lines in your own words, and your animal is up the same day.
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Add my animal to tipped")}`}
        className="inline-block bg-cocoa text-cream no-underline font-sans font-bold text-[14px] px-6 py-3 rounded-[10px] hover:bg-[#241A14]"
      >
        Email {CONTACT_EMAIL}
      </a>
    </div>
  );
}
