import GameSection from "@/components/game-section";
import GreetingClock from "@/components/greeting-clock";
import { games } from "@/lib/data/games";

export default function Home() {
  return (
    <div className="container flex flex-col gap-16">
      <section className="flex flex-col gap-7 text-center items-center justify-center">
        <h1 className="text-primary">Welcome to Happy Blue Joy!</h1>
        <p>Quick cozy games to help you relax and smile.</p>
        <GreetingClock />
      </section>
      <div className="flex items-center justify-center">
        <GameSection games={games} limit={4} />
      </div>
    </div>
  );
}
