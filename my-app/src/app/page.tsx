export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-5 text-center items-center justify-center px-20 mt-20">
        <h1 className="text-primary">Welcome to Happy Blue Joy!</h1>
        <p>
          Step into our friendly world filled with heartwarming games and
          delightful adventures. Make yourself at Home!
        </p>
        <div className="flex flex-row gap-5">
          <button className="text-secondary-foreground bg-secondary px-3 py-2">
            Get Started
          </button>
          <button className="bg-accent text-secondary-foreground">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
