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

First feature built: curriculum planning.
- Schema: `supabase/migrations/20260829120000_curriculum_schema.sql` — family_members,
  subjects, units (optional grouping), lessons (status: not_started/in_progress/complete).
- Auth: Supabase Auth email magic link, one shared login only for now (not yet one per
  family member — that's still the target per Stack above). `src/proxy.ts` refreshes the
  session and gates `/curriculum`; `src/app/login/` sends the link; `src/app/auth/callback/`
  exchanges it for a session and provisions the account's `family_members` row as 'parent'
  on first sign-in. Server clients live in `src/lib/supabase/server.ts` (no browser client
  yet — add one if a Client Component ever needs it).
- RLS: `supabase/migrations/20260829130000_curriculum_rls_auth.sql` switches
  subjects/units/lessons from the first migration's open policies to family-aware ones (any
  signed-in family member can view, only a parent can write).
- Neither migration is applied yet — run `npx supabase link --project-ref
  bmshehijapxuismaxsaf` then `npx supabase db push`. Also add
  `http://localhost:3000/auth/callback` and
  `https://homeschool-os-delta.vercel.app/auth/callback` to Supabase's Authentication → URL
  Configuration → Redirect URLs, or the magic link will be rejected.
- Page: `/curriculum` (`src/app/curriculum/`) lists subjects with their lessons, lets you
  add a subject and add a lesson under a subject, and sign out.
- Next steps: per-family-member logins (kids too, with role-appropriate access), unit-level
  UI, marking lesson status from the page.
