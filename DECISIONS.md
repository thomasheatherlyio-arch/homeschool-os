# Architecture & Decision Log

Running log of decisions that shape the app's direction — the kind a future session
shouldn't have to rediscover by reading old chat transcripts. Day-to-day implementation
choices (a component's props, a query's shape, a Tailwind class) don't belong here — this
is for things that would be expensive to silently redo differently later: stack choices,
schema/data-model direction, integration approach for something with real trade-offs,
anything that closes off an alternative.

Format: date, the decision, what else was considered, why, and current status (a decision
can later be revisited — mark it superseded rather than deleting the entry).

---

## 2026-08-29 — Stack: Next.js + Supabase (continue, don't re-platform)

**Decision:** Build the full HomeSchool OS app (per `docs/CLAUDE_CODE_KICKOFF_PROMPT.md` —
kept alongside `docs/00`–`16` as the project brief) on the Next.js (App Router) + Supabase
(Postgres/Auth/Storage) + Vercel stack already scaffolded, rather than re-platforming.

**Alternatives considered:**
- Next.js + Prisma + Neon Postgres + NextAuth — more conventional/portable, but Supabase
  Auth already supports requesting extra Google OAuth scopes (for future Drive/Docs
  access), so NextAuth wins nothing concrete here. Would mean rebuilding working
  auth/RLS/storage by hand for portability that doesn't matter for a 2-user private tool.
- Python (FastAPI/Django) backend + Postgres, separate frontend — best fit *if* the
  Drive/Docs-parsing and quiz/NLP glue work (Phase 2) becomes the dominant complexity.
  Costs a second runtime, loses Vercel's single-deploy simplicity, duplicates work already
  done. Worth revisiting specifically for that one component if it grows large, not as a
  whole-app rewrite.

**Why:** Postgres fits this system's deeply cross-referential data model (Missions↔
Quadrants↔Evidence↔Mentors↔Courses) well; RLS gives real per-user security once Shiloh has
his own login; free tier covers a 2-user app indefinitely; auth + a first feature
(`/curriculum`) were already built and verified working this session.

**Status:** Active.

---

## 2026-08-29 — Data model: layer the new system on top of the existing curriculum tables

**Decision:** Keep `subjects`/`units`/`lessons` (built earlier this session) as-is — a
Mind & Mastery-only content tracker. Add `quadrants`, `quadrant_scores`, `missions`, and
`evidence_log_entries` as the new cross-cutting core described in the kickoff prompt.
Reconciling `Course`/`CourseUnit` (for the Kitchen/Gym/Panel-style structured courses,
Doc 05's roadmap component 1) against the existing curriculum tables is explicitly deferred
to a later milestone rather than decided now.

**Alternatives considered:**
- Fold curriculum into the new model immediately (subjects→Course, lessons→CourseUnit) —
  more schema churn before Milestone 1 ships, for a unification that doesn't block Missions
  or the Evidence Log from working.
- Deprecate curriculum, rebuild Mind & Mastery tracking inside the new model — cleanest
  long-term shape, but throws away tested, working code for no immediate functional need.

**Why:** Missions and the Evidence Log are the actual spine of the weekly rhythm (Doc 04);
neither depends on how course content ends up modeled. Evidence entries get an optional
`subject_id` link into the existing table so the two systems already talk to each other
without forcing the harder Course/CourseUnit design question now.

**Status:** Active. Revisit when building out Kitchen/Gym/Panel as structured courses.

---

## 2026-08-29 — NotebookLM: manual workflow, not an API integration

**Decision:** The YouTube→NotebookLM-overview→quiz loop (Doc 05 component 3, Doc 08 §7,
Doc 11 §8) stays a human-in-the-loop workflow. The app's job is capturing the *result*
(a link to the deck/recording, the quiz outcome Shiloh reports, a timestamp) as an
`evidence_log_entries` row — not driving NotebookLM itself.

**Verified 2026-08-29 (web search, not assumed from training data):**
- Consumer NotebookLM (what Thomas's account actually is) has no public API.
- Google's real "Gemini Notebook Enterprise API" (Sept 2025) is a different product —
  Google Cloud/Workspace enterprise licensing, still Preview, doesn't reach a personal
  consumer notebook.
- Unofficial reverse-engineered libraries (`notebooklm-py` etc.) work today per community
  reports, but carry real ToS/account risk against Thomas's personal Google account and no
  stability guarantee — not something to build a load-bearing pipeline on.
- Legitimate third-party alternatives (e.g. AutoContent API) do a similar underlying job
  but are not NotebookLM — swapping tools would change an already-established workflow
  choice from Docs 08/11, not just an implementation detail.

**Status:** Active. Google has publicly acknowledged demand for a consumer API — recheck
this periodically (e.g. whenever this workflow becomes a real bottleneck), not on a fixed
schedule.

---

## 2026-08-29 — Milestone 1 scope

**Decision:** `quadrants` (5 fixed rows) + `quadrant_scores` + `missions` +
`evidence_log_entries` tables; extend auth so Thomas and Shiloh each get their own login
(via an `invites` table a parent populates, rather than everyone auto-provisioning as
parent) instead of today's one-shared-login state; a `/dashboard` page reading real data
for Doc 04 §2's first three sections (This Week's Missions, Circle Snapshot, Evidence
Inbox). Mentor Session Log and Open Contracts (which need `mentors`/`contracts` tables)
are Milestone 2.

**Status:** Active — in progress.
