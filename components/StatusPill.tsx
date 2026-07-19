import type { AnimalStatus } from "@/lib/types";

const styles: Record<AnimalStatus, { className: string; label: string }> = {
  available: { className: "bg-sunset text-cocoa", label: "LOOKING FOR A HOME" },
  pending: { className: "bg-tip-pink text-cocoa", label: "ADOPTION PENDING" },
  adopted: { className: "bg-cocoa text-cream", label: "ADOPTED" },
};

export default function StatusPill({ status }: { status: AnimalStatus }) {
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center font-sans font-bold text-[11px] tracking-[.08em] px-3 py-[5px] rounded-[7px] ${s.className}`}
    >
      {s.label}
    </span>
  );
}
