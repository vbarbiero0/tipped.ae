"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TippedLogo from "@/components/TippedLogo";
import { MonogramHead } from "@/components/TippedMonogram";
import { supabaseBrowser } from "@/lib/supabase-browser";

// Lands here from the password-recovery email. supabase-js consumes the
// token in the URL and establishes a session; this page then lets the
// rescuer set a new password.

const inputCls =
  "w-full box-border font-sans font-semibold text-[15px] text-cocoa bg-white border-[1.5px] border-cocoa/[.15] rounded-[11px] px-[15px] py-[14px] outline-none focus:border-cocoa";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "ready" | "invalid" | "saving">("checking");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    // Give supabase-js a moment to consume the recovery token from the URL.
    const timer = setTimeout(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setState(session ? "ready" : "invalid");
    }, 800);
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setState("ready");
    });
    return () => {
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw1.length < 8) return setError("At least 8 characters, please.");
    if (pw1 !== pw2) return setError("The two passwords don't match.");
    setState("saving");
    setError(null);
    const { error: err } = await supabaseBrowser().auth.updateUser({ password: pw1 });
    if (err) {
      setError(
        err.message.includes("different")
          ? "That's already your password — pick a new one."
          : "Couldn't set the password. Try again."
      );
      setState("ready");
      return;
    }
    router.replace("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-paper font-sans overflow-hidden flex items-center justify-center px-6 py-10">
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

        {state === "checking" && (
          <p className="font-sans font-semibold text-[14px] text-cocoa/55 m-0">
            One moment…
          </p>
        )}

        {state === "invalid" && (
          <>
            <h1 className="font-display font-extrabold text-[20px] text-cocoa m-0 mb-1">
              This link has expired
            </h1>
            <p className="font-sans font-semibold text-[13.5px] text-cocoa/55 m-0 mb-5">
              Reset links only work once and don&rsquo;t keep. Request a fresh
              one from the sign-in page.
            </p>
            <Link
              href="/dashboard/login"
              className="inline-block bg-cocoa text-cream no-underline font-sans font-bold text-[14px] px-6 py-3 rounded-[11px] hover:bg-[#241A14]"
            >
              Back to sign in
            </Link>
          </>
        )}

        {(state === "ready" || state === "saving") && (
          <>
            <h1 className="font-display font-extrabold text-[20px] text-cocoa m-0 mb-1">
              Set a new password
            </h1>
            <p className="font-sans font-semibold text-[13.5px] text-cocoa/55 m-0 mb-[26px]">
              At least 8 characters. You&rsquo;ll be signed straight in.
            </p>
            <form onSubmit={save} className="flex flex-col gap-[18px]">
              <div>
                <label htmlFor="pw1" className="block font-sans font-bold text-[13.5px] text-cocoa mb-[7px]">
                  New password
                </label>
                <input
                  id="pw1"
                  type="password"
                  autoComplete="new-password"
                  value={pw1}
                  onChange={(e) => setPw1(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="pw2" className="block font-sans font-bold text-[13.5px] text-cocoa mb-[7px]">
                  Once more
                </label>
                <input
                  id="pw2"
                  type="password"
                  autoComplete="new-password"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  className={inputCls}
                />
              </div>
              {error && (
                <p className="font-sans font-semibold text-[13px] text-badge-text m-0">{error}</p>
              )}
              <button
                type="submit"
                disabled={state === "saving"}
                className="w-full bg-cocoa text-cream font-sans font-bold text-[15px] py-[15px] rounded-[12px] cursor-pointer border-0 hover:bg-[#241A14] transition-colors disabled:opacity-60"
              >
                {state === "saving" ? "Saving…" : "Set password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
