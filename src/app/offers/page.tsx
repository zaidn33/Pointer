"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { apiFetch } from "@/lib/client-api";

type Offer = {
  id: string;
  title: string;
  description: string | null;
  cardId: string | null;
  merchantId: string | null;
  category: string | null;
  bonusType: string;
  bonusValue: number;
  validFrom: string | null;
  validTo: string | null;
};

function fmtDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch<{ offers: Offer[] }>("/api/offers");
        setOffers(data.offers);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not load offers.";
        if (/sign|auth|unauthor/i.test(message)) {
          setAuthed(false);
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <PageShell
      eyebrow="Offers"
      title="Promotions tied to"
      italic="your wallet."
      description="Active merchant offers and card-linked deals for the cards you've saved. Expiring offers surface first."
      actions={
        <Link href="/wallet" className="btn-ghost">
          Manage wallet
        </Link>
      }
    >
      {!authed && (
        <div className="card-surface p-6">
          <p className="font-display text-xl text-ink">Sign in to see offers</p>
          <p className="mt-1 text-ink-muted text-sm">
            Offers are filtered to the cards in your wallet.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/signin" className="btn-primary">Sign in</Link>
            <Link href="/signup" className="btn-ghost">Create account</Link>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-burgundy bg-burgundy/5 border border-burgundy/20 rounded-md px-3 py-2 mb-6">
          {error}
        </p>
      )}

      {loading && <p className="text-ink-muted text-sm">Loading…</p>}

      {!loading && authed && offers.length === 0 && (
        <div className="card-surface p-8 text-ink-muted">
          No active offers right now. Add more cards to your{" "}
          <Link href="/wallet" className="underline text-burgundy">
            wallet
          </Link>{" "}
          to see more.
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((o) => (
          <article key={o.id} className="card-surface p-6 flex flex-col">
            <div className="eyebrow">{o.category ?? "Card-linked"}</div>
            <h2 className="mt-2 font-display text-2xl text-ink leading-tight">
              {o.title}
            </h2>
            {o.description && (
              <p className="mt-2 text-ink-soft text-sm leading-relaxed">
                {o.description}
              </p>
            )}
            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em]">
              <span className="text-burgundy">
                {o.bonusType} · {o.bonusValue}
              </span>
              {o.validTo && (
                <span className="text-ink-muted">
                  Ends {fmtDate(o.validTo)}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
