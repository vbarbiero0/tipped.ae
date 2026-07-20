"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { ChevronRightIcon } from "@/components/dashboard/icons";
import { EAR_PINK } from "@/lib/brand";

// Screen 3 of `Tipped Rescuer Dashboard.dc.html` — rescuer profile.
// Front-end demo with Silvana's seed values; local state only.

const inputCls =
  "w-full box-border font-sans font-semibold text-[15px] text-cocoa bg-white border-[1.5px] border-cocoa/[.15] rounded-[11px] px-[15px] py-[13px] outline-none focus:border-cocoa";

const labelCls = "block font-sans font-bold text-[13.5px] text-cocoa mb-[7px]";

function LinkCard({ title, url }: { title: string; url: string }) {
  return (
    <div className="bg-white border-[1.5px] border-cocoa/[.12] rounded-[12px] px-4 py-[13px] flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="font-sans font-bold text-[14px] text-cocoa">{title}</div>
        <div className="font-mono text-[11.5px] text-cocoa/50 mt-[2px] truncate">{url}</div>
      </div>
      <ChevronRightIcon />
    </div>
  );
}

function DashedAdd({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="border-[1.5px] border-dashed border-cocoa/30 rounded-[12px] p-[13px] text-center font-sans font-bold text-[13.5px] text-cocoa/65 cursor-pointer bg-transparent hover:border-cocoa hover:text-cocoa transition-colors"
    >
      {label}
    </button>
  );
}

export default function RescuerProfilePage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 px-[34px] pt-[30px] pb-[110px] relative min-w-0">
        <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0 mb-1">
          My profile
        </h1>
        <div className="font-sans font-semibold text-[13.5px] text-cocoa/55 mb-[26px]">
          What adopters see next to your animals.
        </div>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-7 max-w-[940px]">
          {/* Left column */}
          <div className="flex flex-col gap-[22px]">
            <div className="flex gap-4 items-end">
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                className="w-[84px] h-[84px] shrink-0 bg-cream rounded-[24px] overflow-hidden flex items-center justify-center font-sans font-bold text-[12px] text-cocoa/50 cursor-pointer border-0 hover:bg-[#FFEDD6]"
              >
                {avatar ? (
                  <img src={avatar} alt="Profile photo" className="w-full h-full object-cover" />
                ) : (
                  "photo"
                )}
              </button>
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setAvatar(f ? URL.createObjectURL(f) : null);
                }}
              />
              <div className="flex-1">
                <label className={labelCls}>Name or group name</label>
                <input defaultValue="Silvana — Stray Cat Dubai" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Emirate</label>
              <input defaultValue="Dubai" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Short bio</label>
              <textarea
                defaultValue="Feeding and fixing the cats of Deira since 2019. Around 40 ear-tipped regulars on my route."
                className={`${inputCls} h-[100px] resize-none text-[14.5px] leading-[1.6]`}
              />
            </div>

            <div>
              <label className={labelCls}>Contact email</label>
              <input defaultValue="silvana@straycatdubai.com" className={inputCls} />
              <div className="font-sans font-semibold text-[12px] text-cocoa/50 mt-[7px]">
                Adoption inquiries land straight in your inbox — tipped never
                handles messages.
              </div>
            </div>

            <div>
              <label className={labelCls}>Instagram</label>
              <input defaultValue="@straycatdubai" className={inputCls} />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-[22px]">
            <div>
              <label className={labelCls}>
                Partner vet clinics{" "}
                <span className="font-semibold text-cocoa/50">
                  · supporters pay your bill at the clinic, directly
                </span>
              </label>
              <div className="flex flex-col gap-[10px]">
                <LinkCard
                  title="Modern Vet · Umm Suqeim"
                  url="modernvet.com/pay/straycatdubai"
                />
                <LinkCard
                  title="Vets in the City · Marina"
                  url="vetsinthecity.ae/bill/silvana"
                />
                <DashedAdd label="+ Add a clinic" />
              </div>
            </div>

            <div>
              <label className={labelCls}>
                Wishlist links{" "}
                <span className="font-semibold text-cocoa/50">
                  · goods delivered straight to you
                </span>
              </label>
              <div className="flex flex-col gap-[10px]">
                <LinkCard title="Amazon wishlist" url="amazon.ae/hz/wishlist/ls/2KX…" />
                <LinkCard
                  title="Dubai Pet Food — food run"
                  url="dubaipetfood.com/list/straycat…"
                />
                <DashedAdd label="+ Add a wishlist" />
              </div>
            </div>

            <div className="bg-cream rounded-[12px] px-[18px] py-4 flex gap-3 items-start">
              <svg width="20" height="18" viewBox="0 0 120 110" className="shrink-0 mt-[1px]" aria-hidden>
                <path
                  d="M28,52 C29,39 31,23 33,15 C34,11.5 36,12 38,15 C42,21 48,27 52,32 C57,30 63,30 68,32 L74,18 L86,14 L92,52 C96,60 96,70 92,78 C84,96 36,96 28,78 C24,70 24,60 28,52 Z"
                  fill="#3A2A22"
                />
                <path d="M68,32 L74,18 L86,14 L92,52 Z" fill={EAR_PINK} />
              </svg>
              <div className="font-sans font-semibold text-[13px] leading-[1.6] text-cocoa/80">
                No money ever moves through tipped or to you. Supporters pay
                clinics directly via your bill links, or send goods via your
                wishlists. That&rsquo;s why there are no prices or payment fields
                anywhere here.
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="fixed left-[230px] right-0 bottom-0 bg-paper border-t border-cocoa/[.08] px-[34px] py-4 flex justify-end">
          <button
            onClick={() => router.push("/dashboard")}
            className="font-sans font-bold text-[14.5px] text-cream bg-cocoa px-[34px] py-[13px] rounded-[11px] cursor-pointer border-0 hover:bg-[#241A14]"
          >
            Save profile
          </button>
        </div>
      </main>
    </div>
  );
}
