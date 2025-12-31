import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../components/Layout";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Login failed");
      }

      const body = await res.json();
      localStorage.setItem("adminToken", body.token);
      router.push("/admin/new");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-lg border border-ink/10 bg-white/90 p-8 shadow-sm">
        <h1 className="font-display text-3xl uppercase tracking-[0.2em]">Admin login</h1>
        <p className="mt-3 text-sm text-ink/70">
          Enter the editor password to publish new articles.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full border border-ink/20 bg-white px-3 py-2 text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <p className="text-sm text-bbcRed">{error}</p>}
          <button
            className="w-full border border-ink px-4 py-2 text-xs uppercase tracking-[0.25em]"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
