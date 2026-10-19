"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { RefObject } from "react";
import type { Phase } from "@/lib/friend-quest";

const PAD = 12;
const RESERVED_BOTTOM = 150;

export function useNoPosition(
  sectionRef: RefObject<HTMLElement | null>,
  phase: Phase,
  noClicks: number,
  baseW: number,
  baseH: number,
) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const randomizeNoPosition = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const maxX = Math.max(PAD, rect.width - baseW - PAD);
    const maxY = Math.max(PAD, rect.height - RESERVED_BOTTOM - baseH - PAD);

    setNoPos({
      x: PAD + Math.random() * (maxX - PAD),
      y: PAD + Math.random() * (maxY - PAD),
    });
  }, [sectionRef, baseW, baseH]);

  useLayoutEffect(() => {
    if (phase !== "no") return;

    randomizeNoPosition();
  }, [phase, noClicks, randomizeNoPosition]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      if (phase !== "no") return;
      randomizeNoPosition();
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [sectionRef, phase, randomizeNoPosition]);

  return { noPos, setNoPos };
}
