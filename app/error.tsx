"use client";

import { useCallback, useState } from "react";

/**
 * app/error.tsx
 * Next.js App Router error boundary page.
 *
 * Props:
 *  - error: Error object thrown in rendering/server
 *  - reset: () => void  (call to attempt a retry)
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string } | null;
  reset?: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    const payload = `Error: ${error?.message ?? "Unknown error"}\n\nStack:\n${error?.stack ??
      "No stack available"}`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [error]);

  const mailToHref = (() => {
    const subject = encodeURIComponent(`[Rhythmé] Bug report: ${error?.message ?? "Unknown error"}`);
    const body = encodeURIComponent(
      `Hi Rhythmé team,\n\nI encountered an error in the app:\n\nMessage: ${error?.message ?? "n/a"}\n\nStack:\n${error?.stack ??
        "n/a"}\n\nURL: ${typeof window !== "undefined" ? window.location.href : "server"}\n\nSteps to reproduce (please add):\n1.\n2.\n3.\n\nThanks.`
    );
    return `mailto:support@rhythme.example?subject=${subject}&body=${body}`;
  })();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#08070a] text-white p-6">
      <div className="relative max-w-3xl w-full bg-gradient-to-b from-black/70 via-neutral-900/60 to-black/50 border border-white/6 rounded-2xl p-8 shadow-2xl overflow-hidden">
        {/* Decorative large 500 behind */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <span className="select-none text-[12rem] font-extrabold tracking-tight text-white/3">500</span>
          </div>
          <div className="absolute -bottom-20 left-0 right-0 opacity-30 blur-3xl">
            {/* subtle horizon glow */}
            <div style={{ height: "260px", background: "radial-gradient(circle at 50% 120%, rgba(255,107,53,0.16), transparent 30%)" }} />
          </div>
        </div>

        {/* Top row: logo + title */}
        <div className="flex items-center gap-4 mb-6">
          <img src="/rhythme.svg" alt="Rhythmé" className="w-12 h-12 md:w-14 md:h-14" />
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">Something went off beat</h2>
            <p className="text-sm text-white/70">We hit an unexpected error. Let’s try to get you back to rhythm.</p>
          </div>
        </div>

        {/* Core message */}
        <div className="mb-6">
          <p className="text-base md:text-lg leading-relaxed text-white/85">
            This is embarrassing — but not catastrophic. You can try again, reload, or return home. If the issue persists,
            please report it and we’ll investigate.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
          <button
            onClick={() => reset?.()}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-accent text-black font-medium hover:brightness-105 transition"
          >
            Retry
          </button>

          <button
            onClick={() => (typeof window !== "undefined" ? window.location.reload() : null)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/10 bg-white/4 text-sm text-white/90 hover:bg-white/6 transition"
          >
            Reload page
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/6 border border-white/10 text-sm hover:bg-white/8 transition"
          >
            Go home
          </a>

          <a
            href={mailToHref}
            className="ml-auto inline-flex items-center justify-center px-4 py-2 rounded-full bg-transparent border border-accent text-accent text-sm hover:bg-accent/10 transition"
          >
            Report issue
          </a>
        </div>

        {/* Details toggle / developer info */}
        <div className="mt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-white/70">Error details</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetails(v => !v)}
                aria-expanded={showDetails}
                className="text-xs px-2 py-1 rounded-md bg-white/3 hover:bg-white/6 transition"
              >
                {showDetails ? "Hide" : "Show"}
              </button>

              <button
                onClick={onCopy}
                className="text-xs px-2 py-1 rounded-md bg-white/3 hover:bg-white/6 transition"
                title="Copy error details to clipboard"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="mt-3 bg-white/3 border border-white/6 rounded-md p-3 text-xs font-mono text-white/90 whitespace-pre-wrap overflow-auto max-h-48">
              <div className="mb-2">
                <strong>Message:</strong>{" "}
                <span className="text-sm text-white/90">{error?.message ?? "Unknown error"}</span>
              </div>

              <div>
                <strong>Stack:</strong>
                <pre className="mt-2 text-[11px] leading-snug text-white/80">{error?.stack ?? "No stack trace available."}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Small footer */}
        <div className="mt-6 text-xs text-white/60 flex items-center justify-between">
          <div>Rhythmé · Error boundary</div>
          <div>
            <a href={mailToHref} className="underline underline-offset-2 hover:text-white/90">Contact support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
