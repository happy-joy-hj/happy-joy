export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-surface/75 py-5 backdrop-blur-sm">
      <div className="container flex flex-col items-center justify-between gap-2 text-center text-sm text-foreground/70 sm:flex-row">
        <p className="text-sm">
          Made with cozy vibes <span aria-hidden="true">♡</span>
        </p>

        <p className="text-sm">© {new Date().getFullYear()} Happy Joy</p>
      </div>
    </footer>
  );
}
