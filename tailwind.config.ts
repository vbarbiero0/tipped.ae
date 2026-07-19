import type { Config } from "tailwindcss";

// Brand tokens — CLAUDE.md is the source of truth. No ad-hoc hex in components.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF3E4",
        cocoa: "#3A2A22",
        sunset: "#F0955B",
        "sunset-hover": "#E8874C",
        "tip-pink": "#F58B93",
        paper: "#FBF7F0",
        "canvas-2": "#FAF7F2",
        receipt: "#FFFDF8",
        link: "#B5643A",
        "link-hover": "#8F4C2B",
        "badge-text": "#C4525C",
      },
      fontFamily: {
        display: ["var(--font-nunito)", "sans-serif"],
        sans: ["var(--font-quicksand)", "sans-serif"],
        mono: ["ui-monospace", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(58,42,34,.08)",
        receipt: "0 12px 40px rgba(0,0,0,.25)",
      },
    },
  },
  plugins: [],
};
export default config;
