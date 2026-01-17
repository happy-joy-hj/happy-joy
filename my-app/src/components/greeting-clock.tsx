"use client";

import { useEffect, useMemo, useState } from "react";

type Greeting = "Good Morning" | "Good Afternoon" | "Good Evening";

function getGreeting(hours: number): Greeting {
  if (hours < 12) return "Good Morning";
  if (hours < 18) return "Good Afternoon";
  return "Good Evening";
}

function formatTime(d: Date) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const parts = new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).formatToParts(d);

  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const second = parts.find((p) => p.type === "second")?.value ?? "";
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "";
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "";

  return `${hour}:${minute}:${second} ${dayPeriod} (${tz})`;
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
