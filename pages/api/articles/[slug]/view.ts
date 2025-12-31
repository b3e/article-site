import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const slug = req.query.slug as string;
  if (!slug) {
    res.status(400).json({ message: "Missing slug" });
    return;
  }

  const { rows } = await sql<{ id: number }>`
    SELECT id FROM articles WHERE slug = ${slug} LIMIT 1
  `;

  const articleId = rows[0]?.id;
  if (!articleId) {
    res.status(404).json({ message: "Article not found" });
    return;
  }

  await sql`
    INSERT INTO article_views (article_id)
    VALUES (${articleId})
  `;

  res.status(200).json({ ok: true });
}
