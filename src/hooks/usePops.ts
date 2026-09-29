import { RefObject, useCallback, useEffect, useRef, useState } from "react";

type Pop = { id: string; x: number; y: number; iconClass: string };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function usePops(sectionRef: RefObject<HTMLElement | null>) {
  const [pops, setPops] = useState<Pop[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;

    return () => {
      for (const t of timeouts) window.clearTimeout(t);
    };
  }, []);

  const spawnPop = useCallback(
    (clientX: number, clientY: number, iconClass: string) => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const y = clamp(clientY - rect.top, 0, rect.height);

      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now() + Math.random());

      setPops((prev) => [...prev, { id, x, y, iconClass }]);

      const t = window.setTimeout(() => {
        setPops((prev) => prev.filter((p) => p.id !== id));
      }, 900);

      timeoutsRef.current.push(t);
    },
    [sectionRef],
  );

  const clearPops = useCallback(() => setPops([]), []);

  return { pops, spawnPop, clearPops };
}
