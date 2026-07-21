import Link from "next/link";
import TippedMonogram from "@/components/TippedMonogram";

export default function NotFound() {
  return (
    <div className="max-w-[560px] mx-auto px-6 pt-20 pb-28 text-center">
      <div className="flex justify-center mb-6">
        <TippedMonogram size={72} />
      </div>
      <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0 mb-3">
        Nothing here.
      </h1>
      <p className="font-sans font-medium text-[15px] leading-[1.65] text-cocoa/75 m-0 mb-6">
        This page wandered off — cats do that. The ones looking for a home are
        this way.
      </p>
      <Link
        href="/pets"
        className="inline-block bg-cocoa text-cream no-underline font-sans font-bold text-[14px] px-6 py-3 rounded-[10px] hover:bg-[#241A14]"
      >
        Browse the cats &amp; dogs
      </Link>
    </div>
  );
}
