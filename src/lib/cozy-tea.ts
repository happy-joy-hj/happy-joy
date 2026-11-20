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
    title: "Mochi is delighted!",
    description:
      "Mochi smiles happily. This cup is gentle and balanced — just what she wanted!",
  },
  close: {
    title: "Mochi enjoys the variation!",
    description:
      "This tastes a little different from Mochi's usual gentle cup, but she appreciates the variation.",
  },
  different: {
    title: "Mochi looks surprised!",
    description:
      "This brew is quite different from the smooth, gentle sencha Mochi requested. She would love to try another preparation!",
  },
};

const TEMPERATURE_EXPLANATIONS: Record<SenchaTemperature, string> = {
  70: "At 70°C, cooler water tends to produce a mellow cup with less astringency.",
  85: "At 85°C, hotter water can extract more astringent compounds, giving the tea a sharper edge.",
  100: "At 100°C, boiling water can bring out bitterness and astringency quickly.",
};

const STEEPING_EXPLANATIONS: Record<SenchaSteepMinutes, string> = {
  1: "A one-minute steep keeps the extraction relatively brief.",
  3: "Three minutes allows more flavor and astringency to develop.",
  5: "Five minutes can make the resulting brew much more intense.",
};

export function explainSenchaBrew(
  temperature: SenchaTemperature,
  steepMinutes: SenchaSteepMinutes,
): string {
  return [
    TEMPERATURE_EXPLANATIONS[temperature],
    STEEPING_EXPLANATIONS[steepMinutes],
  ].join(" ");
}

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
