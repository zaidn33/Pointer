"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { apiFetch } from "@/lib/client-api";

type Me = { user: { id: string; email: string } };
type WalletCard = {
  id: string;
  card: {
    id: string;
    issuer: string;
    network: string;
    name: string;
    annualFee: number | null;
    rewardProgram: string | null;
    baseEarnRate: number | null;
    isVerified: boolean;
    extractionNotes: string | null;
  };
};
type Offer = {
  id: string;
  title: string;
  bonusType: string;
  bonusValue: number;
  validTo: string | null;
};

const QUICK_LINKS = [
  {
    href: "/wallet",
    eyebrow: "Wallet",
    title: "Manage your cards",
    blurb: "Add or remove the cards you carry.",
  },
  {
    href: "/ask",
    eyebrow: "Ask Pointer",
    title: "Which card, right now?",
    blurb: "Get a recommendation in your own words.",
  },
  {
    href: "/flights",
    eyebrow: "Flights",
    title: "Best card for this trip",
    blurb: "Match itineraries to wallet benefits.",
  },
  {
    href: "/offers",
    eyebrow: "Offers",
    title: "Promotions on your cards",
    blurb: "Active card-linked deals and credits.",
  },
];

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [authed, setAuthed] = useState(true);
  const [wallet, setWallet] = useState<WalletCard[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await apiFetch<Me>("/api/auth/me");
        setEmail(me.user.email);
        const [wal, off] = await Promise.all([
          apiFetch<{ cards: WalletCard[] }>("/api/wallet"),
          apiFetch<{ offers: Offer[] }>("/api/offers"),
        ]);
        setWallet(wal.cards);
        setOffers(off.offers);
      } catch (err) {
        if (err instanceof Error && /sign|auth|unauthor/i.test(err.message)) {
          setAuthed(false);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <PageShell
      eyebrow={email ? `Signed in · ${email}` : "Dashboard"}
      title="Your wallet,"
      italic="at a glance."
      description="A quick view of your saved cards, today's offers, and shortcuts into the rest of Pointer."
      actions={
        <Link href="/ask" className="btn-primary">
          Ask Pointer
          <span aria-hidden>→</span>
        </Link>
      }
    >
      {!authed && (
        <div className="card-surface p-8 mb-10">
          <p className="font-display text-2xl text-ink">
            Sign in to see your dashboard
          </p>
          <p className="mt-1 text-ink-muted">
            Pointer ties your wallet, offers, and recommendations to your account.
          </p>
          <div className="mt-5 flex gap-3">
            <Link href="/signin" className="btn-primary">Sign in</Link>
            <Link href="/signup" className="btn-ghost">Create account</Link>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="card-surface p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Wallet</p>
            <Link
              href="/wallet"
              className="text-xs uppercase tracking-[0.18em] text-burgundy hover:text-burgundy-deep"
            >
              Manage →
            </Link>
          </div>
          <h2 className="mt-2 font-display text-3xl text-ink">
            {loading ? "..." : `${wallet.length} card${wallet.length === 1 ? "" : "s"}`}
          </h2>
          {wallet.length === 0 && !loading && authed ? (
            <p className="mt-3 text-ink-muted">
              Empty wallet. Add a card to start getting recommendations.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line-soft">
              {wallet.slice(0, 5).map((w) => (
                <li
                  key={w.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-display text-base text-ink">
                      {w.card.name}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {w.card.issuer} · {w.card.rewardProgram ?? "Program pending review"}
                    </div>
                  </div>
                  <span className="font-mono text-xs text-burgundy">
                    {w.card.isVerified && w.card.baseEarnRate != null
                      ? `${w.card.baseEarnRate}x base`
                      : "Review pending"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card-surface p-6">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Offers</p>
            <Link
              href="/offers"
              className="text-xs uppercase tracking-[0.18em] text-burgundy hover:text-burgundy-deep"
            >
              All →
            </Link>
          </div>
          <h2 className="mt-2 font-display text-3xl text-ink">
            {loading ? "..." : offers.length}
          </h2>
          {offers.length === 0 && !loading ? (
            <p className="mt-3 text-ink-muted text-sm">
              No active offers tied to your wallet right now.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {offers.slice(0, 4).map((o) => (
                <li key={o.id} className="border-b border-line-soft pb-3 last:border-0">
                  <div className="font-display text-sm text-ink">
                    {o.title}
                  </div>
                  <div className="text-xs text-burgundy uppercase tracking-[0.14em]">
                    {o.bonusType} · {o.bonusValue}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_LINKS.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="card-surface p-6 group hover:bg-paper transition flex flex-col"
          >
            <p className="eyebrow">{q.eyebrow}</p>
            <h3 className="mt-2 font-display text-xl text-ink leading-tight">
              {q.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{q.blurb}</p>
            <span className="mt-auto pt-4 text-xs uppercase tracking-[0.18em] text-burgundy group-hover:translate-x-1 transition">
              Open →
            </span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
