import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnimalPhoto from "@/components/AnimalPhoto";
import FosterPill from "@/components/FosterPill";
import { CardBadges, ConditionNotes, HealthTagRow } from "@/components/HealthTags";
import EmailRescuerButton from "@/components/EmailRescuerButton";
import ReceiptCard from "@/components/ReceiptCard";
import StatusPill from "@/components/StatusPill";
import TippedMonogram from "@/components/TippedMonogram";
import { getAnimal, getBillsPaid, getOpenBillFor } from "@/lib/data";
import { STATUS_LINE } from "@/lib/brand";

type Props = { params: Promise<{ ref: string }> };

// OG tags are the distribution model (WhatsApp/Instagram shares) — launch
// requirement, not polish.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ref } = await params;
  const animal = await getAnimal(ref);
  if (!animal) return { title: "Not found" };
  const title = `${animal.name} — ${STATUS_LINE[animal.status]} · tipped`;
  const description = (animal.story ?? "").slice(0, 150);
  return {
    title: `${animal.name} — ${STATUS_LINE[animal.status]}`,
    description,
    openGraph: {
      title,
      description,
      // Falls back to the generated opengraph-image route when no photo exists.
      ...(animal.photos.length > 0 && {
        images: [{ url: animal.photos[0], width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AnimalPage({ params }: Props) {
  const { ref } = await params;
  const [animal, bills] = await Promise.all([getAnimal(ref), getBillsPaid()]);
  if (!animal) notFound();
  const rescuer = animal.rescuer;
  const openBill = getOpenBillFor(bills, animal.ref);
  const meta = [animal.sex?.toLowerCase(), animal.age, animal.emirate]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-[84px]">
      <Link href="/adopt" className="font-sans font-bold text-sm no-underline">
        ← All cats &amp; dogs
      </Link>
      <div className="grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-10 md:gap-16 mt-6 items-start">
        <div className="w-full h-[340px] md:h-[480px] overflow-hidden rounded-[20px]">
          <AnimalPhoto animal={animal} markWidth={110} />
        </div>

        <div>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="font-display font-extrabold text-[38px] md:text-[48px] leading-[1.05] text-cocoa m-0">
              {animal.name}
            </h1>
            <CardBadges animal={animal} />
          </div>
          <div className="flex items-center gap-3 flex-wrap mb-5">
            <StatusPill status={animal.status} />
            <FosterPill animal={animal} />
            <span className="font-sans font-semibold text-[13px] text-cocoa/50">
              {meta} · {animal.ref}
            </span>
          </div>
          <p className="font-sans font-medium text-[17px] leading-[1.65] text-cocoa/80 m-0 mb-7 max-w-[520px]">
            {animal.story}
          </p>

          <div className="mb-7">
            <div className="eyebrow mb-3">HEALTH</div>
            <HealthTagRow animal={animal} />
            {animal.medical && (
              <p className="font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/75 m-0 mt-3 max-w-[520px]">
                {animal.medical}
              </p>
            )}
            <ConditionNotes animal={animal} />
          </div>

          {rescuer && (
            <div className="bg-white rounded-[20px] shadow-card p-5 md:p-6 max-w-[520px]">
              <div className="flex items-center gap-4">
                <TippedMonogram size={48} />
                <div className="min-w-0">
                  <div className="font-display font-extrabold text-[17px] text-cocoa">
                    {animal.name} is with {rescuer.name}
                    {rescuer.is_placeholder && (
                      <span className="ml-2 align-middle font-sans font-bold text-[10px] tracking-[.08em] text-cocoa/45 border border-cocoa/20 rounded-[7px] px-2 py-[2px]">
                        EXAMPLE PROFILE
                      </span>
                    )}
                  </div>
                  <div className="font-sans font-semibold text-[12.5px] text-cocoa/55">
                    {rescuer.emirate}
                    {rescuer.instagram ? (
                      <>
                        {" · "}
                        <a
                          href={`https://instagram.com/${rescuer.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          @{rescuer.instagram}
                        </a>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              {rescuer.blurb && (
                <p className="font-sans font-medium text-[13.5px] leading-[1.6] text-cocoa/70 m-0 mt-3">
                  {rescuer.blurb}
                </p>
              )}
              <div className="mt-4">
                <EmailRescuerButton animal={animal} rescuer={rescuer} size="lg" />
              </div>
              <div className="font-sans font-semibold text-[11.5px] text-cocoa/45 mt-[10px]">
                Straight to {rescuer.name.split(" ")[0]}&rsquo;s inbox — no forms, no
                gatekeeping.
              </div>
            </div>
          )}
        </div>
      </div>

      {openBill && (
        <section className="bg-cocoa rounded-[24px] mt-14 md:mt-20 px-6 md:px-12 py-10 md:py-12 grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 md:gap-14 items-center">
          <div>
            <h2 className="font-display font-extrabold text-[26px] md:text-[32px] leading-[1.15] text-cream m-0 mb-4">
              {animal.name} has an open vet bill.
            </h2>
            <p className="font-sans font-medium text-[15px] leading-[1.7] text-cream/70 m-0 max-w-[440px]">
              You pay the clinic directly — we never hold the money, and the
              receipt goes up on the{" "}
              <Link href="/transparency" className="text-cream underline">
                transparency page
              </Link>{" "}
              for everyone to see.
            </p>
          </div>
          <ReceiptCard
            clinic={openBill.clinic ?? "Clinic"}
            billNo={openBill.note}
            line={openBill.context ?? ""}
            amountAed={openBill.amount_aed}
            coveredAed={openBill.amount_covered_aed}
          />
        </section>
      )}
    </div>
  );
}
