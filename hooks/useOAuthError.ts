"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function useOAuthError() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [errorDescription, setErrorDescription] = useState<string | null>(null);

  useEffect(() => {
    // --- 1. Check query params (?error=...)
    const queryError = searchParams ? searchParams.get("error_code") : null;
    const queryDescription =
      searchParams ? (searchParams.get("error_description") || searchParams.get("error_code")) : null;

    if (queryError || queryDescription) {
      setError(queryError);
      setErrorDescription(queryDescription);
      return;
    }

    // --- 2. Check hash fragment (#error=...)
    if (typeof window !== "undefined") {
      const hash = window.location.hash; // "#error=..."
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const hashError = params.get("error_code");
        const hashDescription =
          params.get("error_description") || params.get("error_code");

        if (hashError || hashDescription) {
          setError(hashError);
          setErrorDescription(hashDescription);
        }
      }
    }
  }, [searchParams]);

  return { error, errorDescription };
}
