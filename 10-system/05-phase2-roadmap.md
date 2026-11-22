---
type: system
doc: "05"
status: active
source: claude-project-export-2026-11-22
---

# Doc 05 — Phase 2 Roadmap: Beyond the Claude Project MVP

**Purpose:** this Claude Project is the MVP — it proves the model (quadrants, mentors, evidence log, dashboard) using conversation and documents alone. Phase 2 is about rebuilding the same model with real automation, using Claude Code, Cowork, and outside tools/APIs, once the MVP has been run long enough to know what's actually worth automating.

This doc is a planning placeholder for now — it gets filled in with real technical detail once Phase 2 work starts. Below is the shape of what that phase covers.

---

## 1. Guiding Rule for Phase 2

Don't automate a process that hasn't been proven manually first. Everything below assumes the MVP ([[00-governing-charter-and-toc|Docs 00]]–04) has run for at least a full grading period so we know which parts of the manual rhythm are worth the engineering effort, and which parts work fine as-is.

## 2. Planned Components

**Quiz generation from YouTube (NotebookLM-style).** Feed a video or lecture into a pipeline that generates a comprehension quiz Shiloh takes afterward — useful for Mind & Mastery content review and for any mentor-recommended videos. Built via Claude Code, likely using a transcript-extraction tool plus Claude for question generation.

**Google Forms/Sheets integration.** Wire the Weekly Check-In form ([[04-student-dashboard|Doc 04]] §4) so submissions land in a live sheet, and have that sheet feed the dashboard automatically instead of being copied in by hand.

**Live student dashboard.** A real, standing dashboard (likely a persisted HTML artifact or small web app) showing the Circle snapshot, current missions, and evidence log in one glance, updated automatically rather than maintained by hand in a doc.

**Time & progress tracking.** A proper system for logging hours per quadrant and mission — feeding both the dashboard and the [[03-academic-tracker-tx-compliance|Doc 03]] evidence log — instead of the rough weekly self-report the MVP uses.

**Third-party learning platforms.** Explore connecting to Khan Academy and Brilliant.org for structured Mind & Mastery content and progress data, where their tracking can supplement or verify the evidence log.

**Health & fitness tracking.** Explore food/fitness apps (Apple Health, Strava, MyFitnessPal, or similar) to feed real data into the Body & Discipline quadrant instead of self-report alone.

**Automated evidence portfolio.** Auto-compile each quarter's evidence log into a clean, exportable record (PDF or similar) — the actual artifact Thomas would show if he ever needed to prove Shiloh's education to a school, college, or program.

## 3. How to Get There

When Phase 2 work starts, the right move is a fresh planning pass: review what [[00-governing-charter-and-toc|Docs 00]]–04 have actually been used for after a real grading period, identify the two or three components above with the highest payoff, and scope those first rather than building everything at once. Claude Code is the right tool for the automation/engineering work; Cowork is the right tool for ongoing file/task orchestration once the pieces exist; MCP connectors (Google Workspace, and whatever else becomes relevant) are the likely integration layer.

## 4. Status Update — 2026-11-22: the Grok pivot

Phase 2 started (Aug 29–30) as a Next.js + Supabase web app (repo `homeschool-os`, branch
`main`; Doc 17 is its build brief). It shipped the dashboard, courses, North Star, Mind Mansion
and Work Ladder, then sat idle for three months. **It is now parked, not deleted.**

**P1 for v1 (Thomas, 2026-11-22): help Thomas track and verify Shiloh's progress toward high school.**
Every component below serves that first: the readiness tracker (`55-progress/hs-readiness.md`, three
gates from Docs 03, 09a and 10a), evidence that counts only once Thomas verifies it, Doc 09a baseline
diagnostics, and a weekly parent report (COLT writes it at the Friday review).

v1 of Phase 2 is instead an **Obsidian vault + one AI** (branch `post-grok`; see `DECISIONS.md`):
- **COLT in Grok Build** on Shiloh's PC: talks, tutors, plans, and writes the notes directly.
- **Obsidian Git**: backs the vault up to GitHub every 10 minutes, giving Thomas remote access and a
  dated record of every change (Doc 00 §6 amendments go through `proposals/`, Thomas decides).
- No Claude in v1 (decided 2026-11-22, to keep it to one subscription).

How the §2 components map now:

| Component | Now |
|---|---|
| Live student dashboard | `NOW.md` + course progress tables in Obsidian (Dataview later if needed) |
| Weekly check-in form | `daily-checkin` / `friday-review` skills in COLT |
| Quiz generation from video | `tutor-session` skill + NotebookLM outputs dropped in `raw/` (still manual, per the NotebookLM decision) |
| Time & progress tracking | `log.md` + `50-evidence/` + `55-progress/` (P1) |
| Automated evidence portfolio | `quarterly-review` skill drafts it from `50-evidence/` |
| Khan/Brilliant, health apps | unchanged — still to explore |

The §1 guiding rule still holds: run this manually for a grading period before automating more.

---

*Changelog: 2026-08-14 — Initial roadmap placeholder drafted (v1.0, MVP). No build work started; this is a scope/sequencing outline only. 2026-11-22 — Added §4 status update: web app parked, Phase 2 v1 is the Obsidian vault with Grok (strategy) + Claude (execution) — proposed by Claude for Thomas.*
