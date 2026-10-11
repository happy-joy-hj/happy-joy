import Link from "next/link";
import Image from "next/image";
import { Game } from "@/lib/types";

type GameCardProps = Game & {
  preload?: boolean;
};

export default function GameCard({
  title,
  description,
  img,
  href,
  label = "Play",
  disabled = false,
  preload = false,
}: GameCardProps) {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center gap-6 rounded-3xl border border-white/70 bg-gradient-to-br from-surface/95 to-surface-muted/85 p-6 text-center shadow-[0_8px_28px_rgba(62,69,66,0.07)] transition-all duration-300 ease-out ${
        disabled
          ? ""
          : "hover:-translate-y-1.5 hover:shadow-[0_14px_36px_rgba(62,69,66,0.12)]"
      }`}
    >
      <Link
        href={disabled ? "" : href}
        className={`w-full max-w-62.5 overflow-hidden rounded-xl ${
          disabled ? "pointer-events-none" : "group"
        }`}
      >
        <Image
          src={img || "/images/default.png"}
          alt={`${title} image`}
          width={1536}
          height={1024}
          preload={preload}
          sizes="250px"
          className={`h-auto w-full rounded-xl transition duration-300 ${
            disabled ? "" : "group-hover:scale-[1.03]"
          }`}
        />
      </Link>
      <div className="flex max-w-75 flex-col gap-1.5">
        <h4 className="text-foreground">{title}</h4>
        <p className="line-clamp-2 text-foreground/70">{description}</p>
      </div>
      {disabled ? (
        <button
          type="button"
          disabled
          className="w-full max-w-62.5 cursor-not-allowed bg-accent/60 font-semibold text-accent-foreground/60 shadow-none"
        >
          {label}
        </button>
      ) : (
        <Link
          href={href}
          className="inline-flex w-full max-w-62.5 justify-center rounded-lg bg-accent py-2 font-semibold text-accent-foreground transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          {label}
        </Link>
      )}
    </div>
  );
}
