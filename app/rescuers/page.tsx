import type { Metadata } from "next";
import TippedMonogram from "@/components/TippedMonogram";
import { getRescuers } from "@/lib/data";
import { CONTACT_EMAIL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "The rescuers",
  description:
    "The people who feed, fix and rehome the UAE's street cats and dogs. Adoption inquiries go straight to their inboxes.",
};

export default async function RescuersPage() {
  const rescuers = await getRescuers();
  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-[84px]">
      <div className="eyebrow mb-[14px]">THE PEOPLE BEHIND THE ANIMALS</div>
      <h1 className="font-display font-extrabold text-[34px] md:text-[44px] text-cocoa m-0 mb-3">
        The rescuers
      </h1>
      <p className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/75 m-0 mb-10 max-w-[560px]">
        They feed the block, trap-neuter-return, cover clinic runs, and know
        every cat and dog by name. When you email about one, it goes straight to
        them.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {rescuers.map((r) => (
          <div key={r.id} className="bg-white rounded-[20px] shadow-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <TippedMonogram size={56} />
              <div>
                <div className="font-display font-extrabold text-[20px] text-cocoa">
                  {r.name}
                </div>
                <div className="font-sans font-semibold text-[12.5px] text-cocoa/55">
                  {r.emirate} · {r.cats_saved} animals saved
                </div>
              </div>
            </div>
            {r.is_placeholder && (
              <div className="inline-flex font-sans font-bold text-[10px] tracking-[.08em] text-cocoa/45 border border-cocoa/20 rounded-[7px] px-2 py-[3px] mb-3">
                EXAMPLE PROFILE
              </div>
            )}
            {r.blurb && (
              <p className="font-sans font-medium text-[13.5px] leading-[1.6] text-cocoa/75 m-0 mb-4">
                {r.blurb}
              </p>
            )}
            <div className="flex flex-col gap-1 font-sans font-semibold text-[13px]">
              <a href={`mailto:${r.email}`}>{r.email}</a>
              {r.instagram && (
                <a
                  href={`https://instagram.com/${r.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{r.instagram}
                </a>
              )}
              {r.clinics.map((c) =>
                c.url ? (
                  <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer">
                    {c.name}
                  </a>
                ) : (
                  <span key={c.name} className="text-cocoa/55">
                    {c.name}
                  </span>
                )
              )}
            </div>
          </div>
        ))}

        <div className="bg-cream rounded-[20px] p-6 flex flex-col justify-center">
          <div className="font-display font-extrabold text-[20px] text-cocoa mb-2">
            You rescue in the UAE?
          </div>
          <p className="font-sans font-medium text-[14px] leading-[1.6] text-cocoa/75 m-0 mb-4">
            List your cats and dogs here. No fees, no forms between you and
            adopters — inquiries land in your own inbox.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Listing my animals on tipped")}`}
            className="self-start bg-cocoa text-cream no-underline font-sans font-bold text-[14px] px-[22px] py-3 rounded-[10px] hover:bg-[#241A14]"
          >
            Write to us
          </a>
        </div>
      </div>
    </div>
  );
}
