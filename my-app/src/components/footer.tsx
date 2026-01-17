export default function Footer() {
  return (
    <footer className="border-border border-t text-center flex justify-center items-center gap-3 mt-12 bg-primary text-white/90 p-2">
      <span>Made with cozy vibes</span>
      <i className="fa-solid fa-face-laugh-squint" />
      <span>©{new Date().getFullYear()}</span>
      <span>Happy Blue Joy</span>
    </footer>
  );
}
