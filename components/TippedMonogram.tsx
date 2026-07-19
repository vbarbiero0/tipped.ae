import { COCOA, CREAM, EAR_PINK, EAR_SUNSET } from "@/lib/brand";

// Cat head silhouette wearing the brand ears — Cream head on a Cocoa
// rounded-square tile, ~27% radius at every size. Shape language: rounded
// squares only — no circle avatars.
export function MonogramHead({ width }: { width: number }) {
  return (
    <svg width={width} viewBox="0 0 120 110" aria-hidden>
      <path
        d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 C57,30 63,30 68,32 L74,18 L86,14 L92,52 C96,60 96,70 92,78 C84,96 36,96 28,78 C24,70 24,60 28,52 Z"
        fill={CREAM}
      />
      <path
        d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 Z"
        fill={EAR_SUNSET}
      />
      <path d="M68,32 L74,18 L86,14 L92,52 Z" fill={EAR_PINK} />
      <circle cx="46" cy="64" r="5" fill={COCOA} />
      <circle cx="74" cy="64" r="5" fill={COCOA} />
    </svg>
  );
}

// Dog head in the same visual language — cream head, floppy brand ears
// (plain Sunset left, tipped cut Tip pink right), cocoa eyes + nose.
// Used as the photo fallback for dog listings; the brand mark stays the cat.
export function DogHead({ width }: { width: number }) {
  return (
    <svg width={width} viewBox="0 0 120 110" aria-hidden>
      <path
        d="M60,18 C82,18 96,34 96,56 C96,80 82,94 60,94 C38,94 24,80 24,56 C24,34 38,18 60,18 Z"
        fill={CREAM}
      />
      <path
        d="M34,24 C22,30 16,48 21,64 C23,70 31,69 33,62 C35,50 37,36 40,26 Z"
        fill={EAR_SUNSET}
      />
      <path d="M86,24 C98,30 104,46 101,58 L89,63 C87,52 84,36 80,26 Z" fill={EAR_PINK} />
      <circle cx="46" cy="56" r="5" fill={COCOA} />
      <circle cx="74" cy="56" r="5" fill={COCOA} />
      <ellipse cx="60" cy="73" rx="6" ry="4.5" fill={COCOA} />
    </svg>
  );
}

export default function TippedMonogram({ size = 56 }: { size?: number }) {
  return (
    <span
      className="bg-cocoa inline-flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
      }}
    >
      <MonogramHead width={size * 0.625} />
    </span>
  );
}
