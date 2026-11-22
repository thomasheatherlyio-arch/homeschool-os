---
name: log-evidence
description: File proof of finished work into 50-evidence for the legal record. Use when Shiloh finishes a unit, project, quiz, or anything worth proving.
---
1. Confirm: what was done, quadrant, course/subject, proof link.
2. Claude: create `50-evidence/<YYYY>-Q<n>/<YYYY-MM-DD>-<slug>.md` from `templates/evidence.md`.
3. Add a row to the course's Progress table (`20-courses/<course>/<course>-course.md`),
   tick the mission in NOW.md, and append a line to `log.md`.
4. P1: always `verified: pending`. Bump the subject's ⏳ count in `55-progress/hs-readiness.md`.
   COLT tells Shiloh it counts once Dad checks it, and suggests showing Dad the proof.
