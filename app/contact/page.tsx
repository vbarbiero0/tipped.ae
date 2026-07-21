import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Say hello — adopting, fostering, listing your pets, shop orders, anything. hello@tipped.ae or @tipped.ae on Instagram.",
};

export default function ContactPage() {
  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-[84px]">
      <div className="eyebrow mb-[14px]">CONTACT</div>
      <h1 className="font-display font-extrabold text-[34px] md:text-[44px] text-cocoa m-0 mb-4">
        Say hello.
      </h1>
      <p className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/75 m-0 mb-10 max-w-[560px]">
        Adopting, fostering, listing your pets, shop orders, a question
        about the books — it all lands in the same inbox, and a person reads
        it. No forms here either.
      </p>

      <div className="flex flex-col gap-4 max-w-[560px]">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="bg-white rounded-[18px] shadow-card px-6 py-5 no-underline hover:shadow-[0_4px_14px_rgba(58,42,34,.12)] transition-shadow"
        >
          <div className="font-sans font-bold text-[12px] tracking-[.1em] text-cocoa/45 mb-1">
            EMAIL
          </div>
          <div className="font-display font-extrabold text-[20px] text-cocoa">
            {CONTACT_EMAIL}
          </div>
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-[18px] shadow-card px-6 py-5 no-underline hover:shadow-[0_4px_14px_rgba(58,42,34,.12)] transition-shadow"
        >
          <div className="font-sans font-bold text-[12px] tracking-[.1em] text-cocoa/45 mb-1">
            INSTAGRAM
          </div>
          <div className="font-display font-extrabold text-[20px] text-cocoa">
            @{INSTAGRAM_HANDLE}
          </div>
        </a>
      </div>

      <p className="font-sans font-medium text-[14px] leading-[1.6] text-cocoa/60 m-0 mt-10 max-w-[560px]">
        Writing about a specific cat or dog? Use the email button on{" "}
        <Link href="/pets">their profile</Link> instead — it goes straight to
        their rescuer, not to us. And if you rescue in the UAE,{" "}
        <Link href="/rescuers#join">here&rsquo;s how to list your pets</Link>.
      </p>
    </div>
  );
}
