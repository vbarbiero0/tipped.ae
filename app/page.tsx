/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import PetCard from "@/components/PetCard";
import ReceiptCard from "@/components/ReceiptCard";
import { EarPair } from "@/components/Ears";
import { getPets, getBillsPaid } from "@/lib/data";
import { products } from "@/lib/seed";
import { TAGLINE } from "@/lib/brand";

// Section toggle from the design handoff (prop toggle on the prototype).
const SHOW_SHOP = true;

export default async function HomePage() {
  const [pets, bills] = await Promise.all([getPets(), getBillsPaid()]);
  // Admin-featured pets lead; the species mix fills any empty slots.
  const available = pets.filter((a) => a.status !== "adopted");
  const featured = available.filter((a) => a.featured).slice(0, 3);
  for (const pick of [
    ...available.filter((a) => a.species === "cat"),
    ...available.filter((a) => a.species === "dog"),
    ...available,
  ]) {
    if (featured.length >= 3) break;
    if (!featured.includes(pick)) featured.push(pick);
  }
  // The admin-starred bill fronts the receipt module; else the first open one.
  const openBill =
    bills.find((b) => b.featured) ??
    bills.find(
      (b) => b.amount_covered_aed !== null && b.amount_covered_aed! < b.amount_aed
    );
  // Hero prints show real listings: first two pets with photos.
  const [printPortrait, printSquare] = pets.filter((a) => a.photos.length > 0);

  return (
    <>
      {/* Hero */}
      <section className="max-w-[1160px] mx-auto px-6 md:px-8 pt-10 md:pt-14 pb-16 md:pb-[84px] grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 md:gap-16 items-center">
        <div>
          <div className="eyebrow mb-[18px]">RESCUED ACROSS THE UAE</div>
          <h1 className="font-display font-extrabold text-[40px] md:text-[54px] leading-[1.08] text-cocoa m-0 mb-[22px] [text-wrap:pretty]">
            {TAGLINE}
          </h1>
          <p className="font-sans font-medium text-[17px] leading-[1.65] text-cocoa/75 m-0 mb-8 max-w-[480px]">
            tipped brings together rescuers across the Emirates and the
            animals in their care. Browse the pets, meet the people who saved
            them, and adopt or foster — from anywhere in the world.
          </p>
          <div className="flex gap-[14px] items-center flex-wrap">
            <Link
              href="/pets"
              className="bg-cocoa text-cream no-underline font-sans font-bold text-[15px] px-7 py-[15px] rounded-[12px] hover:bg-[#241A14]"
            >
              Meet the pets
            </Link>
            <Link
              href="/how-it-works"
              className="text-cocoa no-underline font-sans font-bold text-[15px] px-6 py-[15px] rounded-[12px] border-[1.5px] border-cocoa/30 hover:border-cocoa"
            >
              How it works
            </Link>
          </div>
        </div>
        {/* Static print collage — neutral #FFFDF8 mats, color comes from the
            photos and the sticker. Fixed 528×540 composition, scaled on
            small screens. */}
        {/* overflow-x-clip: the scaled 528px composition can poke a few px
            past 375px viewports and wiggle the whole page sideways */}
        <div className="relative h-[350px] sm:h-[540px] overflow-x-clip">
          <div className="absolute top-0 left-0 w-[528px] h-[540px] scale-[.62] sm:scale-100 origin-top-left">
            {/* Portrait print — polaroid caption, links to the profile,
                lifts forward on hover */}
            {printPortrait && (
              <Link
                href={`/pets/${printPortrait.ref}`}
                className="absolute top-0 left-0 block w-[360px] -rotate-[2.5deg] bg-receipt rounded-[16px] border border-cocoa/[.08] shadow-[0_14px_34px_rgba(58,42,34,.14)] p-[10px] pb-[56px] z-10 no-underline transition-[transform,box-shadow] duration-300 ease-out hover:-rotate-[1deg] hover:scale-[1.03] hover:-translate-y-1 hover:z-30 hover:shadow-[0_24px_48px_rgba(58,42,34,.22)]"
              >
                <img
                  src={printPortrait.photos[0]}
                  alt={`${printPortrait.name}, ${printPortrait.emirate ?? "UAE"}`}
                  className="w-full h-[445px] object-cover rounded-[8px]"
                />
                {/* Caption row in the mat band: name left, emirate right */}
                <span className="absolute left-4 right-4 bottom-4 flex items-center justify-between">
                  <span className="font-display font-extrabold text-[24px] leading-none text-cocoa">
                    {printPortrait.name}
                  </span>
                  <span className="font-sans font-semibold text-[12.5px] uppercase tracking-[.06em] text-cocoa/45">
                    {printPortrait.emirate}
                  </span>
                </span>
              </Link>
            )}
            {/* Square print, overlapping lower-right — same treatment, moved
                up so it never covers the portrait's caption band */}
            {printSquare && (
              <Link
                href={`/pets/${printSquare.ref}`}
                className="absolute left-[255px] top-[148px] block w-[273px] rotate-[3deg] bg-receipt rounded-[14px] border border-cocoa/[.08] shadow-[0_16px_36px_rgba(58,42,34,.2)] p-[9px] pb-[48px] z-20 no-underline transition-[transform,box-shadow] duration-300 ease-out hover:rotate-[1.5deg] hover:scale-[1.04] hover:-translate-y-1 hover:z-30 hover:shadow-[0_26px_52px_rgba(58,42,34,.28)]"
              >
                <img
                  src={printSquare.photos[0]}
                  alt={`${printSquare.name}, ${printSquare.emirate ?? "UAE"}`}
                  className="w-full h-[255px] object-cover rounded-[6px]"
                />
                <span className="absolute left-[14px] right-[14px] bottom-[13px] flex items-center justify-between">
                  <span className="font-display font-extrabold text-[21px] leading-none text-cocoa">
                    {printSquare.name}
                  </span>
                  <span className="font-sans font-semibold text-[12px] uppercase tracking-[.06em] text-cocoa/45">
                    {printSquare.emirate}
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured cats */}
      <section className="max-w-[1160px] mx-auto px-6 md:px-8 pb-16 md:pb-[84px]">
        <div className="flex items-baseline justify-between mb-[26px]">
          <h2 className="font-display font-extrabold text-[28px] md:text-[34px] text-cocoa m-0">
            Waiting for a home
          </h2>
          <Link href="/pets" className="font-sans font-bold text-sm whitespace-nowrap">
            See all pets →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
        <p className="font-sans font-medium text-[15px] text-cocoa/70 text-center m-0 mt-9">
          If you can&rsquo;t adopt right now, fostering helps just as much —
          you give a rescued animal a safe place to rest while they wait.{" "}
          <Link href="/pets?intent=foster" className="font-bold">
            Meet the pets who need a foster →
          </Link>
        </p>
      </section>

      {/* Adopting, plainly */}
      <section className="bg-cream">
        <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-16 md:py-[72px]">
          <h2 className="font-display font-extrabold text-[28px] md:text-[34px] text-cocoa m-0 mb-10">
            How adoption works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                n: "1",
                title: "Find your companion",
                body: "Every pet is listed by the rescuer who cares for them, with their story, health record and microchip.",
              },
              {
                n: "2",
                title: "Email the rescuer",
                body: "Your message goes straight to the person who knows this animal best, and they'll guide you from there.",
              },
              {
                n: "3",
                title: "Adopt or foster, near or far",
                body: "UAE pets travel well. You and the rescuer arrange the health checks, paperwork and travel together.",
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
              Every contribution helps rescuers do more.
            </h2>
            <p className="font-sans font-medium text-base leading-[1.7] text-cream/70 m-0 mb-[14px] max-w-[460px]">
              When a rescued animal needs treatment, the clinic&rsquo;s bill is
              posted here. Payments go straight to the clinic caring for the
              animal — tipped never handles the money — and every receipt is
              published for all to see. Every contribution, no matter how
              small, helps rescuers do more.
            </p>
            <p className="font-sans font-semibold text-sm text-cream/50 m-0">
              This helps listed pets and animals still waiting on the street alike.
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
              There are no open bills right now. When a rescued animal needs
              treatment, the clinic&rsquo;s bill will appear here until
              it&rsquo;s covered — thank you for checking in.
            </div>
          )}
        </div>
      </section>

      {/* Shop teaser */}
      {SHOW_SHOP && (
        <section className="max-w-[1160px] mx-auto px-6 md:px-8 py-16 md:py-[84px]">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-display font-extrabold text-[28px] md:text-[34px] text-cocoa m-0">
              The shop gives back
            </h2>
            <Link href="/shop" className="font-sans font-bold text-sm whitespace-nowrap">
              Visit the shop →
            </Link>
          </div>
          <p className="font-sans font-medium text-[15px] text-cocoa/65 m-0 mb-7">
            100% of the shop&rsquo;s profit goes to vet bills for rescued
            animals — recorded dirham by dirham and published every week on
            the Open books page.
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
