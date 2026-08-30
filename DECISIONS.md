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

**Status:** Complete — shipped 2026-08-29.

---

## 2026-08-29 — Milestone 2: Mentor Session Log + Open Contracts

**Decision:** `mentors` (Doc 02 Knights/Squires roster), `mentor_sessions` (date, mentor,
quadrant, notes, resulting action), and `contracts` (the reusable Doc 00 §7 / Doc 04 §3
pattern — student commitment, provider commitment, definition of done, review date,
active/completed status) tables, plus two more `/dashboard` sections completing Doc 04
§2's spec: Mentor Session Log (with an inline "add a mentor" form) and Open Contracts.

**Notable schema/RLS choices:**
- A mentor's `quadrant_id` is only a default (nullable) — the authoritative quadrant tag
  lives on each `mentor_sessions` row, so a dual-seat mentor like Jahari (basketball +
  zen) can log sessions against either quadrant even though he's one mentor row, per
  Doc 02's explicit instruction that this should work.
- `mentors` write access is `is_family_member()`, not parent-only — deliberately
  different from every other write-gated table in this schema. Doc 02 explicitly gives
  Shiloh standing authority to add/swap/drop a mentor seat without Thomas's sign-off
  first, unlike Doc 00 §6's heavier "Shiloh proposes, Thomas approves" language for
  Docs 01/04/05 changes generally. Deletes stay parent-only either way (evidence-erasure
  pattern kept consistent with the rest of the schema).
- Didn't build a propose/approve workflow for any of Docs 01/02/04/05's amendment
  protocol (Doc 00 §6) — read the literal instructions per-doc instead (mentors: no
  approval needed; quadrants/subjects: parent-only, matching existing Milestone-1
  choices) rather than building a general state machine nobody asked for yet.
- `contracts.status` is just `active`/`completed` — Doc 00 §7's breach/remedy language
  is explicitly a conversation-driven process ("the first response to breach is
  diagnosing the system failure"), not something to encode as a rigid state machine.

**Status:** Complete — shipped 2026-08-29.

---

## 2026-08-29 — RLS hardening after code review (post-merge)

**Decision:** `/code-review` against the auth+curriculum+dashboard work already merged to
`main` surfaced that the `family_members` RLS policies didn't actually enforce the invite
system — `insert`/`update` only checked `id = auth.uid()`, with no constraint on `role`, so
any authenticated Supabase account (no invite needed to get a session at all —
`signInWithOtp` allows sign-up) could self-insert or self-update to `role: 'parent'`
directly via the client, bypassing the invite check entirely (that check only existed in
`src/app/auth/callback/route.ts`, application code, not the database). `family_members`
SELECT was also `using (true)` — readable by any authenticated account, not just real
family members. Fixed in `supabase/migrations/20260829150000_rls_hardening.sql`:
insert now requires a matching `invites` row (same email, same role); update allows a
parent to change anything, but a self-update can't change your own `role`; select is
scoped to real family members (or your own row). Doing this required making
`is_family_member()`/`is_parent()` `security definer` — a plain (`security invoker`)
function checking `family_members` from within `family_members`' own SELECT policy would
recurse infinitely once that policy calls the function.

Also fixed in the same pass: an open redirect in `/auth/callback` (`next` query param fed
unsanitized into `new URL(next, request.url)` — closed with a shared `safeRedirectPath`
allowlist-style helper in `src/lib/auth.ts`, used by both the callback route and the
`/login` actions that originate `next`); `/curriculum`'s write actions checked
`requireUser()` instead of `requireParent()` (relied entirely on the broken RLS above for
real enforcement); the dashboard's Circle Snapshot silently showed a stale (not
necessarily this-week) quadrant score as if it were current, and could resubmit it onto
the current week; and an unbounded `quadrant_scores` query that would keep growing every
week for the life of the app (bounded to an 8-week window, which is already twice what the
UI ever displays).

**Why this matters going forward:** `src/proxy.ts`'s own comment says "the real enforcement
is Postgres RLS" — that's the intended design (app-layer `requireParent()` etc. is
defense-in-depth, not the primary gate), so an RLS gap here isn't a minor inconsistency,
it's the actual security boundary having a hole. Worth remembering for any future
table/policy: a self-referencing helper function that queries the same table its own
policy is defined on needs `security definer` from the start, not bolted on later.

**Status:** Active — fixed, migration applied.

---

## 2026-08-30 — Milestone 3: Course/CourseUnit model, seeded with The Kitchen

**Decision:** `courses` (reusable template — title, description, primary quadrant,
informational `subjects_covered` tags, active/archived) + `course_units` (ordered
unit/week within a course — number, title, teaching notes, deliverable, optional video
assignment, capstone flag) + `course_unit_progress` (per-student status/evidence-link on a
unit — the only student-specific row, since courses/units are shared templates). Seeded
with one real course, Doc 14's The Kitchen (8 units + capstone, from Doc 14 §4's actual
content) — the kickoff prompt's suggested stress-test for whatever Course/CourseUnit shape
got proposed. `/courses` lists courses with a completed/total progress bar;
`/courses/[courseId]` shows each unit with its deliverable and a status + evidence-link
form.

**Notable choices:**
- A unit's `video_assignment` is nullable and unused by the Kitchen seed — the base 8-unit
  course structures (Kitchen, Gym) don't have one per unit; that's a feature of each
  course's separate 6-week "addendum" variant (e.g. Doc 14 §13a's "Opening Night"), which
  this migration doesn't model. Worth a real look once a course actually needs to run in
  that structured weekly-video-clip shape.
- `subjects_covered` is a plain `text[]` of tag strings, not a join to the `subjects`
  table — descriptive metadata pulled from each course doc's "Texas Curriculum Tie-In"
  section, not something queried/joined against anywhere yet. Revisit as a real join if
  that changes.
- No course-authoring UI (a parent building a new Course + CourseUnits from scratch in the
  app) — adding a new course happens via a migration, same as this one's seed. Reasonable
  given there are only a handful of known courses (Docs 14–16) and they change rarely;
  worth building a real UI once that stops being true.
- Didn't build a `course_enrollments` concept (active/dropped/etc. per student) — with a
  small number of courses, showing all of them with a progress bar is simpler and avoids a
  table that's premature until course volume actually needs filtering.

**Status:** Complete — shipped 2026-08-30.
