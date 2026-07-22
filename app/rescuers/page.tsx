import type { Metadata } from "next";
import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import TippedMonogram, { MonogramHead } from "@/components/TippedMonogram";
import InstagramGrid from "@/components/InstagramGrid";
import JoinForm from "@/components/JoinForm";
import { EarPair } from "@/components/Ears";
import { getPets, getRescuers } from "@/lib/data";
import { RESCUER_CONTACT_EMAIL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "The rescuers",
  description:
    "The people who feed, fix and rehome the UAE's street cats and dogs. Adoption inquiries go straight to their inboxes — and listing is free for rescuers, always.",
};

const joinMailto = `mailto:${RESCUER_CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Listing my pets on tipped"
)}&body=${encodeURIComponent(
  [
    "Hi — I rescue in the UAE and want to list my pets.",
    "",
    "My name:",
    "Group or independent:",
    "Emirate:",
    "Instagram (if any):",
    "How many pets right now:",
    "",
    "We'll take it from there.",
  ].join("\n")
)}`;

export default async function RescuersPage() {
  const [rescuers, pets] = await Promise.all([getRescuers(), getPets()]);
  const petsByRescuer = new Map<string, typeof pets>();
  for (const p of pets) {
    if (!p.rescuer?.id) continue;
    petsByRescuer.set(p.rescuer.id, [...(petsByRescuer.get(p.rescuer.id) ?? []), p]);
  }
  const totalSaved = rescuers.reduce((n, r) => n + (r.pets_saved ?? 0), 0);
  return (
    <>
      <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-[84px]">
        {/* Hero per the design: intro left, avatar cluster + counts right */}
        <div className="flex items-end justify-between gap-10 flex-wrap mb-10">
          <div className="max-w-[640px]">
            <div className="eyebrow mb-[14px]">THE PEOPLE BEHIND THE PETS</div>
            <h1 className="font-display font-extrabold text-[40px] md:text-[64px] leading-[1.02] tracking-[-0.015em] text-cocoa m-0 mb-[22px]">
              The rescuers
            </h1>
            <p className="font-sans font-medium text-[17px] leading-[1.65] text-cocoa/75 m-0 [text-wrap:pretty]">
              Across the Emirates, rescuers feed, sterilise and care for street
              animals — often out of their own pockets. Every pet on tipped is
              listed by one of them, and when you email about a pet, your
              message goes straight to the person who knows them best.
            </p>
          </div>
          <div className="flex flex-col gap-3 items-start pb-[6px]">
            <div className="flex">
              {rescuers.slice(0, 5).map((r, i) => (
                <div
                  key={r.id}
                  className={`w-[46px] h-[46px] rounded-[13px] border-[3px] border-paper overflow-hidden bg-cocoa flex items-center justify-center ${i > 0 ? "-ml-3" : ""}`}
                >
                  {r.avatar_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={r.avatar_url} alt={r.name} className="w-full h-full object-cover" />
                  ) : (
                    <MonogramHead width={28} />
                  )}
                </div>
              ))}
            </div>
            <div className="font-sans font-semibold text-[13.5px] text-cocoa/60">
              <span className="font-display font-extrabold text-[16px] text-cocoa">
                {totalSaved} pets saved
              </span>{" "}
              · {rescuers.length} rescuers
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rescuers.map((r) => {
            const theirPets = petsByRescuer.get(r.id) ?? [];
            const cover = theirPets.find((p) => p.photos.length > 0)?.photos[0];
            const isNew = theirPets.length === 0 && (r.pets_saved ?? 0) === 0;
            const chips = [
              ...(r.socials ?? []).map((x) => x.handle && (x.platform === "instagram" || x.platform === "tiktok" ? `@${x.handle.replace(/^@/, "")}` : x.handle)),
              ...r.clinics.map((c) => c.name),
            ]
              .filter(Boolean)
              .slice(0, 3) as string[];
            return (
              <div key={r.id} className="bg-white rounded-[18px] shadow-card overflow-hidden flex flex-col">
                <div className="h-[168px] bg-gradient-to-br from-cream to-sunset/25 flex items-center justify-center">
                  {cover ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={cover} alt={`${r.name}'s rescues`} className="w-full h-full object-cover" />
                  ) : (
                    <EarPair earWidth={38} gap={12} />
                  )}
                </div>
                <div className="px-[22px] pb-5 flex flex-col flex-1">
                  <div className="w-16 h-16 rounded-[17px] overflow-hidden -mt-7 border-[3px] border-white bg-cocoa flex items-center justify-center shrink-0">
                    {r.avatar_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={r.avatar_url} alt={r.name} className="w-full h-full object-cover" />
                    ) : (
                      <MonogramHead width={38} />
                    )}
                  </div>
                  <div className="flex items-center gap-[10px] mt-[10px] flex-wrap">
                    <span className="font-display font-extrabold text-[21px] text-cocoa">{r.name}</span>
                    {isNew && (
                      <span className="bg-tip-pink/[.16] text-badge-text font-sans font-bold text-[11px] px-[10px] py-1 rounded-[7px]">
                        new rescuer
                      </span>
                    )}
                  </div>
                  <div className="font-sans font-semibold text-[12.5px] text-cocoa/55 mt-[2px]">
                    {r.emirate} ·{" "}
                    {isNew ? (
                      "just joined"
                    ) : (
                      <span className="text-link font-bold">{r.pets_saved} pets saved</span>
                    )}
                  </div>
                  {r.is_placeholder && (
                    <div className="self-start font-sans font-bold text-[10px] tracking-[.08em] text-cocoa/45 border border-cocoa/20 rounded-[7px] px-2 py-[3px] mt-2">
                      EXAMPLE PROFILE
                    </div>
                  )}
                  <p className="font-sans font-medium text-[14px] leading-[1.6] text-cocoa/[.78] m-0 mt-3 mb-4">
                    {r.blurb ?? "Listings coming soon."}
                  </p>
                  {chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-[14px]">
                      {chips.map((c) => (
                        <span key={c} className="bg-cream text-cocoa font-sans font-bold text-[12px] px-3 py-[6px] rounded-[8px]">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-[10px]">
                    {r.username ? (
                      <Link href={`/rescuers/${r.username}`} className="font-sans font-bold text-[14px] no-underline">
                        Their pets &amp; wishlist →
                      </Link>
                    ) : (
                      <span />
                    )}
                    <a
                      href={`mailto:${r.email}`}
                      className="font-sans font-bold text-[12.5px] text-cocoa no-underline border-[1.5px] border-cocoa/30 px-[14px] py-2 rounded-[9px] whitespace-nowrap hover:bg-cocoa hover:text-cream transition-colors"
                    >
                      Email {r.name.split(" ")[0]}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Invite tile — routes to the application form below */}
          <a
            href="#join"
            className="border-[1.5px] border-dashed border-cocoa/30 rounded-[18px] flex flex-col items-center justify-center text-center px-7 py-9 gap-[6px] no-underline min-h-[280px]"
          >
            <TippedMonogram size={56} />
            <div className="font-display font-extrabold text-[20px] text-cocoa mt-2">
              Rescue in the UAE?
            </div>
            <div className="font-sans font-medium text-[14px] leading-[1.6] text-cocoa/65 max-w-[260px]">
              List your rescues with us. No fees — and money never touches
              tipped.
            </div>
            <span className="mt-3 font-sans font-bold text-[14px] text-cream bg-cocoa px-[22px] py-3 rounded-[11px]">
              Apply to join →
            </span>
          </a>
        </div>

        {/* Trust note */}
        <div className="bg-cream rounded-[14px] px-[22px] py-[18px] flex gap-[14px] items-start mt-9">
          <div className="shrink-0 mt-[1px]">
            <TippedMonogram size={22} />
          </div>
          <div className="font-sans font-semibold text-[13.5px] leading-[1.6] text-cocoa/80">
            Rescuers never handle money through tipped. Supporters pay vet
            clinics directly through each rescuer&rsquo;s clinic links, or send
            food and supplies via their wishlists — that&rsquo;s why there are
            no donate buttons here.
          </div>
        </div>
      </div>

      <InstagramGrid />

      {/* Join — the recruiting pitch, full-width above the footer */}
      <section id="join" className="bg-cream">
        <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-16 md:py-[84px]">
          <div className="eyebrow mb-[14px]">FOR RESCUERS</div>
          <h2 className="font-display font-extrabold text-[30px] md:text-[40px] leading-[1.12] text-cocoa m-0 mb-4 max-w-[640px] [text-wrap:pretty]">
            You save them. We&rsquo;ll help them find home.
          </h2>
          <p className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/75 m-0 mb-10 max-w-[560px]">
            tipped is free for rescuers, always. You write each listing in
            your own words, and you decide who adopts. We simply help the
            right people find your pets.
          </p>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-12">
            <div>
              <div className="font-display font-extrabold text-[19px] text-cocoa mb-2">
                Reach more adopters
              </div>
              <p className="font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/75 m-0">
                Every pet gets a lovely profile that shares beautifully to
                WhatsApp and Instagram — so adopters anywhere in the world can
                meet your pets the way you know them.
              </p>
            </div>
            <div>
              <div className="font-display font-extrabold text-[19px] text-cocoa mb-2">
                Your inbox, your decision
              </div>
              <p className="font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/75 m-0">
                Adoption inquiries land directly in your own email, and you
                choose the right home for every pet, exactly as you do now.
              </p>
            </div>
            <div>
              <div className="font-display font-extrabold text-[19px] text-cocoa mb-2">
                Help with the bills
              </div>
              <p className="font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/75 m-0">
                Post a vet bill and supporters pay your clinic directly —
                tipped never handles the money. 100% of the shop&rsquo;s profit
                also goes toward open bills, published weekly for everyone to
                see.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <JoinForm />
          </div>
          <span className="font-sans font-semibold text-[13.5px] text-cocoa/55">
            One message. Your first pet can be up the same day. Prefer plain
            email?{" "}
            <a href={joinMailto} className="font-bold">
              Write to us directly
            </a>
            .
          </span>
        </div>
      </section>
    </>
  );
}
