import type { Metadata } from "next";
import Link from "next/link";
import { EarPair } from "@/components/Ears";
import { getBillsPaid } from "@/lib/data";
import ReceiptCard from "@/components/ReceiptCard";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Find your cat or dog, email the rescuer, adopt near or far. And when a pet needs care, the vet gets paid — not us.",
};

const steps = [
  {
    n: "1",
    title: "Find your pet",
    body: "Every listing is written by the rescuer who actually feeds this cat or dog — the person who knows whether he yells for breakfast or hides from vacuum cleaners. No shelter-speak, no stock phrases.",
  },
  {
    n: "2",
    title: "Email the rescuer",
    body: "The button on every listing opens your own email app, addressed straight to the rescuer's inbox. No forms, no accounts, no gatekeeping. Ask the awkward questions — they'd rather you did.",
  },
  {
    n: "3",
    title: "Adopt, near or far",
    body: "UAE cats and dogs fly well, and rescuers here send pets to Europe, the UK and North America all the time. You and the rescuer arrange vetting, paperwork and travel together.",
  },
];

export default async function HowItWorksPage() {
  const bills = await getBillsPaid();
  const openBill = bills.find(
    (b) => b.amount_covered_aed !== null && b.amount_covered_aed! < b.amount_aed
  );

  return (
    <>
      <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16">
        <div className="eyebrow mb-[14px]">ADOPTING, PLAINLY</div>
        <h1 className="font-display font-extrabold text-[34px] md:text-[44px] text-cocoa m-0 mb-10 max-w-[640px]">
          How it works
        </h1>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((s) => (
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

      {/* Why the tipped ear */}
      <section className="bg-cream">
        <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-16 md:py-[72px] grid md:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] gap-10 items-center">
          <div className="flex justify-center md:justify-start">
            <EarPair earWidth={72} gap={30} />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-[26px] md:text-[32px] text-cocoa m-0 mb-4">
              Why the tipped ear?
            </h2>
            <p className="font-sans font-medium text-[15.5px] leading-[1.7] text-cocoa/78 m-0 mb-3 max-w-[600px]">
              When a street cat is trapped, neutered and returned, the vet clips
              the tip of one ear under anaesthesia. It&rsquo;s the universal
              sign — visible from across the street — that this cat has been
              fixed, vaccinated and is being looked after.
            </p>
            <p className="font-sans font-medium text-[15.5px] leading-[1.7] text-cocoa/78 m-0 mb-3 max-w-[600px]">
              That&rsquo;s where the name comes from. Every tipped ear is a cat
              someone saved, and every cat on this site carries one.
            </p>
            <p className="font-sans font-medium text-[15.5px] leading-[1.7] text-cocoa/78 m-0 max-w-[600px]">
              Dogs don&rsquo;t get ear-tipped — theirs is a microchip and a
              collar tag. The promise is the same: every pet here is fixed,
              vaccinated and looked after.
            </p>
          </div>
        </div>
      </section>

      {/* What the tags mean */}
      <section className="max-w-[1160px] mx-auto px-6 md:px-8 py-16 md:py-[72px]">
        <h2 className="font-display font-extrabold text-[26px] md:text-[32px] text-cocoa m-0 mb-3">
          What the tags mean
        </h2>
        <p className="font-sans font-medium text-[15px] leading-[1.65] text-cocoa/70 m-0 mb-8 max-w-[620px]">
          Every profile carries health tags. They&rsquo;re precise claims, not
          vibes — here&rsquo;s exactly what each one commits to.
        </p>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-[900px]">
          {[
            {
              tag: "sterilised",
              body: "Neutered or spayed by a licensed vet. For cats, the tipped ear is the visible version of this tag.",
            },
            {
              tag: "vaccinated",
              body: "Up to date on the shots the UAE actually requires: rabies every year, plus the core combo — flu/enteritis (FVRCP) for cats, DHPPi/L for dogs. The same set the municipality checks at registration.",
            },
            {
              tag: "microchipped",
              body: "Carries an ISO microchip, ready for municipal registration in the adopter's name.",
            },
            {
              tag: "tested −",
              body: "Bloodwork done and negative — FIV/FeLV for cats, heartworm for dogs. If a pet wasn't tested, the tag simply isn't there; we don't claim what we don't know.",
            },
            {
              tag: "FIV + / FeLV + / heartworm +",
              body: "A positive result is stated plainly, never hidden — and the profile automatically explains what it means and what care looks like.",
            },
            {
              tag: "special needs · chronic condition",
              body: "Something needs ongoing attention. The rescuer's own words on the profile carry the specifics.",
            },
          ].map((t) => (
            <div key={t.tag}>
              <div className="font-sans font-bold text-[13px] text-cocoa mb-1">
                {t.tag}
              </div>
              <p className="font-sans font-medium text-[13.5px] leading-[1.6] text-cocoa/72 m-0">
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Vet bill explainer */}
      <section className="bg-cocoa">
        <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-16 md:py-20 grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 md:gap-16 items-center">
          <div>
            <h2 className="font-display font-extrabold text-[28px] md:text-[36px] leading-[1.15] text-cream m-0 mb-5">
              And when a pet needs a vet?
            </h2>
            <p className="font-sans font-medium text-base leading-[1.7] text-cream/70 m-0 mb-[14px] max-w-[460px]">
              The rescuer posts the clinic&rsquo;s bill here. You pay the clinic
              directly, into the clinic&rsquo;s own account — tipped never holds
              the money. The receipt goes up on the{" "}
              <Link href="/transparency" className="text-cream underline">
                transparency page
              </Link>{" "}
              for everyone to see.
            </p>
            <p className="font-sans font-semibold text-sm text-cream/50 m-0">
              Works for listed pets and for the ones still on the street.
            </p>
          </div>
          {openBill && (
            <ReceiptCard
              clinic={openBill.clinic ?? "Clinic"}
              billNo={openBill.note}
              line={openBill.context ?? ""}
              amountAed={openBill.amount_aed}
              coveredAed={openBill.amount_covered_aed}
            />
          )}
        </div>
      </section>

      <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-16 text-center">
        <Link
          href="/pets"
          className="inline-block bg-cocoa text-cream no-underline font-sans font-bold text-[15px] px-7 py-[15px] rounded-[12px] hover:bg-[#241A14]"
        >
          Browse the cats &amp; dogs
        </Link>
      </div>
    </>
  );
}
