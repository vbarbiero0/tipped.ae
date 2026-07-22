import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Tips & Advice posts: .mdx files in content/advice/, no database. The slug
// is the filename. Frontmatter: title, category, summary, cover, date,
// author ("tipped").

export const ADVICE_CATEGORIES = [
  "Cats",
  "Dogs",
  "Community care",
  "Adopting & travel",
] as const;
export type AdviceCategory = (typeof ADVICE_CATEGORIES)[number];

export interface AdvicePost {
  slug: string;
  title: string;
  category: AdviceCategory;
  summary: string;
  cover: string | null;
  date: string; // ISO yyyy-mm-dd
  author: string;
  body: string;
}

const DIR = path.join(process.cwd(), "content", "advice");

export function getAdvicePosts(): AdvicePost[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, f), "utf8"));
      return {
        slug: f.replace(/\.mdx$/, ""),
        title: String(data.title ?? ""),
        category: (ADVICE_CATEGORIES.includes(data.category)
          ? data.category
          : "Community care") as AdviceCategory,
        summary: String(data.summary ?? ""),
        cover: data.cover ? String(data.cover) : null,
        date: String(data.date ?? ""),
        author: String(data.author ?? "tipped"),
        body: content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAdvicePost(slug: string): AdvicePost | null {
  return getAdvicePosts().find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(post: AdvicePost, limit = 3): AdvicePost[] {
  const pool = getAdvicePosts().filter((p) => p.slug !== post.slug);
  const same = pool.filter((p) => p.category === post.category);
  return [...same, ...pool.filter((p) => p.category !== post.category)].slice(0, limit);
}

export function formatAdviceDate(iso: string): string {
  const d = new Date(iso + "T12:00:00Z");
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
