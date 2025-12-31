import type { NextApiRequest, NextApiResponse } from "next";
import { createArticle } from "../../lib/articles";
import { toSlug } from "../../lib/slug";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "local-admin-token";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { title, excerpt, content, category, author, slug, imageUrl } = req.body as {
    title?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    author?: string;
    slug?: string;
    imageUrl?: string;
  };

  if (!title || !excerpt || !content || !category || !author) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const article = await createArticle({
    title,
    excerpt,
    content,
    category,
    author,
    slug: slug ? toSlug(slug) : toSlug(title),
    publishedAt: new Date().toISOString(),
    viewsLast24h: 0,
    imageUrl: imageUrl || null
  });

  res.status(201).json({ article });
}
