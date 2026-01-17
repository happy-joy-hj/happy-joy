"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Hello Friend", href: "/hello-friend" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="px-5 py-3 flex flex-row items-center bg-primary-foreground border-b border-border gap-8">
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
                  ? "bg-secondary text-secondary-foreground/90 rounded-xl"
                  : "text-secondary hover:bg-secondary/50 hover:text-secondary-foreground/90 rounded-xl",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
