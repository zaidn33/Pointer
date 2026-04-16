import Link from "next/link";
import Logo from "@/components/Logo";
import CardStack from "@/components/CardStack";

const STEPS = [
  {
    number: "01",
    title: "Select your cards",
    body:
      "Choose from 50+ Canadian credit cards across TD, RBC, Scotiabank, Amex, CIBC, BMO, and more. No account access or card numbers needed.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-burgundy">
        <rect
          x="2.5"
          y="5.5"
          width="19"
          height="13"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M2.5 9.5h19" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M6 14.5h4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Pick a purchase category",
    body:
      "Groceries, gas, restaurants, travel, entertainment, pharmacy. Choose where you're spending and Pointer does the math.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-burgundy">
        <path
          d="M12.5 3 21 11.5a1.8 1.8 0 0 1 0 2.5l-7 7a1.8 1.8 0 0 1-2.5 0L3 12.5V5a2 2 0 0 1 2-2h7.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Get your recommendation",
    body:
      "Pointer surfaces the best card for that purchase, the earn rate, and any active bonus offers, in under a second.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-burgundy">
        <path
          d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <header className="w-full">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 md:px-12 py-6">
          <Logo />
          <Link href="/signup" className="btn-primary text-[0.65rem]">
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="flex items-center">
        <div className="mx-auto w-full max-w-6xl px-8 md:px-12 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-ink">
                Every swipe,
                <br />
                <span className="italic text-gold">finally</span>
                <br />
                optimized.
              </h1>
              <p className="mt-8 max-w-md text-ink-soft text-base leading-relaxed">
                Stop guessing which card to use. Pointer recommends the best
                card for every purchase: groceries, gas, flights, and more.
              </p>
              <Link href="/signup" className="btn-primary mt-8">
                Get Started
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="flex justify-center md:justify-end">
              <CardStack className="w-full max-w-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-6xl px-8 md:px-12 pb-24">
          <p className="eyebrow !text-ink-muted">How it works</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05] text-ink">
            Three steps to the
            <br />
            <span className="italic text-ink-soft">right card.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-ink-soft text-base leading-relaxed">
            Pointer works entirely in your browser. There&apos;s nothing to
            install, no account to connect, and no personal financial data ever
            leaves your device.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-px bg-line-soft border border-line-soft rounded-2xl overflow-hidden">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="bg-paper p-8 md:p-10 flex flex-col min-h-[300px]"
              >
                <div
                  className="font-display text-6xl leading-none text-burgundy/25"
                  aria-hidden
                >
                  {step.number}
                </div>
                <div className="mt-8 grid place-items-center h-10 w-10 rounded-lg bg-burgundy/10">
                  {step.icon}
                </div>
                <h3 className="mt-6 font-display text-xl text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-ink-muted text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
