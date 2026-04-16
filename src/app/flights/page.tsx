"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { apiFetch } from "@/lib/client-api";
import type { MatchedFlightResult } from "@/lib/flights/match-types";
import type { FlightSearchResponse } from "@/lib/flights/types";

type MatchResponse = FlightSearchResponse<MatchedFlightResult>;

function fmtDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function fmtTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function FlightsPage() {
  const [origin, setOrigin] = useState("YYZ");
  const [destination, setDestination] = useState("YVR");
  const [departureDate, setDepartureDate] = useState("");
  const [cabin, setCabin] = useState("economy");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MatchResponse | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setResults(null);
    try {
      const params = new URLSearchParams({
        origin,
        destination,
        cabin,
      });
      if (departureDate) params.set("departureDate", departureDate);
      const data = await apiFetch<MatchResponse>(
        `/api/flights/match?${params.toString()}`,
      );
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not search flights.");
    } finally {
      setPending(false);
    }
  }

  return (
    <PageShell
      eyebrow="Flights & travel"
      title="Best card for"
      italic="this trip."
      description="Search a route. Pointer matches each itinerary against your wallet across airline partners, lounge access, no-FX, travel insurance, and redemption value."
      actions={
        <Link href="/wallet" className="btn-ghost">
          Manage wallet
        </Link>
      }
    >
      <form
        onSubmit={search}
        className="card-surface p-6 grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">From</span>
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            maxLength={3}
            required
            className="rounded-md border border-line bg-cream/40 px-3 py-2.5 outline-none focus:border-burgundy focus:bg-paper uppercase tracking-widest"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">To</span>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            maxLength={3}
            required
            className="rounded-md border border-line bg-cream/40 px-3 py-2.5 outline-none focus:border-burgundy focus:bg-paper uppercase tracking-widest"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">Depart</span>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="rounded-md border border-line bg-cream/40 px-3 py-2.5 outline-none focus:border-burgundy focus:bg-paper"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">Cabin</span>
          <select
            value={cabin}
            onChange={(e) => setCabin(e.target.value)}
            className="rounded-md border border-line bg-cream/40 px-3 py-2.5 outline-none focus:border-burgundy focus:bg-paper"
          >
            <option value="economy">Economy</option>
            <option value="premium_economy">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="btn-primary self-end justify-center disabled:opacity-60"
        >
          {pending ? "Searching…" : "Search"}
          <span aria-hidden>→</span>
        </button>
      </form>

      {error && (
        <p className="mt-6 text-sm text-burgundy bg-burgundy/5 border border-burgundy/20 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {results && (
        <div className="mt-10">
          <p className="eyebrow">
            {results.results.length} itineraries · wallet:{" "}
            {results.meta.walletCardCount ?? 0} cards
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {results.results.map(({ flight, cardMatches, signals }) => (
              <article
                key={flight.id}
                className="card-surface p-6 grid md:grid-cols-3 gap-6"
              >
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-display text-2xl text-ink">
                        {flight.segments[0]?.origin} →{" "}
                        {flight.segments[flight.segments.length - 1]?.destination}
                      </div>
                      <div className="text-xs uppercase tracking-[0.18em] text-ink-muted mt-1">
                        {flight.segments.map((s) => s.airline).join(" · ")} ·{" "}
                        {fmtDuration(flight.totalDurationMinutes)}
                        {signals.isInternational ? " · Intl" : " · Domestic"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl text-ink">
                        ${flight.price}
                      </div>
                      {flight.pointsCost && (
                        <div className="text-xs text-burgundy">
                          or {flight.pointsCost.toLocaleString()}{" "}
                          {flight.pointsProgram}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-1 text-sm text-ink-soft">
                    {flight.segments.map((seg) => (
                      <div
                        key={seg.id}
                        className="flex items-center gap-3 py-1 border-b border-line-soft last:border-0"
                      >
                        <span className="font-mono text-xs text-ink-muted">
                          {seg.airline} {seg.flightNumber}
                        </span>
                        <span>
                          {fmtTime(seg.departureTime)} {seg.origin} →{" "}
                          {fmtTime(seg.arrivalTime)} {seg.destination}
                        </span>
                        <span className="ml-auto text-xs text-ink-muted">
                          {fmtDuration(seg.durationMinutes)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t md:border-t-0 md:border-l border-line-soft md:pl-6 pt-4 md:pt-0">
                  <p className="eyebrow">Best card for this</p>
                  {cardMatches.length === 0 ? (
                    <p className="mt-3 text-sm text-ink-muted">
                      Add a card to your wallet to see matches.
                    </p>
                  ) : (
                    <ol className="mt-3 space-y-3">
                      {cardMatches.slice(0, 3).map((m, i) => (
                        <li key={m.card.id}>
                          <div className="text-xs uppercase tracking-[0.18em] text-ink-muted">
                            0{i + 1}
                          </div>
                          <div className="font-display text-base text-ink">
                            {m.card.name}
                          </div>
                          <div className="text-xs text-ink-muted">
                            {m.card.issuer} · score {m.score}
                          </div>
                          {m.matchedTags.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {m.matchedTags.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-cream-soft text-ink-soft"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
