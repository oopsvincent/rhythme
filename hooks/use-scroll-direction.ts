import { useState, useEffect } from "react";

/**
 * Custom hook to track scroll direction and determine if fixed components (like appbars)
 * should be shown (scrolling up) or hidden (scrolling down).
 */
export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      // Minimum scroll threshold to avoid jittering
      if (Math.abs(scrollY - lastScrollY) < 12) {
        ticking = false;
        return;
      }

      if (scrollY > lastScrollY && scrollY > 60) {
        // Scrolling down - hide
        setIsVisible(false);
      } else {
        // Scrolling up - show
        setIsVisible(true);
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return isVisible;
}
