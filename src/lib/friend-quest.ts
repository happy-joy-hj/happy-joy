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
};

export function getVibe(phase: Phase, noClicks: number): Vibe {
  if (phase === "final") {
    return {
      icon: "fa-solid fa-handshake",
      anim: "fa-bounce",
    };
  }

  if (phase === "initial") {
    return {
      icon: "fa-regular fa-face-smile",
      anim: "fa-fade",
    };
  }

  if (noClicks <= 2) {
    return {
      icon: "fa-regular fa-face-meh",
      anim: "fa-fade",
    };
  }

  if (noClicks <= 5) {
    return {
      icon: "fa-regular fa-face-flushed",
      anim: "fa-bounce",
    };
  }

  if (noClicks <= 8) {
    return {
      icon: "fa-regular fa-face-sad-tear",
      anim: "fa-shake",
    };
  }

  if (noClicks <= 12) {
    return {
      icon: "fa-solid fa-star",
      anim: "fa-beat-fade",
    };
  }

  return {
    icon: "fa-solid fa-star",
    anim: "fa-beat-fade",
  };
}

export type StageContent = {
  dialogue: string;
  yesText: string;
  noText: string;
};

export function getStageContent(phase: Phase, noClicks: number): StageContent {
  if (phase === "final") {
    return {
      dialogue: "YAY!! I knew you had bestie energy.",
      yesText: "",
      noText: "",
    };
  }

  if (noClicks === 0) {
    return {
      dialogue: "Hi! Want to be friends?",
      yesText: "Yes",
      noText: "No",
    };
  }

  if (noClicks <= 2) {
    return {
      dialogue: "Oh! Maybe that was a misclick?",
      yesText: "Yes!",
      noText: "No...",
    };
  }

  if (noClicks <= 6) {
    return {
      dialogue: "The yes button is feeling ignored",
      yesText: "Be friends",
      noText: "Still no?",
    };
  }

  if (noClicks <= 12) {
    return {
      dialogue: "We are officially in the dramatic part now",
      yesText: "Accept",
      noText: "why",
    };
  }

  if (noClicks <= 20) {
    return {
      dialogue: "I admire the commitment, honestly",
      yesText: "Okay yes",
      noText: "...",
    };
  }

  return {
    dialogue: "At this point, we are basically already friends",
    yesText: "Besties",
    noText: "",
  };
}

export type FinalContent = {
  title: string;
  subline: string;
};

const EXTREME_FINAL_CONTENTS: FinalContent[] = [
  {
    title: "Legendary Bestie Unlocked!",
    subline: "That was a suspicious number of no taps.",
  },
  {
    title: "Friendship wins again!",
    subline: "The no button has officially filed a complaint.",
  },
  {
    title: "At last... besties.",
    subline: "This tiny quest somehow became an epic saga.",
  },
  {
    title: "Maximum friendship achieved!",
    subline: "That was emotional cardio.",
  },
  {
    title: "You have been bestie-fied!",
    subline: "Side effects may include smiling and mild chaos.",
  },
  {
    title: "The prophecy is fulfilled!",
    subline: "The yes button believed in you the whole time.",
  },
  {
    title: "Bestie ending obtained!",
    subline: "The scenic route was very scenic indeed.",
  },
  {
    title: "Friendship: secured.",
    subline: "After 20+ no taps, this outcome feels extra earned.",
  },
  {
    title: "Resistance was adorable!",
    subline: "But friendship was stronger.",
  },
  {
    title: "Quest complete: Besties!",
    subline: "The no button fought bravely and shrank for nothing.",
  },
];

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function getFinalContent(noClicks: number): FinalContent {
  if (noClicks === 0) {
    return {
      title: "Instant Bestie!",
      subline: "That was the fastest friendship ever.",
    };
  }

  if (noClicks <= 3) {
    return {
      title: "Friendship Acquired!",
      subline: "Bestie energy confirmed.",
    };
  }

  if (noClicks <= 8) {
    return {
      title: "You took the scenic route, but yay!",
      subline: "A little drama, a lot of friendship.",
    };
  }

  if (noClicks <= 20) {
    return {
      title: "Friendship was inevitable!",
      subline: "The friendship meter was right all along.",
    };
  }

  return getRandomItem(EXTREME_FINAL_CONTENTS);
}
