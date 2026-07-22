import { ImageResponse } from "next/og";
import { getAdvicePost } from "@/lib/advice";

// Branded OG card for every advice post. Always a PNG — WhatsApp and most
// chat apps won't render SVG og:images, so the SVG covers stay on-page only.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getAdvicePost(slug);
  const title = post?.title ?? "Tips & advice";
  const category = post?.category?.toUpperCase() ?? "ADVICE";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FBF7F0",
          padding: 36,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            background: "#FFF3E4",
            borderRadius: 40,
            padding: 64,
            position: "relative",
          }}
        >
          {/* Brand ear pair, top-left */}
          <svg
            width="140"
            height="90"
            viewBox="0 0 80 52"
            style={{ position: "absolute", top: 56, left: 64 }}
          >
            <g transform="rotate(-12 18 44)">
              <path
                d="M8,44 L18,12 L28,44 Z"
                fill="#F0955B"
                stroke="#F0955B"
                strokeWidth="9"
                strokeLinejoin="round"
              />
            </g>
            <g transform="translate(40,0) rotate(12 18 44)">
              <path
                d="M8,44 L12,24 L24,20 L28,44 Z"
                fill="#F58B93"
                stroke="#F58B93"
                strokeWidth="9"
                strokeLinejoin="round"
              />
            </g>
          </svg>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#B5643A",
              marginBottom: 18,
            }}
          >
            {category}
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#3A2A22",
              maxWidth: 960,
              marginBottom: 40,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: "#3A2A22" }}>tipped</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#3A2A22", opacity: 0.5 }}>
              · advice
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
