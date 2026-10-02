"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Games", href: "/games" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 mb-20 flex flex-row items-center gap-8 border-b border-border bg-primary-foreground/80 py-3 backdrop-blur">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/hj-logo.png"
            alt="Happy Joy"
            width={825}
            height={679}
            className="h-auto w-15"
            priority
          />
        </Link>

        <nav className="flex items-center gap-5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "px-3 py-2 font-semibold",
                  isActive
                    ? "rounded-xl bg-secondary text-secondary-foreground hover:opacity-90"
                    : "rounded-xl text-secondary hover:bg-white/40",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
