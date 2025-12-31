import { sql } from "@vercel/postgres";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  viewsLast24h: number;
  imageUrl: string | null;
};

export async function getArticles(): Promise<Article[]> {
  const { rows } = await sql<Article>`
    SELECT
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      published_at AS "publishedAt",
      views_last_24h AS "viewsLast24h",
      image_url AS "imageUrl"
    FROM articles
    ORDER BY published_at DESC
  `;
  return rows;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { rows } = await sql<Article>`
    SELECT
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      published_at AS "publishedAt",
      views_last_24h AS "viewsLast24h",
      image_url AS "imageUrl"
    FROM articles
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getTopArticles(limit = 4): Promise<Article[]> {
  const { rows } = await sql<Article>`
    SELECT
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      published_at AS "publishedAt",
      views_last_24h AS "viewsLast24h",
      image_url AS "imageUrl"
    FROM articles
    ORDER BY views_last_24h DESC
    LIMIT ${limit}
  `;
  return rows;
}

export async function createArticle(input: Omit<Article, "id">): Promise<Article> {
  const { rows } = await sql<Article>`
    INSERT INTO articles (
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      published_at,
      views_last_24h,
      image_url
    )
    VALUES (
      ${input.title},
      ${input.slug},
      ${input.excerpt},
      ${input.content},
      ${input.category},
      ${input.author},
      ${input.publishedAt},
      ${input.viewsLast24h},
      ${input.imageUrl}
    )
    RETURNING
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      published_at AS "publishedAt",
      views_last_24h AS "viewsLast24h",
      image_url AS "imageUrl"
  `;
  return rows[0];
}
