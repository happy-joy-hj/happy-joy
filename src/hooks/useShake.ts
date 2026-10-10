"use client";

import type { AnimationEvent } from "react";
import { useCallback, useState } from "react";

export function useShake() {
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsShaking(false);
      return;
    }

    setIsShaking(false);
    window.requestAnimationFrame(() => setIsShaking(true));
  }, []);

  const onAnimationEnd = useCallback((event: AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    setIsShaking(false);
  }, []);

  return { isShaking, triggerShake, onAnimationEnd };
}
