---
type: folder-note
date: 2026-11-22
status: active
quadrant: "[[mind-mastery]]"
---
# Khan Academy system

How COLT helps Shiloh monitor, track, and work through Khan Academy. Thomas approved the connection on 2026-11-22 ([[20261122-khan-academy-connection]]).

**Start here:** [[khan-dashboard]] · Priority plan: [[khan-priority-plan]] · P1 summary: [[khan-academy]]

## Data flow

1. **Khan site.** Progress lives on Khan Academy. There is **no public API** (Khan shut it down in 2020). COLT reads the pages in a browser after sign-in.
2. **"Khan sync"** — scheduled **automatically Friday ~6 PM** (so Dad can monitor over the weekend), and whenever Shiloh asks. COLT follows `.agents/skills/khan-sync/SKILL.md`, writes a dated snapshot in `25-khan/snapshots/` from `templates/khan-snapshot.md`, and updates only numbers that appeared on those pages.
3. **Course notes** in `25-khan/courses/` get unit mastery, test scores, and stuck skills.
4. **[[khan-dashboard]]** is the current view (courses, mastery, weekly-minute goal, last synced).
5. **[[khan-academy]]** (`55-progress/`) is the short P1 summary that feeds [[hs-readiness]]. Do not duplicate unit tables there.
6. **Thomas verifies.** Unit tests and mastery jumps are filed as **pending** evidence in `50-evidence/` (via the log-evidence skill). They count toward readiness only after Dad records them in [[verifications]]. COLT never marks `verified: yes`.

## Pending vs verified

| State | Who sets it | What it means |
|---|---|---|
| Empty / — | default | No Khan data has been synced yet. Never invent a number to fill a cell. |
| Pending | COLT, after a real sync or a finished quiz | Written down, waiting for Dad. |
| Verified | Thomas only (or the named mentor) | Counts on [[hs-readiness]]. |

## How Shiloh uses it

- **"Khan sync"** — pull the latest progress from the site. The regular pull is **Friday ~6 PM**, so Dad can look over the weekend.
- **"Khan help"** / **"stuck on Khan"** — COLT coaches from the dashboard and that course note (`.agents/skills/khan-coach/SKILL.md`). Socratic: ask, then hint, then explain. COLT never gives answers to Khan exercises. Work is broken into 15–25 minute steps.
- A weekly Khan log (`25-khan/weekly/`, from `templates/khan-weekly.md`) is written at the **Friday ~6 PM** sync once there are real minutes to report. Priority plan: [[khan-priority-plan]] (weekly minutes and dates approved 2026-11-22).

## Privacy

- Account emails, passwords, and profile details stay off the notes and are never shared outward.
- Snapshots record *progress* (courses, mastery, scores, minutes), not personal messages or "just talking."
- Screenshots, if any, go in `50-evidence/` inside this vault, not to other sites.
- If a sign-in wall appears, COLT does not invent or type stored passwords on his own; the sync stops honestly if sign-in cannot be completed.

## Templates

- Course stub: `templates/khan-course.md`
- Sync snapshot: `templates/khan-snapshot.md` → `25-khan/snapshots/YYYY-MM-DD-khan-snapshot.md`
- Weekly log: `templates/khan-weekly.md` → `25-khan/weekly/YYYY-MM-DD-khan-weekly.md`
