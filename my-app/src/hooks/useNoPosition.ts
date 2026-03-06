"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { RefObject } from "react";
import { getNoScaleFromClicks } from "@/lib/friend-quest";
import type { Phase } from "@/lib/friend-quest";

export function useNoPosition(
  sectionRef: RefObject<HTMLElement | null>,
  phase: Phase,
  noClicks: number,
  baseW: number,
  baseH: number,
) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const randomizeNoPosition = useCallback(
    (clicks: number) => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const scale = getNoScaleFromClicks(clicks);

      const visW = baseW * scale;
      const visH = baseH * scale;

      const PAD = 12;
      const maxX = Math.max(0, rect.width - visW - PAD * 2);
      const maxY = Math.max(0, rect.height - visH - PAD * 2);

      setNoPos({
        x: PAD + Math.random() * maxX,
        y: PAD + Math.random() * maxY,
      });
    },
    [sectionRef, baseW, baseH],
  );

  useLayoutEffect(() => {
    if (phase !== "no") return;
    const clicks = Math.max(1, noClicks);
    randomizeNoPosition(clicks);
  }, [phase, noClicks, randomizeNoPosition]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      if (phase !== "no") return;
      const clicks = Math.max(1, noClicks);
      randomizeNoPosition(clicks);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [sectionRef, phase, noClicks, randomizeNoPosition]);

  return { noPos, setNoPos };
}
