import { useEffect } from "react";

type AdSlotProps = {
  className?: string;
  format?: string;
};

export default function AdSlot({ className, format = "auto" }: AdSlotProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-expect-error adsbygoogle is injected by adsense.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle block min-h-[120px] w-full bg-white/70 text-xs text-ink/70"
        style={{ display: "block" }}
        data-ad-client="ca-pub-0000000000000000"
        data-ad-slot="0000000000"
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <div className="mt-2 text-center text-[11px] uppercase tracking-[0.2em] text-ink/50">
        Advertisement
      </div>
    </div>
  );
}
