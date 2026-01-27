# **Product Requirements Document (PRD)**

## **Rhythmé – Premium MVP V1**

---

## 1. Product Overview

### Product Name

**Rhythmé**

### Product Type

Web-based Productivity & Emotional Intelligence Platform

### Product Stage

Premium MVP (V1)

### Target Release

~6 months from development start

### Primary Goal (MVP)

Deliver a **unified, emotionally-aware productivity system** that helps users **execute consistently** without overwhelm — while laying a **scalable foundation** for AI-driven direction (NBAE) in future versions 

---

## 2. Problem Statement

Modern productivity tools fail at the **most critical moment**:
👉 *“What should I do right now?”*

Users face:

* Fragmented tools (tasks, habits, journaling, focus all separate)
* Decision fatigue from long task lists
* Zero emotional awareness
* No intelligence about *patterns*, only logs

**Rhythmé solves this by**:

* Unifying execution + emotion
* Reducing cognitive load
* Surfacing clarity, not clutter

---

## 3. Target Users

### Primary Users

* Students (18–25)
* Young professionals (22–35)
* Freelancers & solo builders

### User Characteristics

* Ambitious but inconsistent
* Emotionally affected by stress, burnout, motivation swings
* Wants structure **without** complexity
* Values privacy and clean design

---

## 4. Product Principles (Non-Negotiable)

1. **Clarity > Features**
2. **Emotion-aware, not emotion-heavy**
3. **Minimal setup, immediate value**
4. **Privacy-first by design**
5. **Premium feel, not experimental**

If a feature violates any of these → it does NOT go into MVP.

---

## 5. In-Scope Features (MVP V1)

### 5.1 Dashboard (Command Center)

**Purpose:**
Reduce decision fatigue at first glance.

**Must Have**

* Today’s tasks
* Active habits + streaks
* Mood input (simple)
* Quick journal entry
* Daily reflection prompt
* Lightweight productivity summary

**Success Metric**

* User understands “today” in <10 seconds

---

### 5.2 Task Management

**Purpose:**
Execution engine.

**Functional Requirements**

* CRUD tasks
* Priority levels
* Due dates
* Categories/tags
* Completion tracking
* Sorting & filtering

**Non-Goals**

* Dependencies
* Kanban boards
* Team tasks

---

### 5.3 Habit Tracking

**Purpose:**
Identity & consistency building.

**Functional Requirements**

* Habit creation (daily/weekly/custom)
* One-tap completion
* Streaks
* Calendar heatmap
* Rule-based “at risk” detection

**Success Metric**

* ≥60% of users log habits at least 3×/week

---

### 5.4 Journaling + Mood

**Purpose:**
Emotional awareness layer.

**Functional Requirements**

* Daily journal entries
* Mood tagging
* Sentiment labeling (positive/neutral/negative)
* Mood history visualization
* Weekly emotional summary

**Privacy Requirement**

* Journal content encrypted
* Sentiment stored as metadata only

---

### 5.5 Weekly System

**Purpose:**
Reflection + direction without AI overreach.

**Functional Requirements**

* Weekly plan
* Weekly review
* Wins & challenges
* Simple correlations (habit ↔ mood ↔ tasks)

---

### 5.6 Focus Mode (Basic)

**Purpose:**
Support deep work without distraction.

**Functional Requirements**

* Pomodoro timer
* Session logging
* Optional task association

**Explicitly Excluded**

* Focus rooms
* Social co-working
* Music AI

---

### 5.7 Onboarding

**Purpose:**
Immediate personalization without friction.

**Flow**

1. Goals
2. Habits selection
3. Mood baseline
4. Theme choice
5. Dashboard ready

**Target**

* Time to complete onboarding: <3 minutes

---

### 5.8 Settings & Account

**Requirements**

* Theme selection
* Notification preferences
* Data export
* Account deletion
* Secure auth

---

### 5.9 AI (MVP-Light)

**Purpose:**
Support insight, not decision-making (yet).

**Included**

* Daily summary
* Weekly summary
* Simple habit insights

**Explicitly Excluded**

* Next Best Action Engine (NBAE)
* Goal decomposition
* Action recommendations

These are **post-MVP** by design 

---

## 6. Out of Scope (Hard No for MVP)

* Music engine
* Focus rooms
* Community features
* Social sharing
* Advanced ML predictions
* Native mobile apps

This protects velocity.

---

## 7. Technical Requirements

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind + shadcn/ui

### Backend

* Supabase (Auth, DB, RLS)
* PostgreSQL

### AI / ML

* Lightweight sentiment analysis
* Rule-based habit risk logic
* Python services isolated

### Deployment

* Vercel (frontend)
* Supabase (backend)

---

## 8. Non-Functional Requirements

### Performance

* Dashboard load <1.5s
* No blocking AI calls on UI

### Security

* Row Level Security
* Client-side encryption for journals
* GDPR-style data deletion

### Scalability

* Modular services
* Future NBAE-compatible schema

---

## 9. Success Metrics (MVP)

### Activation

* ≥70% complete onboarding

### Retention

* Week-2 retention ≥30%

### Engagement

* Avg. 3 sessions/day
* ≥4 habits logged/week

### Monetization Readiness

* Clear premium boundaries
* Theme & AI insights gated

---

## 10. Risks & Mitigations

| Risk               | Mitigation          |
| ------------------ | ------------------- |
| Feature creep      | Hard scope lock     |
| Over-AI ambition   | NBAE deferred       |
| Team inconsistency | Weekly deliverables |
| UX overwhelm       | Minimal defaults    |

---

## 11. Future Roadmap (Post-MVP)

* Next Best Action Engine (NBAE)
* Goal decomposition
* Identity workspaces
* Focus rooms
* Music intelligence

These are **evolution**, not MVP.

---

## 12. Final Product Definition (One Sentence)

> **Rhythmé is a premium productivity OS that unifies tasks, habits, and emotional awareness to help ambitious people execute consistently — without overwhelm.**

One-line internal rule

> Rhythmé V1 organizes reality. 

> Rhythmé V2 interprets reality.

Razor-sharp product sentence

> “Rhythmé turns mental clutter into a clear next step.”