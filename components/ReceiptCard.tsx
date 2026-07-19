import { CONTACT_EMAIL } from "@/lib/brand";

// The receipt-card visual: off-white, dashed dividers, slight tilt,
// ui-monospace numbers, Sunset progress where a bill is partly covered.
export default function ReceiptCard({
  clinic,
  billNo,
  line,
  amountAed,
  coveredAed,
  cta = true,
  tilt = true,
}: {
  clinic: string;
  billNo?: string | null;
  line: string;
  amountAed: number;
  coveredAed?: number | null;
  cta?: boolean;
  tilt?: boolean;
}) {
  const covered = coveredAed ?? null;
  const toGo = covered !== null ? Math.max(0, amountAed - covered) : null;
  const pct = covered !== null ? Math.min(100, Math.round((covered / amountAed) * 100)) : null;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Paying a vet bill: ${line}`
  )}&body=${encodeURIComponent(
    `Hi — I'd like to pay ${clinic} directly toward "${line}". Please send me the clinic's payment details.`
  )}`;

  return (
    <div
      className={`bg-receipt rounded-[18px] px-7 py-[26px] shadow-receipt ${tilt ? "-rotate-1" : ""}`}
    >
      <div className="flex justify-between items-baseline mb-4 gap-3">
        <span className="font-sans font-bold text-[13px] text-cocoa">{clinic}</span>
        {billNo && (
          <span className="font-mono text-[11px] text-cocoa/45 whitespace-nowrap">{billNo}</span>
        )}
      </div>
      <div className="flex justify-between items-baseline gap-3 py-[14px] border-t-[1.5px] border-b-[1.5px] border-dashed border-cocoa/[.18]">
        <span className="font-sans font-semibold text-[14.5px] text-cocoa">{line}</span>
        <span className="font-mono font-semibold text-[15px] text-cocoa whitespace-nowrap">
          AED {amountAed}
        </span>
      </div>
      {pct !== null && (
        <>
          <div className="mt-4 mb-[6px] h-[10px] rounded-[4px] bg-cream overflow-hidden">
            <div
              className="h-full rounded-[4px] bg-sunset"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[11.5px] text-cocoa/55 mb-[18px]">
            <span>AED {covered} covered</span>
            <span>AED {toGo} to go</span>
          </div>
        </>
      )}
      {cta && (
        <>
          <a
            href={mailto}
            className={`block text-center bg-sunset text-cocoa no-underline font-sans font-bold text-[15px] py-[14px] rounded-xl hover:bg-sunset-hover ${pct === null ? "mt-4" : ""}`}
          >
            Pay the clinic directly
          </a>
          <div className="font-sans font-semibold text-[11.5px] text-cocoa/50 text-center mt-[10px]">
            Goes to the clinic&rsquo;s own account. tipped never touches it.
          </div>
        </>
      )}
    </div>
  );
}
