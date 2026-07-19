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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "tipped — the UAE's street cats & dogs",
    template: "%s · tipped",
  },
  description: `${TAGLINE} Rescuers across the UAE list their street cats and dogs; you browse from anywhere, email the rescuer directly, and adopt. Vet bills get paid to the vet.`,
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
