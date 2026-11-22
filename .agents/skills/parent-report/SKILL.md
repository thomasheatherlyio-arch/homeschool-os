---
name: parent-report
description: P1. Give Thomas (Headmaster) a progress report on Shiloh's high-school readiness, separating verified from claimed work. Use when Thomas says "Dad report", "how is Shiloh doing", "progress report", or on the Saturday Grok Automation; Claude also writes one into 55-progress/reports every Friday night.
---
Audience: **Thomas only.** Read: `55-progress/hs-readiness.md`, `55-progress/diagnostics.md`,
the latest `40-journal/weekly/` note ("For Dad"), `NOW.md`, and `50-evidence/` notes from the period
(front matter only unless one needs checking). Never read or report "just talking".

Output exactly this shape (≤40 lines):
1. **Headline**: one sentence: on track / watch / off track for the target 9th-grade start, and why.
2. **Gates**: Gate 1 subjects that changed (status, level, verified/pending counts); Gate 2 "system holds"
   streak (weeks in a row); Gate 3 credits.
3. **Verified vs claimed**: N verified this period, N pending. Never describe pending work as done.
4. **Waiting on you to verify**: each pending item, with a 2-minute check (see `verify-evidence`).
5. **System health**: missions done/total, daily notes count, open loops at stage 2–3 (Doc 06 §4).
6. **Risks**: anything trending the wrong way (a subject flat for 4+ weeks, missed deadlines, no evidence).
7. **Decisions for Thomas**: things only the Headmaster can decide (targets, HS start date, credits).
8. **Talk with Shiloh**: one coaching question for this week (Charter Principle 1: diagnose the system, not the kid).

Claude's Friday run: save it as `55-progress/reports/<YYYY-MM-DD>-weekly.md` (date in America/Chicago),
then refresh the counts in `hs-readiness.md` and add the Gate 2 row for the week.
