export const SENCHA_TEMPERATURES = [70, 85, 100] as const;
export const SENCHA_STEEP_MINUTES = [1, 3, 5] as const;

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export type SenchaTemperature = (typeof SENCHA_TEMPERATURES)[number];

export type SenchaSteepMinutes = (typeof SENCHA_STEEP_MINUTES)[number];

export type SenchaBrewResult = {
  flavor: "gentle" | "fuller" | "brisk" | "strong" | "intense";
  match: "ideal" | "close" | "different";
};

export const SENCHA_MATCH_FEEDBACK: Record<
  SenchaBrewResult["match"],
  { title: string; description: string }
> = {
  ideal: {
    title: "A lovely cup!",
    description: "Gentle and balanced — just right for this sencha recipe.",
  },
  close: {
    title: "A cozy variation!",
    description: "Not quite the target brew, but a fun variation to explore.",
  },
  different: {
    title: "A bold experiment!",
    description:
      "This brew takes a different path. Try another temperature or steeping time!",
  },
};

type BrewKey = `${SenchaTemperature}-${SenchaSteepMinutes}`;

const BREW_OUTCOMES: Record<BrewKey, SenchaBrewResult> = {
  "70-1": { flavor: "gentle", match: "ideal" },
  "70-3": { flavor: "fuller", match: "close" },
  "70-5": { flavor: "strong", match: "different" },

  "85-1": { flavor: "brisk", match: "close" },
  "85-3": { flavor: "strong", match: "different" },
  "85-5": { flavor: "intense", match: "different" },

  "100-1": { flavor: "brisk", match: "different" },
  "100-3": { flavor: "intense", match: "different" },
  "100-5": { flavor: "intense", match: "different" },
};

export function evaluateSenchaBrew(
  temperature: SenchaTemperature,
  steepMinutes: SenchaSteepMinutes,
): SenchaBrewResult {
  return BREW_OUTCOMES[`${temperature}-${steepMinutes}`];
}
