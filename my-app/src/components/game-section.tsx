import GameCard from "./game-card";

const games = [
  {
    title: "Friend Quest",
    description:
      "Soft vibes, simple choices, instant joy. Befriend a cute character!",
    href: "/hello-friend",
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

export default function GameSection() {
  return (
    <section className="flex flex-col text-center gap-7">
      <h2 className="text-secondary">Let&apos;s Play Something Now</h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard
            key={game.title}
            title={game.title}
            description={game.description}
            href={game.href}
            img={game.img}
            label={game.label}
            disabled={game.disabled}
          />
        ))}
      </div>
    </section>
  );
}
