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
  cardType: string;
  annualFee: number | null;
  rewardProgram: string | null;
  baseEarnRate: number | null;
  isVerified: boolean;
  extractionNotes: string | null;
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
    annualFee: number | null;
    rewardProgram: string | null;
    baseEarnRate: number | null;
    isVerified: boolean;
    extractionNotes: string | null;
  };
};

type CatalogResponse = {
  cards: CatalogCard[];
  filters: {
    issuers: string[];
    networks: string[];
    types: string[];
  };
};

export default function WalletPage() {
  const [catalog, setCatalog] = useState<CatalogCard[]>([]);
  const [wallet, setWallet] = useState<WalletCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [issuerFilter, setIssuerFilter] = useState("");
  const [networkFilter, setNetworkFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Filter options from the API
  const [filterOptions, setFilterOptions] = useState<CatalogResponse["filters"]>({
    issuers: [],
    networks: [],
    types: [],
  });

  // "Can't find your card?" form
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestIssuer, setRequestIssuer] = useState("");
  const [requestNotes, setRequestNotes] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestBusy, setRequestBusy] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [cat, wal] = await Promise.all([
        apiFetch<CatalogResponse>("/api/cards"),
        apiFetch<{ cards: WalletCard[] }>("/api/wallet").catch((err) => {
          if (/sign|auth|unauthor/i.test(err.message)) {
            setAuthed(false);
            return { cards: [] };
          }
          throw err;
        }),
      ]);
      setCatalog(cat.cards);
      setFilterOptions(cat.filters);
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

  const available = useMemo(() => {
    let items = catalog.filter((c) => !ownedIds.has(c.id));
    const q = search.toLowerCase();
    if (q) {
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.issuer.toLowerCase().includes(q) ||
          (c.rewardProgram?.toLowerCase().includes(q) ?? false),
      );
    }
    if (issuerFilter) items = items.filter((c) => c.issuer === issuerFilter);
    if (networkFilter) items = items.filter((c) => c.network === networkFilter);
    if (typeFilter) items = items.filter((c) => c.cardType === typeFilter);
    return items;
  }, [catalog, ownedIds, search, issuerFilter, networkFilter, typeFilter]);

  const hasActiveFilters = !!(search || issuerFilter || networkFilter || typeFilter);

  function clearFilters() {
    setSearch("");
    setIssuerFilter("");
    setNetworkFilter("");
    setTypeFilter("");
  }

  function renderRewardSummary(card: {
    rewardProgram: string | null;
    baseEarnRate: number | null;
    annualFee: number | null;
    isVerified: boolean;
  }) {
    if (!card.isVerified || card.baseEarnRate == null || card.annualFee == null) {
      return "Reward data pending review";
    }

    return `${card.rewardProgram ?? "Cashback"} · base ${card.baseEarnRate}x · $${card.annualFee}/yr`;
  }

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
        {/* ── Left: Wallet ───────────────────────────────────────── */}
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
                    {renderRewardSummary(w.card)}
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

        {/* ── Right: Catalog ─────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-2xl text-ink">Card catalog</h2>
          <p className="text-ink-muted text-sm mt-1">
            {available.length} of {catalog.length} cards
          </p>

          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by card name, bank, or reward program…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="mt-3 flex flex-wrap gap-2">
            <select
              value={issuerFilter}
              onChange={(e) => setIssuerFilter(e.target.value)}
              className="rounded-md border border-ink/10 bg-white px-2 py-1.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            >
              <option value="">All banks</option>
              {filterOptions.issuers.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              className="rounded-md border border-ink/10 bg-white px-2 py-1.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            >
              <option value="">All networks</option>
              {filterOptions.networks.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-md border border-ink/10 bg-white px-2 py-1.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            >
              <option value="">All types</option>
              {filterOptions.types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-burgundy hover:text-burgundy-deep underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Card list */}
          <div className="mt-4 flex flex-col gap-3 max-h-[640px] overflow-y-auto pr-1">
            {loading && <p className="text-ink-muted text-sm">Loading…</p>}
            {!loading && available.length === 0 && !hasActiveFilters && (
              <div className="card-surface p-6 text-ink-muted text-sm">
                No catalog cards available right now.
              </div>
            )}
            {!loading && available.length === 0 && hasActiveFilters && (
              <div className="card-surface p-6 text-ink-muted text-sm">
                No cards match your filters.{" "}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-burgundy underline underline-offset-2"
                >
                  Clear filters
                </button>
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
                    {renderRewardSummary(c)}
                  </div>
                  {!c.isVerified && (
                    <div className="mt-2 text-xs text-rust">
                      Needs reward review before Pointer can trust this card fully.
                    </div>
                  )}
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

          {/* Can't find your card? */}
          <div className="mt-6 card-surface p-5">
            {!showRequestForm && !requestSubmitted && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink-muted">
                  Can&apos;t find your card?
                </p>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(true)}
                  className="text-xs text-burgundy hover:text-burgundy-deep underline underline-offset-2"
                >
                  Request it
                </button>
              </div>
            )}
            {showRequestForm && !requestSubmitted && (
              <div>
                <p className="text-sm font-medium text-ink mb-3">
                  Request a card to be added
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Card name (e.g. RBC Rewards Visa)"
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                  />
                  <input
                    type="text"
                    placeholder="Issuer / bank (e.g. RBC)"
                    value={requestIssuer}
                    onChange={(e) => setRequestIssuer(e.target.value)}
                    className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                  />
                  <textarea
                    placeholder="Optional notes for the admin reviewer"
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    rows={3}
                    className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      disabled={!requestName.trim() || requestBusy}
                      onClick={async () => {
                        setRequestBusy(true);
                        setRequestError(null);
                        try {
                          await apiFetch("/api/card-requests", {
                            method: "POST",
                            body: JSON.stringify({
                              cardName: requestName.trim(),
                              issuer: requestIssuer.trim() || undefined,
                              notes: requestNotes.trim() || undefined,
                            }),
                          });
                          setRequestSubmitted(true);
                          setShowRequestForm(false);
                        } catch (err) {
                          setRequestError(
                            err instanceof Error ? err.message : "Could not submit request."
                          );
                        } finally {
                          setRequestBusy(false);
                        }
                      }}
                      className="btn-primary !py-2 !px-4 text-xs disabled:opacity-50"
                    >
                      {requestBusy ? "Submitting…" : "Submit request"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRequestForm(false);
                        setRequestName("");
                        setRequestIssuer("");
                        setRequestNotes("");
                      }}
                      className="text-xs text-ink-muted hover:text-ink"
                    >
                      Cancel
                    </button>
                  </div>
                  {requestError && (
                    <p className="text-xs text-burgundy mt-2">{requestError}</p>
                  )}
                </div>
              </div>
            )}
            {requestSubmitted && (
              <p className="text-sm text-ink-muted">
                Thanks! We&apos;ll review your request for{" "}
                <span className="font-medium text-ink">{requestName}</span> and
                add it to the catalog soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
