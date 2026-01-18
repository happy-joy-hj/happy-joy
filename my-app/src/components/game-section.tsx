import { Game } from "@/lib/types";
import GameCard from "./game-card";

type GameSectionProps = {
  title?: string;
  games: Game[];
  limit?: number;
};

export default function GameSection({
  title = "Let's Play Something Now",
  games,
  limit,
}: GameSectionProps) {
  const visibleGames =
    typeof limit === "number" ? games.slice(0, limit) : games;

  return (
    <section className="flex flex-col text-center gap-7">
      <h2 className="text-secondary">{title}</h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {visibleGames.map((game) => (
          <GameCard key={game.title} {...game} />
        ))}
      </div>
    </section>
  );
}
