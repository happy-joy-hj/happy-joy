"use client";

import { useCallback, useState } from "react";

export function useShake() {
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = useCallback(() => {
    setIsShaking(false);
    window.requestAnimationFrame(() => setIsShaking(true));
  }, []);

  const onAnimationEnd = useCallback(() => {
    setIsShaking(false);
  }, []);

  return { isShaking, triggerShake, onAnimationEnd };
}
