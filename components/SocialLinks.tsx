import { Social, socialLabel, socialUrl } from "@/lib/socials";

// Inline dot-separated social links (Instagram/Facebook/TikTok/other).
export default function SocialLinks({ socials, prefix }: { socials?: Social[] | null; prefix?: string }) {
  const items = (socials ?? []).filter((s) => s.handle?.trim());
  if (items.length === 0) return null;
  return (
    <>
      {items.map((s, i) => {
        const url = socialUrl(s);
        const label = socialLabel(s);
        return (
          <span key={`${s.platform}-${i}`}>
            {i === 0 ? (prefix ?? "") : " · "}
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ) : (
              <span>{label}</span>
            )}
          </span>
        );
      })}
    </>
  );
}
