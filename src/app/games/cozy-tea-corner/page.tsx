"use client";

import { useEffect, useRef, useState } from "react";

import {
  SENCHA_MATCH_FEEDBACK,
  SENCHA_STEEP_MINUTES,
  SENCHA_TEMPERATURES,
  celsiusToFahrenheit,
  evaluateSenchaBrew,
  explainSenchaBrew,
} from "@/lib/cozy-tea";

import type {
  SenchaBrewResult,
  SenchaSteepMinutes,
  SenchaTemperature,
} from "@/lib/cozy-tea";

type TemperatureUnit = "C" | "F";

const RESULT_PRESENTATION: Record<
  SenchaBrewResult["match"],
  {
    icon: string;
    label: string;
    className: string;
  }
> = {
  ideal: {
    icon: "✨",
    label: "Ideal match",
    className: "border-primary/25 bg-primary/10",
  },
  close: {
    icon: "🍃",
    label: "Close match",
    className: "border-secondary/40 bg-secondary/10",
  },
  different: {
    icon: "🫖",
    label: "Different brew",
    className: "border-accent bg-accent/20",
  },
};

export default function CozyTeaCornerPage() {
  const [unit, setUnit] = useState<TemperatureUnit>("C");
  const [temperature, setTemperature] = useState<SenchaTemperature | null>(
    null,
  );
  const [steepMinutes, setSteepMinutes] = useState<SenchaSteepMinutes | null>(
    null,
  );
  const canBrew = temperature !== null && steepMinutes !== null;
  const [brewResult, setBrewResult] = useState<SenchaBrewResult | null>(null);
  const [isBrewing, setIsBrewing] = useState(false);
  const brewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleBrew() {
    if (
      temperature === null ||
      steepMinutes === null ||
      isBrewing ||
      brewTimerRef.current !== null
    ) {
      return;
    }

    setBrewResult(null);

    const result = evaluateSenchaBrew(temperature, steepMinutes);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBrewResult(result);
      return;
    }

    setIsBrewing(true);

    brewTimerRef.current = setTimeout(() => {
      setBrewResult(result);
      setIsBrewing(false);
      brewTimerRef.current = null;
    }, 1200);
  }

  function handleNewCup() {
    if (brewTimerRef.current !== null) {
      clearTimeout(brewTimerRef.current);
      brewTimerRef.current = null;
    }

    setIsBrewing(false);
    setBrewResult(null);
  }

  useEffect(() => {
    return () => {
      if (brewTimerRef.current !== null) {
        clearTimeout(brewTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <h1 className="text-center text-3xl text-primary">Cozy Tea Corner</h1>

      <p className="text-center text-foreground/75">
        Take a little break and brew a cozy cup of sencha for Mochi.
      </p>

      <div className="grid grid-cols-1 items-start gap-6 rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-muted/80 p-5 shadow-sm sm:p-7 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 px-5 py-6 text-center lg:col-start-1 lg:row-start-1">
          <div
            aria-hidden="true"
            className="flex size-24 items-center justify-center rounded-full bg-surface text-6xl shadow-sm"
          >
            🍵
          </div>

          <p className="font-semibold text-primary">Mochi&apos;s order</p>

          <p className="max-w-md text-sm text-foreground/75">
            One cup of sencha, please! I&apos;d love a smooth, gentle green tea
            that isn&apos;t too bitter.
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <details className="rounded-2xl border border-border bg-surface/80 px-4 py-4">
            <summary className="cursor-pointer font-semibold text-primary focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none">
              💡 Need a brewing hint?
            </summary>

            <p className="mt-3 text-sm leading-6 text-foreground/80">
              Water temperature and steeping time both affect tea flavor. Cooler
              water often creates a softer, less astringent cup, while hotter
              water can bring out more bitterness and astringency. Longer
              steeping generally produces a stronger brew. Think about the
              flavor Mochi requested!
            </p>
          </details>

          <fieldset disabled={isBrewing} className="flex flex-col gap-3">
            <legend className="mb-3 font-semibold">Temperature unit</legend>

            <div className="flex gap-2">
              {(["C", "F"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={unit === option}
                  onClick={() => setUnit(option)}
                  className={`cursor-pointer rounded-lg px-4 py-2 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                    unit === option
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-muted text-foreground"
                  }`}
                >
                  °{option}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset disabled={isBrewing} className="flex flex-col gap-3">
            <legend className="mb-3 font-semibold">Water temperature</legend>

            <div className="grid grid-cols-3 gap-3">
              {SENCHA_TEMPERATURES.map((celsius) => (
                <button
                  key={celsius}
                  type="button"
                  aria-pressed={temperature === celsius}
                  onClick={() => {
                    setTemperature(celsius);
                    setBrewResult(null);
                  }}
                  className={`cursor-pointer rounded-xl px-3 py-4 transition-colors focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                    temperature === celsius
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-surface text-foreground ring-1 ring-border ring-inset enabled:hover:bg-surface-muted enabled:hover:ring-primary/50"
                  }`}
                >
                  {unit === "C" ? celsius : celsiusToFahrenheit(celsius)}°{unit}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset disabled={isBrewing} className="flex flex-col gap-3">
            <legend className="mb-3 font-semibold">Steeping time</legend>

            <div className="grid grid-cols-3 gap-3">
              {SENCHA_STEEP_MINUTES.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  aria-pressed={steepMinutes === minutes}
                  onClick={() => {
                    setSteepMinutes(minutes);
                    setBrewResult(null);
                  }}
                  className={`cursor-pointer rounded-xl px-3 py-4 transition-colors focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                    steepMinutes === minutes
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-surface text-foreground ring-1 ring-border ring-inset enabled:hover:bg-surface-muted enabled:hover:ring-primary/50"
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-3 lg:flex-row">
            <button
              type="button"
              onClick={handleBrew}
              disabled={!canBrew}
              aria-disabled={isBrewing ? true : undefined}
              className="w-full cursor-pointer rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 lg:w-auto lg:min-w-0 lg:flex-1"
            >
              {isBrewing ? "Brewing..." : "Brew Tea"}
            </button>

            <button
              type="button"
              onClick={handleNewCup}
              className="w-full cursor-pointer rounded-xl border border-border bg-surface px-5 py-3 font-semibold text-primary transition hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none lg:w-auto lg:min-w-0 lg:flex-1"
            >
              New Cup
            </button>
          </div>
        </div>
        <div
          aria-live="polite"
          aria-atomic="true"
          className="min-w-0 lg:col-start-1 lg:row-start-2"
        >
          {isBrewing && (
            <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-5 text-center font-medium text-primary">
              🍵 Brewing Mochi&apos;s sencha...
            </p>
          )}
          {brewResult && (
            <section
              className={`flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:p-6 ${
                RESULT_PRESENTATION[brewResult.match].className
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface text-3xl shadow-sm"
                >
                  {RESULT_PRESENTATION[brewResult.match].icon}
                </span>

                <div className="flex min-w-0 flex-col gap-2">
                  <p className="text-xs font-semibold tracking-wide text-foreground/70 uppercase">
                    {RESULT_PRESENTATION[brewResult.match].label}
                  </p>

                  <h2 className="text-xl font-semibold text-primary">
                    {SENCHA_MATCH_FEEDBACK[brewResult.match].title}
                  </h2>
                </div>
              </div>

              <p className="text-sm leading-6 text-foreground/80">
                {SENCHA_MATCH_FEEDBACK[brewResult.match].description}
              </p>

              <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-surface/80 px-4 py-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5">
                {temperature !== null && (
                  <p>
                    Temperature:{" "}
                    <strong>
                      {unit === "C"
                        ? temperature
                        : celsiusToFahrenheit(temperature)}
                      °{unit}
                    </strong>
                  </p>
                )}

                {steepMinutes !== null && (
                  <p>
                    Steeping: <strong>{steepMinutes} min</strong>
                  </p>
                )}

                <p>
                  Flavor:{" "}
                  <strong className="capitalize">{brewResult.flavor}</strong>
                </p>
              </div>

              {temperature !== null && steepMinutes !== null && (
                <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-surface/80 px-4 py-4">
                  <h3 className="text-lg leading-snug font-semibold text-primary">
                    🍃 How do brewing choices affect flavor?
                  </h3>

                  <p className="text-sm leading-6 text-foreground/80">
                    {explainSenchaBrew(temperature, steepMinutes)}
                  </p>

                  <p className="text-xs leading-5 text-foreground/65">
                    These are general brewing tendencies. Actual tea flavors
                    vary depending on the tea leaves and brewing conditions.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
