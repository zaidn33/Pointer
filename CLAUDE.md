# CLAUDE.md

## Project

Pointer

## What This Project Is

Pointer is a website-first credit card rewards optimization platform for Canadian users. Users select the credit cards they already own, then ask Pointer which card they should use for a specific purchase, merchant, or travel booking.

The system recommends the best card based on structured reward logic, merchant/category mapping, offers, and travel relevance. The product does not connect to banks, does not ask for bank logins, and does not collect card numbers.

Examples:

* groceries at Loblaws
* gas at Petro-Canada
* dining at Starbucks
* domestic Air Canada flight
* international flight booking
* merchant-specific offers tied to a saved card

## Core Product Rule

Users only tell Pointer which cards they have.

Pointer must never require:

* bank usernames
* bank passwords
* card numbers
* CVV
* bank account linking
* financial aggregation APIs for MVP

## Current Product Shape

Pointer is a website, not a native mobile app.

The product should be organized across separate pages, not one overloaded screen.

Primary pages:

* landing page
* dashboard
* wallet page
* card detail page
* Ask Pointer page
* flights page
* offers page

## Build Philosophy

Build for clarity, speed, and trust.

Important principles:

* privacy first
* clear explanations
* simple user flows
* structured logic underneath
* conversational UX on top
* modular code
* clean separation of concerns

## AI and Recommendation Philosophy

Pointer is heavily LLM-powered, especially for the Ask Pointer experience.

However, do not build this as a pure LLM guessing system.

Use this model:

* structured card, merchant, and offer data is the source of truth
* recommendation ranking should be grounded in structured logic
* LLMs should parse user intent, help handle natural language, and explain results
* if LLM output conflicts with structured reward rules, structured logic wins

The goal is to make the product feel smart and conversational while keeping recommendations reliable.

## Supported LLM Direction

Design the system so it can work with multiple LLM providers.

Examples:

* OpenAI
* Gemini
* Claude
* Grok

Use a provider-agnostic adapter pattern where possible.

## What the System Must Do

The system must allow a user to:

* create an account
* save the cards they own
* remove cards they no longer use
* ask which card to use for a merchant or category
* ask which card to use for flights and travel
* see why a card was recommended
* see other ranked card options
* view offers tied to their saved cards

The system must allow admins to:

* manage supported cards
* manage card rules
* manage merchant mappings
* manage offers
* override incorrect mappings or rules

## What the System Must Know

The backend should maintain structured data for:

* cards
* reward programs
* category multipliers
* merchant-specific benefits
* merchant aliases
* travel partner relationships
* active offers
* card network and acceptance notes
* rule exceptions and caps where relevant

## Website Structure Guidance

Keep the product organized.

### Landing Page

Purpose:

* explain the value clearly
* reassure users about privacy
* drive signup

### Dashboard

Purpose:

* quick overview of wallet
* quick access to main sections
* show top useful insights

### Wallet Page

Purpose:

* show saved cards
* allow card add/remove
* highlight key benefits

### Card Detail Page

Purpose:

* show a card’s categories, rules, and benefits
* show relevant offers

### Ask Pointer Page

Purpose:

* let users ask questions in natural language
* return best card recommendation and explanation
* support follow-up questions

### Flights Page

Purpose:

* handle domestic vs international flight logic
* compare best cards for airline bookings and travel spend

### Offers Page

Purpose:

* show promotions relevant to the user’s saved cards
* show merchant-specific opportunities and expiring offers

## Recommended Tech Direction

Unless explicitly changed later, use this stack direction:

* frontend: Next.js + TypeScript + Tailwind CSS
* backend: Node.js + TypeScript + Next.js API routes or equivalent modular backend
* database: PostgreSQL
* auth: Supabase Auth or equivalent
* ORM: Prisma or Drizzle
* hosting: Vercel + hosted Postgres/Supabase
* LLM layer: provider adapter supporting OpenAI, Gemini, Claude, Grok, or similar

## Backend Expectations

The backend should be modular and easy to reason about.

Preferred logical separation:

* auth layer
* wallet management
* card data service
* merchant mapping service
* offer service
* recommendation engine
* LLM orchestration layer
* admin service
* logging/observability layer

## Recommendation Engine Rules

The recommendation engine is core product logic.

It should:

1. parse the user’s query
2. detect merchant, category, travel context, or offer intent
3. load the user’s saved cards
4. load matching card rules and active offers
5. score all relevant cards
6. rank cards best to worst
7. return the winner with explanation
8. optionally use LLM output to make the response conversational
9. log the result

Factors to consider when scoring:

* base earn rate
* category multiplier
* merchant-specific benefit
* active offer or bonus
* travel partner relevance
* domestic vs international context
* network acceptance constraints when relevant

## Query Handling Guidance

Users may ask things casually.

Examples:

* Which card should I use at Loblaws?
* Best card for groceries?
* I have Cobalt and Aventura, what should I use for Starbucks?
* Best card for a domestic Air Canada flight?
* Do any of my cards have a promo for Starbucks?

The system should support:

* natural language input
* merchant alias handling
* category detection
* travel intent detection
* follow-up questions

## Data Rules

Do not store sensitive financial data.

Allowed data:

* user account info
* saved card choices
* recommendation history
* preferences
* structured card and offer data

Never store:

* bank login credentials
* account aggregation tokens
* card numbers
* CVV
* bank statements

## Coding Expectations

Write clean, production-style code.

Requirements:

* TypeScript-first
* strongly typed interfaces
* modular files
* readable naming
* low coupling
* no giant monolithic files if avoidable
* include basic validation and error handling
* keep business logic out of UI components
* keep recommendation logic testable

## Testing Expectations

At minimum, include:

* unit tests for recommendation scoring
* unit tests for merchant/category mapping
* API tests for wallet and recommendation endpoints
* tests for fallback behavior when LLM calls fail
* tests verifying that sensitive bank/card fields are not accepted

## Admin Expectations

Support admin functionality for managing:

* cards
* category rules
* merchant aliases
* merchant overrides
* offers
* rule updates

Admin changes should be auditable.

## Logging Expectations

Track:

* recommendation requests
* detected merchant/category
* chosen card
* LLM provider used
* latency
* failures
* admin changes

## UX Expectations for Responses

When showing a recommendation, always aim to include:

* best card
* why it wins
* backup option if relevant
* points/value difference if available
* active offer if relevant

The response should feel direct and helpful, not robotic.

## Constraints

Do not:

* add bank connections for MVP
* build native mobile apps right now
* overcomplicate the first version with too many side systems
* rely on LLMs alone for factual recommendation ranking

Do:

* keep the MVP website-first
* keep the product privacy-friendly
* build the recommendation flow first
* keep docs and code separated clearly by concern

## Output Preference for Agent Work

When making changes:

* explain what files were created or changed
* keep architecture decisions consistent with this document
* prefer small, clear steps over random broad rewrites
* keep the codebase organized so PRD, frontend, and backend docs remain separate

## One-Sentence Mission

Help users stop leaving points on the table by telling them exactly which credit card to use for each purchase, using a privacy-first, LLM-enhanced, structured recommendation system.
