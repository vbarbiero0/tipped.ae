import type { Metadata } from "next";
import TippedMonogram from "@/components/TippedMonogram";
import { getRescuers } from "@/lib/data";
import { CONTACT_EMAIL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "The rescuers",
  description:
    "The people who feed, fix and rehome the UAE's street cats and dogs. Adoption inquiries go straight to their inboxes — and listing is free for rescuers, always.",
};

const joinMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Listing my animals on tipped"
)}&body=${encodeURIComponent(
  [
    "Hi — I rescue in the UAE and want to list my animals.",
    "",
    "My name:",
    "Group or independent:",
    "Emirate:",
    "Instagram (if any):",
    "How many animals right now:",
    "",
    "We'll take it from there.",
  ].join("\n")
)}`;

export default async function RescuersPage() {
  const rescuers = await getRescuers();
  return (
    <>
      <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-[84px]">
        <div className="eyebrow mb-[14px]">THE PEOPLE BEHIND THE ANIMALS</div>
        <h1 className="font-display font-extrabold text-[34px] md:text-[44px] text-cocoa m-0 mb-3">
          The rescuers
        </h1>
        <p className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/75 m-0 mb-10 max-w-[560px]">
          They feed the block, trap-neuter-return, cover clinic runs, and know
          every cat and dog by name. When you email about one, it goes straight
          to them.
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
        </div>
      </div>

      {/* Join — the recruiting pitch, full-width above the footer */}
      <section id="join" className="bg-cream">
        <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-16 md:py-[84px]">
          <div className="eyebrow mb-[14px]">FOR RESCUERS</div>
          <h2 className="font-display font-extrabold text-[30px] md:text-[40px] leading-[1.12] text-cocoa m-0 mb-4 max-w-[640px] [text-wrap:pretty]">
            You feed them. Let&rsquo;s home them.
          </h2>
          <p className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/75 m-0 mb-10 max-w-[560px]">
            tipped is free for rescuers, always. You write the listing in your
            own words, and you decide who adopts. We just make sure the right
            people see it.
          </p>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-12">
            <div>
              <div className="font-display font-extrabold text-[19px] text-cocoa mb-2">
                Reach past your followers
              </div>
              <p className="font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/75 m-0">
                Every animal gets a clean profile that shares beautifully to
                WhatsApp and Instagram — so an adopter in London sees your cat
                the way you see her.
              </p>
            </div>
            <div>
              <div className="font-display font-extrabold text-[19px] text-cocoa mb-2">
                Your inbox, your call
              </div>
              <p className="font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/75 m-0">
                No forms, no middlemen, no committee. Inquiries land in your own
                email, and you vet adopters exactly the way you do now.
              </p>
            </div>
            <div>
              <div className="font-display font-extrabold text-[19px] text-cocoa mb-2">
                Help with the bills
              </div>
              <p className="font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/75 m-0">
                Post a vet bill and supporters pay your clinic directly — we
                never touch the money. And 100% of the shop&rsquo;s profit goes
                at the open bills, updated weekly in public.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <a
              href={joinMailto}
              className="bg-cocoa text-cream no-underline font-sans font-bold text-[15px] px-7 py-[15px] rounded-[12px] hover:bg-[#241A14]"
            >
              List your animals
            </a>
            <span className="font-sans font-semibold text-[13.5px] text-cocoa/55">
              One email. Your first animal can be up the same day.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
