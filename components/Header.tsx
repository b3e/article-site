import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-ink text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="bg-bbcRed px-3 py-1 font-display text-3xl uppercase tracking-[0.15em]">
            Signal
          </span>
          <span className="font-display text-3xl uppercase tracking-[0.12em]">
            Gazette
          </span>
        </div>
        <nav className="hidden items-center gap-6 text-sm uppercase tracking-[0.2em] md:flex">
          <Link className="a11y-focus hover:text-bbcRed" href="/">
            Home
          </Link>
          <Link className="a11y-focus hover:text-bbcRed" href="/">
            World
          </Link>
          <Link className="a11y-focus hover:text-bbcRed" href="/">
            Politics
          </Link>
          <Link className="a11y-focus hover:text-bbcRed" href="/">
            Business
          </Link>
          <Link className="a11y-focus hover:text-bbcRed" href="/">
            Culture
          </Link>
        </nav>
        <Link
          className="a11y-focus border border-white/40 px-3 py-2 text-xs uppercase tracking-[0.2em] hover:border-bbcRed"
          href="/admin"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
