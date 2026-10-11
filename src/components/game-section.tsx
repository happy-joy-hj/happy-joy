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
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 text-center sm:gap-6">
      <h2 className="text-secondary-emphasis">{title}</h2>
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        {visibleGames.map((game, index) => (
          <GameCard key={game.title} {...game} preload={index === 0} />
        ))}
      </div>
    </section>
  );
}
