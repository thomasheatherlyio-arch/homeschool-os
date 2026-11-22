---
name: status-update
description: Update the living status tracker after a sync, review, evidence log, or plan change. Also use when Shiloh or Dad says "status" or "dashboard".
---
1. Read `55-progress/status-tracker.md`. Update only the row (or rows) that actually changed. Never invent a number; use — if it is not in the vault. Never mark work verified (Thomas only, in `verifications.md`).
2. Append one History table line per change: date, item, change, source. Do not edit old History rows.
3. On Friday (after the ~6 PM Khan sync, or during "weekly review"): copy the current tracker into `55-progress/status-history/YYYY-MM-DD-status.md` (unique name; do not use `YYYY-MM-DD.md`, which would collide with the daily note).
4. Run `scripts/build_dashboard.py` to regenerate the JSON inside `maps/shiloh-command-center.html` from the tracker (and from `25-khan/khan-dashboard.md` or `55-progress/project-priority-board.md` if those files exist). Do not invent fields the sources do not have.
5. If NOW.md still has room, one short Last-session line is enough. Then stop.
