import type { NextApiRequest, NextApiResponse } from "next";
import { put } from "@vercel/blob";

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

  const { filename, contentType, data } = req.body as {
    filename?: string;
    contentType?: string;
    data?: string;
  };

  if (!filename || !data) {
    res.status(400).json({ message: "Missing upload data" });
    return;
  }

  const buffer = Buffer.from(data, "base64");
  const blob = await put(filename, buffer, {
    access: "public",
    contentType: contentType || "application/octet-stream"
  });

  res.status(200).json({ url: blob.url });
}
