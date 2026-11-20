import { describe, expect, it } from "vitest";

import {
  celsiusToFahrenheit,
  evaluateSenchaBrew,
  fahrenheitToCelsius,
} from "./cozy-tea";

describe("evaluateSenchaBrew", () => {
  it.each([
    [70, 1, "gentle", "ideal"],
    [70, 3, "fuller", "close"],
    [70, 5, "strong", "different"],
    [85, 1, "brisk", "close"],
    [85, 3, "strong", "different"],
    [85, 5, "intense", "different"],
    [100, 1, "brisk", "different"],
    [100, 3, "intense", "different"],
    [100, 5, "intense", "different"],
  ] as const)(
    "evaluates %i°C for %i minute(s)",
    (temperature, steepMinutes, flavor, match) => {
      expect(evaluateSenchaBrew(temperature, steepMinutes)).toEqual({
        flavor,
        match,
      });
    },
  );

  it("returns consistent results for identical inputs", () => {
    const first = evaluateSenchaBrew(70, 1);
    const second = evaluateSenchaBrew(70, 1);

    expect(first).toEqual(second);
  });
});

describe("celsiusToFahrenheit", () => {
  it.each([
    [70, 158],
    [85, 185],
    [100, 212],
  ])("converts %i°C to %i°F", (celsius, fahrenheit) => {
    expect(celsiusToFahrenheit(celsius)).toBe(fahrenheit);
  });
});

describe("fahrenheitToCelsius", () => {
  it.each([
    [158, 70],
    [185, 85],
    [212, 100],
  ])("converts %i°F to %i°C", (fahrenheit, celsius) => {
    expect(fahrenheitToCelsius(fahrenheit)).toBeCloseTo(celsius);
  });
});

describe("temperature conversion round trip", () => {
  it("preserves the original temperature", () => {
    const originalCelsius = 72.5;
    const fahrenheit = celsiusToFahrenheit(originalCelsius);
    const convertedBack = fahrenheitToCelsius(fahrenheit);

    expect(convertedBack).toBeCloseTo(originalCelsius);
  });
});
