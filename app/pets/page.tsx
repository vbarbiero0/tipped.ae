import type { Metadata } from "next";
import Link from "next/link";
import AdoptGrid, { type Intent } from "./AdoptGrid";
import { getPets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Adopt & foster",
  description:
    "Every pet here is sterilised, vaccinated and listed by the rescuer who feeds it. Browse the UAE's street cats and dogs, adopt from anywhere, foster from the UAE — email the rescuer directly.",
};

export default async function PetsPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const [pets, params] = await Promise.all([getPets(), searchParams]);
  const initialIntent: Intent =
    params.intent === "foster" ? "foster" : params.intent === "adopt" ? "adopt" : "all";
  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-[84px]">
      <div className="eyebrow mb-[14px]">THE UAE&rsquo;S STREET CATS &amp; DOGS</div>
      <h1 className="font-display font-extrabold text-[34px] md:text-[44px] text-cocoa m-0 mb-3">
        Ready to leave the street
      </h1>
      <p className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/75 m-0 mb-8 max-w-[560px]">
        Every pet here is sterilised, vaccinated and known by name — the
        tags on each profile say exactly what&rsquo;s been done. Every listing
        is written by the rescuer who feeds them. Adopt from anywhere in the
        world; foster if you&rsquo;re in the UAE. The success stories live on
        the{" "}
        <Link href="/adopted" className="font-bold">
          Already home page
        </Link>
        .
      </p>
      <AdoptGrid pets={pets} initialIntent={initialIntent} />
    </div>
  );
}
