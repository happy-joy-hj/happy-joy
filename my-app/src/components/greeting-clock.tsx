"use client";

import { useEffect, useMemo, useState } from "react";

type Greeting = "Good Morning" | "Good Afternoon" | "Good Evening";

function getGreeting(hours: number): Greeting {
  if (hours < 12) return "Good Morning";
  if (hours < 18) return "Good Afternoon";
  return "Good Evening";
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatTime(d: Date) {
  const hours24 = d.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = pad2(d.getMinutes());
  const seconds = pad2(d.getSeconds());
  const ampm = hours24 >= 12 ? "PM" : "AM";
  return `${hours12}:${minutes}:${seconds} ${ampm}`;
}

export default function GreetingClock() {
  const [timeNow, setTimeNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setTimeNow(new Date());

    const t0 = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);

    return () => {
      window.clearTimeout(t0);
      window.clearInterval(id);
    };
  }, []);

  const view = useMemo(() => {
    if (!timeNow) return null;

    const greeting = getGreeting(timeNow.getHours());

    const month = timeNow.toLocaleDateString(undefined, { month: "long" });
    const weekday = timeNow.toLocaleDateString(undefined, { weekday: "long" });
    const day = timeNow.getDate();
    const year = timeNow.getFullYear();
    const customDate = `${month} ${day}, ${year} (${weekday})`;

    const timePart = formatTime(timeNow);

    return { greeting, customDate, timePart };
  }, [timeNow]);

  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-white/60 px-4 py-2 shadow-md">
      <span className="text-secondary font-semibold">
        {view?.greeting ?? "Hello"}
      </span>
      <span className="text-foreground/40">•</span>
      <span>{view?.customDate ?? "—"}</span>
      <span>·</span>
      <span>{view?.timePart ?? "—"}</span>
    </div>
  );
}
