import GameSection from "@/components/game-section";
import GreetingClock from "@/components/greeting-clock";
import { games } from "@/lib/data/games";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="flex flex-col items-center justify-center gap-4 text-center">
        <span className="rounded-full border border-secondary/30 bg-secondary/15 px-4 py-1.5 text-sm font-semibold text-secondary-emphasis">
          ✨ Welcome to Happy Joy
        </span>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          A little joy, one game at a time.
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-foreground/75">
          Take a break, get comfy, and enjoy a collection of playful little
          games made to brighten your day.
        </p>

        <GreetingClock />
      </section>
      <div className="flex items-center justify-center">
        <GameSection games={games} limit={4} />
      </div>
    </div>
  );
}
