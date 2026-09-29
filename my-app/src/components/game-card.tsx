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
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-white/70 p-6 text-center shadow-sm">
      <Link
        href={disabled ? "" : href}
        className={disabled ? "pointer-events-none" : ""}
      >
        <Image
          src={img || "/images/default.png"}
          alt={`${title} image`}
          width={1536}
          height={1024}
          className="h-auto w-62.5 rounded-xl"
        />
      </Link>
      <div className="flex max-w-75 flex-col gap-2">
        <h4>{title}</h4>
        <p className="line-clamp-2">{description}</p>
      </div>
      {disabled ? (
        <button
          type="button"
          disabled
          className="w-full max-w-62.5 cursor-not-allowed bg-accent font-semibold text-white opacity-60"
        >
          {label}
        </button>
      ) : (
        <Link
          href={href}
          className="inline-flex w-full max-w-62.5 justify-center rounded-lg bg-accent py-2 font-semibold text-white hover:opacity-90"
        >
          {label}
        </Link>
      )}
    </div>
  );
}
