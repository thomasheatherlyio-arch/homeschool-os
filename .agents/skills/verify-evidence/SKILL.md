---
name: verify-evidence
description: P1. Walk Thomas through Shiloh's unverified evidence and record his verdicts. Use when Thomas says "verify evidence", "review his work", or "what do I need to check".
---
Only Thomas (or the mentor named for that subject in Doc 03 §4, e.g. Jahari for PE) can verify.
Agents never mark anything verified on their own and never "verify" from Shiloh's description alone.

1. List `50-evidence/**` notes with `verified: pending` (oldest first, max 5 per sitting).
2. For each, suggest one **2-minute check** that fits the work:
   - Look at the artifact (file/photo/link in **Proof**). Is it his, is it complete?
   - Oral check: ask Shiloh to explain one step or redo one similar problem (give the exact problem).
   - Mentor check: text the mentor one question.
   - Quiz: 3 questions COLT writes, Thomas gives in person.
3. Record Thomas's verdict: `yes` · `needs-redo` (+ what's missing) · `not-his-work` (stop; Thomas handles it).
4. Write ONE handoff (`touches:` the evidence files + `55-progress/hs-readiness.md`) listing each file and
   its verdict, `how_verified`, and date. Claude applies it: sets `verified`, `verified_by: thomas`,
   `verified_on`, `how_verified`; updates the readiness counts; `needs-redo` → a mission in NOW.md.
