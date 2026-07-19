import type { MetadataRoute } from "next";
import { getAnimals } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tipped.ae";
  const animals = await getAnimals();
  return [
    { url: base, priority: 1 },
    { url: `${base}/adopt`, priority: 0.9 },
    ...animals.map((a) => ({ url: `${base}/adopt/${a.ref}`, priority: 0.8 })),
    { url: `${base}/how-it-works`, priority: 0.6 },
    { url: `${base}/rescuers`, priority: 0.6 },
    { url: `${base}/transparency`, priority: 0.6 },
    { url: `${base}/shop`, priority: 0.5 },
  ];
}
