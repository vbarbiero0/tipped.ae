// Small stroke icons for the rescuer dashboard, per the design file.
import { COCOA } from "@/lib/brand";

export const DELETE_RED = "#C4525C";

export function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden>
      <path
        d="M4,16 L4.8,12.8 L13.5,4.1 A1.6,1.6 0 0 1 15.9,6.5 L7.2,15.2 Z"
        fill="none"
        stroke={COCOA}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SwapIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden>
      <path
        d="M4,7 H14 M14,7 L11,4 M14,7 L11,10 M16,13 H6 M6,13 L9,10 M6,13 L9,16"
        fill="none"
        stroke={COCOA}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden>
      <path
        d="M4,6 H16 M8,6 V4.5 A1,1 0 0 1 9,3.5 H11 A1,1 0 0 1 12,4.5 V6 M6,6 L6.8,16 A1.5,1.5 0 0 0 8.3,17.3 H11.7 A1.5,1.5 0 0 0 13.2,16 L14,6"
        fill="none"
        stroke={DELETE_RED}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <path
        d="M10,4 V16 M4,10 H16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
      <path
        d="M10,14 V4 M10,4 L6.5,7.5 M10,4 L13.5,7.5 M4,14 V15.5 A1.5,1.5 0 0 0 5.5,17 H14.5 A1.5,1.5 0 0 0 16,15.5 V14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
      <path
        d="M8,5 L13,10 L8,15"
        fill="none"
        stroke="rgba(58,42,34,.4)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="11" height="9" viewBox="0 0 12 10" aria-hidden>
      <path
        d="M1,5 L4.5,8.5 L11,1.5"
        fill="none"
        stroke="#FFF3E4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Empty-state mark: Cocoa head, Sunset + Tip-pink ears, Paper eyes
export function EmptyStateHead() {
  return (
    <svg width="84" height="77" viewBox="0 0 120 110" aria-hidden>
      <path
        d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 C57,30 63,30 68,32 L74,18 L86,14 L92,52 C96,60 96,70 92,78 C84,96 36,96 28,78 C24,70 24,60 28,52 Z"
        fill="#3A2A22"
      />
      <path d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 Z" fill="#F0955B" />
      <path d="M68,32 L74,18 L86,14 L92,52 Z" fill="#F58B93" />
      <circle cx="46" cy="64" r="5" fill="#FBF7F0" />
      <circle cx="74" cy="64" r="5" fill="#FBF7F0" />
    </svg>
  );
}
