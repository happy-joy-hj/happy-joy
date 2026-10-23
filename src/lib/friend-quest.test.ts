import { describe, expect, it, vi } from "vitest";
import {
  clamp,
  getFinalContent,
  getNoIndexFromClicks,
  getNoScaleFromClicks,
  getStageContent,
  getVibe,
} from "./friend-quest";

describe("getNoScaleFromClicks", () => {
  it("keeps the button at full size for the first two states", () => {
    expect(getNoScaleFromClicks(0)).toBe(1);
    expect(getNoScaleFromClicks(1)).toBe(1);
  });

  it("gradually shrinks the button after the first click", () => {
    expect(getNoScaleFromClicks(2)).toBeCloseTo(0.95);
    expect(getNoScaleFromClicks(5)).toBeCloseTo(0.8);
    expect(getNoScaleFromClicks(10)).toBeCloseTo(0.55);
  });

  it("never shrinks the button below half size", () => {
    expect(getNoScaleFromClicks(11)).toBe(0.5);
    expect(getNoScaleFromClicks(20)).toBe(0.5);
    expect(getNoScaleFromClicks(100)).toBe(0.5);
  });
});

describe("getNoIndexFromClicks", () => {
  it("starts at the initial illustration", () => {
    expect(getNoIndexFromClicks(0)).toBe(0);
  });

  it("advances at triangular-number thresholds", () => {
    expect(getNoIndexFromClicks(1)).toBe(1);
    expect(getNoIndexFromClicks(3)).toBe(2);
    expect(getNoIndexFromClicks(6)).toBe(3);
    expect(getNoIndexFromClicks(10)).toBe(4);
    expect(getNoIndexFromClicks(15)).toBe(5);
    expect(getNoIndexFromClicks(21)).toBe(6);
  });

  it("does not advance before the next threshold", () => {
    expect(getNoIndexFromClicks(2)).toBe(1);
    expect(getNoIndexFromClicks(5)).toBe(2);
    expect(getNoIndexFromClicks(9)).toBe(3);
    expect(getNoIndexFromClicks(20)).toBe(5);
  });

  it("never exceeds the final illustration index", () => {
    expect(getNoIndexFromClicks(22)).toBe(6);
    expect(getNoIndexFromClicks(100)).toBe(6);
  });
});

describe("getStageContent", () => {
  it.each([
    [0, "Hi! Want to be friends?"],
    [1, "Oh! Maybe that was a misclick?"],
    [2, "Oh! Maybe that was a misclick?"],
    [3, "The yes button is feeling ignored"],
    [6, "The yes button is feeling ignored"],
    [7, "We are officially in the dramatic part now"],
    [12, "We are officially in the dramatic part now"],
    [13, "I admire the commitment, honestly"],
    [20, "I admire the commitment, honestly"],
    [21, "At this point, we are basically already friends"],
  ])("returns the correct dialogue after %i No clicks", (clicks, dialogue) => {
    expect(getStageContent("no", clicks).dialogue).toBe(dialogue);
  });

  it("prioritizes the final phase regardless of click count", () => {
    expect(getStageContent("final", 0).dialogue).toBe(
      "YAY!! I knew you had bestie energy.",
    );
    expect(getStageContent("final", 25).dialogue).toBe(
      "YAY!! I knew you had bestie energy.",
    );
  });

  it("prioritizes the declined phase regardless of click count", () => {
    expect(getStageContent("declined", 0).dialogue).toBe(
      "That's okay! Maybe another time?",
    );
    expect(getStageContent("declined", 25).dialogue).toBe(
      "That's okay! Maybe another time?",
    );
  });
});

describe("getFinalContent", () => {
  it.each([
    [0, "Instant Bestie!"],
    [1, "Friendship Acquired!"],
    [3, "Friendship Acquired!"],
    [4, "You took the scenic route, but yay!"],
    [8, "You took the scenic route, but yay!"],
    [9, "Friendship was inevitable!"],
    [20, "Friendship was inevitable!"],
  ])("returns the correct ending after %i No clicks", (clicks, title) => {
    expect(getFinalContent(clicks).title).toBe(title);
  });

  it("returns a valid ending after more than 20 No clicks", () => {
    const ending = getFinalContent(21);

    expect(ending.title).toBeTruthy();
    expect(ending.subline).toBeTruthy();
    expect(typeof ending.title).toBe("string");
    expect(typeof ending.subline).toBe("string");
  });

  it("selects extreme endings based on the random index", () => {
    const randomSpy = vi.spyOn(Math, "random");

    try {
      randomSpy.mockReturnValue(0);
      expect(getFinalContent(21).title).toBe("Legendary Bestie Unlocked!");

      randomSpy.mockReturnValue(0.99);
      expect(getFinalContent(21).title).toBe("Quest complete: Besties!");
    } finally {
      randomSpy.mockRestore();
    }
  });
});

describe("clamp", () => {
  it("preserves values within the allowed range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("enforces the minimum and maximum boundaries", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("getVibe", () => {
  it("returns the initial friendly appearance", () => {
    expect(getVibe("initial", 0)).toEqual({
      icon: "fa-regular fa-face-smile",
      anim: "fa-fade",
    });
  });

  it("changes the appearance as No clicks increase", () => {
    expect(getVibe("no", 2).icon).toBe("fa-regular fa-face-meh");
    expect(getVibe("no", 3).icon).toBe("fa-regular fa-face-flushed");
    expect(getVibe("no", 6).icon).toBe("fa-regular fa-face-sad-tear");
    expect(getVibe("no", 9).icon).toBe("fa-solid fa-star");
  });

  it("prioritizes ending phases regardless of click count", () => {
    expect(getVibe("final", 25)).toEqual({
      icon: "fa-solid fa-handshake",
      anim: "fa-bounce",
    });

    expect(getVibe("declined", 25)).toEqual({
      icon: "fa-regular fa-face-smile",
      anim: "",
    });
  });
});
