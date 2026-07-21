"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TippedLogo from "@/components/TippedLogo";
import { MonogramHead } from "@/components/TippedMonogram";
import { RESCUER_CONTACT_EMAIL } from "@/lib/brand";
import { supabaseBrowser } from "@/lib/supabase-browser";

// Rescuer sign-in: username → auth email via get_rescuer_email() RPC, then
// password auth. No self-signup, no social logins — rescuers are hand-vetted.

const inputCls =
  "w-full box-border font-sans font-semibold text-[15px] text-cocoa bg-white border-[1.5px] border-cocoa/[.15] rounded-[11px] px-[15px] py-[14px] outline-none focus:border-cocoa";

export default function RescuerLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "forgot" | "sent">("signin");

  // Already signed in? Straight to the dashboard.
  useEffect(() => {
    supabaseBrowser()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (session) router.replace("/dashboard");
      });
  }, [router]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = supabaseBrowser();
    const { data: email } = await supabase.rpc("get_rescuer_email", {
      p_username: username.trim().toLowerCase(),
    });
    if (!email) {
      setError("That didn't work. Check the username and password.");
      setBusy(false);
      return;
    }
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email as string,
      password,
    });
    if (authError) {
      setError("That didn't work. Check the username and password.");
      setBusy(false);
      return;
    }
    router.replace("/dashboard");
  };

  // Self-serve reset: username → auth email → recovery mail with a link to
  // /dashboard/reset (allow-listed in Supabase auth config).
  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = supabaseBrowser();
    const { data: email } = await supabase.rpc("get_rescuer_email", {
      p_username: username.trim().toLowerCase(),
    });
    if (!email) {
      setError("No rescuer with that username.");
      setBusy(false);
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email as string,
      { redirectTo: `${window.location.origin}/dashboard/reset` }
    );
    if (resetError) {
      setError("Couldn't send the reset email. Try again in a minute.");
      setBusy(false);
      return;
    }
    setBusy(false);
    setMode("sent");
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
        <h1 className="font-display font-extrabold text-[20px] text-cocoa m-0 mb-1">
          {mode === "signin" ? "Rescuer sign in" : "Reset your password"}
        </h1>
        <p className="font-sans font-semibold text-[13.5px] text-cocoa/55 m-0 mb-[26px]">
          {mode === "signin"
            ? "The dashboard for your animals and profile."
            : mode === "forgot"
              ? "Tell us your username — we'll email you a reset link."
              : "Check your email — the reset link is on its way."}
        </p>

        {mode === "sent" && (
          <button
            onClick={() => setMode("signin")}
            className="font-sans font-bold text-[13.5px] text-cocoa cursor-pointer bg-transparent border-0 p-0"
          >
            ← Back to sign in
          </button>
        )}

        {mode === "forgot" && (
          <form onSubmit={sendReset} className="flex flex-col gap-[18px]">
            <div>
              <label htmlFor="username-reset" className="block font-sans font-bold text-[13.5px] text-cocoa mb-[7px]">
                Username
              </label>
              <input
                id="username-reset"
                placeholder="straycatdubai"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputCls}
              />
            </div>
            {error && (
              <p className="font-sans font-semibold text-[13px] text-badge-text m-0">{error}</p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-cocoa text-cream font-sans font-bold text-[15px] py-[15px] rounded-[12px] cursor-pointer border-0 hover:bg-[#241A14] transition-colors disabled:opacity-60"
            >
              {busy ? "Sending…" : "Email me a reset link"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
              className="font-sans font-bold text-[13px] text-cocoa/60 hover:text-cocoa cursor-pointer bg-transparent border-0 p-0 self-center"
            >
              Back to sign in
            </button>
          </form>
        )}

        {mode === "signin" && (
        <form onSubmit={signIn} className="flex flex-col gap-[18px]">
          <div>
            <label htmlFor="username" className="block font-sans font-bold text-[13.5px] text-cocoa mb-[7px]">
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="straycatdubai"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-[7px]">
              <label htmlFor="password" className="font-sans font-bold text-[13.5px] text-cocoa">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError(null);
                }}
                className="font-sans font-semibold text-[12.5px] text-link hover:text-link-hover cursor-pointer bg-transparent border-0 p-0"
              >
                Forgot it?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </div>

          {error && (
            <p className="font-sans font-semibold text-[13px] text-badge-text m-0">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-cocoa text-cream font-sans font-bold text-[15px] py-[15px] rounded-[12px] cursor-pointer border-0 hover:bg-[#241A14] transition-colors disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        )}

        <p className="font-sans font-medium text-[12.5px] text-cocoa/55 text-center m-0 mt-5">
          New rescuer?{" "}
          <a
            href={`mailto:${RESCUER_CONTACT_EMAIL}?subject=${encodeURIComponent("Listing my animals on tipped")}`}
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
