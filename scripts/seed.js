const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { sql } = require("@vercel/postgres");

dotenv.config({ path: path.join(process.cwd(), ".env") });

async function seed() {
  const dataPath = path.join(process.cwd(), "data", "articles.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const articles = JSON.parse(raw);

  for (const article of articles) {
    const publishedAt = article.publishedAt || new Date().toISOString();
    const viewsLast24h = Number.isFinite(article.viewsLast24h)
      ? article.viewsLast24h
      : 0;
    const imageUrl = article.imageUrl || null;

    await sql`
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
        ${article.title},
        ${article.slug},
        ${article.excerpt},
        ${article.content},
        ${article.category},
        ${article.author},
        ${publishedAt},
        ${viewsLast24h},
        ${imageUrl}
      )
      ON CONFLICT (slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        category = EXCLUDED.category,
        author = EXCLUDED.author,
        published_at = EXCLUDED.published_at,
        views_last_24h = EXCLUDED.views_last_24h,
        image_url = EXCLUDED.image_url
    `;
  }
}

seed()
  .then(() => {
    console.log("Seed complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
