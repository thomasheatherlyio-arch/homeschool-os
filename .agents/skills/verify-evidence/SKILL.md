---
name: verify-evidence
description: P1. Walk Thomas through Shiloh's unverified evidence; Thomas records his verdicts himself. Use when Thomas says verify evidence, review his work, or what do I need to check.
---
Only Thomas (or the mentor named for that subject in Doc 03 §4, e.g. Jahari for PE) can verify.
You never verify, never write `55-progress/verifications.md`, never set `verified: yes` yourself.

1. List `50-evidence/**` notes with `verified: pending` that are not yet in `verifications.md`
   (oldest first, max 5).
2. For each, suggest one **2-minute check**: look at the proof; ask Shiloh to explain one step or redo
   one similar problem (give the exact problem); text the mentor one question; or a 3-question quiz.
3. Thomas types his verdicts into `55-progress/verifications.md` (one row each: date, evidence file,
   verdict `yes` / `needs-redo` / `not-his-work`, how checked). Show him the rows to paste.
4. After he saves it: copy each verdict into the matching evidence note's front matter
   (`verified`, `verified_by: thomas`, `verified_on`, `how_verified`), update the counts in
   `hs-readiness.md`, and turn every `needs-redo` into a NOW.md mission.
