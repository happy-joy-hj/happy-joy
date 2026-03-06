export type Phase = "initial" | "no" | "final";

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function getNoIndexFromClicks(clicks: number) {
  let k = 0;
  while (((k + 1) * (k + 2)) / 2 <= clicks) k++;
  return clamp(k, 0, 6);
}

export function getNoScaleFromClicks(clicks: number) {
  if (clicks <= 1) return 1;
  return Math.max(0.02, 1 - (clicks - 1) * 0.05);
}

export type Vibe = {
  icon: string;
  anim: string;
  text: string;
};

export function getVibe(phase: Phase, noClicks: number): Vibe {
  if (phase === "final") {
    return {
      icon: "fa-solid fa-handshake",
      anim: "fa-bounce",
      text: "Yay!! Cozy friendship unlocked",
    };
  }

  if (phase === "initial") {
    return {
      icon: "fa-regular fa-face-smile",
      anim: "fa-fade",
      text: "Be my friend? I'll be super nice",
    };
  }

  if (noClicks <= 2) {
    return {
      icon: "fa-regular fa-face-meh",
      anim: "fa-fade",
      text: "Oh… okay",
    };
  }
  if (noClicks <= 5) {
    return {
      icon: "fa-regular fa-face-flushed",
      anim: "fa-bounce",
      text: "Wait—why not?",
    };
  }
  if (noClicks <= 9) {
    return {
      icon: "fa-regular fa-face-sad-tear",
      anim: "fa-shake",
      text: "No is getting shy and slippery…",
    };
  }
  return {
    icon: "fa-solid fa-star",
    anim: "fa-beat-fade",
    text: "The Yes button is becoming irresistible",
  };
}
