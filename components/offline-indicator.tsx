"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    function onOffline() {
      setIsOffline(true);
      toast("You are offline", {
        description: "Your changes will sync when you are back online.",
        icon: <WifiOff className="h-4 w-4" />,
        duration: Infinity,
        id: "offline-toast",
      });
    }

    function onOnline() {
      setIsOffline(false);
      toast.dismiss("offline-toast");
      toast.success("You are back online");
    }

    if (!navigator.onLine) {
       onOffline();
    }

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return null;
}
