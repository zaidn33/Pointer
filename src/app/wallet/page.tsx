"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { apiFetch } from "@/lib/client-api";

type CatalogCard = {
  id: string;
  issuer: string;
  network: string;
  name: string;
  annualFee: number;
  rewardProgram: string | null;
  baseEarnRate: number;
  categoryRules: { category: string; multiplier: number }[];
};

type WalletCard = {
  id: string;
  createdAt: string;
  card: {
    id: string;
    issuer: string;
    network: string;
    name: string;
    annualFee: number;
    rewardProgram: string | null;
    baseEarnRate: number;
  };
};

export default function WalletPage() {
  const [catalog, setCatalog] = useState<CatalogCard[]>([]);
  const [wallet, setWallet] = useState<WalletCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [cat, wal] = await Promise.all([
        apiFetch<{ cards: CatalogCard[] }>("/api/cards"),
        apiFetch<{ cards: WalletCard[] }>("/api/wallet").catch((err) => {
          if (/sign|auth|unauthor/i.test(err.message)) {
            setAuthed(false);
            return { cards: [] };
          }
          throw err;
        }),
      ]);
      setCatalog(cat.cards);
      setWallet(wal.cards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wallet.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addCard(cardId: string) {
    setBusyId(cardId);
    setError(null);
    try {
      await apiFetch("/api/wallet/cards", {
        method: "POST",
        body: JSON.stringify({ cardId }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add card.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeCard(walletCardId: string) {
    setBusyId(walletCardId);
    setError(null);
    try {
      await apiFetch(`/api/wallet/cards/${walletCardId}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove card.");
    } finally {
      setBusyId(null);
    }
  }

  const ownedIds = useMemo(
    () => new Set(wallet.map((w) => w.card.id)),
    [wallet],
  );
  const available = useMemo(
    () => catalog.filter((c) => !ownedIds.has(c.id)),
    [catalog, ownedIds],
  );

  return (
    <PageShell
      eyebrow="Your wallet"
      title="The cards you"
      italic="actually carry."
      description="Add the cards you own. Pointer uses this list, and nothing else, to pick the right card for every purchase."
      actions={
        <Link href="/ask" className="btn-ghost">
          Ask Pointer
        </Link>
      }
    >
      {!authed && (
        <div className="card-surface p-6 mb-8">
          <p className="font-display text-xl text-ink">Sign in to use your wallet</p>
          <p className="mt-1 text-ink-muted text-sm">
            Wallets are tied to your Pointer account.
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

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-2xl text-ink">In your wallet</h2>
          <p className="text-ink-muted text-sm mt-1">
            {wallet.length} card{wallet.length === 1 ? "" : "s"} saved
          </p>
          <div className="mt-5 flex flex-col gap-3">
            {loading && <p className="text-ink-muted text-sm">Loading…</p>}
            {!loading && wallet.length === 0 && authed && (
              <div className="card-surface p-6 text-ink-muted text-sm">
                Empty wallet. Add cards from the catalog on the right.
              </div>
            )}
            {wallet.map((w) => (
              <article
                key={w.id}
                className="card-surface p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-ink-muted">
                    {w.card.issuer} · {w.card.network}
                  </div>
                  <div className="font-display text-xl text-ink mt-1">
                    {w.card.name}
                  </div>
                  <div className="text-sm text-ink-soft mt-1">
                    {w.card.rewardProgram ?? "Cashback"} · base{" "}
                    {w.card.baseEarnRate}x · ${w.card.annualFee}/yr
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCard(w.id)}
                  disabled={busyId === w.id}
                  className="text-xs uppercase tracking-[0.18em] text-burgundy hover:text-burgundy-deep disabled:opacity-50"
                >
                  {busyId === w.id ? "…" : "Remove"}
                </button>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl text-ink">Card catalog</h2>
          <p className="text-ink-muted text-sm mt-1">
            {available.length} available
          </p>
          <div className="mt-5 flex flex-col gap-3 max-h-[640px] overflow-y-auto pr-1">
            {!loading && available.length === 0 && (
              <div className="card-surface p-6 text-ink-muted text-sm">
                No catalog cards available right now.
              </div>
            )}
            {available.map((c) => (
              <article
                key={c.id}
                className="card-surface p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-ink-muted">
                    {c.issuer} · {c.network}
                  </div>
                  <div className="font-display text-lg text-ink mt-1">
                    {c.name}
                  </div>
                  <div className="text-sm text-ink-soft mt-1">
                    {c.rewardProgram ?? "Cashback"} · base {c.baseEarnRate}x ·
                    ${c.annualFee}/yr
                  </div>
                  {c.categoryRules.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.categoryRules.slice(0, 4).map((r) => (
                        <span
                          key={r.category}
                          className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream-soft text-ink-soft"
                        >
                          {r.multiplier}x {r.category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addCard(c.id)}
                  disabled={busyId === c.id || !authed}
                  className="btn-primary !py-2 !px-4 text-[0.65rem] disabled:opacity-50"
                >
                  {busyId === c.id ? "…" : "Add"}
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
