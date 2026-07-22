import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TAGLINE } from "@/lib/brand";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-nunito",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  // Fallback is the production domain — localhost must never leak into
  // deployed metadata (share previews are the distribution model).
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tipped.ae"),
  title: {
    default: "tipped — the UAE's street cats & dogs",
    template: "%s · tipped",
  },
  description: `${TAGLINE} tipped brings together rescuers across the Emirates and the animals in their care. Browse the pets, email the rescuer directly, and adopt or foster from anywhere in the world.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${quicksand.variable}`}>
      <body className="bg-paper font-sans text-cocoa antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
