"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { apiFetch } from "@/lib/client-api";

type RankedCard = {
  walletCardId: string;
  card: {
    id: string;
    issuer: string;
    network: string;
    name: string;
    annualFee: number;
    rewardProgram: string | null;
    baseEarnRate: number;
  };
  score: number;
  matchedRule: "merchant_benefit" | "category_rule" | "base_rate";
};

type Recommendation = {
  detectedMerchant: { id: string; name: string; primaryCategory: string } | null;
  detectedCategory: string | null;
  bestCard: RankedCard;
  rankedCards: RankedCard[];
  explanation: string;
  matchedOffers: {
    id: string;
    title: string;
    description: string | null;
    bonusType: string;
    bonusValue: number;
  }[];
};

const SUGGESTIONS = [
  "Best card for groceries at Loblaws",
  "Dining at Starbucks",
  "Domestic Air Canada flight",
  "Gas at Petro-Canada",
];

function ruleLabel(rule: RankedCard["matchedRule"]) {
  switch (rule) {
    case "merchant_benefit":
      return "Merchant benefit";
    case "category_rule":
      return "Category multiplier";
    case "base_rate":
      return "Base earn rate";
  }
}

export default function AskPage() {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Recommendation | null>(null);

  async function ask(text: string) {
    if (!text.trim()) return;
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiFetch<Recommendation>(
        "/api/recommendations/query",
        {
          method: "POST",
          body: JSON.stringify({ query: text.trim() }),
        },
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not get a recommendation.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PageShell
      eyebrow="Ask Pointer"
      title="Which card,"
      italic="right now?"
      description="Ask in your own words. Pointer parses the merchant, category, or travel intent and ranks your saved cards."
      actions={
        <Link href="/wallet" className="btn-ghost">
          Manage wallet
        </Link>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(query);
        }}
        className="card-surface p-6 md:p-8"
      >
        <label className="block">
          <span className="eyebrow">Your question</span>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            placeholder="e.g. Best card for groceries at Loblaws"
            className="mt-3 w-full rounded-md border border-line bg-cream/40 px-4 py-3 outline-none focus:border-burgundy focus:bg-paper text-ink resize-none"
          />
        </label>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQuery(s);
                  ask(s);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-line text-ink-soft hover:bg-cream-soft"
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={pending}
            className="btn-primary disabled:opacity-60"
          >
            {pending ? "Thinking…" : "Ask Pointer"}
            <span aria-hidden>→</span>
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-6 text-sm text-burgundy bg-burgundy/5 border border-burgundy/20 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <article className="lg:col-span-2 card-surface p-8 bg-burgundy text-paper border-burgundy">
            <p className="eyebrow !text-paper/60">Best card</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">
              {result.bestCard.card.name}
            </h2>
            <p className="mt-2 text-paper/70 text-sm">
              {result.bestCard.card.issuer} · {result.bestCard.card.network}
            </p>
            <p className="mt-6 text-paper/90 leading-relaxed text-lg">
              {result.explanation}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em]">
              <span className="px-3 py-1 rounded-full bg-paper/10 border border-paper/20">
                {ruleLabel(result.bestCard.matchedRule)} · {result.bestCard.score}x
              </span>
              {result.detectedMerchant && (
                <span className="px-3 py-1 rounded-full bg-paper/10 border border-paper/20">
                  {result.detectedMerchant.name}
                </span>
              )}
              {result.detectedCategory && (
                <span className="px-3 py-1 rounded-full bg-paper/10 border border-paper/20">
                  {result.detectedCategory}
                </span>
              )}
            </div>
          </article>

          <aside className="card-surface p-6">
            <p className="eyebrow">Ranking</p>
            <ol className="mt-3 space-y-3">
              {result.rankedCards.map((c, i) => (
                <li
                  key={c.walletCardId}
                  className="flex items-start justify-between gap-3 border-b border-line-soft pb-3 last:border-0"
                >
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-ink-muted">
                      0{i + 1}
                    </div>
                    <div className="font-display text-base text-ink mt-0.5">
                      {c.card.name}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {ruleLabel(c.matchedRule)}
                    </div>
                  </div>
                  <span className="font-mono text-sm text-burgundy">
                    {c.score}x
                  </span>
                </li>
              ))}
            </ol>
          </aside>

          {result.matchedOffers.length > 0 && (
            <div className="lg:col-span-3 card-surface p-6">
              <p className="eyebrow">Active offers</p>
              <div className="mt-3 grid md:grid-cols-2 gap-3">
                {result.matchedOffers.map((o) => (
                  <div
                    key={o.id}
                    className="border border-line-soft rounded-lg p-4 bg-cream-soft"
                  >
                    <div className="font-display text-lg text-ink">
                      {o.title}
                    </div>
                    {o.description && (
                      <p className="text-sm text-ink-soft mt-1">
                        {o.description}
                      </p>
                    )}
                    <div className="mt-2 text-xs uppercase tracking-[0.18em] text-burgundy">
                      {o.bonusType} · {o.bonusValue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
