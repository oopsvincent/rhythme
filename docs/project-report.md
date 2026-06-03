# Rhythme Project Report

**Project:** Rhythme  
**Version in codebase:** `0.67.0`  
**Type:** Web-based productivity and emotional-awareness platform  
**Current repo status reviewed:** May 30, 2026

## 1. What the product is

Rhythme is a premium productivity system that combines execution tools and self-awareness tools in one app. Its core promise is to help users stay consistent without overwhelm by unifying tasks, habits, journaling, mood tracking, focus sessions, weekly planning, and light AI-assisted workflows inside one calmer workspace.

The product is positioned less like a generic task manager and more like a personal operating system. The idea repeated across the PRD, onboarding docs, landing content, and app structure is:

- reduce decision fatigue
- connect productivity with emotion and reflection
- keep the experience premium, minimal, and privacy-conscious
- build toward future AI guidance without making MVP feel like an experimental AI toy

## 2. Product thesis

Rhythme is built around a simple problem: most productivity tools track activity but do not answer, in a grounded way, what matters now or how the user is actually doing. This product tries to close that gap by combining:

- execution: tasks, habits, focus
- awareness: journaling, mood, reflection
- rhythm: weekly planning and review
- direction: onboarding tied to one primary goal/workspace
- monetization: premium gates around higher-value insights, customization, and advanced usage

## 3. Target users

Primary audience described in product docs:

- students
- young professionals
- freelancers
- solo builders / ambitious individual users

Common user traits:

- ambitious but inconsistent
- affected by stress, burnout, and motivation swings
- wants structure without tool sprawl
- values clarity, clean design, and privacy

## 4. Core product principles

The strongest recurring product rules are:

- clarity over feature overload
- emotion-aware, not emotion-heavy
- minimal setup with immediate value
- privacy-first by design
- premium feel over experimental feel

## 5. What exists in the app today

The repo shows a broad working surface area, not just a concept site.

### Public/marketing surface

- landing page
- features page
- pricing page
- about page
- beta page
- legal pages for privacy, terms, cookie policy

### Authentication and account

- login
- signup intro and account creation flow
- auth callback and reset-password flow
- logout page
- account update-password page
- secure auth via Supabase

### Main app areas

- dashboard
- tasks
- habits
- journal
- journal insights
- mood
- activity
- focus
- focus history
- weekly
- goals
- AI page
- full settings area with many subsections

### Settings surface

- account
- profile
- appearance
- theme
- custom themes
- notifications
- privacy
- security
- connections
- onboarding
- billing
- billing history
- subscription
- delete account

## 6. Functional modules

### Dashboard

The dashboard acts as the command center. Current code and changelog indicate it includes:

- today-oriented overview
- quick actions
- task and habit summaries
- mood and journal widgets
- productivity charts
- weekly widget
- activity feed
- reflection prompts
- greeting/personalization
- right sidebar calendar and activity inspector

### Tasks

Task management is a core execution layer with dedicated pages and detail views. Current architecture suggests support for:

- task creation, editing, completion, deletion
- slugs/detail pages
- filtering/sorting
- due dates and organization metadata
- dashboard/task integration
- premium/free usage-limit checks

### Habits

Habits are one of the most developed systems in the repo. Current implementation includes:

- habit creation and editing
- active/inactive habit handling
- unified frequency model using `frequency_num`, `target_count`, and `period`
- period-based completions instead of older daily/weekly split
- streak logic
- habit detail pages
- heatmap visualization
- daily activity inspector integration
- optimistic UI updates
- rule-based prediction/risk-oriented utilities
- free-tier active habit limits

### Journaling

Journaling is both a reflection feature and a data source for insight features. Current codebase includes:

- journal list page
- new journal flow
- journal detail page
- journal insights page
- sentiment-related utilities
- storage helpers
- encryption-related logic and passphrase flows
- journal usage-limit checks for free users

### Mood tracking

Mood is treated as lightweight emotional logging, not therapy tooling. Current implementation includes:

- mood logging
- mood history page
- mood selector components
- mood charts/sparklines
- weekly mood correlation inputs
- free-tier daily limit checks

### Focus mode

Focus mode supports deep work and timing workflows. Current implementation includes:

- focus page
- active timer
- session detail page
- focus history
- focus audio helper
- focus storage utilities
- floating focus widget
- session completion UI
- optional linkage to broader productivity context

### Weekly system

Weekly planning/review is already represented in both docs and shipped route structure. Current signals indicate:

- weekly page
- weekly plan/review/history logic in actions
- weekly widget on dashboard
- review carousel UI
- mood sparkline
- correlation cards
- habit/mood/task summary logic
- calm reflective workflow rather than dense analytics

### Notifications

The app includes a notification system with:

- notification popover
- unread badge
- polling
- mark-one and mark-all-as-read flows
- browser notification prompt components
- push subscription endpoints

### Premium and billing

Premium is not just planned; it is actively wired into the app:

- subscription status server actions
- Dodo Payments checkout creation
- webhook handling
- billing and subscription settings pages
- entitlement checks
- feature/usage gating
- premium gate modal

### AI and ML direction

AI exists in two different states:

- practical backend hooks already present:
  - AI health endpoint
  - onboarding generation endpoint
  - sentiment and habit-prediction utilities
  - ML warm-service hooks
- future-facing product layer still partly aspirational:
  - AI agent page
  - Next Best Action Engine concepts
  - roadmap/agent mock interactions

Important distinction: the dedicated AI page currently reads like an in-development showcase rather than a fully production-backed agent workflow.

## 7. Onboarding and workspace model

One of the most important product decisions in the repo is the move toward a **single primary goal workspace**.

Onboarding docs define this model clearly:

- user enters one main goal
- that goal becomes the workspace anchor
- generated starter tasks and habits orbit that goal
- tasks can act as practical sub-goals
- commitment screen frames the shift from setup to action

This is a key product identity choice because it makes Rhythme feel more directional than a normal planner.

## 8. Business model

Rhythme is designed as a freemium subscription product.

Product docs and code together show:

- free tier with usage caps
- premium tier for unlimited or expanded use
- billing via Dodo Payments
- monthly and yearly plan support
- premium-gated AI/insight/customization-style value

Current code-level limit examples:

- journals: 1 per day for free users
- tasks: 10 per day for free users
- habits: 3 active habits for free users
- mood logs: 1 per day for free users

This is important because the current implementation is stricter than some older PRD examples, so the product has clearly evolved.

## 9. Technical architecture

### Frontend

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui and Radix-based UI primitives
- Framer Motion for richer UI motion
- TanStack Query and Zustand for client state/data flows

### Backend and data

- Supabase Auth
- Supabase/PostgreSQL
- row-level security patterns
- server actions for core app workflows
- Supabase migrations for evolving product schema

### Payments and delivery

- Dodo Payments
- Vercel Analytics
- Vercel-style deployment assumptions

### PWA and device behavior

- web app manifest
- service worker registration
- offline indicator
- install prompt support
- Apple splash screens
- standalone app configuration

## 10. Privacy and security posture

Privacy is a visible part of the product positioning and implementation. Evidence in the repo includes:

- journal encryption flows and passphrase handling
- metadata-first sentiment handling direction in docs
- secure auth flows
- account deletion flows with explicit server-side cleanup
- privacy/legal sections
- row-level access control patterns via Supabase

## 11. Product maturity summary

Rhythme is beyond the idea stage. It is already a substantial product with:

- a real authenticated application
- multiple connected productivity modules
- a premium subscription layer
- PWA support
- weekly systems and notifications
- active schema evolution and documented release history

At the same time, some of the most differentiated “intelligence” positioning is still emerging rather than fully shipped. The strongest current value is the integrated productivity + reflection stack, while the strongest future value is the AI-guided, goal-centered workspace model.

## 12. Concise definition

Rhythme is a premium web productivity OS for individuals that combines tasks, habits, journaling, mood, focus, and weekly reflection into one privacy-conscious workspace, with monetized premium features and an in-progress path toward AI-guided goal execution.
