import GreetingClock from "@/components/greeting-clock";

export default function Home() {
  return (
    <main className="container flex flex-col gap-24">
      <section className="flex flex-col gap-7 text-center items-center justify-center">
        <h1 className="text-primary">Welcome to Happy Blue Joy!</h1>
        <p>Quick cozy games to help you relax and smile.</p>
        <GreetingClock />
      </section>
      <section className="flex flex-col text-center gap-7">
        <h2 className="text-secondary">Let&apos;s Play Something Now</h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {["Friend Quest", "Coming Soon"].map((title) => (
            <div
              key={title}
              className="rounded-2xl bg-white/70 p-6 shadow-sm flex flex-col gap-4 justify-center"
            >
              <h4>{title}</h4>
              <p>A quick, cozy mini game to brighten your day.</p>
              <button className="bg-accent text-white hover:opacity-90">
                Play
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
