"use client";

import { useState } from "react";

import {
  SENCHA_MATCH_FEEDBACK,
  SENCHA_STEEP_MINUTES,
  SENCHA_TEMPERATURES,
  celsiusToFahrenheit,
  evaluateSenchaBrew,
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
  const [temperature, setTemperature] = useState<SenchaTemperature>(70);
  const [steepMinutes, setSteepMinutes] = useState<SenchaSteepMinutes>(1);
  const [brewResult, setBrewResult] = useState<SenchaBrewResult | null>(null);

  function handleBrew() {
    const result = evaluateSenchaBrew(temperature, steepMinutes);
    setBrewResult(result);
  }

  function handleNewCup() {
    setTemperature(70);
    setSteepMinutes(1);
    setBrewResult(null);
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <h1 className="text-center text-3xl text-primary">Cozy Tea Corner</h1>

      <p className="text-center text-foreground/75">
        Take a little break and brew your perfect cup of sencha.
      </p>

      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-muted/80 p-5 shadow-sm sm:p-7">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 px-5 py-6 text-center">
          <div
            aria-hidden="true"
            className="flex size-24 items-center justify-center rounded-full bg-surface text-6xl shadow-sm"
          >
            🍵
          </div>

          <p className="font-semibold text-primary">
            A little pause, a warm cup.
          </p>

          <p className="max-w-md text-sm text-foreground/75">
            Choose your brewing settings and discover your perfect cup of
            sencha.
          </p>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 font-semibold">Temperature unit</legend>

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
        </fieldset>

        <fieldset className="flex flex-col gap-3">
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
                className={`cursor-pointer rounded-xl px-3 py-4 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none ${
                  temperature === celsius
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-muted text-foreground"
                }`}
              >
                {unit === "C" ? celsius : celsiusToFahrenheit(celsius)}°{unit}
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
                  setBrewResult(null);
                }}
                className={`cursor-pointer rounded-xl px-3 py-4 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none ${
                  steepMinutes === minutes
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-muted text-foreground"
                }`}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-1">
          <p className="text-center text-sm text-foreground/75">
            Selected temperature:{" "}
            <strong>
              {unit === "C" ? temperature : celsiusToFahrenheit(temperature)}°
              {unit}
            </strong>
          </p>

          <p className="text-center text-sm text-foreground/75">
            Selected steeping time:{" "}
            <strong>
              {steepMinutes} {steepMinutes === 1 ? "minute" : "minutes"}
            </strong>
          </p>
        </div>

        <button
          type="button"
          onClick={handleBrew}
          className="w-full cursor-pointer rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
        >
          Brew Tea
        </button>

        <button
          type="button"
          onClick={handleNewCup}
          className="w-full cursor-pointer rounded-xl border border-border bg-surface px-5 py-3 font-semibold text-primary transition hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
        >
          New Cup
        </button>

        <div aria-live="polite" aria-atomic="true">
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

              <div className="rounded-xl border border-border/70 bg-surface/80 px-4 py-3">
                <p className="text-sm">
                  Flavor profile:{" "}
                  <strong className="capitalize">{brewResult.flavor}</strong>
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
