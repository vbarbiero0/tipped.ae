"use client";

import { useCallback, useEffect, useState } from "react";
import AdminShell, { useAdmin } from "@/components/admin/AdminShell";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { EMIRATES } from "@/lib/emirates";
import { inviteRescuer } from "@/app/admin/actions";

// Rescuer management: trust level, active (deactivating unpublishes their
// pets via RLS — deletes nothing), consent flag, inline profile edit,
// and the invite flow (account + emailable one-time login link).

interface AdminRescuer {
  id: string;
  name: string;
  username: string | null;
  email: string;
  emirate: string | null;
  socials: { platform: string; handle: string }[] | null;
  phone: string | null;
  trust_level: "trusted" | "review";
  role: string;
  active: boolean;
  is_placeholder: boolean;
  created_at: string;
}

const inputCls =
  "w-full box-border font-sans font-semibold text-[14px] text-cocoa bg-white border-[1.5px] border-cocoa/[.15] rounded-[10px] px-3 py-[10px] outline-none focus:border-cocoa";

interface RescuerApplication {
  id: string;
  name: string;
  email: string;
  emirate: string | null;
  phone: string | null;
  vets: string | null;
  socials: { platform: string; handle: string }[] | null;
  note: string | null;
  created_at: string;
}

export default function AdminRescuersPage() {
  const { admin, loading } = useAdmin();
  const [rows, setRows] = useState<AdminRescuer[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminRescuer | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ name: "", username: "", email: "", emirate: "Dubai" });
  const [inviteResult, setInviteResult] = useState<{ link?: string; error?: string } | null>(null);
  const [inviteBusy, setInviteBusy] = useState(false);
  const [applications, setApplications] = useState<RescuerApplication[]>([]);

  const load = useCallback(async () => {
    const supabase = supabaseBrowser();
    const { data } = await supabase
      .from("rescuers")
      .select("id,name,username,email,emirate,socials,phone,trust_level,role,active,is_placeholder,created_at")
      .order("created_at", { ascending: true });
    setRows((data as AdminRescuer[]) ?? []);
    const { data: pets } = await supabase.from("pets").select("rescuer_id");
    const c: Record<string, number> = {};
    for (const a of (pets as { rescuer_id: string }[]) ?? [])
      c[a.rescuer_id] = (c[a.rescuer_id] ?? 0) + 1;
    setCounts(c);
    const { data: apps } = await supabase
      .from("rescuer_applications")
      .select("id,name,email,emirate,phone,vets,socials,note,created_at")
      .is("handled_at", null)
      .order("created_at", { ascending: true });
    setApplications((apps as RescuerApplication[]) ?? []);
  }, []);

  useEffect(() => {
    if (admin) load();
  }, [admin, load]);

  const patch = async (id: string, fields: Partial<AdminRescuer>) => {
    setBusyId(id);
    const { error } = await supabaseBrowser().from("rescuers").update(fields).eq("id", id);
    if (!error) setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...fields } : r)));
    setBusyId(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    await patch(editing.id, {
      name: editing.name,
      username: editing.username,
      email: editing.email,
      emirate: editing.emirate,
      phone: editing.phone,
    });
    setEditing(null);
  };

  const sendInvite = async () => {
    setInviteBusy(true);
    setInviteResult(null);
    const {
      data: { session },
    } = await supabaseBrowser().auth.getSession();
    const res = await inviteRescuer({
      accessToken: session?.access_token ?? "",
      ...invite,
    });
    setInviteResult(res.ok ? { link: res.link } : { error: res.error });
    setInviteBusy(false);
    if (res.ok) load();
  };

  const chip = (label: string, on: boolean) => (
    <span
      className={`font-sans font-bold text-[11px] px-2 py-[3px] rounded-[6px] ${
        on ? "bg-cream text-cocoa" : "bg-transparent text-cocoa/40 border border-cocoa/15"
      }`}
    >
      {label}
    </span>
  );

  // Gmail web compose (not mailto:) so it opens gmail.com in the browser
  // regardless of the device's default mail app — this button is admin-only.
  const inviteGmail = (link: string) =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(invite.email)}&su=${encodeURIComponent("Your tipped rescuer account")}&body=${encodeURIComponent(
      `Hi ${invite.name} —\n\nYour tipped rescuer account is ready. Set your password here (one-time link):\n\n${link}\n\nYour username is: ${invite.username}\nSign in afterwards at https://tippedae.netlify.app/dashboard/login\n\nWelcome aboard.`
    )}`;

  return (
    <AdminShell admin={admin}>
      {loading ? (
        <div className="font-sans font-semibold text-[14px] text-cocoa/50">Loading…</div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap mb-[22px]">
            <div>
              <h1 className="font-display font-extrabold text-[30px] text-cocoa m-0">Rescuers</h1>
              <div className="font-sans font-semibold text-[13.5px] text-cocoa/55 mt-[3px]">
                {rows.length} on the platform · deactivating unpublishes, never deletes
              </div>
            </div>
            <button
              onClick={() => {
                setInviteOpen((v) => !v);
                setInviteResult(null);
              }}
              className="bg-cocoa text-cream font-sans font-bold text-[14px] px-5 py-3 rounded-[11px] cursor-pointer border-0 hover:bg-[#241A14]"
            >
              Invite a rescuer
            </button>
          </div>

          {applications.length > 0 && (
            <div className="bg-white rounded-[16px] shadow-card p-5 mb-5 max-w-[860px]">
              <div className="font-sans font-bold text-[11px] tracking-[.08em] text-cocoa/45 mb-3">
                APPLICATIONS · {applications.length}
              </div>
              {applications.map((a, i) => (
                <div key={a.id}
                  className={`flex items-start justify-between gap-4 py-3 ${
                    i < applications.length - 1 ? "border-b border-cocoa/[.07]" : ""
                  }`}>
                  <div className="min-w-0">
                    <div className="font-sans font-bold text-[14px] text-cocoa">
                      {a.name}
                      <span className="font-semibold text-[12px] text-cocoa/50 ml-2">{a.emirate}</span>
                    </div>
                    <div className="font-sans font-semibold text-[12.5px] text-cocoa/60">
                      {[a.email, a.phone].filter(Boolean).join(" · ")}
                    </div>
                    {a.vets && (
                      <div className="font-sans font-semibold text-[12px] text-cocoa/60 mt-[2px]">
                        Vets: <span className="font-medium">{a.vets}</span>
                      </div>
                    )}
                    {(a.socials ?? []).length > 0 && (
                      <div className="font-sans font-semibold text-[12px] text-cocoa/55 mt-[2px]">
                        {(a.socials ?? []).map((x) => `${x.platform}: ${x.handle}`).join(" · ")}
                      </div>
                    )}
                    {a.note && (
                      <div className="font-sans font-medium text-[13px] text-cocoa/70 mt-1">&ldquo;{a.note}&rdquo;</div>
                    )}
                    <div className="font-mono text-[10.5px] text-cocoa/40 mt-1">{a.created_at.slice(0, 10)}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setInvite({
                          name: a.name,
                          username: a.name.toLowerCase().replace(/[^a-z0-9]+/g, ""),
                          email: a.email,
                          emirate: a.emirate ?? "Dubai",
                        });
                        setInviteOpen(true);
                        setInviteResult(null);
                      }}
                      className="font-sans font-bold text-[12px] text-cocoa border-[1.5px] border-cocoa/20 px-3 py-[6px] rounded-[8px] cursor-pointer bg-transparent hover:bg-cocoa/[.05]">
                      Invite →
                    </button>
                    <button
                      onClick={async () => {
                        await supabaseBrowser().from("rescuer_applications")
                          .update({ handled_at: new Date().toISOString() }).eq("id", a.id);
                        setApplications((prev) => prev.filter((x) => x.id !== a.id));
                      }}
                      className="font-sans font-bold text-[12px] text-cocoa/55 border-[1.5px] border-cocoa/15 px-3 py-[6px] rounded-[8px] cursor-pointer bg-transparent hover:border-cocoa/40">
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {inviteOpen && (
            <div className="bg-white rounded-[16px] shadow-card p-5 mb-6 max-w-[560px]">
              <div className="font-display font-extrabold text-[17px] text-cocoa mb-3">
                New rescuer
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input placeholder="Name or group" value={invite.name}
                  onChange={(e) => setInvite({ ...invite, name: e.target.value })} className={inputCls} />
                <input placeholder="Username (for sign-in)" value={invite.username}
                  onChange={(e) => setInvite({ ...invite, username: e.target.value })} className={inputCls} />
                <input placeholder="Email" value={invite.email}
                  onChange={(e) => setInvite({ ...invite, email: e.target.value })} className={inputCls} />
                <select value={invite.emirate}
                  onChange={(e) => setInvite({ ...invite, emirate: e.target.value })} className={inputCls}>
                  {EMIRATES.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={sendInvite} disabled={inviteBusy}
                  className="bg-cocoa text-cream font-sans font-bold text-[13.5px] px-5 py-[10px] rounded-[10px] cursor-pointer border-0 hover:bg-[#241A14] disabled:opacity-60">
                  {inviteBusy ? "Creating…" : "Create account + link"}
                </button>
                {inviteResult?.error && (
                  <span className="font-sans font-semibold text-[13px] text-badge-text">{inviteResult.error}</span>
                )}
              </div>
              {inviteResult?.link && (
                <div className="mt-3 bg-paper rounded-[10px] p-3">
                  <div className="font-sans font-semibold text-[12.5px] text-cocoa/70 mb-2">
                    Account created. Send them this one-time link (sets their password):
                  </div>
                  <div className="font-mono text-[11px] text-cocoa/70 break-all mb-2">{inviteResult.link}</div>
                  <a href={inviteGmail(inviteResult.link)} target="_blank" rel="noopener noreferrer"
                    className="inline-block bg-cocoa text-cream no-underline font-sans font-bold text-[12.5px] px-4 py-2 rounded-[9px] hover:bg-[#241A14]">
                    Email it via Gmail
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-[16px] shadow-card overflow-hidden max-w-[900px]">
            <div className="hidden md:grid grid-cols-[1.4fr_1fr_.9fr_.6fr_.8fr_auto] gap-3 items-center px-5 py-3 border-b border-cocoa/[.07] font-sans font-bold text-[11px] tracking-[.08em] text-cocoa/45">
              <span>RESCUER</span><span>EMIRATE</span><span>TRUST</span><span>PETS</span><span>JOINED</span><span className="text-right">ACTIONS</span>
            </div>
            {rows.map((r, i) => (
              <div key={r.id}
                className={`flex flex-wrap md:grid md:grid-cols-[1.4fr_1fr_.9fr_.6fr_.8fr_auto] gap-3 items-center px-4 md:px-5 py-3 ${
                  i < rows.length - 1 ? "border-b border-cocoa/[.07]" : ""
                } ${!r.active ? "opacity-60" : ""}`}>
                <div className="min-w-0 flex-1 md:flex-none">
                  <div className="font-sans font-bold text-[14px] text-cocoa truncate">
                    {r.name}
                    {r.role === "admin" && (
                      <span className="ml-2 font-bold text-[10px] tracking-[.08em] text-cocoa/45">ADMIN</span>
                    )}
                  </div>
                  <div className="font-sans font-semibold text-[11.5px] text-cocoa/50 truncate">
                    {r.username ? `@${r.username} · ` : ""}{r.email}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {chip("placeholder", r.is_placeholder)}
                    {!r.active && chip("deactivated", true)}
                  </div>
                </div>
                <span className="hidden md:inline font-sans font-semibold text-[13px] text-cocoa/75">{r.emirate}</span>
                <button onClick={() => patch(r.id, { trust_level: r.trust_level === "trusted" ? "review" : "trusted" })}
                  disabled={busyId === r.id}
                  className={`font-sans font-bold text-[12px] px-3 py-[6px] rounded-[8px] cursor-pointer transition-colors justify-self-start ${
                    r.trust_level === "trusted"
                      ? "bg-sunset/[.16] text-link border-[1.5px] border-sunset"
                      : "bg-transparent text-cocoa/60 border-[1.5px] border-cocoa/20 hover:border-cocoa/50"
                  }`}
                  title="Toggle trust level">
                  {r.trust_level}
                </button>
                <span className="hidden md:inline font-sans font-semibold text-[13px] text-cocoa/75">{counts[r.id] ?? 0}</span>
                <span className="hidden md:inline font-mono text-[11.5px] text-cocoa/50">{r.created_at.slice(0, 10)}</span>
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                  <button onClick={() => setEditing({ ...r })}
                    className="font-sans font-bold text-[12px] text-cocoa border-[1.5px] border-cocoa/20 px-3 py-[6px] rounded-[8px] cursor-pointer bg-transparent hover:bg-cocoa/[.05]">
                    Edit
                  </button>
                  <button onClick={() => patch(r.id, { is_placeholder: !r.is_placeholder })}
                    className="font-sans font-bold text-[12px] text-cocoa border-[1.5px] border-cocoa/20 px-3 py-[6px] rounded-[8px] cursor-pointer bg-transparent hover:bg-cocoa/[.05]"
                    title="Toggle consent/placeholder flag">
                    {r.is_placeholder ? "Consented" : "Placeholder"}
                  </button>
                  <button onClick={() => patch(r.id, { active: !r.active })}
                    className={`font-sans font-bold text-[12px] px-3 py-[6px] rounded-[8px] cursor-pointer bg-transparent ${
                      r.active
                        ? "border-[1.5px] border-[rgba(196,82,92,.4)] text-[#C4525C] hover:bg-[rgba(196,82,92,.08)]"
                        : "border-[1.5px] border-cocoa/20 text-cocoa hover:bg-cocoa/[.05]"
                    }`}>
                    {r.active ? "Deactivate" : "Reactivate"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editing && (
            <div className="fixed inset-0 z-50 bg-cocoa/20 flex items-center justify-center px-6"
              onClick={() => setEditing(null)}>
              <div className="w-[440px] max-w-full bg-white rounded-[16px] shadow-[0_24px_60px_rgba(58,42,34,.25)] p-5"
                onClick={(e) => e.stopPropagation()}>
                <div className="font-display font-extrabold text-[17px] text-cocoa mb-3">
                  Edit {editing.name}
                </div>
                <div className="flex flex-col gap-2">
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="Name" className={inputCls} />
                  <input value={editing.username ?? ""} onChange={(e) => setEditing({ ...editing, username: e.target.value || null })}
                    placeholder="Username" className={inputCls} />
                  <input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                    placeholder="Contact email" className={inputCls} />
                  <input value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value || null })}
                    placeholder="Phone (private)" className={inputCls} />
                  <select value={editing.emirate ?? "Dubai"} onChange={(e) => setEditing({ ...editing, emirate: e.target.value })}
                    className={inputCls}>
                    {EMIRATES.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button onClick={() => setEditing(null)}
                    className="font-sans font-bold text-[13px] text-cocoa/60 cursor-pointer bg-transparent border-0">
                    Cancel
                  </button>
                  <button onClick={saveEdit}
                    className="bg-cocoa text-cream font-sans font-bold text-[13px] px-5 py-[9px] rounded-[10px] cursor-pointer border-0 hover:bg-[#241A14]">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
