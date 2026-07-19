import { EAR_PINK, EAR_SUNSET } from "@/lib/brand";

// The two brand ears. viewBox 36×52, thick round-joined stroke to match
// Nunito's terminals. Plain = Sunset, tipped = Tip pink — never recolored.
export function PlainEar({ width, rotate = 0 }: { width: number; rotate?: number }) {
  return (
    <svg
      width={width}
      height={(width * 52) / 36}
      viewBox="0 0 36 52"
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
      aria-hidden
    >
      <path
        d="M8,44 L18,12 L28,44 Z"
        fill={EAR_SUNSET}
        stroke={EAR_SUNSET}
        strokeWidth="9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TippedEar({ width, rotate = 0 }: { width: number; rotate?: number }) {
  return (
    <svg
      width={width}
      height={(width * 52) / 36}
      viewBox="0 0 36 52"
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
      aria-hidden
    >
      <path
        d="M8,44 L12,24 L24,20 L28,44 Z"
        fill={EAR_PINK}
        stroke={EAR_PINK}
        strokeWidth="9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EarPair({
  earWidth,
  gap,
  rotation = 12,
}: {
  earWidth: number;
  gap: number;
  rotation?: number;
}) {
  return (
    <span style={{ display: "flex", gap }} aria-hidden>
      <PlainEar width={earWidth} rotate={-rotation} />
      <TippedEar width={earWidth} rotate={rotation} />
    </span>
  );
}
