import { ImageResponse } from "next/og";
import { getAnimal } from "@/lib/data";
import { STATUS_LINE } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "tipped — the UAE's street cats & dogs";

// Brand fallback share card: species head + name + status on Cocoa.
// When the animal has a photo, generateMetadata points og:image at the photo
// instead; this route covers listings without one.
export default async function OgImage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const animal = await getAnimal(ref);
  const name = animal?.name ?? "tipped";
  const statusLine = animal ? STATUS_LINE[animal.status] : "the UAE's street cats & dogs";
  const meta = animal
    ? [animal.sex?.toLowerCase(), animal.age, animal.emirate].filter(Boolean).join(" · ")
    : "";
  const isDog = animal?.species === "dog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#3A2A22",
          gap: 28,
        }}
      >
        {isDog ? (
          <svg width="180" viewBox="0 0 120 110">
            <path
              d="M60,18 C82,18 96,34 96,56 C96,80 82,94 60,94 C38,94 24,80 24,56 C24,34 38,18 60,18 Z"
              fill="#FFF3E4"
            />
            <path
              d="M34,24 C22,30 16,48 21,64 C23,70 31,69 33,62 C35,50 37,36 40,26 Z"
              fill="#F0955B"
            />
            <path d="M86,24 C98,30 104,46 101,58 L89,63 C87,52 84,36 80,26 Z" fill="#F58B93" />
            <circle cx="46" cy="56" r="5" fill="#3A2A22" />
            <circle cx="74" cy="56" r="5" fill="#3A2A22" />
            <ellipse cx="60" cy="73" rx="6" ry="4.5" fill="#3A2A22" />
          </svg>
        ) : (
          <svg width="180" viewBox="0 0 120 110">
            <path
              d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 C57,30 63,30 68,32 L74,18 L86,14 L92,52 C96,60 96,70 92,78 C84,96 36,96 28,78 C24,70 24,60 28,52 Z"
              fill="#FFF3E4"
            />
            <path
              d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 Z"
              fill="#F0955B"
            />
            <path d="M68,32 L74,18 L86,14 L92,52 Z" fill="#F58B93" />
            <circle cx="46" cy="64" r="5" fill="#3A2A22" />
            <circle cx="74" cy="64" r="5" fill="#3A2A22" />
          </svg>
        )}
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 800,
            color: "#FFF3E4",
            fontFamily: "sans-serif",
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#F0955B",
            fontFamily: "sans-serif",
          }}
        >
          {statusLine}
          {meta ? ` · ${meta}` : ""}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "rgba(255,243,228,.55)",
            fontFamily: "sans-serif",
          }}
        >
          tipped · the UAE&rsquo;s street cats &amp; dogs
        </div>
      </div>
    ),
    size
  );
}
