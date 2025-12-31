import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { toSlug } from "../../lib/slug";

export default function NewArticle() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("adminToken");
    setToken(stored);
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        const base64 = result.split(",")[1] || "";
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Publishing...");

    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        setUploading(true);
        const base64 = await fileToBase64(imageFile);
        const uploadRes = await fetch("/api/uploads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            filename: imageFile.name,
            contentType: imageFile.type || "image/jpeg",
            data: base64
          })
        });

        if (!uploadRes.ok) {
          const body = await uploadRes.json();
          throw new Error(body.message || "Image upload failed");
        }

        const body = await uploadRes.json();
        imageUrl = body.url;
      }

      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          slug: toSlug(form.title),
          imageUrl
        })
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Publish failed");
      }

      setStatus("Published. ISR will revalidate shortly.");
      setForm({ title: "", excerpt: "", content: "", category: "", author: "" });
      setImageFile(null);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl border border-ink/10 bg-white/90 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl uppercase tracking-[0.2em]">New article</h1>
          <span className="text-xs uppercase tracking-[0.25em] text-ink/60">
            Editor console
          </span>
        </div>
        {!token && (
          <p className="mt-4 text-sm text-bbcRed">
            You need to log in before publishing. Visit /admin to sign in.
          </p>
        )}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-ink/60">
              Article image
            </label>
            <input
              className="w-full border border-ink/20 bg-white px-3 py-2 text-sm"
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
            />
            {imagePreview && (
              <img alt="Preview" className="h-48 w-full object-cover" src={imagePreview} />
            )}
          </div>
          <input
            className="w-full border border-ink/20 bg-white px-3 py-2 text-sm"
            placeholder="Title"
            value={form.title}
            onChange={handleChange("title")}
            required
          />
          <input
            className="w-full border border-ink/20 bg-white px-3 py-2 text-sm"
            placeholder="Category"
            value={form.category}
            onChange={handleChange("category")}
            required
          />
          <input
            className="w-full border border-ink/20 bg-white px-3 py-2 text-sm"
            placeholder="Author"
            value={form.author}
            onChange={handleChange("author")}
            required
          />
          <textarea
            className="h-24 w-full border border-ink/20 bg-white px-3 py-2 text-sm"
            placeholder="Excerpt"
            value={form.excerpt}
            onChange={handleChange("excerpt")}
            required
          />
          <textarea
            className="h-48 w-full border border-ink/20 bg-white px-3 py-2 text-sm"
            placeholder="Content"
            value={form.content}
            onChange={handleChange("content")}
            required
          />
          <button
            className="w-full border border-ink px-4 py-2 text-xs uppercase tracking-[0.25em]"
            type="submit"
            disabled={!token || uploading}
          >
            {uploading ? "Uploading..." : "Publish"}
          </button>
          {status && <p className="text-sm text-ink/70">{status}</p>}
        </form>
      </div>
    </Layout>
  );
}
