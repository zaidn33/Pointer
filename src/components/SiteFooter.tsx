import Link from "next/link";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="bg-cream-soft border-t border-line-soft">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xs text-ink-muted ml-2">
            Built in Canada · Privacy first
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.18em] text-ink-muted">
          <Link href="/dashboard" className="hover:text-ink">
            Dashboard
          </Link>
          <Link href="/wallet" className="hover:text-ink">
            Wallet
          </Link>
          <Link href="/ask" className="hover:text-ink">
            Ask
          </Link>
          <Link href="/flights" className="hover:text-ink">
            Flights
          </Link>
          <Link href="/offers" className="hover:text-ink">
            Offers
          </Link>
        </nav>
        <p className="text-xs text-ink-muted">
          © {new Date().getFullYear()} Pointer
        </p>
      </div>
    </footer>
  );
}
