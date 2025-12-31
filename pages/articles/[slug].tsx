import type { GetStaticPaths, GetStaticProps } from "next";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import AdSlot from "../../components/AdSlot";
import { getArticleBySlug, getArticles, type Article } from "../../lib/articles";

type ArticlePageProps = {
  article: Article;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getArticles();
  return {
    paths: articles.map((article) => ({ params: { slug: article.slug } })),
    fallback: "blocking"
  };
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: { article },
    revalidate: 120
  };
};

export default function ArticlePage({ article }: ArticlePageProps) {
  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/articles/${article.slug}/view`, {
      method: "POST",
      signal: controller.signal
    }).catch(() => {
      // Swallow view errors to avoid impacting the article render.
    });

    return () => controller.abort();
  }, [article.slug]);

  return (
    <Layout>
      <article className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="text-xs uppercase tracking-[0.3em] text-bbcRed">
            {article.category}
          </div>
          {article.imageUrl && (
            <div className="overflow-hidden border border-ink/10 bg-white/80">
              <img
                alt={article.title}
                className="h-72 w-full object-cover"
                src={article.imageUrl}
              />
            </div>
          )}
          <h1 className="text-4xl font-semibold leading-tight text-ink">{article.title}</h1>
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-ink/50">
            <span>{article.author}</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            <span>{article.viewsLast24h.toLocaleString()} reads (24h)</span>
          </div>
          <p className="text-lg leading-relaxed text-ink/80">{article.content}</p>
          <AdSlot className="border border-ink/10 bg-white/80 p-6" />
          <div className="border border-ink/10 bg-white/90 p-6 text-sm text-ink/70">
            <h2 className="font-display text-2xl uppercase tracking-[0.2em]">Editor notes</h2>
            <p className="mt-3">
              This story updates as new information is confirmed by the newsroom.
            </p>
          </div>
        </div>
        <aside className="space-y-6">
          <AdSlot className="border border-ink/10 bg-white/80 p-6" />
          <div className="texture border border-ink/10 bg-white/90 p-6">
            <h3 className="font-display text-2xl uppercase tracking-[0.2em]">In brief</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink/70">
              <li>Correspondents are tracking reactions across global markets.</li>
              <li>Expect a policy response within the next 48 hours.</li>
              <li>Local officials will issue new guidance this afternoon.</li>
            </ul>
          </div>
        </aside>
      </article>
    </Layout>
  );
}
