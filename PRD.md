Pointwise is a Canadian credit card rewards tool that helps users decide which card to use for every purchase based on the cards they already have. Users simply select their cards, and Pointwise recommends the best one for groceries, gas, dining, travel, and more while also highlighting card-specific perks and bonus offers. It is privacy-friendly, with no bank logins or card numbers required.

Frontend: Next.js, TypeScript, Tailwind CSS
Backend: Node.js, Next.js API routes, Supabase, PostgreSQL
LLM: OpenAI API
Auth: Supabase Auth
Core Logic: Custom rules engine in TypeScript
Hosting: Vercel
Background Jobs / Offer Scanning: Supabase Edge Functions or cron jobs
Optional Later: Pinecone for semantic search if you add a large amount of offer and rewards data


Pointwise PRD
Product Name
Pointwise
Product Overview
Pointwise is a credit card rewards optimization platform that helps users decide which credit card to use for a given purchase based on the cards they already own. Users do not connect their bank accounts, log in to their bank, or share card numbers. Instead, they simply tell Pointwise which cards they have in their wallet. Pointwise then recommends the best card to use for a specific transaction based on reward multipliers, category bonuses, travel benefits, merchant-specific offers, and card-linked promotions.
The core value of Pointwise is simple: most people own multiple credit cards but do not know which one gives them the most value for each purchase. As a result, they leave points, cashback, and travel rewards on the table. Pointwise solves this by acting as a smart card advisor that tells users exactly which card to use and why.
Examples:
A user asks: “I am buying groceries at Loblaws. Which card should I use?”
Pointwise responds: “Use your Amex Cobalt because it earns 5x points on groceries, while your CIBC Aventura earns only 1x.”
A user asks: “I am booking a domestic Air Canada flight.”
Pointwise responds: “Use your Aeroplan-linked Visa because it gives better value on Air Canada purchases and travel redemptions.”
Pointwise is designed for privacy, simplicity, and trust. It never requests bank login credentials, bank account access, or card numbers. It only stores which cards a user says they own.
Problem Statement
Consumers with multiple credit cards often do not know which card is best for each spending situation. Reward programs are complicated, card benefits vary by category and merchant, and promotions change over time. Most users either use the same card for everything or guess which one is best, causing them to miss valuable points, travel rewards, cashback, welcome bonuses, and merchant offers.
There is currently no easy, privacy-friendly tool that helps users answer questions like:
Which card should I use for groceries?
Which card should I use for gas?
Which card should I use for dining?
Which card should I use for booking flights?
Which of my cards has the best value at this store?
Are there any active promotions or card-linked offers I should use?
Pointwise addresses this gap by creating a simple recommendation engine based only on the user’s selected cards and public reward logic.
Vision
To become the smartest and most trusted rewards decision engine for Canadian consumers by helping them maximize the value of every purchase without requiring access to sensitive banking data.
Mission
Help users stop leaving points on the table by telling them which card to use for every purchase, store, and travel booking.
Goals
Product Goals
Let users add the cards they own in less than 2 minutes.
Recommend the best card for a given purchase quickly and clearly.
Explain why a specific card is the best option.
Show side-by-side comparisons between the user’s available cards.
Surface merchant-specific offers and promotions where applicable.
Support common spending categories such as groceries, gas, dining, travel, recurring bills, and general retail.
User Goals
Maximize points, cashback, or travel rewards.
Make better card decisions without memorizing reward rules.
Understand why one card is better than another.
Discover offers and promotions tied to their existing cards.
Use a secure product without sharing bank credentials.
Target Users
Primary Users
Canadian consumers who:
Own 2 or more credit cards.
Care about maximizing points, cashback, or travel rewards.
Use cards across multiple spending categories.
Feel confused by card reward structures.
Want quick guidance before making a purchase.
Secondary Users
Travel enthusiasts optimizing flights and travel redemptions.
Students and young professionals learning how to use credit cards more effectively.
Rewards hobbyists who want a cleaner way to compare card usage.
Users considering new cards and wanting lifestyle-based card suggestions in the future.

Value Proposition
Pointwise helps users get the most out of the credit cards they already own by telling them exactly which card to use for each transaction. Unlike bank aggregation tools, Pointwise does not ask for bank logins or sensitive financial data. It is a privacy-friendly rewards advisor that turns a confusing rewards ecosystem into clear, actionable decisions. i’m
Core Product Principles
Privacy first
Clarity over complexity
Fast recommendations
Transparent explanations
Trustworthy logic
Canadian-first experience
MVP Scope
The MVP should focus on the smallest set of features that proves the core value of the product.
Included in MVP
User onboarding
Card selection from a supported list of Canadian credit cards
User wallet showing selected cards
Transaction query input
Recommendation engine that chooses the best card from the user’s wallet
Explanation layer that explains why a card is recommended
Side-by-side comparison of eligible cards
Category-based and merchant-based reward mapping
Basic merchant offer and card-linked bonus tracking
Search by category, merchant, or travel use case
Excluded from MVP
Bank account linking
Card number storage
Automatic transaction import
Real-time statement tracking
Redemption booking inside the app
Advanced loyalty account integrations
Full international issuer coverage
Browser extension
Native mobile app builds in version 1, since the MVP will launch as a website first
Product Features
1. Card Wallet Setup
Users can build a digital wallet inside Pointwise by selecting which credit cards they already own.
Functional Requirements
Users can search and select cards from a predefined list.
Each card record includes issuer, network, annual fee, reward program, category multipliers, merchant benefits, and known travel perks.
Users can add multiple cards.
Users can remove cards at any time.
Users can optionally mark a card as active, primary, or backup.
UX Requirements
Card setup must be simple and visual.
Cards should be displayed with recognizable branding and key multipliers.
Onboarding should take under 2 minutes.
2. Transaction Recommendation Engine
Users can ask Pointwise which card they should use for a given transaction.
Example Inputs
“Which card should I use at Loblaws?”
“I am buying groceries.”
“Which card is best for gas?”
“Which card should I use for an Air Canada flight?”
“Best card for Starbucks reload?”
Functional Requirements
The system identifies the merchant or category.
The system checks the user’s saved cards.
The system compares reward structures across those cards.
The system recommends the best card.
The system gives a short explanation.
The system shows alternatives ranked from best to worst.
Recommendation Logic Inputs
Card reward multipliers
Spending category
Merchant classification
Merchant-specific offers
Travel partner alignment
Domestic vs international travel context
Eligible bonus campaigns
Base earn rate fallback
3. Merchant and Category Mapping
Pointwise must map merchants to categories so that the recommendation engine can determine which category bonus applies.
Examples:
Loblaws → Grocery
Petro-Canada → Gas
Starbucks → Dining or merchant-specific reload logic depending on card
Air Canada → Airline / travel
Uber Eats → Dining / delivery
Functional Requirements
Maintain a merchant-category mapping table.
Support multiple aliases for merchant names.
Allow manual admin updates to merchant mapping.
Support merchant-specific overrides where a merchant has unique treatment.
4. Offer and Bonus Detection
Pointwise should show users when one of their cards has a special offer or linked benefit that makes it more valuable than usual.
Examples:
Link card to Starbucks and receive a large points bonus.
Earn extra points on Air Canada bookings with a specific card.
Temporary issuer promotion for travel or recurring bill payments.
Functional Requirements
Store active offers tied to cards or issuers.
Match offers against the user’s saved cards.
Surface offers in wallet view and recommendation results.
Expire offers automatically based on end date.
MVP Note
In version 1, offers may be manually curated or updated from public offer pages through admin workflows.
5. AI Advisor Interface
Pointwise should provide a conversational interface where users can ask questions naturally. This experience will be powered primarily by LLMs so the product feels fast, flexible, and easy to use.
Examples:
“I have Amex Cobalt and Aventura. Which card should I use for groceries?”
“What is the best card in my wallet for booking a domestic flight?”
“Do any of my cards have benefits at Starbucks?”
Functional Requirements
Accept natural language input.
Parse merchant, category, travel intent, and offer intent.
Return a clear answer with explanation.
Support follow-up questions in a conversational flow.
Be designed to work with leading LLM providers such as OpenAI, Gemini, Claude, Grok, or similar models.
Use structured card and offer data as grounding context wherever possible.
Product Principle
The product experience will be heavily powered by LLMs because they are fast, flexible, and strong at answering natural language questions. Pointwise should use LLMs to interpret queries, explain recommendations, and provide a more intelligent user experience. Structured card, merchant, and offer data should still be used to ground answers and improve reliability.
6. Best Card by Lifestyle
Pointwise should eventually help users understand which card fits their lifestyle best overall.
Examples:
Best card in my wallet for groceries and dining
Best travel card in my wallet
Which of my cards gives the most overall value
MVP Status
This can be partially supported in MVP through simple summary views, but deeper lifestyle analysis is a post-MVP feature.
User Stories
Wallet Setup
As a user, I want to select the cards I own so the app can personalize recommendations.
As a user, I want to remove a card from my wallet if I no longer have it.
As a user, I want to see the key benefits of each card I added.
Recommendation Flow
As a user, I want to ask which card to use for a specific purchase.
As a user, I want to know why a certain card is recommended.
As a user, I want to compare my other cards in case the top choice is not accepted.
As a user, I want to know if a card is not accepted at a merchant and see the next-best option.
Offers
As a user, I want to see special offers tied to the cards I already own.
As a user, I want to know when a merchant-specific promotion applies.
As a user, I want to be warned if an offer is expiring soon.
Trust and Privacy
As a user, I want to use the product without entering card numbers.
As a user, I want to know that my bank credentials are never requested.
As a user, I want confidence that recommendations are based on transparent logic.
Key Workflows
Workflow 1: New User Onboarding
User lands on website.
User sees value proposition: stop leaving points on the table.
User signs up directly and starts onboarding.
User selects their cards from a catalog.
User saves wallet.
User is taken to recommendation screen.
Workflow 2: Ask Which Card to Use
User enters a purchase context such as grocery, gas, store name, or flight booking.
System identifies the merchant, category, and purchase type.
System compares the user’s cards.
System displays the best card to use.
System explains the decision.
System shows alternative cards and earned value differences.
Workflow 3: Discover Offers
User opens wallet or recommendations page.
System shows active offers matched to their cards.
User taps an offer to read details.
User learns where and how to use the offer.
Functional Requirements
User Accounts
Users can sign up with email or social login.
Users can create and manage a saved wallet.
Users can store preferences.
Card Data Management
Admin can create, edit, and archive supported cards.
Each card must include:
issuer
network
card name
annual fee
reward type
base earn rate
category multipliers
travel partner logic
merchant-specific benefits
notes and exceptions
Recommendation Engine
Must rank cards owned by the user for a specified transaction.
Must support both category-based and merchant-based recommendations.
Must return explanation text.
Must support fallback recommendations if top card is not accepted.
Must consider network acceptance constraints where relevant.
Offer Engine
Must store active offers and campaigns.
Must associate offers with cards, issuers, merchants, or categories.
Must surface matched offers in recommendations.
Search and Query Parsing
Must accept simple natural-language inputs.
Must detect merchant names, categories, and travel terms.
Must handle spelling variants and common aliases.
Admin Tools
Admin dashboard for updating cards, categories, merchants, and offers.
Manual override capability for recommendation rules.
Logging for recommendation decisions.
Non-Functional Requirements
Performance
Recommendation response should feel instant or near instant.
Query result should ideally return in under 2 seconds.
Privacy and Security
No bank login collection.
No bank credential storage.
No card number collection.
Only store user-selected card metadata.
Clear privacy messaging throughout the product.
Reliability
Recommendation engine must be deterministic and testable.
Changes to reward logic should be versioned.
Scalability
System should support adding more cards, merchants, and offers over time.
Architecture should allow future support for native mobile apps and APIs.
Data Model Overview
User
id
email
created_at
preferences
UserCard
id
user_id
card_id
added_at
status
Card
id
issuer
network
name
annual_fee
reward_program
base_earn_rate
notes
CardCategoryRule
id
card_id
category
multiplier
value_type
cap_rules
exceptions
Merchant
id
name
normalized_name
category
aliases
CardMerchantBenefit
id
card_id
merchant_id
benefit_type
benefit_value
start_date
end_date
conditions
Offer
id
title
description
issuer
card_id
merchant_id
category
bonus_value
start_date
end_date
conditions
status
RecommendationLog
id
user_id
query_text
detected_merchant
detected_category
recommended_card_id
explanation
created_at
Recommendation Logic Framework
The recommendation engine should use a structured ranking model.
Step 1: Identify Context
Merchant name
Category
Transaction type
Travel type
Domestic or international
Any known offer or bonus context
Step 2: Gather Eligible Cards
Load all cards in the user’s wallet.
Filter for acceptance constraints if needed.
Step 3: Score Each Card
Score cards using factors such as:
Base earn rate
Category multiplier
Merchant-specific bonus
Travel partner relevance
Promotional bonus
Acceptance likelihood
Effective value estimate
Step 4: Rank and Return
Best card
Backup option
Comparison view
Explanation string
Example Rule
If merchant category is grocery and user has Amex Cobalt, score it highly due to grocery multiplier. If merchant does not accept Amex, recommend the next best Visa or Mastercard option.
UX Requirements
Website Structure
Pointwise version 1 will be a website, not a native mobile app. The product should be designed as a multi-page web experience so each major feature has its own space and the demo feels clear, structured, and easy to navigate.
Landing Page
Clear message: stop leaving points on the table.
Explain that users only enter which cards they own.
Strong privacy reassurance.
Direct signup CTA.
Clear navigation to main product sections.
Dashboard
High-level overview of the user’s wallet.
Quick links to the main recommendation sections.
Snapshot of best current offers and featured insights.
Wallet Page
Visual card library.
Selected cards section.
Benefit highlights.
Active offers section.
Ability to add or remove cards.
Card Detail Page
Individual card overview.
Reward categories and multipliers.
Merchant-specific benefits.
Known travel benefits and notes.
Linked offers and promotions.
Ask Pointwise Page
Search bar or conversational input.
Example prompts.
Instant recommendation card.
Comparison table.
Reasoning summary.
Flights Page
Dedicated page for travel and flight-related recommendations.
Domestic flight vs international flight use cases.
Airline-specific logic such as Air Canada and Aeroplan-related recommendations.
Travel card comparisons for flights, baggage, travel insurance, and related perks.
Offers Page
Active promotions matched to the user’s saved cards.
Merchant-specific bonus opportunities.
Expiring offers and featured deals.
Recommendation Result Design
Must show:
Best card
Why it wins
Points or value estimate
Other card options
Offer or bonus badge if applicable
Success Metrics
MVP Metrics
Number of users who complete wallet setup
Average number of cards added per user
Number of recommendation queries per user
Recommendation response time
Offer click-through rate
User retention after 7 days and 30 days
Product Quality Metrics
Recommendation accuracy based on internal validation
User trust score or satisfaction score
Percentage of recommendations with clear explanation
Business Metrics
Conversion from landing page to signup
Activation rate after signup
Premium conversion rate in future
Risks and Challenges
Reward programs can change frequently.
Merchant categorization may be inconsistent.
Some benefits depend on hidden issuer rules or regional exceptions.
Users may expect perfect real-time accuracy.
Offer tracking may require ongoing manual upkeep early on.
Assumptions
Users are willing to manually select their cards.
Users value privacy over bank-linked automation.
Public card reward information is sufficient for MVP recommendations.
Canadian card optimization is a strong enough niche to gain traction.
Monetization Opportunities
Premium subscription for advanced travel optimization
Affiliate revenue from credit card recommendations
Sponsored placements for card issuers or financial partners
Premium alerts for limited-time offers
Personalized card upgrade suggestions
Open Questions
How many Canadian cards should be supported at launch?
Will offers be curated manually or partially automated in MVP?
How should Pointwise calculate “value” when comparing different reward currencies?
Should the MVP optimize for points only, or also cashback and travel perks?
Should recommendations consider annual fee impact in later versions?
Release Recommendation
The first version should focus on doing one thing exceptionally well: helping users select the best card from the cards they already own for a given purchase through a clean, organized website experience. The product should be structured across separate pages such as wallet, flights, offers, and card details so users can explore the product easily and demos feel polished. It should be fast, easy to trust, and simple to understand. The Ask Pointwise experience should lean heavily on LLMs to make the product feel conversational and intelligent, while still using structured card and offer data in the background to improve answer quality.
One-Line Summary
Pointwise is a privacy-first rewards optimization platform that tells users which credit card to use for every purchase based on the cards they already own, helping them maximize points, benefits, and offers without sharing sensitive banking information.

