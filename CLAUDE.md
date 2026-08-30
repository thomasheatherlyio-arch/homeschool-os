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
Scaffolded (Next.js + TypeScript + Tailwind + ESLint). Supabase project not yet created.
No routes/schema built yet.
