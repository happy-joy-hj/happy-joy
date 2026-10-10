export default function Footer() {
  return (
    <footer className="mt-12 flex items-center justify-center gap-3 border-t border-border bg-primary p-2 text-center text-primary-foreground/90">
      <span>Made with cozy vibes</span>
      <i className="fa-solid fa-face-laugh-squint" />
      <span>
        <i className="fa-regular fa-copyright" /> {new Date().getFullYear()}
      </span>
      <span>Happy Joy</span>
    </footer>
  );
}
