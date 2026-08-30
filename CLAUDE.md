@AGENTS.md

# Shiloh's Home School OS

A private, single-family web app for managing our homeschool: curriculum/lesson planning,
scheduling and attendance, grades/records, and a resource library. Built for our family only
(not a multi-tenant product) — each family member gets their own login.

## Stack
- Frontend: Next.js (App Router, TypeScript, Tailwind), deployed on Vercel
- Backend: Supabase (Postgres + Auth + Storage), free tier
- Auth: Supabase Auth — one login per family member (parent + each kid)
- File storage: Supabase Storage (worksheets, scanned work, resource library files)

## Structure
- `src/app/` — Next.js App Router pages/routes
- `business-plan/business-plan.md` — working plan (source of truth Claude edits)
- `business-plan/facts.yaml` — key numbers/dates/assumptions, cheap for Claude to read
- `research/` — notes on state homeschool reporting requirements, curriculum approaches, etc.
- `AGENTS.md` — Next.js-version-specific agent guidance, auto-maintained by `next dev`; do
  not hand-edit, just commit it as generated
- (once more code exists) `.claude/rules/` — area-specific conventions, added once needed

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npx supabase db push` — apply database migrations (once Supabase project exists)

## Conventions
See `.claude/rules/` for anything beyond the high-level. Keep this file short — move
specifics there once it stops fitting comfortably here.

## Status
Infrastructure complete: Next.js scaffolded, Supabase connected, GitHub synced, deployed on
Vercel at https://homeschool-os-delta.vercel.app (auto-deploys on push to main).

This is now a from-scratch rebuild of the "HomeSchool OS" system Thomas ran conversationally
in a Claude Project — see `docs/CLAUDE_CODE_KICKOFF_PROMPT.md` for the full brief and
`docs/00`–`16` for the 19-document source system it digitizes. `DECISIONS.md` is the running
architecture/decision log — check it before assuming a design choice needs revisiting.

All 10 migrations under `supabase/migrations/` are applied to the live Supabase project
(`bmshehijapxuismaxsaf`) and in sync (`npx supabase migration list` to confirm). Auth is
Supabase email magic link + Google OAuth (`src/app/login/`), gated by an `invites` table a
parent populates at `/family` — no more single shared login. `src/proxy.ts` refreshes the
session and protects `/curriculum`, `/dashboard`, `/family`, `/courses`, `/north-star`,
`/mansion`, `/work-ladder`. Server clients live in `src/lib/supabase/server.ts`. RLS is the real enforcement layer
everywhere (app-level `requireParent()`/`requireFamilyMember()` in `src/lib/auth.ts` is
defense-in-depth, not the primary gate) — see DECISIONS.md's 2026-08-29 RLS hardening entry
for a real bug this caught.

Built so far:
- `/curriculum` — subjects/units/lessons (Mind & Mastery only): add a subject, add a unit
  under a subject, add a lesson under a subject or into a unit, set lesson status.
- `/dashboard` — Doc 04 §2's full spec: Circle Snapshot (5 quadrant 0–10 scores, weekly),
  This Week's Missions, Evidence Inbox, Mentor Session Log (Doc 02 Knights/Squires), Open
  Contracts (Doc 00 §7 / Doc 04 §3 pattern).
- `/family` — parent-only: invite a family member (email/name/role), view roster.
- `/courses` + `/courses/[courseId]` — reusable Course/CourseUnit model (kickoff prompt's
  data model, seeded with Doc 14's The Kitchen: 8 units + capstone). Per-unit status +
  evidence-link tracking in `course_unit_progress`. New courses are added via a migration
  for now (no authoring UI yet — see DECISIONS.md's Milestone 3 entry for why).
- `/north-star` — Doc 07: Horizon Ladder (50yr → monthly target, append-only so old
  versions stay visible instead of being overwritten), Interest Ledger (the Five Audits),
  Fork Log (two-way/one-way decision points).
- `/mansion` — Doc 08: Study Shelves (books), Screening Room (videos), Practice Room
  (recurring habits), Toolshed (apps/platforms — Shiloh can propose, Thomas signs off
  before setup via a dedicated action, separate from status), and The Gallery (finished
  work — one of the two most important read surfaces per Doc 08, alongside the evidence
  log). Empty by design until real items get added through the page.
- `/work-ladder` — Doc 13: Home Job (job description, Extras Menu, weekly log with a
  computed HTeaO-readiness streak per Doc 13 §3.4) and the HTeaO Work Log (Rung 1). The
  Home Job Contract itself reuses `/dashboard`'s Open Contracts (the existing `contracts`
  table), not a new table.

Next steps: course-authoring UI (or seed Gym/Panel too), Diagnostic Assessment (Doc 09),
The Studio (Doc 11), Work Exposure & Apprenticeship Explorer (Doc 10).
