import Link from "next/link";
import Logo from "./Logo";

export default function SiteHeader({
  variant = "marketing",
}: {
  variant?: "marketing" | "app";
}) {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Logo />
        <nav className="hidden md:flex items-center gap-9 text-sm text-ink-soft">
          {variant === "marketing" ? (
            <>
              <Link href="#how" className="hover:text-ink transition">
                How it works
              </Link>
              <Link href="#categories" className="hover:text-ink transition">
                Categories
              </Link>
              <Link href="#privacy" className="hover:text-ink transition">
                Privacy
              </Link>
              <Link href="/signin" className="hover:text-ink transition">
                Sign in
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="hover:text-ink transition">
                Dashboard
              </Link>
              <Link href="/wallet" className="hover:text-ink transition">
                Wallet
              </Link>
              <Link href="/ask" className="hover:text-ink transition">
                Ask Pointer
              </Link>
              <Link href="/flights" className="hover:text-ink transition">
                Flights
              </Link>
              <Link href="/offers" className="hover:text-ink transition">
                Offers
              </Link>
            </>
          )}
        </nav>
        <Link
          href={variant === "marketing" ? "/signup" : "/wallet"}
          className="btn-primary text-[0.65rem]"
        >
          {variant === "marketing" ? "Get Started" : "My Wallet"}
        </Link>
      </div>
      <div className="hairline" />
    </header>
  );
}
