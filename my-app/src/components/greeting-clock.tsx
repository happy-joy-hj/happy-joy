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

function formatDateTime(d: Date) {
  const hours24 = d.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = pad2(d.getMinutes());
  const seconds = pad2(d.getSeconds());
  const ampm = hours24 >= 12 ? "PM" : "AM";

  return {
    timePart: `${hours12}:${minutes}:${seconds} ${ampm}`,
  };
}

export default function GreetingClock() {
  const [timeNow, setTimeNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeNow(new Date());
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  const view = useMemo(() => {
    const greeting = getGreeting(timeNow.getHours());

    const month = timeNow.toLocaleDateString(undefined, { month: "long" });
    const weekday = timeNow.toLocaleDateString(undefined, { weekday: "long" });
    const day = timeNow.getDate();
    const year = timeNow.getFullYear();
    const customDate = `${month} ${day}, ${year} (${weekday})`;

    const { timePart } = formatDateTime(timeNow);

    return { greeting, customDate, timePart };
  }, [timeNow]);

  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-white/60 px-4 py-2 shadow-md">
      <span className="text-secondary font-semibold">{view.greeting}</span>
      <span className="text-foreground/40">•</span>
      <span>{view.customDate}</span>
      <span>·</span>
      <span>{view.timePart}</span>
    </div>
  );
}
