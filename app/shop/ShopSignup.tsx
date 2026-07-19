"use client";

import { useActionState } from "react";
import { signupForShop, type SignupState } from "./actions";
import { CONTACT_EMAIL } from "@/lib/brand";

const initialState: SignupState = { status: "idle" };

export default function ShopSignup() {
  const [state, action, pending] = useActionState(signupForShop, initialState);

  if (state.status === "ok") {
    return (
      <p className="font-sans font-semibold text-[14px] text-cocoa m-0">
        Noted. You&rsquo;ll hear from us when new things land in the shop.
      </p>
    );
  }

  return (
    <div>
      <form action={action} className="flex gap-2 flex-wrap">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="font-sans font-medium text-[14px] text-cocoa bg-white border-[1.5px] border-cocoa/25 rounded-[10px] px-5 py-3 min-w-[240px] outline-none focus:border-cocoa"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-cocoa text-cream font-sans font-bold text-[14px] px-6 py-3 rounded-[10px] cursor-pointer hover:bg-[#241A14] disabled:opacity-60"
        >
          {pending ? "One sec…" : "Keep me posted"}
        </button>
      </form>
      {state.status === "invalid" && (
        <p className="font-sans font-semibold text-[12.5px] text-badge-text mt-2 m-0">
          That email doesn&rsquo;t look right — try again?
        </p>
      )}
      {(state.status === "not-configured" || state.status === "error") && (
        <p className="font-sans font-semibold text-[12.5px] text-cocoa/60 mt-2 m-0">
          Signups aren&rsquo;t wired up yet — email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we&rsquo;ll
          keep you posted.
        </p>
      )}
    </div>
  );
}
