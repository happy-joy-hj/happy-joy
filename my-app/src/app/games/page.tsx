import GameSection from "@/components/game-section";
import { games } from "@/lib/data/games";

export default function Page() {
  return (
    <div className="flex items-center justify-center">
      <GameSection title="Choose Your Game" games={games} />
    </div>
  );
}
