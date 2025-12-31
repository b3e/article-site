import Link from "next/link";
import type { Article } from "../lib/articles";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group border-b border-ink/10 pb-6">
      {article.imageUrl && (
        <div className="mb-4 overflow-hidden border border-ink/10 bg-white/80">
          <img
            alt={article.title}
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            src={article.imageUrl}
          />
        </div>
      )}
      <div className="text-xs uppercase tracking-[0.3em] text-bbcRed">
        {article.category}
      </div>
      <h3 className="mt-2 text-2xl font-semibold leading-tight">
        <Link className="a11y-focus group-hover:text-bbcRed" href={`/articles/${article.slug}`}>
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 text-base text-ink/80">{article.excerpt}</p>
      <div className="mt-4 flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-ink/50">
        <span>{article.author}</span>
        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
      </div>
    </article>
  );
}
