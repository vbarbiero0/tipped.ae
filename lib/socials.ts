// Multi-platform socials: {platform, handle} pairs stored on rescuers and
// applications. "other" handles are treated as a full URL if they look like
// one, else shown as plain text.

export type SocialPlatform = "instagram" | "facebook" | "tiktok" | "other";

export interface Social {
  platform: SocialPlatform;
  handle: string;
}

export const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "other", label: "Other" },
];

export function socialUrl(s: Social): string | null {
  const h = s.handle.trim().replace(/^@/, "");
  if (!h) return null;
  if (s.platform === "instagram") return `https://instagram.com/${h}`;
  if (s.platform === "tiktok") return `https://tiktok.com/@${h}`;
  if (s.platform === "facebook") return `https://facebook.com/${h}`;
  return /^https?:\/\//.test(s.handle) ? s.handle : null;
}

export function socialLabel(s: Social): string {
  const h = s.handle.trim();
  if (s.platform === "instagram" || s.platform === "tiktok")
    return h.startsWith("@") ? h : `@${h}`;
  if (s.platform === "facebook") return h.replace(/^@/, "");
  return h.replace(/^https?:\/\/(www\.)?/, "");
}
