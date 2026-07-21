import type { MetadataRoute } from "next";
import { getPets } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tipped.ae";
  const pets = await getPets();
  return [
    { url: base, priority: 1 },
    { url: `${base}/pets`, priority: 0.9 },
    ...pets.map((a) => ({ url: `${base}/pets/${a.ref}`, priority: 0.8 })),
    { url: `${base}/how-it-works`, priority: 0.6 },
    { url: `${base}/rescuers`, priority: 0.6 },
    { url: `${base}/transparency`, priority: 0.6 },
    { url: `${base}/shop`, priority: 0.5 },
    { url: `${base}/about`, priority: 0.5 },
    { url: `${base}/contact`, priority: 0.5 },
  ];
}
