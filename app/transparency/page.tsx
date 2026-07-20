import type { Metadata } from "next";
import Link from "next/link";
import { getBillsPaid, getShopLedger } from "@/lib/data";

export const metadata: Metadata = {
  title: "Open books",
  description:
    "The two-ledger glass box: what the shop sold, and the vet bills its profit paid. Every bill with its receipt, updated weekly.",
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default async function TransparencyPage() {
  const [ledger, bills] = await Promise.all([getShopLedger(), getBillsPaid()]);
  const totalIn = ledger.reduce((s, r) => s + r.amount_aed, 0);
  const totalOut = bills
    .filter((b) => b.source === "shop")
    .reduce((s, b) => s + (b.amount_covered_aed ?? b.amount_aed), 0);
  const ready = totalIn - totalOut;

  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-[84px]">
      <div className="eyebrow mb-[14px]">THE GLASS BOX</div>
      <h1 className="font-display font-extrabold text-[34px] md:text-[44px] text-cocoa m-0 mb-3">
        Every dirham, in public.
      </h1>
      <p className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/75 m-0 mb-8 max-w-[600px]">
        Money for care never passes through tipped — clinics get paid directly,
        and 100% of the shop&rsquo;s profit goes to vet bills. What comes in and
        what gets paid lives here, receipt by receipt, updated weekly. Listed
        animals and the ones still on the street alike.
      </p>

      {/* Totals + honesty line */}
      <div className="bg-white rounded-[20px] shadow-card px-6 md:px-8 py-6 mb-12">
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div>
            <div className="font-mono text-[22px] md:text-[30px] font-semibold text-cocoa">
              AED {totalIn}
            </div>
            <div className="font-sans font-bold text-[11px] tracking-[.1em] text-cocoa/50 mt-1">
              IN — SHOP SALES
            </div>
          </div>
          <div>
            <div className="font-mono text-[22px] md:text-[30px] font-semibold text-cocoa">
              AED {totalOut}
            </div>
            <div className="font-sans font-bold text-[11px] tracking-[.1em] text-cocoa/50 mt-1">
              OUT — VET BILLS
            </div>
          </div>
          <div>
            <div className="font-mono text-[22px] md:text-[30px] font-semibold text-sunset">
              AED {ready}
            </div>
            <div className="font-sans font-bold text-[11px] tracking-[.1em] text-cocoa/50 mt-1">
              READY FOR THE NEXT BILL
            </div>
          </div>
        </div>
        <div className="font-sans font-semibold text-[13.5px] text-cocoa/65 border-t border-dashed border-cocoa/[.18] pt-3">
          AED {totalIn} in · AED {totalOut} out · AED {ready} ready for the next
          bill.
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start">
        {/* Money in */}
        <section>
          <h2 className="font-display font-extrabold text-[24px] text-cocoa m-0 mb-1">
            Money in
          </h2>
          <p className="font-sans font-medium text-[13.5px] text-cocoa/60 m-0 mb-5">
            What the shop sold. Updated weekly, sale by sale.
          </p>
          {ledger.length === 0 ? (
            <p className="font-sans font-medium text-[14px] text-cocoa/60">
              First sales coming soon — the shop just opened.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {ledger.map((row) => (
                <div
                  key={row.id}
                  className="bg-receipt rounded-[14px] px-5 py-4 shadow-card"
                >
                  <div className="flex justify-between items-baseline gap-3">
                    <span className="font-sans font-bold text-[14px] text-cocoa">
                      {row.item}
                      {row.qty > 1 ? ` × ${row.qty}` : ""}
                    </span>
                    <span className="font-mono font-semibold text-[14px] text-cocoa whitespace-nowrap">
                      AED {row.amount_aed}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline gap-3 mt-1 border-t border-dashed border-cocoa/[.14] pt-2">
                    <span className="font-mono text-[11px] text-cocoa/45">
                      {formatDate(row.sold_on)}
                    </span>
                    {row.benefit && (
                      <span className="font-sans font-semibold text-[12px] text-badge-text">
                        {row.benefit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Money out */}
        <section>
          <h2 className="font-display font-extrabold text-[24px] text-cocoa m-0 mb-1">
            Money out
          </h2>
          <p className="font-sans font-medium text-[13.5px] text-cocoa/60 m-0 mb-5">
            What it paid for — with the receipt, every time.
          </p>
          {bills.length === 0 ? (
            <p className="font-sans font-medium text-[14px] text-cocoa/60">
              First bills coming soon. When one is paid, the receipt goes up
              here.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {bills.map((b, i) => {
                const covered = b.amount_covered_aed;
                const partial = covered !== null && covered < b.amount_aed;
                const pct = partial
                  ? Math.min(100, Math.round((covered! / b.amount_aed) * 100))
                  : 100;
                return (
                  <div
                    key={b.id}
                    className={`bg-receipt rounded-[16px] px-5 py-4 shadow-card ${i % 2 === 0 ? "-rotate-1" : "rotate-[0.5deg]"}`}
                  >
                    <div className="flex justify-between items-baseline gap-3">
                      <span className="font-sans font-bold text-[14px] text-cocoa">
                        {b.animal_ref ? (
                          <Link href={`/adopt/${b.animal_ref}`} className="no-underline text-cocoa hover:text-link">
                            {b.context}
                          </Link>
                        ) : (
                          b.context
                        )}
                      </span>
                      <span className="font-mono font-semibold text-[14px] text-cocoa whitespace-nowrap">
                        AED {b.amount_aed}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline gap-3 mt-1 border-t border-dashed border-cocoa/[.14] pt-2">
                      <span className="font-mono text-[11px] text-cocoa/45">
                        {formatDate(b.paid_on)}
                        {b.clinic ? ` · ${b.clinic}` : ""}
                        {b.note ? ` · ${b.note}` : ""}
                      </span>
                      <span className="font-sans font-semibold text-[11px] text-cocoa/50 whitespace-nowrap">
                        {b.source === "supporter" ? "paid by a supporter" : "paid by the shop"}
                      </span>
                    </div>
                    {partial && (
                      <>
                        <div className="mt-3 mb-[5px] h-[8px] rounded-[4px] bg-cream overflow-hidden">
                          <div
                            className="h-full rounded-[4px] bg-sunset"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between font-mono text-[10.5px] text-cocoa/55">
                          <span>AED {covered} covered</span>
                          <span>AED {b.amount_aed - covered!} to go</span>
                        </div>
                      </>
                    )}
                    {b.receipt_url && (
                      <a
                        href={b.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block font-sans font-bold text-[12.5px] mt-2"
                      >
                        View receipt →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <p className="font-sans font-medium text-[12px] text-cocoa/50 mt-4">
            Bills marked &ldquo;paid by a supporter&rdquo; went from the
            supporter to the clinic directly — they&rsquo;re shown here for the
            record but aren&rsquo;t part of the shop math.
          </p>
        </section>
      </div>
    </div>
  );
}
