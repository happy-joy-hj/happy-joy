"use client";

import { useEffect, useState } from "react";

type Greeting = "Good Morning" | "Good Afternoon" | "Good Evening";

function getGreeting(hours: number): Greeting {
  if (hours < 12) return "Good Morning";
  if (hours < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function GreetingClock() {
  const [timeNow, setTimeNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setTimeNow(new Date());

    updateTime();

    const interval = window.setInterval(updateTime, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  const greeting = timeNow ? getGreeting(timeNow.getHours()) : "Hello";

  const time = timeNow?.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const date = timeNow?.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="inline-flex max-w-full items-center justify-center gap-2 rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-center shadow-sm">
      <span className="font-semibold text-secondary-emphasis">{greeting}</span>

      <span aria-hidden="true" className="text-foreground/40">
        ·
      </span>

      <span className="hidden sm:inline">{date ?? "—"}</span>

      <span aria-hidden="true" className="hidden text-foreground/40 sm:inline">
        ·
      </span>

      <span>{time ?? "—"}</span>
    </div>
  );
}
