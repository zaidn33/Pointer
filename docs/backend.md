# Pointer Backend Notes

Pointer's backend is a Next.js App Router API layer backed by Prisma/PostgreSQL and Supabase Auth. Route handlers live in `src/app/api`, while business logic lives in `src/lib` so deterministic behavior can be tested without route glue.

## Architecture

- `src/lib/auth.ts` reads Supabase claims and upserts the local `User` record.
- `src/lib/wallet.ts` owns wallet card reads and writes.
- `src/lib/recommendations.ts` ranks saved cards for merchant/category queries.
- `src/lib/offers.ts` lists active offers for wallet cards and recommendation matches.
- `src/lib/llm` is optional. It can parse recommendation intent and improve explanations, but deterministic ranking remains the source of truth.
- `src/lib/flights` owns flight provider normalization, enrichment, signals, card matching, and wallet adaptation.

Shared API helpers in `src/lib/api.ts` provide consistent error envelopes:

```json
{ "error": { "code": "bad_request", "message": "..." } }
```

## Routes

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/signout`
- `GET /api/auth/me`
- `GET /api/wallet`
- `POST /api/wallet/cards`
- `DELETE /api/wallet/cards/[id]`
- `GET /api/offers`
- `POST /api/recommendations/query`
- `GET /api/flights/search`
- `GET /api/flights/match`

## Flights Scope

Flights currently includes:

- provider abstraction with a mock provider
- deterministic provider normalization
- flight signal generation
- explanation-ready metadata
- wallet-aware card matching
- deterministic scoring and stable tie-breaking
- top-N match limiting
- canonical card benefits catalog
- heuristic fallback for unknown cards

`/api/flights/search` returns enriched flight results. `/api/flights/match` authenticates the user, loads wallet cards through the wallet service, adapts them to flight-card inputs, and attaches `cardMatches` to each enriched flight.

## Card Catalog Resolution

Flight matching resolves wallet cards in this order:

1. Match the card name against `CARD_BENEFITS_CATALOG`.
2. If a catalog entry matches, use the catalog values exactly.
3. If no catalog entry matches, use deterministic name/fee heuristics from `FLIGHT_WALLET_FALLBACK_CONFIG`.

Catalog-first behavior is intentional. It prevents a broad fallback marker from overriding known card metadata.

To add a card, update `src/lib/flights/card-benefits-catalog.ts` with:

- normalized `knownNames`
- no-FX status
- airline transfer partners
- lounge benefits
- premium travel tags
- travel insurance markers

Then add or update a focused wallet-adapter test.

## Deterministic vs LLM-Assisted

Deterministic systems decide:

- recommendation ranking
- offer matching
- flight normalization
- flight signal generation
- flight/card match scores, reasons, tags, and ordering

The LLM layer may help parse natural language and write explanations for recommendation queries. It must not choose the winning card, alter scoring, or override deterministic flight/offer behavior.

## Backend Safety Notes

- Do not commit real secrets. Use `.env.local.example` as the template.
- Keep `/api/offers` ranking behavior stable.
- Keep flights and offers isolated: flight matching should not change offer ranking, and offer matching should not affect flight card matches.
- Prefer adding constants in `src/lib/flights/config.ts` over scattering score weights, reason keys, and top-N limits.
