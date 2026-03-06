"use client";

import Image from "next/image";
import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { useNoPosition } from "@/hooks/useNoPosition";
import { usePops } from "@/hooks/usePops";
import { useShake } from "@/hooks/useShake";

import {
  clamp,
  getNoIndexFromClicks,
  getNoScaleFromClicks,
  getVibe,
} from "@/lib/friend-quest";
import type { Phase } from "@/lib/friend-quest";

type FaAnimStyle = CSSProperties & {
  ["--fa-animation-duration"]?: string;
};

const BASE_W = 100;
const BASE_H = 50;
const MAX_METER = 20;
const YES_FINISH_DELAY = 250;

export default function Page() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const yesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [phase, setPhase] = useState<Phase>("initial");
  const [noClicks, setNoClicks] = useState(0);
  const [isAccepting, setIsAccepting] = useState(false);

  const { isShaking, triggerShake, onAnimationEnd } = useShake();
  const { pops, spawnPop, clearPops } = usePops(sectionRef);
  const { noPos, setNoPos } = useNoPosition(
    sectionRef,
    phase,
    noClicks,
    BASE_W,
    BASE_H,
  );

  useEffect(() => {
    return () => {
      if (yesTimeoutRef.current) clearTimeout(yesTimeoutRef.current);
    };
  }, []);

  const isMeterFull = isAccepting || phase === "final";
  const clicksForMeter = clamp(noClicks, 0, MAX_METER);
  const meter = isMeterFull ? 1 : Math.min(clicksForMeter / MAX_METER, 0.99);

  const noIndex = getNoIndexFromClicks(noClicks);
  const noScale = getNoScaleFromClicks(noClicks);
  const yesScale = 1 + clicksForMeter * 0.05;

  const duration = Math.max(0.35, 1 - noClicks * 0.05);
  const faAnimStyle: FaAnimStyle = {
    ["--fa-animation-duration"]: `${duration}s`,
  };

  const vibe = getVibe(phase, noClicks);

  const imageSrc =
    phase === "final"
      ? "/images/friend-quest/final.png"
      : noIndex >= 1
        ? `/images/friend-quest/no-series/${noIndex}.png`
        : "/images/friend-quest/initial.png";

  const showButtons = phase !== "final" && !isAccepting;
  const showNoText = noScale >= 0.05;

  const yesIcon =
    noClicks >= 10 ? "fa-regular fa-face-smile-beam" : "fa-solid fa-heart";

  const noIcon =
    noClicks >= 8 ? "fa-regular fa-face-sad-tear" : "fa-solid fa-star";

  function handleYes(e: MouseEvent<HTMLButtonElement>) {
    if (isAccepting || phase === "final") return;

    spawnPop(e.clientX, e.clientY, "fa-solid fa-heart");
    if (Math.random() > 0.5) {
      spawnPop(e.clientX + 10, e.clientY - 6, "fa-solid fa-star");
    }

    setIsAccepting(true);

    yesTimeoutRef.current = setTimeout(() => {
      setPhase("final");
      setIsAccepting(false);
      yesTimeoutRef.current = null;
    }, YES_FINISH_DELAY);
  }

  function handleNo(e: MouseEvent<HTMLButtonElement>) {
    if (isAccepting || phase === "final") return;

    spawnPop(
      e.clientX,
      e.clientY,
      Math.random() > 0.5
        ? "fa-solid fa-star fa-fade"
        : "fa-regular fa-heart fa-fade",
    );

    triggerShake();
    setPhase("no");
    setNoClicks((c) => c + 1);
  }

  function handleReset() {
    if (yesTimeoutRef.current) {
      clearTimeout(yesTimeoutRef.current);
      yesTimeoutRef.current = null;
    }

    setPhase("initial");
    setNoClicks(0);
    setIsAccepting(false);
    setNoPos({ x: 0, y: 0 });
    clearPops();
  }

  return (
    <div className="container flex flex-col gap-8 md:gap-12 justify-center items-center text-center">
      <h2 className="text-primary">Friend Quest: Will you be my friend?</h2>

      <section
        ref={sectionRef}
        onAnimationEnd={onAnimationEnd}
        className={[
          "relative rounded-2xl bg-white/80 shadow-sm flex flex-col gap-4 justify-center items-center text-center size-full max-w-5xl",
          "h-118.75 md:h-125 overflow-hidden",
          isShaking ? "cozy-shake" : "",
        ].join(" ")}
      >
        <div
          className="px-4 py-2 rounded-2xl bg-white/70 shadow-sm inline-flex items-center gap-2"
          aria-live="polite"
        >
          <i
            aria-hidden="true"
            className={`${vibe.icon} ${vibe.anim}`}
            style={faAnimStyle}
          />
          <span className="text-sm md:text-base">{vibe.text}</span>
        </div>

        <div className="w-full max-w-md px-4">
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span className="inline-flex items-center gap-2">
              <i
                aria-hidden="true"
                className="fa-solid fa-paw fa-beat-fade"
                style={faAnimStyle}
              />
              Friendship meter
            </span>
            <span>{Math.round(meter * 100)}%</span>
          </div>

          <div className="h-2 rounded-full bg-black/10 overflow-hidden">
            <div
              className={`h-full bg-primary ${
                phase === "final" ? "" : "transition-all duration-300"
              }`}
              style={{ width: `${meter * 100}%` }}
            />
          </div>
        </div>

        <Image
          src={imageSrc}
          alt="Friend Quest image"
          width={300}
          height={300}
          className="h-auto w-50 md:w-72 select-none"
          draggable={false}
          priority
        />

        {pops.map((p) => (
          <i
            key={p.id}
            aria-hidden="true"
            className={`${p.iconClass} cozy-pop absolute pointer-events-none select-none`}
            style={{
              left: p.x,
              top: p.y,
              transform: "translate(-50%, -50%)",
              fontSize: 18,
            }}
          />
        ))}

        {showButtons && (
          <>
            {phase === "initial" && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleYes}
                  style={{ width: BASE_W, height: BASE_H }}
                  className="rounded-full bg-primary text-white grid place-items-center active:scale-95 transition-transform duration-150"
                >
                  <span className="inline-flex items-center gap-2">
                    <i
                      aria-hidden="true"
                      className="fa-solid fa-heart fa-beat"
                      style={faAnimStyle}
                    />
                    Yes
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleNo}
                  style={{ width: BASE_W, height: BASE_H }}
                  className="rounded-full bg-secondary text-white grid place-items-center active:scale-95 transition-transform duration-150"
                >
                  <span className="inline-flex items-center gap-2">
                    <i
                      aria-hidden="true"
                      className="fa-solid fa-star fa-fade"
                      style={faAnimStyle}
                    />
                    No
                  </span>
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
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-primary text-white grid place-items-center origin-center transition-transform duration-200 ease-out active:scale-[0.98]"
                >
                  <span className="inline-flex items-center gap-2">
                    <i
                      aria-hidden="true"
                      className={`${yesIcon} fa-beat-fade`}
                      style={faAnimStyle}
                    />
                    Yes
                  </span>
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
                  className="absolute rounded-full bg-secondary text-white grid place-items-center origin-top-left transition-all duration-200 ease-out active:scale-95"
                >
                  <span className="inline-flex items-center gap-2">
                    <i
                      aria-hidden="true"
                      className={`${noIcon} fa-fade`}
                      style={faAnimStyle}
                    />
                    {showNoText ? "No" : ""}
                  </span>
                </button>
              </>
            )}
          </>
        )}

        {phase === "final" && (
          <div className="mt-1 text-lg font-semibold inline-flex items-center gap-2">
            <i
              aria-hidden="true"
              className="fa-solid fa-heart fa-beat"
              style={faAnimStyle}
            />
            Friendship Acquired!
            <i
              aria-hidden="true"
              className="fa-solid fa-star fa-fade"
              style={faAnimStyle}
            />
          </div>
        )}
      </section>

      <div className="w-full max-w-5xl flex items-center justify-between gap-3">
        <div className="flex justify-center items-center gap-2 px-3 py-2 rounded-xl bg-white/60 shadow-sm text-sm">
          <i
            aria-hidden="true"
            className="fa-regular fa-face-meh-blank fa-beat-fade"
            style={faAnimStyle}
          />
          <span>No Taps:</span>
          <span className="font-semibold text-secondary">{noClicks}</span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="bg-accent text-white hover:opacity-90 px-3 py-1 rounded-lg inline-flex items-center gap-2 justify-center active:scale-[0.98] transition-transform"
        >
          <i
            aria-hidden="true"
            className="fa-solid fa-rotate-left fa-spin"
            style={faAnimStyle}
          />
          Play Again?
        </button>
      </div>
    </div>
  );
}
