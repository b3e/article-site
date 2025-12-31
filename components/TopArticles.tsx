import Link from "next/link";
import type { Article } from "../lib/articles";

export default function TopArticles({ items }: { items: Article[] }) {
  return (
    <section className="border border-ink/10 bg-white/80 p-6 shadow-sm">
      <div className="text-xs uppercase tracking-[0.3em] text-ink/60">Most read</div>
      <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.2em]">Top 24 Hours</h2>
      <ol className="mt-6 space-y-5">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-start gap-4">
            <div className="text-3xl font-semibold text-bbcRed">{index + 1}</div>
            <div>
              <Link
                className="a11y-focus text-lg font-semibold leading-snug hover:text-bbcRed"
                href={`/articles/${item.slug}`}
              >
                {item.title}
              </Link>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-ink/50">
                {item.viewsLast24h.toLocaleString()} reads
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
