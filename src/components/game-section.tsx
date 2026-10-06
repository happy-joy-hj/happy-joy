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
    <section className="flex flex-col gap-6 text-center">
      <h2 className="text-secondary">{title}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {visibleGames.map((game, index) => (
          <GameCard key={game.title} {...game} preload={index === 0} />
        ))}
      </div>
    </section>
  );
}
