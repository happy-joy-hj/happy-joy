"use client";

import Image from "next/image";
import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { useNoPosition } from "@/hooks/useNoPosition";
import { usePops } from "@/hooks/usePops";
import { useShake } from "@/hooks/useShake";

import {
  clamp,
  getFinalContent,
  getNoIndexFromClicks,
  getNoScaleFromClicks,
  getStageContent,
  getVibe,
} from "@/lib/friend-quest";
import type { FinalContent, Phase } from "@/lib/friend-quest";

type FaAnimStyle = CSSProperties & {
  ["--fa-animation-duration"]?: string;
};

const BASE_W = 100;
const BASE_H = 50;
const MAX_METER = 20;
const MAX_INCOMPLETE_PROGRESS = 0.95;
const YES_FINISH_DELAY = 250;

export default function Page() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const yesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialYesButtonRef = useRef<HTMLButtonElement | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const endingHeadingRef = useRef<HTMLHeadingElement | null>(null);

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

  useEffect(() => {
    if (phase !== "initial" || !shouldRestoreFocusRef.current) {
      return;
    }

    initialYesButtonRef.current?.focus();
    shouldRestoreFocusRef.current = false;
  }, [phase]);

  useEffect(() => {
    if (phase === "final" || phase === "declined") {
      endingHeadingRef.current?.focus();
    }
  }, [phase]);

  const isMeterFull = isAccepting || phase === "final";
  const clicksForMeter = clamp(noClicks, 0, MAX_METER);
  const meter = isMeterFull
    ? 1
    : Math.min(clicksForMeter / MAX_METER, MAX_INCOMPLETE_PROGRESS);

  const noIndex = getNoIndexFromClicks(noClicks);
  const noScale = getNoScaleFromClicks(noClicks);
  const yesScale = Math.min(1.5, 1 + clicksForMeter * 0.05);

  const duration = Math.max(0.35, 1 - noClicks * 0.05);
  const faAnimStyle: FaAnimStyle = {
    ["--fa-animation-duration"]: `${duration}s`,
  };

  const vibe = getVibe(phase, noClicks);
  const stageContent = getStageContent(phase, noClicks);
  const [finalContent, setFinalContent] = useState<FinalContent | null>(null);

  const imageSrc =
    phase === "final"
      ? "/images/friend-quest/final.png"
      : phase === "declined"
        ? "/images/friend-quest/initial.png"
        : noIndex >= 1
          ? `/images/friend-quest/no-series/${noIndex}.png`
          : "/images/friend-quest/initial.png";

  const showButtons = phase !== "final" && phase !== "declined" && !isAccepting;
  const showNoText = noScale >= 0.05 && stageContent.noText.length > 0;

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
      setFinalContent(getFinalContent(noClicks));
      setPhase("final");
      setIsAccepting(false);
      yesTimeoutRef.current = null;
    }, YES_FINISH_DELAY);
  }

  function handleNo(e: MouseEvent<HTMLButtonElement>) {
    if (isAccepting || phase === "final") return;

    if (e.detail > 0) {
      e.currentTarget.blur();
    }

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

  function handleDecline() {
    if (isAccepting || phase === "final" || phase === "declined") {
      return;
    }

    setPhase("declined");
  }

  function handleReset() {
    if (yesTimeoutRef.current) {
      clearTimeout(yesTimeoutRef.current);
      yesTimeoutRef.current = null;
    }

    shouldRestoreFocusRef.current = true;

    setPhase("initial");
    setNoClicks(0);
    setIsAccepting(false);
    setNoPos({ x: 0, y: 0 });
    setFinalContent(null);
    clearPops();
  }

  return (
    <div className="container flex flex-col items-center justify-center gap-8 text-center md:gap-12">
      <h2 className="max-w-2xl text-2xl text-primary sm:text-3xl">
        Friend Quest: Will you be my friend?
      </h2>

      <section
        ref={sectionRef}
        onAnimationEnd={onAnimationEnd}
        className={[
          "relative flex size-full max-w-5xl flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-surface/95 to-surface-muted/85 text-center shadow-[0_8px_28px_rgba(62,69,66,0.07)]",
          "h-118.75 md:h-125",
          isShaking ? "cozy-shake" : "",
        ].join(" ")}
      >
        <div className="w-full max-w-md px-5 sm:px-6">
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs text-foreground/80">
            <span className="inline-flex items-center gap-2">
              <i
                aria-hidden="true"
                className="fa-solid fa-paw fa-beat-fade"
                style={faAnimStyle}
              />
              Quest progress
            </span>
            <span>{Math.round(meter * 100)}%</span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-black/10"
            role="progressbar"
            aria-label="Quest progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(meter * 100)}
          >
            <div
              className={`friend-quest-motion h-full bg-primary ${
                phase === "final" ? "" : "transition-all duration-300"
              }`}
              style={{ width: `${meter * 100}%` }}
            />
          </div>
        </div>

        <div
          className="inline-flex max-w-[90%] items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-2 text-center shadow-sm"
          aria-live="polite"
        >
          <i
            aria-hidden="true"
            className={`${vibe.icon} ${vibe.anim}`}
            style={faAnimStyle}
          />
          <span className="text-sm md:text-base">{stageContent.dialogue}</span>
        </div>

        <Image
          src={imageSrc}
          alt=""
          width={300}
          height={300}
          className="h-auto w-45 select-none lg:w-65"
          draggable={false}
          priority
        />

        {pops.map((p) => (
          <i
            key={p.id}
            aria-hidden="true"
            className={`${p.iconClass} cozy-pop pointer-events-none absolute select-none`}
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
                  ref={initialYesButtonRef}
                  type="button"
                  aria-label="Say yes and befriend the kitten"
                  onClick={handleYes}
                  style={{ width: BASE_W, height: BASE_H }}
                  className="grid cursor-pointer place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-95"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <i
                      aria-hidden="true"
                      className="fa-solid fa-heart fa-beat shrink-0"
                      style={faAnimStyle}
                    />
                    <span className="min-w-0 text-center leading-tight">
                      {stageContent.yesText}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  aria-label="Say no and continue the game"
                  onClick={handleNo}
                  style={{ width: BASE_W, height: BASE_H }}
                  className="grid cursor-pointer place-items-center rounded-full bg-secondary text-secondary-foreground transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-95"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <i
                      aria-hidden="true"
                      className="fa-solid fa-star fa-fade shrink-0"
                      style={faAnimStyle}
                    />
                    <span className="min-w-0 text-center leading-tight">
                      {stageContent.noText}
                    </span>
                  </span>
                </button>
              </div>
            )}

            {phase === "no" && (
              <>
                <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
                  <button
                    type="button"
                    aria-label={`Accept friendship: ${stageContent.yesText}`}
                    onClick={handleYes}
                    style={{
                      width: BASE_W,
                      height: BASE_H,
                      transform: `scale(${yesScale})`,
                    }}
                    className="friend-quest-motion pointer-events-auto grid origin-center cursor-pointer place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 ease-out focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transition-none"
                  >
                    <span className="inline-flex items-center justify-center gap-1.5 px-2">
                      <i
                        aria-hidden="true"
                        className={`${yesIcon} fa-beat-fade shrink-0`}
                        style={faAnimStyle}
                      />
                      <span className="text-center text-sm leading-tight">
                        {stageContent.yesText}
                      </span>
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  aria-label={`Continue saying no: ${stageContent.noText || "No"}`}
                  onClick={handleNo}
                  style={{
                    width: BASE_W,
                    height: BASE_H,
                    left: noPos.x,
                    top: noPos.y,
                  }}
                  className="absolute grid cursor-pointer place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  <span
                    aria-hidden="true"
                    className="friend-quest-motion grid h-full w-full place-items-center rounded-full bg-secondary text-secondary-foreground transition-transform duration-200 ease-out motion-reduce:transition-none"
                    style={{
                      transform: `scale(${noScale})`,
                    }}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <i
                        aria-hidden="true"
                        className={`${noIcon} fa-fade shrink-0`}
                        style={faAnimStyle}
                      />
                      <span className="min-w-0 text-center leading-tight">
                        {showNoText ? stageContent.noText : ""}
                      </span>
                    </span>
                  </span>
                </button>
              </>
            )}
          </>
        )}

        {phase === "final" && finalContent && (
          <div className="mt-1 flex flex-col items-center gap-2 px-4">
            <h3
              ref={endingHeadingRef}
              tabIndex={-1}
              className="inline-flex items-center gap-2 text-lg font-semibold focus:outline-none"
            >
              <i
                aria-hidden="true"
                className="fa-solid fa-heart fa-beat"
                style={faAnimStyle}
              />
              {finalContent.title}
              <i
                aria-hidden="true"
                className="fa-solid fa-star fa-fade"
                style={faAnimStyle}
              />
            </h3>

            <p className="text-sm opacity-80 md:text-base">
              {finalContent.subline}
            </p>
          </div>
        )}

        {phase === "declined" && (
          <div className="flex flex-col items-center gap-2 px-4">
            <h3
              ref={endingHeadingRef}
              tabIndex={-1}
              className="text-xl font-semibold text-primary focus:outline-none"
            >
              No worries! Maybe next time ♡
            </h3>

            <p className="text-sm text-foreground/75">
              The kitten waves goodbye. Come back whenever you&apos;d like!
            </p>
          </div>
        )}
      </section>

      <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center justify-center gap-2 rounded-xl bg-white/60 px-3 py-2 text-sm shadow-sm">
          <i
            aria-hidden="true"
            className="fa-regular fa-face-meh-blank fa-beat-fade"
            style={faAnimStyle}
          />
          <span>No Taps:</span>
          <span className="font-semibold text-secondary-emphasis">
            {noClicks}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {showButtons && (
            <button
              type="button"
              onClick={handleDecline}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-foreground/75 underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
            >
              Maybe later
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 font-semibold text-accent-foreground transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.98]"
          >
            <i
              aria-hidden="true"
              className="fa-solid fa-rotate-right"
              style={faAnimStyle}
            />
            {phase === "declined" ? "Play Again" : "Retry Friendship?"}
          </button>
        </div>
      </div>
    </div>
  );
}
