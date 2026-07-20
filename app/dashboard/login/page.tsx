"use client";

import { useRouter } from "next/navigation";
import TippedLogo from "@/components/TippedLogo";
import { MonogramHead } from "@/components/TippedMonogram";
import { CONTACT_EMAIL } from "@/lib/brand";

// Rescuer sign-in per design spec. No self-signup, no social logins —
// rescuers are added by hand after vetting. Demo: submit → /dashboard.
// (Spec said hello@tipped.cat; domain decision 2026-07-19 is tipped.ae.)

const inputCls =
  "w-full box-border font-sans font-semibold text-[15px] text-cocoa bg-white border-[1.5px] border-cocoa/[.15] rounded-[11px] px-[15px] py-[14px] outline-none focus:border-cocoa";

const labelCls = "block font-sans font-bold text-[13.5px] text-cocoa mb-[7px]";

export default function RescuerLoginPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-paper font-sans overflow-hidden flex items-center justify-center px-6 py-10">
      {/* Watermark: giant monogram head bleeding off bottom-right */}
      <div
        className="absolute -bottom-[140px] -right-[120px] opacity-5 pointer-events-none select-none"
        aria-hidden
      >
        <MonogramHead width={700} />
      </div>

      <div className="relative w-[420px] max-w-full bg-white rounded-[20px] border border-cocoa/[.08] shadow-[0_24px_60px_rgba(58,42,34,.12)] px-10 pt-10 pb-[34px]">
        <div className="mb-5">
          <TippedLogo size={30} />
        </div>
        <h1 className="font-display font-extrabold text-[20px] text-cocoa m-0 mb-1">
          Rescuer sign in
        </h1>
        <p className="font-sans font-semibold text-[13.5px] text-cocoa/55 m-0 mb-[26px]">
          The dashboard for your animals and profile.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/dashboard");
          }}
          className="flex flex-col gap-[18px]"
        >
          <div>
            <label htmlFor="username" className={labelCls}>
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="straycatdubai"
              autoComplete="username"
              className={inputCls}
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-[7px]">
              <label htmlFor="password" className="font-sans font-bold text-[13.5px] text-cocoa">
                Password
              </label>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Forgot my password")}`}
                className="font-sans font-semibold text-[12.5px] no-underline"
              >
                Forgot it?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cocoa text-cream font-sans font-bold text-[15px] py-[15px] rounded-[12px] cursor-pointer border-0 hover:bg-[#241A14] transition-colors"
          >
            Sign in
          </button>
        </form>

        <p className="font-sans font-medium text-[12.5px] text-cocoa/55 text-center m-0 mt-5">
          New rescuer?{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Listing my animals on tipped")}`}
            className="font-bold"
          >
            Email us
          </a>{" "}
          — all rescuers are vetted.
        </p>
      </div>
    </div>
  );
}
