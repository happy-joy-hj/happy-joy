"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Games", href: "/hello-friend" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 px-5 py-3 flex flex-row items-center bg-primary-foreground/80 border-b border-border gap-8 backdrop-blur mb-20">
      <div className="container flex items-center justify-between max-w-">
        <Link href="/">
          <Image
            src="/images/happy-logo.png"
            alt="logo"
            width={100}
            height={0}
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
                  "font-semibold px-3 py-2",
                  isActive
                    ? "bg-secondary text-secondary-foreground rounded-xl hover:opacity-90"
                    : "text-secondary hover:bg-white/40 rounded-xl",
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
