import GameSection from "@/components/game-section";
import GreetingClock from "@/components/greeting-clock";
import { games } from "@/lib/data/games";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col items-center justify-center gap-5 text-center">
        <h1 className="text-4xl text-primary sm:text-5xl">
          Welcome to Happy Joy!
        </h1>
        <p className="max-w-xl text-lg text-foreground/80">
          Quick cozy games to help you relax and smile.
        </p>
        <GreetingClock />
      </section>
      <div className="flex items-center justify-center">
        <GameSection games={games} limit={4} />
      </div>
    </div>
  );
}
