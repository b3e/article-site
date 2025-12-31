import { ReactNode } from "react";
import Header from "./Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-sand">
      <Header />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">{children}</main>
      <footer className="border-t border-ink/10 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-center text-sm text-ink/70">
          <span className="font-display text-2xl uppercase tracking-[0.2em]">Signal Gazette</span>
          <p className="max-w-xl">
            Independent coverage, deep reporting, and the stories shaping your world.
          </p>
        </div>
      </footer>
    </div>
  );
}
