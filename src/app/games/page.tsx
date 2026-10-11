import GameSection from "@/components/game-section";
import { games } from "@/lib/data/games";

export default function Page() {
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl text-primary sm:text-5xl">Explore Our Games</h1>

        <p className="max-w-xl text-lg text-foreground/75">
          Pick a little adventure, take a cozy break, and find something that
          makes you smile.
        </p>
      </section>

      <GameSection title="Ready to Play?" games={games} />
    </div>
  );
}
