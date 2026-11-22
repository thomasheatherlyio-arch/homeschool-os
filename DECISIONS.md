# Decision Log

Decisions that would be expensive to silently redo. Newest first. Format: decision,
alternatives, why, status. Pre-Grok entries (from the web-app era on `main`) are kept below.

---

## 2026-11-22 — Pivot: vault-first v1, Grok for strategy, Claude for execution

**Decision:** HomeSchool OS v1 is an Obsidian vault (this branch, `post-grok`), not the Next.js
app. Grok (as COLT) is Shiloh's interface for thinking/tutoring/planning; Claude executes
handoffs once a day under Thomas's account. Git is the message bus.

**Alternatives considered:** keep building the web app (idle 3 months; heavy for 2 users);
Google Drive + Obsidian (no history/review, sync conflicts); Claude as Shiloh's direct
interface (consumer Claude is 18+); an API bridge Grok↔Claude (per-token cost, keys to manage).

**Why:** the Charter's amendment protocol maps onto PRs; markdown + AGENTS.md + skills are
tool-agnostic; flat Grok subscription + one batched Claude run keeps cost low.

**Status:** Active. Web app parked on `main` (still deployed).

---

## 2026-11-22 — Branches: `main` = pre-Grok, `post-grok` = the pivot

`main` keeps the web app + final snapshot of the Claude Project docs. `post-grok` replaced the
app with the vault (shiloh-hq history merged in). Vercel builds disabled on `post-grok`
(`vercel.json`). Revisit making `post-grok` the default branch once Grok's GitHub connector is
confirmed to read non-default branches (or if it can't).

---

## 2026-11-22 — Vault structure choices

- Courses split into `<course>-course.md` index + `sections/` (one H2 each) so a tutoring turn
  loads ~3 kB instead of up to 51 kB.
- One file per mentor seat in `60-companions/knights/` (Doc 02 stays the concept doc).
- `learner-profile.md` is evidence-only; "just talking" is never logged anywhere.
- Docs 09/10 renamed 09a/09b, 10a/10b for unique wikilinks.
- Skills in `.agents/skills/` (cross-tool standard); `.claude/skills` links to it.

---

# Pre-Grok entries (web app era)

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

---

## 2026-08-30 — North Star (Doc 07): Horizon Ladder, Interest Ledger, Fork Log

**Decision:** Three small, mostly-free-text tables rather than a big schema, per Doc 07's
own framing and the kickoff prompt's note that this system's narrative visions are "fine
as loosely-structured notes/markdown rather than rigid entities":

- `visions` — the Horizon Ladder (50/30/10/5/3-year visions, 1-year goals, quarterly
  objectives, monthly targets). **Append-only, not update-in-place** — Doc 07 §7
  explicitly expects these to be revisited and rewritten often, and overwriting would lose
  exactly the trail Doc 00 Principle 3 (evidence over assertion) cares about. "Current" for
  a horizon is just its latest row; `/north-star` shows older versions collapsed behind a
  details toggle. Weekly Missions is the existing `missions` table (Doc 04 already owns
  that horizon); "Today's Next Action" isn't modeled — a single next physical action
  decided in the moment isn't worth a stored row.
- `interest_ledger_entries` — Doc 07 §3's Five Audits (Energy/Flow/Admiration/Problem/
  Feedback) and the small bets they turn into. `result` is free text, not an enum — Doc 07
  §6 says this doesn't need to be formal.
- `fork_log_entries` — Doc 07 §5's real decision points, tagged `two_way`/`one_way` door.

**RLS note:** used the same parent-or-own-student pattern as every other student-authored
table in this schema, even though Doc 07 §1 says the vision itself is Shiloh's to write
(Thomas reviews, doesn't co-author). Treated that as a norm about how the system gets
*used*, not a hard access boundary worth a one-off asymmetric RLS rule — a parent being
technically able to add a vision entry doesn't stop Shiloh from writing his own, and
consistency with the rest of the schema is worth more here than enforcing it in the
database.

**Status:** Complete — shipped 2026-08-30.

---

## 2026-08-30 — Unit-level curriculum UI

**Decision:** No schema change — `units` and `lessons.unit_id` already existed in the
original curriculum migration (2026-08-29) but had no UI. `/curriculum` now shows each
subject's lessons grouped by unit (plus a "Not in a unit" bucket for ungrouped lessons),
lets a parent add a unit under a subject, add a lesson either directly under a subject or
into a specific unit, and set a lesson's status from the page (the last item flagged as
unaddressed back in Milestone 1's CLAUDE.md notes).

**Notable choice:** kept `setLessonStatus` and unit/lesson creation parent-only
(`requireParent()`), matching the RLS that's actually been live since the 2026-08-29
family-aware curriculum migration. `lessons.assigned_to` (and the matching
`lessons_update_own_assignment` RLS policy that would let a child update their own
assigned lesson) exists in the schema but nothing in the UI sets it yet — a lesson can't
currently be assigned to a specific family member, so that policy is presently unreachable
in practice. Out of scope for this pass; flagged here rather than silently left unexplained.

**Status:** Complete — shipped 2026-08-30.

---

## 2026-08-30 — The Mind Mansion + Gallery (Doc 08)

**Decision:** Five tables — `mansion_books` (Study Shelves), `mansion_videos` (Screening
Room), `mansion_practices` (Practice Room), `mansion_tools` (Toolshed), `gallery_items`
(The Gallery) — each its own table rather than one polymorphic table, since each has
genuinely distinct fields and status vocabularies per Doc 08. `/mansion` shows all five as
sections, matching the dashboard's established list-plus-inline-add-form pattern. No
`rooms` lookup table — the five rooms map 1:1 to the existing `quadrants` table, so a room
is just a `quadrant_id` with a display-label map (`ROOM_LABELS`) in the page component.

**Student-scoped, unlike mentors/courses:** every Mansion table has `student_id`, matching
`missions`/`evidence_log_entries`'s per-student pattern rather than Milestone 2's
mentors/courses (shared family rosters). Doc 08 frames the Mansion as explicitly personal
("Shiloh's own memory palace"), not something siblings would share the way a mentor or a
course curriculum could be — a future second kid needs their own reading list and Gallery,
not a shared one.

**Toolshed is the one write-pattern exception, matching mentors:** `mansion_tools`
insert/update uses `is_family_member()`, not the parent-or-own-student pattern every other
Mansion table uses. Doc 08 §7 explicitly gives Shiloh standing authority to *propose* a
tool candidate without Thomas's sign-off first — the sign-off gate lives in separate
`signed_off_by`/`signed_off_at` columns (set only by a dedicated parent-only `signOffTool`
action), not in the insert/update RLS itself, since Doc 08 is explicit that setup (not
proposing) is what needs sign-off, and usually because an account, personal info, or real
money is involved.

**No seed data**, unlike Milestone 3's Kitchen course seed: Mansion items are per-student,
and there's no guarantee a student's `family_members` row exists at migration-apply time
the way a student-independent course template's does. Doc 08 itself frames empty shelves
as the correct starting state ("Shelves start empty by design... not a failure"), so
leaving these tables empty is the right call, not a shortcut around a timing problem.

**Status:** Complete — shipped 2026-08-30.

---

## 2026-08-30 — The Work Ladder (Doc 13)

**Decision:** Four tables covering Rung 0 (Home Job) and Rung 1 (First Paid Job / HTeaO):
`home_job` (the job description, one row per student — job title, core duties, standard of
done, schedule), `extras_menu_items` (priced above-and-beyond tasks), `home_job_log_entries`
(weekly: duties met yes/partial/no, extras completed, pay earned, misses/consequence,
notes), `hteao_log_entries` (contacts/applications/interviews/shifts with the specific
HTeaO contact).

**Two things deliberately *not* built as new tables:**
- **The Home Job Contract (Doc 13 §2.5)** reuses the existing `contracts` table from
  Milestone 2 — Doc 13 explicitly models it "on the Founding Agreement," the same literal-
  contracts pattern `contracts` already covers. `/work-ladder` links to `/dashboard`'s Open
  Contracts section rather than duplicating contract UI.
- **The HTeaO readiness checklist (Doc 13 §3.4)** isn't stored data — Doc 13 says it should
  be "evidence-based, pulled straight from the Home Job Log," so `/work-ladder` computes a
  current consecutive-weeks-met streak directly from `home_job_log_entries` and displays it
  against Doc 13's starting 4-week target, rather than a separate table that could drift out
  of sync with the log it's supposed to summarize.

**`home_job` is update-in-place, not append-only** — unlike `visions` (North Star), which
Doc 07 explicitly expects to be rewritten often. Doc 13 §2.1 makes the opposite case for
this one: "write them down once and stop relitigating them weekly" is presented as the
actual fix for why chore systems typically fail, so a single mutable row per student fits
the doc's own intent better than a revision trail here.

**`home_job_log_entries.duties_met` is a tri-state** (`yes`/`partial`/`no`), not boolean —
Doc 13's own example log uses a blank/Yes distinction loosely, but a real week is often
partial, and the honesty-over-binary-pass-fail theme running through this whole system
(diagnostic rubric, mission status, etc.) argues for the same here.

**Out of scope:** Doc 10 (Work Exposure & Apprenticeship Explorer) — Doc 13 references its
Exposure Ladder conceptually, but Doc 10 itself wasn't requested and has its own separate
Exposure Log that would be a distinct feature, not something to fold in silently here.

**Status:** Complete — shipped 2026-08-30.
