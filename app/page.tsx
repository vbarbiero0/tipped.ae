/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import AnimalCard from "@/components/AnimalCard";
import ReceiptCard from "@/components/ReceiptCard";
import { EarPair } from "@/components/Ears";
import { getAnimals, getBillsPaid } from "@/lib/data";
import { heroImage, products } from "@/lib/seed";
import { TAGLINE } from "@/lib/brand";

// Section toggles from the design handoff (prop toggles on the prototype).
const SHOW_SHOP = true;
const SHOW_HERO_EARS = true;

export default async function HomePage() {
  const [animals, bills] = await Promise.all([getAnimals(), getBillsPaid()]);
  // Featured mix: two cats + one dog so both species show above the fold.
  const available = animals.filter((a) => a.status === "available");
  const featured = [
    ...available.filter((a) => a.species === "cat").slice(0, 2),
    ...available.filter((a) => a.species === "dog").slice(0, 1),
  ];
  while (featured.length < 3 && featured.length < available.length) {
    const next = available.find((a) => !featured.includes(a));
    if (!next) break;
    featured.push(next);
  }
  const openBill = bills.find(
    (b) => b.amount_covered_aed !== null && b.amount_covered_aed! < b.amount_aed
  );

  return (
    <>
      {/* Hero */}
      <section className="max-w-[1160px] mx-auto px-6 md:px-8 pt-10 md:pt-14 pb-16 md:pb-[84px] grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 md:gap-16 items-center">
        <div>
          <div className="eyebrow mb-[18px]">THE UAE&rsquo;S STREET CATS &amp; DOGS</div>
          <h1 className="font-display font-extrabold text-[40px] md:text-[54px] leading-[1.08] text-cocoa m-0 mb-[22px] [text-wrap:pretty]">
            {TAGLINE}
          </h1>
          <p className="font-sans font-medium text-[17px] leading-[1.65] text-cocoa/75 m-0 mb-8 max-w-[480px]">
            Rescuers across the UAE list their street cats and dogs here. Browse
            from anywhere in the world, email the rescuer directly, and adopt.
            When an animal needs care, the vet gets paid — not us.
          </p>
          <div className="flex gap-[14px] items-center flex-wrap">
            <Link
              href="/adopt"
              className="bg-cocoa text-cream no-underline font-sans font-bold text-[15px] px-7 py-[15px] rounded-[12px] hover:bg-[#241A14]"
            >
              Browse the cats &amp; dogs
            </Link>
            <Link
              href="/how-it-works"
              className="text-cocoa no-underline font-sans font-bold text-[15px] px-6 py-[15px] rounded-[12px] border-[1.5px] border-cocoa/30 hover:border-cocoa"
            >
              How it works
            </Link>
          </div>
        </div>
        <div className="relative pt-11">
          {SHOW_HERO_EARS && (
            <span className="absolute left-1/2 -top-2 -translate-x-1/2 z-0">
              <EarPair earWidth={58} gap={26} rotation={16} />
            </span>
          )}
          <div className="relative z-10 w-full h-[340px] md:h-[440px] overflow-hidden rounded-[20px]">
            <img
              src={heroImage}
              alt="A tortie street cat, comfortably off the street"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured cats */}
      <section className="max-w-[1160px] mx-auto px-6 md:px-8 pb-16 md:pb-[84px]">
        <div className="flex items-baseline justify-between mb-[26px]">
          <h2 className="font-display font-extrabold text-[28px] md:text-[34px] text-cocoa m-0">
            Ready to leave the street
          </h2>
          <Link href="/adopt" className="font-sans font-bold text-sm whitespace-nowrap">
            All cats &amp; dogs →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
        <p className="font-sans font-medium text-[15px] text-cocoa/70 text-center m-0 mt-9">
          Can&rsquo;t adopt? Foster. Two weeks of your sofa changes everything.{" "}
          <Link href="/adopt?intent=foster" className="font-bold">
            See who needs a foster →
          </Link>
        </p>
      </section>

      {/* Adopting, plainly */}
      <section className="bg-cream">
        <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-16 md:py-[72px]">
          <h2 className="font-display font-extrabold text-[28px] md:text-[34px] text-cocoa m-0 mb-10">
            Adopting, plainly
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                n: "1",
                title: "Find your animal",
                body: "Every listing is written by the rescuer who actually feeds this cat or dog. No shelter-speak.",
              },
              {
                n: "2",
                title: "Email the rescuer",
                body: "Straight to their inbox — no forms, no gatekeeping. Ask the awkward questions.",
              },
              {
                n: "3",
                title: "Adopt, near or far",
                body: "UAE cats and dogs fly well. You and the rescuer arrange vetting, paperwork and travel together.",
              },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-display font-extrabold text-[40px] text-sunset leading-none mb-3">
                  {s.n}
                </div>
                <div className="font-display font-extrabold text-[19px] text-cocoa mb-2">
                  {s.title}
                </div>
                <p className="font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/75 m-0">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vet bills */}
      <section className="bg-cocoa">
        <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-16 md:py-20 grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 md:gap-16 items-center">
          <div>
            <h2 className="font-display font-extrabold text-[30px] md:text-[38px] leading-[1.15] text-cream m-0 mb-5 [text-wrap:pretty]">
              Vet bills get paid to the vet.
            </h2>
            <p className="font-sans font-medium text-base leading-[1.7] text-cream/70 m-0 mb-[14px] max-w-[460px]">
              When a cat or dog needs treatment, the rescuer posts the
              clinic&rsquo;s bill here. You pay the clinic directly — we never
              hold the money, and the receipt goes up for everyone to see.
            </p>
            <p className="font-sans font-semibold text-sm text-cream/50 m-0">
              Works for listed animals and for the ones still on the street.
            </p>
          </div>
          {openBill ? (
            <ReceiptCard
              clinic={openBill.clinic ?? "Clinic"}
              billNo={openBill.note}
              line={openBill.context ?? ""}
              amountAed={openBill.amount_aed}
              coveredAed={openBill.amount_covered_aed}
            />
          ) : (
            <div className="bg-receipt rounded-[18px] px-7 py-[26px] shadow-receipt -rotate-1 font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/70">
              No open bills right now. When an animal needs treatment, the
              clinic&rsquo;s bill goes up here — and comes down when it&rsquo;s
              paid.
            </div>
          )}
        </div>
      </section>

      {/* Shop teaser */}
      {SHOW_SHOP && (
        <section className="max-w-[1160px] mx-auto px-6 md:px-8 py-16 md:py-[84px]">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-display font-extrabold text-[28px] md:text-[34px] text-cocoa m-0">
              The shop pays bills too
            </h2>
            <Link href="/shop" className="font-sans font-bold text-sm whitespace-nowrap">
              Visit the shop →
            </Link>
          </div>
          <p className="font-sans font-medium text-[15px] text-cocoa/65 m-0 mb-7">
            Every purchase buys what rescuers actually need — food, medicine,
            supplies — and helps pay down vet bills.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p) => (
              <Link
                key={p.slug}
                href="/shop"
                className="flex flex-col gap-3 no-underline group"
              >
                <div className="h-[220px] md:h-[280px] rounded-[18px] bg-gradient-to-br from-cream to-sunset/25 flex items-center justify-center group-hover:from-cream group-hover:to-sunset/40 transition-colors">
                  <EarPair earWidth={44} gap={16} />
                </div>
                <div className="flex justify-between items-baseline gap-3">
                  <span className="font-sans font-bold text-[15px] text-cocoa">
                    {p.name}
                  </span>
                  <span className="font-mono text-[13px] text-cocoa/60 whitespace-nowrap">
                    AED {p.price_aed}
                  </span>
                </div>
                <span className="font-sans font-semibold text-[12.5px] text-badge-text">
                  {p.benefit}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
