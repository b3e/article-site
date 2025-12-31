import type { GetStaticProps } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import ArticleCard from "../components/ArticleCard";
import TopArticles from "../components/TopArticles";
import AdSlot from "../components/AdSlot";
import { getArticles, getTopArticles, type Article } from "../lib/articles";

type HomeProps = {
  articles: Article[];
  topArticles: Article[];
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const [articles, topArticles] = await Promise.all([
    getArticles(),
    getTopArticles(5)
  ]);

  return {
    props: {
      articles,
      topArticles
    },
    revalidate: 120
  };
};

export default function Home({ articles, topArticles }: HomeProps) {
  const [hero, ...rest] = articles;

  return (
    <Layout>
      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          {hero && (
            <article className="border border-ink/10 bg-white/90 p-8 shadow-sm">
              <div className="text-xs uppercase tracking-[0.3em] text-bbcRed">Lead</div>
              {hero.imageUrl && (
                <div className="mt-4 overflow-hidden border border-ink/10 bg-white/80">
                  <img
                    alt={hero.title}
                    className="h-64 w-full object-cover"
                    src={hero.imageUrl}
                  />
                </div>
              )}
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink">
                {hero.title}
              </h1>
              <p className="mt-4 text-lg text-ink/80">{hero.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-ink/50">
                <span>{hero.author}</span>
                <span>{new Date(hero.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-6">
                <Link
                  className="a11y-focus inline-flex items-center border border-ink px-4 py-2 text-xs uppercase tracking-[0.25em] hover:border-bbcRed hover:text-bbcRed"
                  href={`/articles/${hero.slug}`}
                >
                  Read analysis
                </Link>
              </div>
            </article>
          )}
          <div className="grid gap-6">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <TopArticles items={topArticles} />
          <AdSlot className="border border-ink/10 bg-white/80 p-6 shadow-sm" />
          <div className="texture border border-ink/10 bg-white/90 p-6">
            <h3 className="font-display text-2xl uppercase tracking-[0.2em]">Newsletter</h3>
            <p className="mt-3 text-sm text-ink/70">
              Get the morning briefing and the evening close, curated by our editors.
            </p>
            <form className="mt-4 flex flex-col gap-3">
              <input
                className="w-full border border-ink/20 bg-white px-3 py-2 text-sm"
                placeholder="Email address"
                type="email"
              />
              <button className="border border-ink px-4 py-2 text-xs uppercase tracking-[0.25em]">
                Subscribe
              </button>
            </form>
          </div>
        </aside>
      </section>
      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <AdSlot className="border border-ink/10 bg-white/80 p-6" />
        <div className="border border-ink/10 bg-white/90 p-6">
          <h2 className="font-display text-2xl uppercase tracking-[0.2em]">Live updates</h2>
          <ul className="mt-4 space-y-4 text-sm text-ink/70">
            <li>Markets open higher as tech sector rebounds in early trading.</li>
            <li>Regional transport strike expected to affect commuter lines.</li>
            <li>Foreign ministers meet to discuss the next round of climate talks.</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
