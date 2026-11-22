---
name: process-handoffs
description: Claude executor loop — apply every file in handoff/inbox (and GitHub issues labeled for-claude), then move them to handoff/done. Use on schedule or when asked to process handoffs.
---
1. `git pull`. List `handoff/inbox/*.md` (oldest first) and open issues labeled `for-claude`.
2. For each: do the "Do" list, check "Done when", commit `handoff: <title>`.
   - Anything touching `00-charter/` or `10-system/` → branch + PR for Thomas instead.
   - Anything that needs Headmaster authority → don't do it; note it in NOW.md open loops.
3. Move the file to `handoff/done/` (or close the issue with a one-line result). Push.
4. If a handoff is unclear, don't guess — append a question under "## Questions for COLT" in NOW.md.
