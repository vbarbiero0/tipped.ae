import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  formatAdviceDate,
  getAdvicePost,
  getAdvicePosts,
  getRelatedPosts,
} from "@/lib/advice";

/* eslint-disable @next/next/no-img-element */

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAdvicePosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getAdvicePost(slug);
  if (!post) return { title: "Not found" };
  const title = `${post.title} · tipped`;
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title,
      description: post.summary,
      // The dynamic opengraph-image route renders the branded PNG for every
      // post (WhatsApp won't preview SVG covers) — no images entry needed.
    },
    twitter: { card: "summary_large_image", title, description: post.summary },
  };
}

// Readable article typography per the type scale, applied to MDX output via
// element overrides — no global CSS, no layout changes elsewhere.
const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="font-display font-extrabold text-[24px] leading-[1.25] text-cocoa mt-10 mb-3"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="font-display font-extrabold text-[19px] leading-[1.3] text-cocoa mt-8 mb-2"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="font-sans font-medium text-[16.5px] leading-[1.75] text-cocoa/80 m-0 mb-5"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="m-0 mb-5 pl-6 flex flex-col gap-2 list-disc" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="m-0 mb-5 pl-6 flex flex-col gap-2 list-decimal" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className="font-sans font-medium text-[16px] leading-[1.65] text-cocoa/80"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-cocoa" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="text-cocoa/70" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="font-bold" {...props} />
  ),
};

export default async function AdvicePostPage({ params }: Props) {
  const { slug } = await params;
  const post = getAdvicePost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(post);

  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-[84px]">
      <Link href="/advice" className="font-sans font-bold text-sm no-underline">
        ← All advice
      </Link>

      <article className="max-w-[720px] mt-6">
        {post.cover && (
          <div className="rounded-[20px] overflow-hidden mb-8 bg-cream">
            <img src={post.cover} alt="" className="w-full h-auto" />
          </div>
        )}
        <span className="inline-flex font-sans font-bold text-[11px] tracking-[.08em] text-badge-text bg-tip-pink/[.16] rounded-[7px] px-[10px] py-1 mb-3">
          {post.category.toUpperCase()}
        </span>
        <h1 className="font-display font-extrabold text-[32px] md:text-[42px] leading-[1.12] text-cocoa m-0 mb-3 [text-wrap:pretty]">
          {post.title}
        </h1>
        <div className="font-sans font-semibold text-[13px] text-cocoa/50 mb-9">
          {formatAdviceDate(post.date)} · by {post.author}
        </div>

        <MDXRemote source={post.body} components={mdxComponents} />
      </article>

      {related.length > 0 && (
        <section className="mt-14 md:mt-20">
          <h2 className="font-display font-extrabold text-[22px] text-cocoa m-0 mb-6">
            Keep reading
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/advice/${p.slug}`}
                className="block bg-white rounded-[18px] shadow-card p-5 no-underline group"
              >
                <span className="inline-flex font-sans font-bold text-[10px] tracking-[.08em] text-badge-text bg-tip-pink/[.16] rounded-[7px] px-2 py-[3px] mb-2">
                  {p.category.toUpperCase()}
                </span>
                <div className="font-display font-extrabold text-[17px] leading-[1.3] text-cocoa group-hover:text-link">
                  {p.title}
                </div>
                <span className="font-sans font-semibold text-[12px] text-cocoa/45 mt-2 inline-block">
                  {formatAdviceDate(p.date)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="font-sans font-medium text-[15.5px] leading-[1.65] text-cocoa/70 mt-14 m-0 max-w-[560px]">
        And if your home has room for one more —{" "}
        <Link href="/pets" className="font-bold">
          the pets waiting for a family would love to meet you
        </Link>
        .
      </p>
    </div>
  );
}
