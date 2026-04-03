"use client";

import { useEffect } from "react";

export function PwaRegistry() {
  useEffect(() => {
    // Only register the service worker if the browser supports it
    // and we're not running in development (optional, but checking https is good)
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration.scope);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }, []);

  return null;
}
