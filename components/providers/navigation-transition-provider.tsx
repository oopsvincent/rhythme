"use client";

import React, { createContext, useContext, useTransition, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface NavigationTransitionContextProps {
  isPending: boolean;
  navigate: (href: string) => void;
}

const NavigationTransitionContext = createContext<NavigationTransitionContextProps>({
  isPending: false,
  navigate: () => {},
});

export function NavigationTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Prefetch is automatically handled by Next.js Link when in viewport.
  // This navigate function handles the actual transition-based routing.
  const navigate = (href: string) => {
    // Normalise URL to avoid transitioning to the same path
    const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    if (href === currentUrl) return;

    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <NavigationTransitionContext.Provider value={{ isPending, navigate }}>
      {children}
      {isPending && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] w-full overflow-hidden bg-primary/20">
          <div className="h-full w-full bg-primary animate-nav-loader shadow-[0_0_8px_var(--primary)]" />
        </div>
      )}
    </NavigationTransitionContext.Provider>
  );
}

export function useNavigationTransition() {
  return useContext(NavigationTransitionContext);
}
