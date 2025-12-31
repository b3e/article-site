CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  views_last_24h INTEGER NOT NULL DEFAULT 0,
  image_url TEXT
);

CREATE INDEX IF NOT EXISTS articles_views_last_24h_idx ON articles (views_last_24h DESC);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles (published_at DESC);
