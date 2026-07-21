/* eslint-disable @next/next/no-img-element */
import { DogHead, MonogramHead } from "./TippedMonogram";
import type { Pet } from "@/lib/types";

// Photo when the rescuer has one; otherwise the species head on a warm
// gradient tinted by sex (Sunset for males, Tip pink for females).
export default function PetPhoto({
  pet,
  className = "",
  markWidth = 72,
}: {
  pet: Pet;
  className?: string;
  markWidth?: number;
}) {
  if (pet.photos.length > 0) {
    return (
      <img
        src={pet.photos[0]}
        alt={`${pet.name}, ${pet.emirate ?? "UAE"}`}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }
  const gradient =
    pet.sex === "Female"
      ? "bg-gradient-to-br from-tip-pink/70 via-tip-pink/40 to-cream"
      : "bg-gradient-to-br from-sunset/70 via-sunset/40 to-cream";
  const Head = pet.species === "dog" ? DogHead : MonogramHead;
  return (
    <div className={`w-full h-full flex items-center justify-center ${gradient} ${className}`}>
      <div className="opacity-90">
        <Head width={markWidth} />
      </div>
    </div>
  );
}
