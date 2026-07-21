"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { useRescuer } from "@/components/dashboard/useRescuer";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { SOCIAL_PLATFORMS, Social } from "@/lib/socials";
import { EAR_PINK } from "@/lib/brand";
import { EMIRATES } from "@/lib/emirates";

// Rescuer profile — live against Supabase. Clinics and wishlists are jsonb
// lists edited inline and saved together with the rest.

type LinkItem = { label: string; url?: string };

const inputCls =
  "w-full box-border font-sans font-semibold text-[15px] text-cocoa bg-white border-[1.5px] border-cocoa/[.15] rounded-[11px] px-[15px] py-[13px] outline-none focus:border-cocoa";
const labelCls = "block font-sans font-bold text-[13.5px] text-cocoa mb-[7px]";

function LinkList({
  items,
  onChange,
  addLabel,
}: {
  items: LinkItem[];
  onChange: (items: LinkItem[]) => void;
  addLabel: string;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const add = () => {
    if (!name.trim()) return;
    onChange([...items, { label: name.trim(), url: url.trim() || undefined }]);
    setName("");
    setUrl("");
    setAdding(false);
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {items.map((it, i) => (
        <div
          key={`${it.label}-${i}`}
          className="bg-white border-[1.5px] border-cocoa/[.12] rounded-[12px] px-4 py-[13px] flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <div className="font-sans font-bold text-[14px] text-cocoa">{it.label}</div>
            {it.url && (
              <div className="font-mono text-[11.5px] text-cocoa/50 mt-[2px] truncate">
                {it.url}
              </div>
            )}
          </div>
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label={`Remove ${it.label}`}
            className="font-sans font-bold text-[13px] text-cocoa/40 hover:text-[#C4525C] cursor-pointer bg-transparent border-0"
          >
            ✕
          </button>
        </div>
      ))}
      {adding ? (
        <div className="bg-white border-[1.5px] border-cocoa/[.12] rounded-[12px] p-3 flex flex-col gap-2">
          <input
            placeholder="Name (e.g. Modern Vet · Umm Suqeim)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${inputCls} text-[14px] py-[10px]`}
          />
          <input
            placeholder="Link (optional)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`${inputCls} text-[14px] py-[10px] font-mono`}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setAdding(false)}
              className="font-sans font-bold text-[12.5px] text-cocoa/60 cursor-pointer bg-transparent border-0"
            >
              Cancel
            </button>
            <button
              onClick={add}
              className="font-sans font-bold text-[12.5px] text-cream bg-cocoa px-4 py-2 rounded-[9px] cursor-pointer border-0 hover:bg-[#241A14]"
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="border-[1.5px] border-dashed border-cocoa/30 rounded-[12px] p-[13px] text-center font-sans font-bold text-[13.5px] text-cocoa/65 cursor-pointer bg-transparent hover:border-cocoa hover:text-cocoa transition-colors"
        >
          {addLabel}
        </button>
      )}
    </div>
  );
}

export default function RescuerProfilePage() {
  const router = useRouter();
  const { rescuer, loading } = useRescuer();

  const [name, setName] = useState("");
  const [emirate, setEmirate] = useState("Dubai");
  const [blurb, setBlurb] = useState("");
  const [email, setEmail] = useState("");
  const [socials, setSocials] = useState<Social[]>([]);
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [clinics, setClinics] = useState<LinkItem[]>([]);
  const [wishlists, setWishlists] = useState<LinkItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!rescuer) return;
    setName(rescuer.name);
    setEmirate(rescuer.emirate ?? "Dubai");
    setBlurb(rescuer.blurb ?? "");
    setEmail(rescuer.email);
    setSocials(rescuer.socials ?? []);
    setPhone(rescuer.phone ?? "");
    setAvatarUrl(rescuer.avatar_url);
    setClinics((rescuer.clinics ?? []).map((c) => ({ label: c.name, url: c.url })));
    setWishlists(rescuer.wishlist_links ?? []);
  }, [rescuer]);

  const save = async () => {
    if (!rescuer) return;
    setBusy(true);
    setNote(null);
    const supabase = supabaseBrowser();
    try {
      let avatar = avatarUrl;
      if (avatarFile) {
        const path = `avatars/${rescuer.id}-${Date.now()}`;
        const { error: upErr } = await supabase.storage
          .from("pet-photos")
          .upload(path, avatarFile, { contentType: avatarFile.type });
        if (upErr) throw upErr;
        avatar = supabase.storage.from("pet-photos").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase
        .from("rescuers")
        .update({
          name: name.trim(),
          emirate,
          blurb: blurb.trim() || null,
          email: email.trim(),
          socials: socials
            .map((x) => ({ platform: x.platform, handle: x.handle.trim().replace(/^@/, "") }))
            .filter((x) => x.handle),
          phone: phone.trim() || null,
          avatar_url: avatar,
          clinics: clinics.map((c) => ({ name: c.label, url: c.url })),
          wishlist_links: wishlists,
        })
        .eq("id", rescuer.id);
      if (error) throw error;
      setAvatarUrl(avatar);
      setAvatarFile(null);
      setNote("Saved.");
    } catch {
      setNote("Couldn't save. Check your connection and try again.");
    }
    setBusy(false);
  };

  const avatarPreview = avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl;

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 px-4 pt-5 md:px-[34px] md:pt-[30px] pb-[110px] relative min-w-0">
        {loading ? (
          <div className="font-sans font-semibold text-[14px] text-cocoa/50">Loading…</div>
        ) : (
          <>
            <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0 mb-1">
              My profile
            </h1>
            <div className="font-sans font-semibold text-[13.5px] text-cocoa/55 mb-[26px]">
              What adopters see next to your pets.
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-7 max-w-[940px]">
              <div className="flex flex-col gap-[22px]">
                <div className="flex gap-4 items-end">
                  <button
                    type="button"
                    onClick={() => avatarRef.current?.click()}
                    className="w-[84px] h-[84px] shrink-0 bg-cream rounded-[24px] overflow-hidden flex items-center justify-center font-sans font-bold text-[12px] text-cocoa/50 cursor-pointer border-0 hover:bg-[#FFEDD6]"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Profile photo" className="w-full h-full object-cover" />
                    ) : (
                      "photo"
                    )}
                  </button>
                  <input
                    ref={avatarRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                  />
                  <div className="flex-1">
                    <label className={labelCls}>Name or group name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Emirate</label>
                  <select
                    value={emirate}
                    onChange={(e) => setEmirate(e.target.value)}
                    className={`${inputCls} appearance-none`}
                  >
                    {EMIRATES.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Short bio</label>
                  <textarea
                    value={blurb}
                    onChange={(e) => setBlurb(e.target.value)}
                    className={`${inputCls} h-[100px] resize-none text-[14.5px] leading-[1.6]`}
                  />
                </div>

                <div>
                  <label className={labelCls}>Contact email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                  <div className="font-sans font-semibold text-[12px] text-cocoa/50 mt-[7px]">
                    Adoption inquiries land straight in your inbox — tipped never
                    handles messages. (This is separate from your sign-in email.)
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    Socials{" "}
                    <span className="font-semibold text-cocoa/50">
                      — shown on your public page
                    </span>
                  </label>
                  <div className="flex flex-col gap-2">
                    {socials.map((x, i) => (
                      <div key={i} className="flex gap-2">
                        <select
                          value={x.platform}
                          onChange={(e) =>
                            setSocials((prev) =>
                              prev.map((p, j) =>
                                j === i ? { ...p, platform: e.target.value as Social["platform"] } : p
                              )
                            )
                          }
                          className={`${inputCls} text-[14px] py-[10px] w-[130px] shrink-0`}
                        >
                          {SOCIAL_PLATFORMS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                        <input
                          value={x.handle}
                          onChange={(e) =>
                            setSocials((prev) =>
                              prev.map((p, j) => (j === i ? { ...p, handle: e.target.value } : p))
                            )
                          }
                          placeholder={x.platform === "other" ? "https://…" : "@handle"}
                          className={`${inputCls} text-[14px] py-[10px]`}
                        />
                        <button
                          onClick={() => setSocials((prev) => prev.filter((_, j) => j !== i))}
                          aria-label="Remove"
                          className="shrink-0 w-[38px] rounded-[10px] border-[1.5px] border-cocoa/[.15] bg-transparent cursor-pointer text-cocoa/50 hover:text-cocoa"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {socials.length < 4 && (
                      <button
                        onClick={() => setSocials((prev) => [...prev, { platform: "instagram", handle: "" }])}
                        className="self-start font-sans font-bold text-[13px] text-cocoa/60 bg-transparent border-0 p-0 cursor-pointer hover:text-cocoa"
                      >
                        + Add a social
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    Phone{" "}
                    <span className="font-semibold text-cocoa/50">
                      — private, only Vanessa sees it
                    </span>
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 000 0000"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[22px]">
                <div>
                  <label className={labelCls}>
                    Partner vet clinics{" "}
                    <span className="font-semibold text-cocoa/50">
                      · supporters pay your bill at the clinic, directly
                    </span>
                  </label>
                  <LinkList items={clinics} onChange={setClinics} addLabel="+ Add a clinic" />
                </div>

                <div>
                  <label className={labelCls}>
                    Wishlist links{" "}
                    <span className="font-semibold text-cocoa/50">
                      · goods delivered straight to you
                    </span>
                  </label>
                  <LinkList items={wishlists} onChange={setWishlists} addLabel="+ Add a wishlist" />
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
                    wishlists. That&rsquo;s why there are no prices or payment
                    fields anywhere here.
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed left-[230px] right-0 bottom-0 bg-paper border-t border-cocoa/[.08] px-[34px] py-4 flex justify-end items-center gap-4">
              {note && (
                <span
                  className={`font-sans font-semibold text-[13px] ${
                    note === "Saved." ? "text-cocoa/60" : "text-badge-text"
                  }`}
                >
                  {note}
                </span>
              )}
              <button
                onClick={save}
                disabled={busy}
                className="font-sans font-bold text-[14.5px] text-cream bg-cocoa px-[34px] py-[13px] rounded-[11px] cursor-pointer border-0 hover:bg-[#241A14] disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save profile"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
