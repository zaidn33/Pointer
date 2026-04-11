CLAUDE.backend.md
Scope
This file is for backend implementation work only.
Use this document when working on Pointwise backend systems, APIs, data models, recommendation logic, admin tools, LLM orchestration, and infrastructure-related code.
Do not use this file as the main guide for frontend design or UI implementation.
Project Summary
Pointwise is a website-first credit card rewards optimization platform for Canadian users.
Users select the credit cards they already own, then ask Pointwise which card they should use for a specific merchant, purchase category, or travel booking.
The backend must support accurate recommendations without asking for:
bank logins
bank account connections
card numbers
CVV
bank statements
The product should only store which cards the user says they have.
Backend Mission
Build a privacy-first backend that uses structured card, merchant, and offer data to recommend the best card for a given transaction, while using LLMs to improve query understanding and explanation quality.
Mandatory Workflow Before Coding
Before making any backend implementation changes, always do the following first:
Read the relevant backend doc and current task request.
Create a clear implementation plan.
Break the work into steps.
Explain which files will likely be created or changed.
Explain any assumptions.
Wait for explicit approval before writing or modifying code.
Do not start coding immediately unless the user clearly says to proceed.
Implementation Plan Requirements
Every implementation plan should include:
goal
scope
files to create or update
data model impact
API impact
logic impact
risks or edge cases
testing plan
clear step-by-step execution order
The implementation plan should be concise, structured, and easy to review.
Backend Build Principles
privacy first
deterministic logic underneath
LLM-enhanced UX on top
modular backend design
strong typing
clean separation of services
auditability for admin changes
easy future expansion
Core Backend Responsibilities
The backend must support:
user auth
user wallet storage
supported card storage
category rules
merchant mapping
merchant aliases
card-specific merchant benefits
offer storage and matching
recommendation scoring
recommendation explanation payloads
LLM provider orchestration
admin management APIs
recommendation logging
Recommendation Philosophy
Do not rely on the LLM alone to decide which card wins.
Use this model:
structured backend logic determines card ranking
LLM helps parse natural language and explain results
if there is a conflict, structured reward logic wins
Recommended Backend Stack
Node.js
TypeScript
Next.js API routes or equivalent backend service layer
PostgreSQL
Supabase Auth or equivalent
Prisma or Drizzle
provider-agnostic LLM adapter
Expected Backend Modules
Organize code into clear modules such as:
auth
wallet
cards
merchants
offers
recommendation engine
LLM providers
admin
logs
shared types
validation
Required Backend Data Areas
The backend must maintain structured data for:
users
user cards
cards
category multipliers
merchant mappings
merchant aliases
merchant-specific benefits
offers
recommendation logs
admin audit logs
API Direction
Support endpoints for:
auth
wallet management
supported card lookup
recommendation queries
recommendation history
offers
admin updates
Query Handling Rules
The backend should support questions like:
Which card should I use at Loblaws?
Best card for groceries?
Best card for gas?
Best card for a domestic Air Canada flight?
Do I have any Starbucks offers?
The system should extract:
merchant
category
travel intent
domestic or international signal
offer lookup intent
Privacy Rules
Never store or request:
bank usernames
bank passwords
card numbers
CVV
aggregation tokens
bank statement data
Allowed storage:
user profile data
selected cards
recommendation history
structured card and offer data
Coding Standards
use TypeScript
use strongly typed interfaces
keep logic modular
keep recommendation logic testable
include validation and error handling
avoid putting business logic directly inside route handlers when possible
Testing Standards
Include:
scoring logic tests
merchant mapping tests
API endpoint tests
fallback tests for LLM failures
validation tests for sensitive field rejection
Logging Standards
Track:
query input
parsed result
chosen card
ranked cards
LLM provider used
latency
failures
admin changes
Change Management Rule
For any non-trivial backend change, the agent should:
propose the implementation plan first
wait for approval
then implement in the agreed order
summarize exactly what changed after completion
One-Line Rule
Plan first, get approval second, code third.

