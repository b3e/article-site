import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";

const CRON_SECRET = process.env.CRON_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const authHeader = req.headers.authorization;
  const isVercelCron = req.headers["x-vercel-cron"] === "1";

  if (!isVercelCron && (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  await sql`
    UPDATE articles
    SET views_last_24h = counts.views_last_24h
    FROM (
      SELECT article_id, COUNT(*)::int AS views_last_24h
      FROM article_views
      WHERE created_at >= NOW() - INTERVAL '24 hours'
      GROUP BY article_id
    ) AS counts
    WHERE articles.id = counts.article_id
  `;

  await sql`
    UPDATE articles
    SET views_last_24h = 0
    WHERE id NOT IN (
      SELECT DISTINCT article_id
      FROM article_views
      WHERE created_at >= NOW() - INTERVAL '24 hours'
    )
  `;

  res.status(200).json({ ok: true });
}
