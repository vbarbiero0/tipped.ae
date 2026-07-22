/* eslint-disable @next/next/no-img-element */
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/brand";
import { getInstagramPosts } from "@/lib/instagram";

// The community feed on /rescuers: the last 9 posts from @tipped.ae in a
// rounded-square grid, refreshed hourly, each linking to Instagram. Until
// the account is connected (token in app_settings), a follow card renders
// instead — never a broken block.

export default async function InstagramGrid() {
  const posts = await getInstagramPosts(9);

  return (
    <section className="max-w-[1160px] mx-auto px-6 md:px-8 pb-16 md:pb-[84px]">
      <div className="eyebrow mb-[10px]">FROM THE COMMUNITY</div>
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-7">
        <h2 className="font-display font-extrabold text-[26px] md:text-[32px] text-cocoa m-0">
          Rescue life, as it happens
        </h2>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans font-bold text-sm whitespace-nowrap"
        >
          Follow @{INSTAGRAM_HANDLE} →
        </a>
      </div>

      {posts ? (
        <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-[720px]">
          {posts.map((p) => (
            <a
              key={p.id}
              href={p.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square rounded-[14px] overflow-hidden bg-cream transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_10px_26px_rgba(58,42,34,.18)]"
              aria-label={p.caption ? p.caption.slice(0, 80) : "Instagram post"}
            >
              <img
                src={p.image}
                alt={p.caption ? p.caption.slice(0, 100) : ""}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </a>
          ))}
        </div>
      ) : (
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-[20px] shadow-card p-8 max-w-[560px] no-underline hover:shadow-[0_4px_14px_rgba(58,42,34,.12)] transition-shadow"
        >
          <div className="font-display font-extrabold text-[20px] text-cocoa mb-1">
            Follow the day-to-day on Instagram
          </div>
          <p className="font-sans font-medium text-[14.5px] leading-[1.6] text-cocoa/70 m-0">
            Rescues, updates and happy endings from across the Emirates —
            @{INSTAGRAM_HANDLE}.
          </p>
        </a>
      )}
    </section>
  );
}
