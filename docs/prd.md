# Product Requirements Document (PRD)

## Rhythmé – Premium MVP V1

### Created by: oopsvincent
#### Updated on: 02/23/2026

### 1. Product Overview 

**Product Name**  
Rhythmé

**Product Type**  
Web-based Productivity & Emotional Intelligence Platform

**Product Stage**  
Premium MVP (V1)

**Target Release**  
6-7 months from development start (with 3-week buffer for AI/UX testing)

**Primary Goal (MVP)**  
Deliver a unified, emotionally-aware productivity system that helps users execute consistently without overwhelm — while laying a scalable foundation for AI-driven direction (NBAE) in future versions

### 2. Problem Statement

Modern productivity tools fail at the most critical moment:  
"What should I do right now?"

Users face:  
- Fragmented tools (tasks, habits, journaling, focus all separate)  
- Decision fatigue from long task lists  
- Zero emotional awareness  
- No intelligence about patterns, only logs  

**Rhythmé solves this by:**  
- Unifying execution + emotion  
- Reducing cognitive load  
- Surfacing clarity, not clutter  

### 3. Target Users

**Primary Users**  
- Students (18-25)  
- Young professionals (22-35)  
- Freelancers & solo builders  

**User Characteristics**  
- Ambitious but inconsistent  
- Emotionally affected by stress, burnout, motivation swings  
- Wants structure without complexity  
- Values privacy and clean design  

### 4. Product Principles (Non-Negotiable)

1. Clarity > Features  
2. Emotion-aware, not emotion-heavy  
3. Minimal setup, immediate value  
4. Privacy-first by design  
5. Premium feel, not experimental  

If a feature violates any of these → it does NOT go into MVP.

### 5. In-Scope Features (MVP V1)

#### 5.1 Dashboard (Command Center)

**Purpose:**  
Reduce decision fatigue at first glance.

**Must Have**  
- Today's tasks  
- Active habits + streaks  
- Mood input (simple)  
- Quick journal entry  
- Daily reflection prompt  
- Lightweight productivity summary  

**Success Metric**  
- User understands “today” in <10 seconds  

#### 5.2 Task Management

**Purpose:**  
Execution engine.

**Functional Requirements**  
- CRUD tasks  
- Priority levels  
- Due dates  
- Categories/tags  
- Completion tracking  
- Sorting & filtering  

**Non-Goals**  
- Dependencies  
- Kanban boards  
- Team tasks  

#### 5.3 Habit Tracking

**Purpose:**  
Identity & consistency building.

**Functional Requirements**  
- Habit creation (daily/weekly/custom)  
- One-tap completion  
- Streaks  
- Calendar heatmap  
- Rule-based "at risk" detection  

**Success Metric**  
- ≥60% of users log habits at least 3x/week  

#### 5.4 Journaling + Mood

**Purpose:**  
Emotional awareness layer.

**Functional Requirements**  
- Daily journal entries  
- Mood tagging  
- Sentiment labeling (positive/neutral/negative)  
- Mood history visualization  
- Weekly emotional summary  

**Privacy Requirement**  
- Journal content encrypted  
- Sentiment stored as metadata only  

#### 5.5 Weekly System

**Purpose:**  
Reflection + direction without AI overreach.

**Functional Requirements**  
- Weekly plan  
- Weekly review  
- Wins & challenges  
- Simple correlations (habit ↔ mood ↔ tasks)  

#### 5.6 Focus Mode (Basic)

**Purpose:**  
Support deep work without distraction.

**Functional Requirements**  
- Pomodoro timer  
- Session logging  
- Optional task association  

**Explicitly Excluded**  
- Focus rooms  
- Social co-working  
- Music AI  

#### 5.7 Onboarding

**Purpose:**  
Immediate personalization without friction.

**Flow**  
1. Goals  
2. Habits selection  
3. Mood baseline  
4. Theme choice  
5. Dashboard ready  

**Target**  
- Time to complete onboarding: <3 minutes  

#### 5.8 Settings & Account

**Requirements**  
- Theme selection  
- Notification preferences  
- Data export  
- Account deletion  
- Secure auth  

#### 5.9 AI (MVP-Light)

**Purpose:**  
Support insight, not decision-making (yet).

**Included**  
- Daily summary  
- Weekly summary  
- Simple habit insights  
- Optional: Rule/ML-based correlations (e.g., habit streaks ↔ mood) if velocity allows  

**Explicitly Excluded**  
- Next Best Action Engine (NBAE)  
- Goal decomposition  
- Action recommendations  

These are **post-MVP** by design

### 6. Out of Scope (Hard No for MVP)

- Music engine  
- Focus rooms  
- Community features  
- Social sharing  
- Advanced ML predictions  
- Native mobile apps  

This protects velocity.

### 7. Technical Requirements

**Frontend**  
- Next.js (App Router)  
- TypeScript  
- Tailwind + shadcn/ui  

**Backend**  
- Supabase (Auth, DB, RLS)  
- PostgreSQL  

**AI / ML**  
- Lightweight sentiment analysis  
- Rule-based habit risk logic  
- Python services isolated  

**Deployment**  
- Vercel (frontend)  
- Supabase (backend)  

### 8. Non-Functional Requirements

**Performance**  
- Dashboard load <1.5s  
- No blocking AI calls on UI  

**Security**  
- Row Level Security  
- Client-side encryption for journals  
- GDPR-style data deletion  

**Scalability**  
- Modular services  
- Future NBAE-compatible schema  

### 9. Success Metrics (MVP)

**Activation**  
- ≥50% complete onboarding  

**Retention**  
- Week-2 retention ≥20%  

**Engagement**  
- Avg. 2 sessions/day  
- ≥3 habits logged/week  

**Monetization Readiness**  
- Clear premium boundaries  
- Theme & AI insights gated  

### 9.5 Monetization Model

**Model:** Freemium with subscription tiers. This balances acquisition (free tier for trials) with revenue (premium upsells on high-value features), aligning with 2025-2026 benchmarks where freemium conversions drive 2-5% upgrades in AI productivity apps, with top performers at 6-8%. Subscriptions ensure recurring revenue, focusing on retention over one-time sales.

**Free Tier:**  
- Basic tasks (limited to 10 active)  
- Basic habits (limited to 5 active)  
- Mood input and journaling (no visualizations or summaries)  
- Dashboard (core view only, no AI summaries)  
- Onboarding and settings (basic themes only)  
- Focus mode (basic timer, no logging)  
**Goal:** Hook users with immediate value (principle #3), targeting 50% activation. Limits encourage upgrades without friction.

**Premium Tier ($9/mo or $90/year):**  
- Unlimited tasks/habits  
- AI summaries (daily/weekly)  
- Mood visualizations and correlations  
- Advanced themes  
- Focus session logging  
- Priority support (e.g., faster data exports)  
**Rationale:** Gates AI insights as upsells, matching trends where AI features convert 15-25% of users in productivity tools. Pricing at $9/mo hits sweet spot for consumer apps (e.g., Todoist, Calm), avoiding margin erosion from AI costs (up to 70% reported). Annual option boosts LTV by 20-30% via discounts.

**Projected Metrics:**  
- Conversion Rate: 3-5% (conservative benchmark for new AI apps).  
- ARPU: $2-3/mo overall (assuming 100 users: 95 free, 5 premium at $9/mo).  
- LTV: $50-80 over 12 months (factoring 15% monthly churn).  
- Revenue Per Install (60-day): ~$0.50 (aligned with AI productivity benchmarks).  

**Implementation Notes:**  
- Use Supabase RLS for tier enforcement (e.g., premium data access).  
- Paywall prompts: Surface during onboarding or after free limits (e.g., "Unlock AI insights?").  
- Testing: A/B trials in beta; monitor via analytics.  
- Risks: Low conversion if free too generous—mitigate with subtle nudges, not aggression.

This model prioritizes trust and retention, avoiding ads or usage-based (risky for light AI).

### 10. Risks & Mitigations

| Risk              | Mitigation              |
|-------------------|-------------------------|
| Feature creep     | Hard scope lock         |
| Over-AI ambition  | NBAE deferred           |
| Team inconsistency| Weekly deliverables     |
| UX overwhelm      | Minimal defaults        |

### 11. Future Roadmap (Post-MVP)

- Next Best Action Engine (NBAE)  
- Goal decomposition  
- Identity workspaces  
- Focus rooms  
- Music intelligence  

These are evolution, not MVP.

### 12. Final Product Definition (One Sentence)

Rhythmé is a premium productivity OS that unifies tasks, habits, and emotional awareness to help ambitious people execute consistently — without overwhelm.