"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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

type BrewingView = "preparation" | "brewing" | "result";

type CompletedBrew = {
  temperature: SenchaTemperature;
  steepMinutes: SenchaSteepMinutes;
  unit: TemperatureUnit;
  result: SenchaBrewResult;
};

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
  const [view, setView] = useState<BrewingView>("preparation");
  const isBrewing = view === "brewing";
  const [completedBrew, setCompletedBrew] = useState<CompletedBrew | null>(
    null,
  );
  const brewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preparationNavRef = useRef<HTMLButtonElement>(null);
  const resultNavRef = useRef<HTMLButtonElement>(null);
  const brewButtonRef = useRef<HTMLButtonElement>(null);
  const scrollAfterNewCupRef = useRef(false);

  function handleBrew() {
    if (
      temperature === null ||
      steepMinutes === null ||
      isBrewing ||
      brewTimerRef.current !== null
    ) {
      return;
    }

    const submission: CompletedBrew = {
      temperature,
      steepMinutes,
      unit,
      result: evaluateSenchaBrew(temperature, steepMinutes),
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCompletedBrew(submission);
      setView("result");
      return;
    }

    setView("brewing");

    brewTimerRef.current = setTimeout(() => {
      setCompletedBrew(submission);
      setView("result");
      brewTimerRef.current = null;
    }, 1200);
  }

  function handleNewCup() {
    if (brewTimerRef.current !== null) {
      clearTimeout(brewTimerRef.current);
      brewTimerRef.current = null;
    }

    scrollAfterNewCupRef.current = true;
    setView("preparation");
  }

  useEffect(() => {
    return () => {
      if (brewTimerRef.current !== null) {
        clearTimeout(brewTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (completedBrew === null || view === "brewing") {
      return;
    }

    const activeNav =
      view === "preparation" ? preparationNavRef.current : resultNavRef.current;

    activeNav?.focus({ preventScroll: true });
  }, [view, completedBrew]);

  useLayoutEffect(() => {
    if (view !== "preparation" || !scrollAfterNewCupRef.current) {
      return;
    }

    scrollAfterNewCupRef.current = false;

    const isShortMobile = window.matchMedia(
      "(max-width: 639px) and (max-height: 760px)",
    ).matches;

    if (!isShortMobile) {
      return;
    }

    brewButtonRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [view]);

  const mochiHeading =
    view === "brewing"
      ? "Mochi is waiting for her tea..."
      : completedBrew
        ? SENCHA_MATCH_FEEDBACK[completedBrew.result.match].title
        : "Mochi's order";

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <h1 className="text-center text-3xl text-primary">Cozy Tea Corner</h1>

      <p className="hidden text-center text-foreground/75 sm:block">
        Take a little break and brew a cozy cup of sencha for Mochi.
      </p>

      <div className="grid grid-cols-1 items-start gap-6 rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-muted/80 p-5 shadow-sm sm:p-7 lg:grid-cols-2">
        <div className="hidden min-w-0 flex-col items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 px-5 py-6 text-center lg:col-start-1 lg:row-start-1 lg:flex">
          <div
            aria-hidden="true"
            className="flex size-24 items-center justify-center rounded-full bg-surface text-6xl shadow-sm"
          >
            🍵
          </div>

          <p className="font-semibold text-primary">{mochiHeading}</p>

          <p className="max-w-md text-sm text-foreground/75">
            One cup of sencha, please! I&apos;d love a smooth, gentle green tea
            that isn&apos;t too bitter.
          </p>
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <div className="sticky top-24 z-10 mb-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-surface/95 px-3 py-2 shadow-sm backdrop-blur lg:hidden">
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-muted text-4xl"
            >
              🍵
            </span>

            <div className="min-w-0">
              <p className="text-sm leading-5 font-semibold text-primary">
                {mochiHeading}
              </p>

              <p className="text-xs leading-5 text-foreground/75">
                {view === "brewing"
                  ? "Waiting to taste the tea..."
                  : completedBrew
                    ? "Ready for another cup."
                    : "Gentle sencha, please—not too bitter."}
              </p>
            </div>
          </div>
          {completedBrew && view !== "brewing" && (
            <div
              role="group"
              aria-label="Brewing views"
              className="mb-4 grid grid-cols-2 gap-2"
            >
              <button
                ref={preparationNavRef}
                type="button"
                aria-pressed={view === "preparation"}
                onClick={() => setView("preparation")}
                className={`cursor-pointer scroll-mt-24 rounded-xl px-3 py-3 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none ${
                  view === "preparation"
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-primary ring-1 ring-border ring-inset hover:bg-surface-muted"
                }`}
              >
                Preparation
              </button>

              <button
                ref={resultNavRef}
                type="button"
                aria-pressed={view === "result"}
                onClick={() => setView("result")}
                className={`cursor-pointer scroll-mt-24 rounded-xl px-3 py-3 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none ${
                  view === "result"
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-primary ring-1 ring-border ring-inset hover:bg-surface-muted"
                }`}
              >
                Last Result
              </button>
            </div>
          )}
          <p role="status" aria-atomic="true" className="sr-only">
            {isBrewing
              ? "Brewing Mochi's sencha..."
              : completedBrew
                ? `Brewing complete. ${SENCHA_MATCH_FEEDBACK[completedBrew.result.match].title}`
                : ""}
          </p>
          {view === "preparation" && (
            <div className="flex flex-col gap-4">
              <details className="rounded-2xl border border-[#ECD9B9] bg-[#FFF1DB] px-4 py-4">
                <summary className="cursor-pointer font-semibold text-[#295F53] focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none">
                  💡 Need a brewing hint?
                </summary>

                <p className="mt-3 text-sm leading-6 text-foreground/80">
                  Water temperature and steeping time both affect tea flavor.
                  Cooler water often creates a softer, less astringent cup,
                  while hotter water can bring out more bitterness and
                  astringency. Longer steeping generally produces a stronger
                  brew. Think about the flavor Mochi requested!
                </p>
              </details>

              <fieldset>
                <legend className="sr-only">Temperature unit</legend>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span aria-hidden="true" className="text-base font-semibold">
                    Temperature unit
                  </span>

                  <div className="flex gap-2">
                    {(["C", "F"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={unit === option}
                        onClick={() => setUnit(option)}
                        className={`cursor-pointer rounded-lg px-4 py-2 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none ${
                          unit === option
                            ? "bg-primary text-primary-foreground"
                            : "bg-surface-muted text-foreground"
                        }`}
                      >
                        °{option}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 font-semibold">
                  Water temperature
                </legend>

                <div className="grid grid-cols-3 gap-3">
                  {SENCHA_TEMPERATURES.map((celsius) => (
                    <button
                      key={celsius}
                      type="button"
                      aria-pressed={temperature === celsius}
                      onClick={() => {
                        setTemperature(celsius);
                      }}
                      className={`cursor-pointer rounded-xl px-3 py-4 transition-colors focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                        temperature === celsius
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-surface text-foreground ring-1 ring-border ring-inset enabled:hover:bg-surface-muted enabled:hover:ring-primary/50"
                      }`}
                    >
                      {unit === "C" ? celsius : celsiusToFahrenheit(celsius)}°
                      {unit}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 font-semibold">Steeping time</legend>

                <div className="grid grid-cols-3 gap-3">
                  {SENCHA_STEEP_MINUTES.map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      aria-pressed={steepMinutes === minutes}
                      onClick={() => {
                        setSteepMinutes(minutes);
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
              <button
                ref={brewButtonRef}
                type="button"
                onClick={handleBrew}
                disabled={!canBrew}
                className="w-full cursor-pointer scroll-mb-6 rounded-xl bg-[#295F53] px-5 py-3 font-semibold text-white transition-[filter,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none enabled:hover:shadow-sm enabled:hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Brew Tea
              </button>
            </div>
          )}
          <div>
            {isBrewing && (
              <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-6 text-center">
                <span
                  aria-hidden="true"
                  className="flex size-14 items-center justify-center rounded-full bg-surface text-4xl shadow-sm"
                >
                  🍵
                </span>

                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-primary">
                    Brewing Mochi&apos;s sencha...
                  </p>

                  <p className="text-sm text-foreground/70">
                    A cozy cup is on its way!
                  </p>
                </div>
              </div>
            )}
            {view === "result" && completedBrew && (
              <section
                className={`flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:p-6 ${
                  RESULT_PRESENTATION[completedBrew.result.match].className
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface text-3xl shadow-sm"
                  >
                    {RESULT_PRESENTATION[completedBrew.result.match].icon}
                  </span>

                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="text-xs font-semibold tracking-wide text-foreground/70 uppercase">
                      {RESULT_PRESENTATION[completedBrew.result.match].label}
                    </p>

                    <h2 className="text-xl font-semibold text-primary">
                      {SENCHA_MATCH_FEEDBACK[completedBrew.result.match].title}
                    </h2>
                  </div>
                </div>

                <p className="text-sm leading-6 text-foreground/80">
                  {
                    SENCHA_MATCH_FEEDBACK[completedBrew.result.match]
                      .description
                  }
                </p>

                <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-surface/80 px-4 py-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5">
                  <p>
                    Temperature:{" "}
                    <strong>
                      {completedBrew.unit === "C"
                        ? completedBrew.temperature
                        : celsiusToFahrenheit(completedBrew.temperature)}
                      °{completedBrew.unit}
                    </strong>
                  </p>

                  <p>
                    Steeping: <strong>{completedBrew.steepMinutes} min</strong>
                  </p>

                  <p>
                    Flavor:{" "}
                    <strong className="capitalize">
                      {completedBrew.result.flavor}
                    </strong>
                  </p>
                </div>

                <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-surface/80 px-4 py-4">
                  <h3 className="text-lg leading-snug font-semibold text-primary">
                    🍃 How do brewing choices affect flavor?
                  </h3>

                  <p className="text-sm leading-6 text-foreground/80">
                    {explainSenchaBrew(
                      completedBrew.temperature,
                      completedBrew.steepMinutes,
                    )}
                  </p>

                  <p className="text-xs leading-5 text-foreground/65">
                    These are general brewing tendencies. Actual tea flavors
                    vary depending on the tea leaves and brewing conditions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNewCup}
                  className="w-full cursor-pointer rounded-xl bg-[#295F53] px-5 py-3 font-semibold text-white transition-[filter,box-shadow] duration-150 hover:shadow-sm hover:brightness-95 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
                >
                  New Cup
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
