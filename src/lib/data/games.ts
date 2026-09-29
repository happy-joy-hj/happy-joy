import { Game } from "../types";

export const games: Game[] = [
  {
    title: "Friend Quest",
    description:
      "Soft vibes, simple choices, instant joy. Befriend a cute character!",
    href: "/games/friend-quest",
    img: "/images/friend-quest/cover.png",
  },
  {
    title: "Coming Soon",
    description:
      "Next game is in progress… something cozy is loading. Stay tuned!",
    href: "",
    img: "/images/coming-soon.png",
    label: "Coming Soon",
    disabled: true,
  },
];
