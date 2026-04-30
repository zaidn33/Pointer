"use client";

import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/client-api";

type CardRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "created_pending_review"
  | "fulfilled";
type StatusFilter = CardRequestStatus | "all";

type CardSummary = {
  id: string;
  name: string;
  issuer: string;
  network: string;
  cardType?: string;
  annualFee?: number | null;
  rewardProgram?: string | null;
  baseEarnRate?: number | null;
  isActive: boolean;
  isVerified?: boolean;
};

type CardRequestRecord = {
  id: string;
  cardName: string;
  issuer: string | null;
  notes: string | null;
  status: CardRequestStatus;
  source: string;
  userId: string | null;
  userEmail: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  resolutionNotes: string | null;
  resolvedCardId: string | null;
  pendingDuplicateCount: number;
  resolvedCard: CardSummary | null;
  matchingCatalogCard: CardSummary | null;
};

type CreateDraft = {
  name: string;
  issuer: string;
  network: string;
  cardType: string;
  annualFee: string;
  rewardProgram: string;
  baseEarnRate: string;
};

const FILTERS: Array<{ label: string; value: StatusFilter }> = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Created pending review", value: "created_pending_review" },
  { label: "Rejected", value: "rejected" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "All", value: "all" },
];

const NETWORK_OPTIONS = ["Visa", "Mastercard", "Amex"];
const CARD_TYPE_OPTIONS = ["Personal", "Business", "Prepaid", "Student", "Store"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return dateFormatter.format(new Date(value));
}

function statusPillClass(status: CardRequestStatus) {
  switch (status) {
    case "pending":
      return "bg-gold-bright/15 text-gold";
    case "approved":
      return "bg-burgundy/10 text-burgundy";
    case "created_pending_review":
      return "bg-rust/10 text-rust";
    case "rejected":
      return "bg-ink/10 text-ink-soft";
    case "fulfilled":
      return "bg-emerald-700/10 text-emerald-800";
  }
}

function getDefaultCreateDraft(request: CardRequestRecord): CreateDraft {
  return {
    name: request.cardName,
    issuer: request.issuer ?? "",
    network: request.matchingCatalogCard?.network ?? "",
    cardType: "Personal",
    annualFee: "",
    rewardProgram: "",
    baseEarnRate: "",
  };
}

export default function AdminCardRequestsClient() {
  const [requests, setRequests] = useState<CardRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [createDrafts, setCreateDrafts] = useState<Record<string, CreateDraft>>({});
  const [linkSearches, setLinkSearches] = useState<Record<string, string>>({});
  const [linkResults, setLinkResults] = useState<Record<string, CardSummary[]>>({});

  const deferredSearch = useDeferredValue(search);

  async function load(nextFilter: StatusFilter, nextSearch: string) {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("status", nextFilter);
      if (nextSearch.trim()) {
        params.set("search", nextSearch.trim());
      }

      const data = await apiFetch<{ requests: CardRequestRecord[] }>(
        `/api/admin/card-requests?${params.toString()}`,
      );

      setRequests(data.requests);
      setNoteDrafts((current) => {
        const nextDrafts = { ...current };
        for (const request of data.requests) {
          if (!(request.id in nextDrafts)) {
            nextDrafts[request.id] = request.resolutionNotes ?? "";
          }
        }
        return nextDrafts;
      });
      setCreateDrafts((current) => {
        const nextDrafts = { ...current };
        for (const request of data.requests) {
          if (!(request.id in nextDrafts)) {
            nextDrafts[request.id] = getDefaultCreateDraft(request);
          }
        }
        return nextDrafts;
      });
      setLinkSearches((current) => {
        const nextSearches = { ...current };
        for (const request of data.requests) {
          if (!(request.id in nextSearches)) {
            nextSearches[request.id] = request.cardName;
          }
        }
        return nextSearches;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load card requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(filter, deferredSearch);
  }, [filter, deferredSearch]);

  const emptyMessage = useMemo(() => {
    if (filter === "all") {
      return "No card requests match the current filters.";
    }

    return `No ${filter} card requests match the current filters.`;
  }, [filter]);

  async function refresh() {
    startTransition(() => {
      void load(filter, deferredSearch);
    });
  }

  async function updateStatus(
    requestId: string,
    status: Exclude<CardRequestStatus, "fulfilled" | "created_pending_review">,
  ) {
    setBusyId(requestId);
    setError(null);

    try {
      await apiFetch<{ cardRequest: CardRequestRecord }>(
        `/api/admin/card-requests/${requestId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
            resolutionNotes: noteDrafts[requestId] ?? "",
          }),
        },
      );

      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update card request.");
    } finally {
      setBusyId(null);
    }
  }

  async function searchCards(requestId: string) {
    setBusyId(requestId);
    setError(null);

    try {
      const query = (linkSearches[requestId] ?? "").trim();
      const params = new URLSearchParams();
      if (query) {
        params.set("search", query);
      }

      const data = await apiFetch<{ cards: CardSummary[] }>(
        `/api/admin/cards?${params.toString()}`,
      );

      setLinkResults((current) => ({
        ...current,
        [requestId]: data.cards,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search existing cards.");
    } finally {
      setBusyId(null);
    }
  }

  async function fulfillByLink(requestId: string, resolvedCardId: string) {
    setBusyId(requestId);
    setError(null);

    try {
      await apiFetch<{ cardRequest: CardRequestRecord }>(
        `/api/admin/card-requests/${requestId}/fulfill`,
        {
          method: "POST",
          body: JSON.stringify({
            action: "link",
            resolvedCardId,
            resolutionNotes: noteDrafts[requestId] ?? "",
          }),
        },
      );

      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to link catalog card.");
    } finally {
      setBusyId(null);
    }
  }

  async function createAndFulfill(requestId: string) {
    const draft = createDrafts[requestId];
    setBusyId(requestId);
    setError(null);

    try {
      await apiFetch<{ cardRequest: CardRequestRecord }>(
        `/api/admin/card-requests/${requestId}/fulfill`,
        {
          method: "POST",
          body: JSON.stringify({
            action: "create",
            name: draft.name,
            issuer: draft.issuer,
            network: draft.network,
            cardType: draft.cardType,
            annualFee: draft.annualFee.trim() ? Number(draft.annualFee) : null,
            rewardProgram: draft.rewardProgram || undefined,
            baseEarnRate: draft.baseEarnRate.trim() ? Number(draft.baseEarnRate) : null,
            resolutionNotes: noteDrafts[requestId] ?? "",
          }),
        },
      );

      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create and fulfill card request.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="card-surface p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Filters</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FILTERS.map((option) => {
                const active = option.value === filter;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition ${
                      active
                        ? "border-burgundy bg-burgundy text-paper"
                        : "border-line text-ink hover:bg-cream-soft"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block w-full max-w-md">
            <span className="eyebrow">Search</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Card name or issuer"
              className="mt-3 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            />
          </label>
        </div>
      </section>

      {error && (
        <p className="rounded-xl border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {error}
        </p>
      )}

      <section className="space-y-4">
        {loading && (
          <div className="card-surface p-6 text-sm text-ink-muted">
            Loading review queue…
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="card-surface p-6 text-sm text-ink-muted">
            {emptyMessage}
          </div>
        )}

        {!loading &&
          requests.map((request) => {
            const createDraft = createDrafts[request.id] ?? getDefaultCreateDraft(request);
            const searchResults = linkResults[request.id] ?? [];
            const isBusy = busyId === request.id;

            return (
              <article key={request.id} className="card-surface p-5 md:p-6">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${statusPillClass(request.status)}`}
                        >
                          {request.status}
                        </span>
                        {request.status === "pending" && request.pendingDuplicateCount > 1 && (
                          <span className="rounded-full bg-rust/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-rust">
                            {request.pendingDuplicateCount} pending duplicates
                          </span>
                        )}
                        <span className="rounded-full bg-cream-soft px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                          {request.source}
                        </span>
                      </div>

                      <h2 className="mt-4 font-display text-2xl text-ink">
                        {request.cardName}
                      </h2>
                      <p className="mt-1 text-sm text-ink-soft">
                        {request.issuer || "Issuer not provided"}
                      </p>

                      <dl className="mt-5 grid gap-4 text-sm text-ink-soft md:grid-cols-2 xl:grid-cols-3">
                        <div>
                          <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                            Submitted
                          </dt>
                          <dd className="mt-1 text-ink">{formatDate(request.createdAt)}</dd>
                        </div>
                        <div>
                          <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                            User
                          </dt>
                          <dd className="mt-1 break-all text-ink">
                            {request.userEmail || request.userId || "Anonymous"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                            Reviewed
                          </dt>
                          <dd className="mt-1 text-ink">
                            {request.reviewedAt
                              ? `${formatDate(request.reviewedAt)} by ${request.reviewedBy ?? "Unknown"}`
                              : "Not reviewed yet"}
                          </dd>
                        </div>
                      </dl>

                      {request.notes && (
                        <div className="mt-5 rounded-xl bg-cream-soft/70 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                            Request notes
                          </p>
                          <p className="mt-2 text-sm text-ink-soft">{request.notes}</p>
                        </div>
                      )}

                      {request.resolvedCard && (
                        <div className="mt-5 rounded-xl border border-emerald-800/15 bg-emerald-700/5 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-800">
                            Linked card
                          </p>
                          <p className="mt-2 text-sm text-ink">
                            {request.resolvedCard.name} · {request.resolvedCard.issuer} · {request.resolvedCard.network}
                          </p>
                          {request.status === "created_pending_review" && (
                            <p className="mt-2 text-xs text-rust">
                              Card exists, but reward verification is still pending before this request is fulfilled.
                            </p>
                          )}
                        </div>
                      )}

                      {!request.resolvedCard && request.matchingCatalogCard && (
                        <div className="mt-5 rounded-xl border border-burgundy/15 bg-burgundy/5 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-burgundy">
                            Exact catalog match
                          </p>
                          <p className="mt-2 text-sm text-ink">
                            {request.matchingCatalogCard.name} · {request.matchingCatalogCard.issuer} · {request.matchingCatalogCard.network}
                          </p>
                          <button
                            type="button"
                            onClick={() => fulfillByLink(request.id, request.matchingCatalogCard!.id)}
                            disabled={isBusy}
                            className="mt-3 rounded-full border border-burgundy/20 bg-burgundy px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-paper transition hover:bg-burgundy-deep disabled:opacity-50"
                          >
                            Link exact match
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="w-full xl:max-w-md">
                      <p className="eyebrow">Review notes</p>
                      <textarea
                        value={noteDrafts[request.id] ?? ""}
                        onChange={(event) =>
                          setNoteDrafts((current) => ({
                            ...current,
                            [request.id]: event.target.value,
                          }))
                        }
                        rows={4}
                        placeholder="Optional resolution notes"
                        className="mt-3 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                      />
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => updateStatus(request.id, "approved")}
                          disabled={isBusy}
                          className="btn-primary !px-4 !py-2 text-[0.68rem] disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(request.id, "rejected")}
                          disabled={isBusy}
                          className="rounded-full border border-line px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-cream-soft disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>

                  {!request.resolvedCard && (
                    <div className="grid gap-4 lg:grid-cols-2">
                      <section className="rounded-2xl border border-line-soft bg-white/60 p-4">
                        <p className="eyebrow">Create card</p>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <input
                            type="text"
                            value={createDraft.name}
                            onChange={(event) =>
                              setCreateDrafts((current) => ({
                                ...current,
                                [request.id]: {
                                  ...createDraft,
                                  name: event.target.value,
                                },
                              }))
                            }
                            placeholder="Card name"
                            className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink"
                          />
                          <input
                            type="text"
                            value={createDraft.issuer}
                            onChange={(event) =>
                              setCreateDrafts((current) => ({
                                ...current,
                                [request.id]: {
                                  ...createDraft,
                                  issuer: event.target.value,
                                },
                              }))
                            }
                            placeholder="Issuer"
                            className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink"
                          />
                          <select
                            value={createDraft.network}
                            onChange={(event) =>
                              setCreateDrafts((current) => ({
                                ...current,
                                [request.id]: {
                                  ...createDraft,
                                  network: event.target.value,
                                },
                              }))
                            }
                            className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink"
                          >
                            <option value="">Network</option>
                            {NETWORK_OPTIONS.map((network) => (
                              <option key={network} value={network}>
                                {network}
                              </option>
                            ))}
                          </select>
                          <select
                            value={createDraft.cardType}
                            onChange={(event) =>
                              setCreateDrafts((current) => ({
                                ...current,
                                [request.id]: {
                                  ...createDraft,
                                  cardType: event.target.value,
                                },
                              }))
                            }
                            className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink"
                          >
                            {CARD_TYPE_OPTIONS.map((cardType) => (
                              <option key={cardType} value={cardType}>
                                {cardType}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={createDraft.annualFee}
                            onChange={(event) =>
                              setCreateDrafts((current) => ({
                                ...current,
                                [request.id]: {
                                  ...createDraft,
                                  annualFee: event.target.value,
                                },
                              }))
                            }
                            placeholder="Annual fee if trusted"
                            className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink"
                          />
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={createDraft.baseEarnRate}
                            onChange={(event) =>
                              setCreateDrafts((current) => ({
                                ...current,
                                [request.id]: {
                                  ...createDraft,
                                  baseEarnRate: event.target.value,
                                },
                              }))
                            }
                            placeholder="Base earn rate if trusted"
                            className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink"
                          />
                          <input
                            type="text"
                            value={createDraft.rewardProgram}
                            onChange={(event) =>
                              setCreateDrafts((current) => ({
                                ...current,
                                [request.id]: {
                                  ...createDraft,
                                  rewardProgram: event.target.value,
                                },
                              }))
                            }
                            placeholder="Reward program"
                            className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink md:col-span-2"
                          />
                          <p className="text-xs text-ink-muted md:col-span-2">
                            Leave reward fields blank unless they are trusted. Pointer will mark the card for review instead of guessing.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => createAndFulfill(request.id)}
                          disabled={isBusy}
                          className="mt-4 rounded-full border border-emerald-800/20 bg-emerald-700/10 px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-emerald-800 transition hover:bg-emerald-700/15 disabled:opacity-50"
                        >
                          Create card
                        </button>
                      </section>

                      <section className="rounded-2xl border border-line-soft bg-white/60 p-4">
                        <p className="eyebrow">Link existing</p>
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            value={linkSearches[request.id] ?? ""}
                            onChange={(event) =>
                              setLinkSearches((current) => ({
                                ...current,
                                [request.id]: event.target.value,
                              }))
                            }
                            placeholder="Search active catalog cards"
                            className="flex-1 rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink"
                          />
                          <button
                            type="button"
                            onClick={() => searchCards(request.id)}
                            disabled={isBusy}
                            className="rounded-full border border-line px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-cream-soft disabled:opacity-50"
                          >
                            Find
                          </button>
                        </div>

                        <div className="mt-4 space-y-2">
                          {searchResults.map((card) => (
                            <div
                              key={card.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-paper px-3 py-3"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-ink">
                                  {card.name}
                                </p>
                                <p className="text-xs text-ink-muted">
                                  {card.issuer} · {card.network}
                                </p>
                                {card.isVerified === false && (
                                  <p className="text-xs text-rust">
                                    Pending verification
                                  </p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => fulfillByLink(request.id, card.id)}
                                disabled={isBusy}
                                className="rounded-full border border-burgundy/20 bg-burgundy px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-paper transition hover:bg-burgundy-deep disabled:opacity-50"
                              >
                                Link
                              </button>
                            </div>
                          ))}
                          {linkResults[request.id] && searchResults.length === 0 && (
                            <p className="text-sm text-ink-muted">
                              No active cards matched that search.
                            </p>
                          )}
                        </div>
                      </section>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
      </section>
    </div>
  );
}
