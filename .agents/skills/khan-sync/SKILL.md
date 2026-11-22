---
name: khan-sync
description: Pull Shiloh's Khan Academy progress from the website in a browser (no public API), write a dated snapshot, and update the dashboard, course notes, and P1 tracker. Use when he says Khan sync, first Khan sync, or at the weekly Khan sync.
---
1. There is **no Khan API** (shut down in 2020). Progress is read from the live site in a browser. Never invent mastery, minutes, or scores. If you cannot see a number on the page, leave the cell as —.
2. If a **sign-in wall** appears, do not invent or paste a password. Follow the vault's sign-in process; if sign-in cannot be completed, stop, write that in the snapshot (or skip the snapshot and say so), and leave trackers unchanged.
3. After pages are visible, create `25-khan/snapshots/YYYY-MM-DD-khan-snapshot.md` from `templates/khan-snapshot.md`. Record the URL(s), date, and a raw summary of *what the pages showed*.
4. Update only the matching rows in `25-khan/courses/` (create a new course note from `templates/khan-course.md` if the site shows a course that has no stub). Then update [[khan-dashboard]] (mastery, last synced, weekly minutes if shown) and the P1 summary [[khan-academy]] — summary only, do not copy every unit table there.
5. **Unit tests and mastery jumps** are evidence: follow `.agents/skills/log-evidence/SKILL.md`. `verified: pending` always. Never set `verified: yes`. Never edit `55-progress/verifications.md`.
6. If this is a Friday or a weekly wrap, also consider a log in `25-khan/weekly/` from `templates/khan-weekly.md`, using only numbers from this sync and earlier snapshots.
7. Bookkeeping: one line in `log.md`, `NOW.md` if a "First Khan sync" mission/loop should be ticked. Tell Shiloh the new figures are pending until Dad checks the evidence.
