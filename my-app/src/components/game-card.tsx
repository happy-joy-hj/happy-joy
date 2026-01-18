import Link from "next/link";
import Image from "next/image";
import { Game } from "@/lib/types";

type GameCardProps = Game;

export default function GameCard({
  title,
  description,
  img,
  href,
  label = "Play",
  disabled = false,
}: GameCardProps) {
  return (
    <div className="rounded-2xl bg-white/70 p-6 shadow-sm flex flex-col gap-6 justify-center items-center text-center">
      <Link
        href={disabled ? "" : href}
        className={disabled ? "pointer-events-none" : ""}
      >
        <Image
          src={img || "/images/default.png"}
          alt={title + " image"}
          width={250}
          height={0}
          className="rounded-xl"
        />
      </Link>
      <div className="flex flex-col gap-2 max-w-75">
        <h4>{title}</h4>
        <p className="line-clamp-2">{description}</p>
      </div>
      {disabled ? (
        <button
          type="button"
          disabled
          className="bg-accent text-white opacity-60 cursor-not-allowed font-semibold w-full max-w-62.5"
        >
          {label}
        </button>
      ) : (
        <Link
          href={href}
          className="bg-accent text-white hover:opacity-90 font-semibold w-full max-w-62.5 py-2 rounded-lg inline-flex justify-center"
        >
          {label}
        </Link>
      )}
    </div>
  );
}
