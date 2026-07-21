import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PetCard from "@/components/PetCard";
import TippedMonogram from "@/components/TippedMonogram";
import { getPets, getRescuers } from "@/lib/data";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const rescuer = (await getRescuers()).find((r) => r.username === username);
  if (!rescuer) return { title: "Not found" };
  return {
    title: `${rescuer.name} — rescuer`,
    description: rescuer.blurb ?? `${rescuer.name} rescues in ${rescuer.emirate}.`,
  };
}

// A rescuer's public page: their pets, and the two ways to help that never
// involve sending them money — supplies to the door, payments to the clinic.
export default async function RescuerProfilePage({ params }: Props) {
  const { username } = await params;
  const [rescuers, pets] = await Promise.all([getRescuers(), getPets()]);
  const rescuer = rescuers.find((r) => r.username === username);
  if (!rescuer) notFound();

  const theirPets = pets.filter((p) => p.rescuer?.id === rescuer.id);
  const waiting = theirPets.filter((p) => p.status !== "adopted");
  const homed = theirPets.filter((p) => p.status === "adopted");
  const wishlists = (rescuer.wishlist_links ?? []).filter((w) => w.url);

  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-10 md:pt-16 pb-16 md:pb-[84px]">
      <Link href="/rescuers" className="font-sans font-bold text-sm no-underline">
        ← All rescuers
      </Link>

      <div className="flex items-center gap-5 mt-6 mb-2">
        <TippedMonogram size={64} />
        <div>
          <h1 className="font-display font-extrabold text-[34px] md:text-[44px] leading-[1.05] text-cocoa m-0">
            {rescuer.name}
          </h1>
          <div className="font-sans font-semibold text-[14px] text-cocoa/55 mt-1">
            {rescuer.emirate} · {rescuer.pets_saved} pets saved
            {rescuer.instagram && (
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
            )}
          </div>
        </div>
      </div>
      {rescuer.is_placeholder && (
        <div className="inline-flex font-sans font-bold text-[10px] tracking-[.08em] text-cocoa/45 border border-cocoa/20 rounded-[7px] px-2 py-[3px] mb-3">
          EXAMPLE PROFILE
        </div>
      )}
      {rescuer.blurb && (
        <p className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/75 m-0 mb-8 max-w-[560px]">
          {rescuer.blurb}
        </p>
      )}

      {(wishlists.length > 0 || rescuer.clinics.length > 0) && (
        <section className="grid md:grid-cols-2 gap-6 mb-12 max-w-[860px]">
          {wishlists.length > 0 && (
            <div className="bg-white rounded-[20px] shadow-card p-6">
              <h2 className="font-display font-extrabold text-[19px] text-cocoa m-0 mb-1">
                Send supplies directly
              </h2>
              <p className="font-sans font-medium text-[13.5px] leading-[1.6] text-cocoa/65 m-0 mb-4">
                Food, litter, carriers — bought by you, delivered to{" "}
                {rescuer.name.split(" ")[0]}&rsquo;s door.
              </p>
              <div className="flex flex-col items-start gap-2">
                {wishlists.map((w) => (
                  <a
                    key={w.label}
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans font-bold text-[14px] no-underline bg-cream text-cocoa rounded-[10px] px-4 py-[10px] hover:bg-sunset/25"
                  >
                    {w.label} →
                  </a>
                ))}
              </div>
            </div>
          )}
          {rescuer.clinics.length > 0 && (
            <div className="bg-white rounded-[20px] shadow-card p-6">
              <h2 className="font-display font-extrabold text-[19px] text-cocoa m-0 mb-1">
                Pay their clinic
              </h2>
              <p className="font-sans font-medium text-[13.5px] leading-[1.6] text-cocoa/65 m-0 mb-4">
                Open vet bills live on the{" "}
                <Link href="/transparency">Open books page</Link> — settle them
                with the clinic itself.
              </p>
              <div className="flex flex-col items-start gap-2">
                {rescuer.clinics.map((c) =>
                  c.url ? (
                    <a
                      key={c.name}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans font-bold text-[14px]"
                    >
                      {c.name} →
                    </a>
                  ) : (
                    <span key={c.name} className="font-sans font-semibold text-[14px] text-cocoa/60">
                      {c.name}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </section>
      )}
      <p className="font-sans font-semibold text-[12.5px] text-cocoa/50 m-0 mb-12 max-w-[560px]">
        Goods and clinic payments only — money never moves through tipped, and
        never to private accounts.
      </p>

      <section>
        <h2 className="font-display font-extrabold text-[24px] text-cocoa m-0 mb-6">
          {waiting.length > 0
            ? `Looking for homes (${waiting.length})`
            : "No pets listed right now"}
          {homed.length > 0 && (
            <span className="font-sans font-semibold text-[14px] text-cocoa/50 ml-3">
              {homed.length} already{" "}
              <Link href="/adopted" className="font-bold">
                home
              </Link>
            </span>
          )}
        </h2>
        {waiting.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {waiting.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
