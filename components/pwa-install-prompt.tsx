"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

// Extend window to include the deferred prompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const DISMISS_KEY = "rhythme-install-prompt-dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * A banner that captures the browser's native `beforeinstallprompt` event
 * and shows a polished install prompt inside the app.
 *
 * - Automatically hidden if the PWA is already installed (display-mode: standalone).
 * - Remembers dismissal for 7 days via localStorage.
 * - Triggers the real Chrome install dialog when the user taps "Install".
 */
export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Check if previously dismissed within cooldown
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS) {
      return;
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Detect when the app gets installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error("Install prompt error:", err);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowBanner(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  }, []);

  if (isInstalled || !showBanner) return null;

  return (
    <div className="pwa-install-banner" role="alert" aria-live="polite">
      <div className="pwa-install-banner__inner">
        {/* Icon */}
        <div className="pwa-install-banner__icon">
          <Smartphone size={24} />
        </div>

        {/* Text */}
        <div className="pwa-install-banner__content">
          <p className="pwa-install-banner__title">Install Rhythmé</p>
          <p className="pwa-install-banner__desc">
            Get the full app experience — faster access, offline support &amp; notifications.
          </p>
        </div>

        {/* Actions */}
        <div className="pwa-install-banner__actions">
          <Button
            id="pwa-install-button"
            variant="default"
            size="sm"
            onClick={handleInstall}
            className="pwa-install-banner__btn-install"
          >
            <Download size={14} />
            Install
          </Button>
          <button
            id="pwa-dismiss-button"
            onClick={handleDismiss}
            className="pwa-install-banner__btn-dismiss"
            aria-label="Dismiss install prompt"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
