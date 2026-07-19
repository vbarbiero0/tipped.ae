import type { Metadata } from "next";
import Link from "next/link";
import { EarPair } from "@/components/Ears";
import ShopSignup from "./ShopSignup";
import { products } from "@/lib/seed";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "The shop",
  description:
    "100% of the shop's profit pays vet bills — updated weekly, in public. Order via Instagram or email.",
};

// v1 is a catalog, not a checkout (Selling model in CLAUDE.md). Orders happen
// over Instagram DM or email until the trade license + hosted store exist.

export default function ShopPage() {
  const orderMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Shop order")}&body=${encodeURIComponent(
    "Hi — I'd like to order:\n\nItem(s):\nQuantity:\nShip to (or UAE pickup):\n"
  )}`;

  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-[84px]">
      <div className="eyebrow mb-[14px]">THE SHOP PAYS BILLS</div>
      <h1 className="font-display font-extrabold text-[34px] md:text-[44px] text-cocoa m-0 mb-3">
        Buy a thing, feed a street.
      </h1>
      <p className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/75 m-0 mb-10 max-w-[560px]">
        100% of the shop&rsquo;s profit pays vet bills. Every sale in, every
        bill out — public and updated weekly on the{" "}
        <Link href="/transparency">transparency page</Link>.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-14">
        {products.map((p) => (
          <div key={p.slug} className="flex flex-col gap-3">
            <div className="h-[260px] md:h-[300px] rounded-[18px] bg-gradient-to-br from-cream to-sunset/25 flex items-center justify-center">
              <EarPair earWidth={48} gap={18} />
            </div>
            <div className="flex justify-between items-baseline gap-3">
              <span className="font-sans font-bold text-[16px] text-cocoa">{p.name}</span>
              <span className="font-mono text-[14px] text-cocoa/60 whitespace-nowrap">
                AED {p.price_aed}
              </span>
            </div>
            <p className="font-sans font-medium text-[13.5px] leading-[1.6] text-cocoa/70 m-0">
              {p.description}
            </p>
            <span className="font-sans font-semibold text-[12.5px] text-badge-text">
              {p.benefit}
            </span>
          </div>
        ))}
      </div>

      {/* How buying works */}
      <div className="bg-cream rounded-[24px] px-6 md:px-10 py-8 md:py-10 mb-12">
        <h2 className="font-display font-extrabold text-[24px] text-cocoa m-0 mb-3">
          How buying works, for now
        </h2>
        <p className="font-sans font-medium text-[14.5px] leading-[1.65] text-cocoa/75 m-0 mb-6 max-w-[620px]">
          No cart yet — orders are personal while we&rsquo;re small. Message us
          on Instagram or email what you want; we invoice by payment link or
          bank transfer and ship anywhere in the UAE. Every sale lands in the
          public ledger.
        </p>
        <div className="flex gap-[14px] items-center flex-wrap">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cocoa text-cream no-underline font-sans font-bold text-[14px] px-6 py-3 rounded-[10px] hover:bg-[#241A14]"
          >
            Order via Instagram
          </a>
          <a
            href={orderMailto}
            className="text-cocoa no-underline font-sans font-bold text-[14px] px-6 py-3 rounded-[10px] border-[1.5px] border-cocoa/30 hover:border-cocoa"
          >
            Order by email
          </a>
        </div>
      </div>

      <div className="max-w-[560px]">
        <h2 className="font-display font-extrabold text-[20px] text-cocoa m-0 mb-2">
          New things, when there are new things
        </h2>
        <p className="font-sans font-medium text-[13.5px] leading-[1.6] text-cocoa/65 m-0 mb-4">
          Leave your email and we&rsquo;ll tell you when the next batch lands.
          Nothing else, ever.
        </p>
        <ShopSignup />
      </div>
    </div>
  );
}
