import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/race-setup", label: "Race Setup" },
  { href: "/strategy-builder", label: "Strategy Builder" },
  { href: "/simulation", label: "Simulation" },
  { href: "/results", label: "Results" },
  { href: "/history", label: "History" },
];

export function NavBar() {
  return (
    <header className="border-b border-track-line bg-track-surface">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-semibold tracking-wide text-graphite">
          F1 STRATEGY SIM
        </Link>
        <ul className="flex gap-6 text-sm text-graphite-soft">
          {LINKS.slice(1).map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-graphite">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}