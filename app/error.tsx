"use client";

import Link from "next/link";
import { useCallback, useState, useEffect } from "react";
import { RhythmeLogo } from "@/components/rhythme-logo";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  RotateCcw, 
  RefreshCw, 
  Home, 
  LifeBuoy, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { motion } from "framer-motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: (Error & { digest?: string }) | null;
  reset?: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onCopy = useCallback(async () => {
    const payload = `Error: ${error?.message ?? "Unknown error"}\n\nStack:\n${error?.stack ?? "No stack available"}`;
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
      `Hi Rhythmé team,\n\nI encountered an error in the app:\n\nMessage: ${error?.message ?? "n/a"}\n\nStack:\n${error?.stack ?? "n/a"}\n\nURL: ${typeof window !== "undefined" ? window.location.href : "server"}\n\nSteps to reproduce (please add):\n1.\n2.\n3.\n\nThanks.`
    );
    return `mailto:support@rhythme.example?subject=${subject}&body=${body}`;
  })();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background blobs for premium ambient lighting */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      
      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full backdrop-blur-md bg-card/40 border border-border/40 rounded-[32px] p-6 sm:p-10 shadow-2xl overflow-hidden"
      >
        {/* Top Header Logo */}
        <div className="flex justify-between items-start mb-6">
          <RhythmeLogo size="sm" />
          <span className="text-[10px] font-extrabold tracking-wider bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 rounded-full uppercase">
            Error
          </span>
        </div>

        {/* Title and Icon */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-primary tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Something went off beat
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed font-sans">
              We hit an unexpected error. Let’s try to get you back to your rhythm.
            </p>
          </div>
        </div>

        {/* Error message text */}
        <div className="mb-8 font-sans">
          <p className="text-sm leading-relaxed text-muted-foreground">
            This is embarrassing — but not catastrophic. You can try to retry the last operation, reload the current page, or return home. If this keeps happening, please report it.
          </p>
        </div>

        {/* Actions Button Grid */}
        <div className="flex flex-wrap items-center gap-3 pt-2 mb-6">
          <Button
            onClick={() => reset?.()}
            className="rounded-2xl h-11 px-5 font-semibold bg-gradient-to-r from-primary to-accent border-none text-primary-foreground shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </Button>

          <Button
            onClick={() => (typeof window !== "undefined" ? window.location.reload() : null)}
            variant="outline"
            className="rounded-2xl h-11 px-5 font-semibold border-border/50 hover:bg-accent/40 hover:border-primary/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-2xl h-11 px-5 font-semibold border-border/50 hover:bg-accent/40 hover:border-primary/30 transition-all cursor-pointer"
          >
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="rounded-2xl h-11 px-5 font-semibold text-destructive hover:bg-destructive/10 transition-all cursor-pointer sm:ml-auto"
          >
            <a href={mailToHref} className="flex items-center justify-center gap-2">
              <LifeBuoy className="w-4 h-4" />
              Report Issue
            </a>
          </Button>
        </div>

        {/* Collapsible Details */}
        <div className="border-t border-border/40 pt-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer py-1"
            >
              <span>{showDetails ? "Hide Error Details" : "Show Error Details"}</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDetails && (
              <button
                onClick={onCopy}
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy details</span>
                  </>
                )}
              </button>
            )}
          </div>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 bg-muted/10 border border-border/50 rounded-2xl p-4 text-xs font-mono text-muted-foreground whitespace-pre-wrap overflow-auto max-h-48 scrollbar-none"
            >
              <div className="mb-2">
                <strong className="text-foreground">Message:</strong>{" "}
                <span className="text-foreground/90">{error?.message ?? "Unknown error"}</span>
              </div>

              <div>
                <strong className="text-foreground">Stack Trace:</strong>
                <pre className="mt-2 text-[10px] leading-relaxed text-muted-foreground/80 overflow-x-auto whitespace-pre-wrap">
                  {error?.stack ?? "No stack trace available."}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
