import type { Metadata } from "next";
import Link from "next/link";
import PetPhoto from "@/components/PetPhoto";
import { getPets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Already home",
  description:
    "Every pet on this page slept on the street once. Proof the model works.",
};

// The celebration page — approved pets whose status is adopted. No email
// buttons, no bills: these stories are finished.
export default async function AdoptedPage() {
  const pets = (await getPets()).filter((p) => p.status === "adopted");

  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-10 md:pt-16 pb-16 md:pb-[84px]">
      <div className="eyebrow mb-[14px]">ALREADY HOME</div>
      <h1 className="font-display font-extrabold text-[34px] md:text-[44px] text-cocoa m-0 mb-3">
        The ones who made it.
      </h1>
      <p className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/70 m-0 mb-10 max-w-[560px]">
        {pets.length > 0
          ? `${pets.length} ${pets.length === 1 ? "pet" : "pets"} on this page slept on the street once. Now they yell for breakfast indoors — proof the model works.`
          : "The first adoption gets celebrated here, photo and all."}
      </p>

      {pets.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {pets.map((pet) => (
            <Link
              key={pet.id}
              href={`/pets/${pet.ref}`}
              className="block bg-white rounded-[20px] shadow-card no-underline group"
            >
              <div className="h-[240px] rounded-t-[20px] overflow-hidden">
                <PetPhoto pet={pet} />
              </div>
              <div className="px-5 pt-4 pb-5 flex items-baseline justify-between gap-3">
                <span className="font-display font-extrabold text-[22px] text-cocoa group-hover:text-link">
                  {pet.name}
                </span>
                <span className="font-sans font-bold text-[11px] tracking-[.08em] text-cocoa/45">
                  {pet.emirate?.toUpperCase()} · HOME
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-paper border border-cocoa/[.08] rounded-[20px] px-10 py-[70px] text-center">
          <p className="font-sans font-medium text-[15px] text-cocoa/60 m-0">
            Meanwhile, someone&rsquo;s waiting —{" "}
            <Link href="/pets" className="font-bold">
              meet the pets looking for a home
            </Link>
            .
          </p>
        </div>
      )}

      {pets.length > 0 && (
        <p className="font-sans font-medium text-[15px] text-cocoa/60 mt-10 m-0">
          Want to be the reason the next one lands here?{" "}
          <Link href="/pets" className="font-bold">
            Meet the pets still waiting →
          </Link>
        </p>
      )}
    </div>
  );
}
