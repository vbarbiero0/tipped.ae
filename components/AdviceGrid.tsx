"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import type { AdvicePost } from "@/lib/advice";

// Client-side category filter over the (small) post list. Only categories
// that actually have posts render as buttons, so nothing filters to empty.

export default function AdviceGrid({
  posts,
  dates,
}: {
  posts: Omit<AdvicePost, "body">[];
  dates: Record<string, string>; // slug -> formatted date (server-formatted)
}) {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const shown = category === "All" ? posts : posts.filter((p) => p.category === category);

  const btn = (active: boolean) =>
    `font-sans font-bold text-[13.5px] px-4 py-[9px] rounded-[10px] cursor-pointer transition-colors border-[1.5px] ${
      active
        ? "bg-cocoa text-cream border-cocoa"
        : "bg-white text-cocoa/70 border-cocoa/[.15] hover:border-cocoa/40"
    }`;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-9">
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={btn(category === c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {shown.map((p) => (
          <Link
            key={p.slug}
            href={`/advice/${p.slug}`}
            className="block bg-white rounded-[20px] shadow-card no-underline group"
          >
            <div className="h-[200px] rounded-t-[20px] overflow-hidden bg-cream">
              {p.cover && (
                <img
                  src={p.cover}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="px-5 pt-4 pb-5">
              <span className="inline-flex font-sans font-bold text-[10.5px] tracking-[.08em] text-badge-text bg-tip-pink/[.16] rounded-[7px] px-2 py-[3px] mb-2">
                {p.category.toUpperCase()}
              </span>
              <div className="font-display font-extrabold text-[19px] leading-[1.25] text-cocoa group-hover:text-link mb-[6px]">
                {p.title}
              </div>
              <p className="font-sans font-medium text-[13.5px] leading-[1.55] text-cocoa/70 m-0 mb-3 line-clamp-2">
                {p.summary}
              </p>
              <span className="font-sans font-semibold text-[12px] text-cocoa/45">
                {dates[p.slug]}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
