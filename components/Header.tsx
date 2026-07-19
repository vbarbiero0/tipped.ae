import Link from "next/link";
import TippedLogo from "./TippedLogo";

const nav = [
  { href: "/adopt", label: "Adopt & foster" },
  { href: "/transparency", label: "Transparency" },
  { href: "/shop", label: "Shop" },
  { href: "/rescuers", label: "For rescuers" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur">
      <div className="max-w-[1160px] mx-auto px-6 md:px-8 py-[18px] md:py-[22px] flex items-center justify-between gap-6">
        <Link href="/" className="no-underline" aria-label="tipped — home">
          <TippedLogo size={26} />
        </Link>
        <nav className="flex items-center gap-5 md:gap-7 font-sans font-semibold text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="hidden md:inline text-cocoa no-underline hover:text-link"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/adopt"
            className="bg-cocoa text-cream no-underline px-5 py-[10px] rounded-[10px] font-bold hover:bg-[#241A14]"
          >
            Meet the animals
          </Link>
        </nav>
      </div>
    </header>
  );
}
