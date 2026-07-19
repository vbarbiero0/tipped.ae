import { EarPair } from "./Ears";

// Wordmark: lowercase `tipped`, Nunito 800, ears centered on the second p.
// Geometry per brand guidelines: ear width ≈ 0.33×F, gap ≈ 0.07×F,
// pair top ≈ 0.21×F above the ascender. Ears never recolor (inverted or not).
export default function TippedLogo({
  size = 26,
  inverted = false,
}: {
  size?: number;
  inverted?: boolean;
}) {
  const earWidth = size * 0.33;
  const gap = size * 0.07;
  const top = -size * 0.21;

  return (
    <span
      className={`font-display font-extrabold leading-none ${inverted ? "text-cream" : "text-cocoa"}`}
      style={{ fontSize: size, position: "relative", display: "inline-block" }}
    >
      tip
      <span style={{ position: "relative", display: "inline-block" }}>
        p
        <span
          style={{
            position: "absolute",
            left: "50%",
            top,
            transform: "translateX(-50%)",
          }}
        >
          <EarPair earWidth={earWidth} gap={gap} />
        </span>
      </span>
      ed
    </span>
  );
}
