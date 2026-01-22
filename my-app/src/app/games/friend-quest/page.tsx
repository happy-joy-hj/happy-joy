"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Phase = "initial" | "no" | "final";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getNoIndexFromClicks(clicks: number) {
  let k = 0;
  while (((k + 1) * (k + 2)) / 2 <= clicks) k++;
  return clamp(k, 0, 6);
}

function getNoScaleFromClicks(clicks: number) {
  if (clicks <= 1) return 1;
  return Math.max(0.02, 1 - (clicks - 1) * 0.05);
}

export default function Page() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [phase, setPhase] = useState<Phase>("initial");
  const [noClicks, setNoClicks] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const BASE_W = 100;
  const BASE_H = 50;

  const noIndex = useMemo(() => getNoIndexFromClicks(noClicks), [noClicks]);

  const yesScale = useMemo(() => {
    const clicks = clamp(noClicks, 0, 14);
    return 1 + clicks * 0.05;
  }, [noClicks]);

  const noScale = useMemo(() => getNoScaleFromClicks(noClicks), [noClicks]);

  const imageSrc = useMemo(() => {
    if (phase === "final") return "/images/friend-quest/final.png";
    if (noIndex >= 1) return `/images/friend-quest/no-series/${noIndex}.png`;
    return "/images/friend-quest/initial.png";
  }, [phase, noIndex]);

  function randomizeNoPosition(nextClicks: number) {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scale = getNoScaleFromClicks(nextClicks);

    const visW = BASE_W * scale;
    const visH = BASE_H * scale;

    const maxX = Math.max(0, rect.width - visW);
    const maxY = Math.max(0, rect.height - visH);

    setNoPos({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    });
  }

  function handleYes() {
    setPhase("final");
  }

  function handleNo() {
    setPhase("no");
    setNoClicks((prev) => {
      const next = prev + 1;
      randomizeNoPosition(next);
      return next;
    });
  }

  function handleReset() {
    setPhase("initial");
    setNoClicks(0);
    setNoPos({ x: 0, y: 0 });
  }

  useEffect(() => {
    if (phase === "no" && noClicks === 0) {
      randomizeNoPosition(1);
      setTimeout(() => setNoClicks(1), 0);
    }
  }, [phase, noClicks]);

  const showButtons = phase !== "final";
  const showNoText = noScale >= 0.05;

  return (
    <div className="flex flex-col gap-8 md:gap-12 justify-center items-center text-center">
      <h2 className="text-primary">Quest: Be my friend. Accept?</h2>

      <section
        ref={(node) => {
          sectionRef.current = node;
        }}
        className="relative rounded-2xl bg-white/80 shadow-sm flex flex-col gap-6 justify-center items-center text-center size-full max-w-5xl h-118.75 md:h-125 overflow-hidden"
      >
        <Image src={imageSrc} alt="Friend Quest image" width={300} height={0} />

        {showButtons && (
          <>
            {phase === "initial" && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleYes}
                  style={{ width: BASE_W, height: BASE_H }}
                  className="rounded-full bg-primary text-white grid place-items-center"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={handleNo}
                  style={{ width: BASE_W, height: BASE_H }}
                  className="rounded-full bg-secondary text-white grid place-items-center"
                >
                  No
                </button>
              </div>
            )}

            {phase === "no" && (
              <>
                <button
                  type="button"
                  onClick={handleYes}
                  style={{
                    width: BASE_W,
                    height: BASE_H,
                    transform: `scale(${yesScale})`,
                  }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-primary text-white grid place-items-center origin-center"
                >
                  Yes
                </button>

                <button
                  type="button"
                  aria-label="No"
                  onClick={handleNo}
                  style={{
                    width: BASE_W,
                    height: BASE_H,
                    left: noPos.x,
                    top: noPos.y,
                    transform: `scale(${noScale})`,
                  }}
                  className="absolute rounded-full bg-secondary text-white grid place-items-center origin-top-left"
                >
                  {showNoText ? "No" : ""}
                </button>
              </>
            )}
          </>
        )}
      </section>

      <div className="w-full max-w-5xl flex items-center justify-between gap-3">
        <div className="flex justify-center items-center gap-2 px-3 py-2 rounded-xl bg-white/60 shadow-sm text-sm">
          <span>No clicks:</span>
          <span className="font-semibold text-secondary">{noClicks}</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="bg-accent text-white hover:opacity-90 px-3 py-1 rounded-lg inline-flex justify-center"
        >
          Play Again?
        </button>
      </div>
    </div>
  );
}
