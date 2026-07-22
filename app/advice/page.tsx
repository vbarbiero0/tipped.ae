import type { Metadata } from "next";
import AdviceGrid from "@/components/AdviceGrid";
import { formatAdviceDate, getAdvicePosts } from "@/lib/advice";

export const metadata: Metadata = {
  title: "Tips & advice",
  description:
    "Practical, kind advice for caring for cats and dogs in the UAE — summer heat, community cats, adopting and more.",
};

export default function AdvicePage() {
  const posts = getAdvicePosts().map(({ body: _body, ...meta }) => meta);
  const dates = Object.fromEntries(posts.map((p) => [p.slug, formatAdviceDate(p.date)]));

  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-[84px]">
      <div className="eyebrow mb-[14px]">TIPS &amp; ADVICE</div>
      <h1 className="font-display font-extrabold text-[34px] md:text-[44px] text-cocoa m-0 mb-3">
        Caring for pets, here.
      </h1>
      <p className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/75 m-0 mb-9 max-w-[560px]">
        Practical, gentle advice for the animals in your home and on your
        street — written for UAE weather, UAE streets, and the people who care
        for both.
      </p>
      <AdviceGrid posts={posts} dates={dates} />
    </div>
  );
}
