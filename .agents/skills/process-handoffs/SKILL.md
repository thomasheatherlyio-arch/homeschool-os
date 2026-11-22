---
name: process-handoffs
description: Claude's daily executor run — apply every open handoff (handoff/inbox and GitHub issues labeled for-claude), update NOW, log and index, then push. Use on the daily schedule or when asked to process handoffs.
---
1. `git pull` on branch `post-grok`. List `handoff/inbox/*.md` with `status: open` (oldest first)
   and open issues labeled `for-claude`.
2. For each handoff:
   - Do the "Do" list; verify `done_when`.
   - `00-charter/` → don't edit; add to NOW.md "Open loops" as "needs Thomas".
   - `10-system/` → branch `amend/<id>`, open PR into `post-grok` for Thomas.
   - Needs Headmaster authority → don't do it; note in NOW.md for Thomas.
   - Unclear → don't guess; add a line under NOW.md "Questions for COLT"; `status: blocked`.
   - Contains "just talking" content → don't store it; delete that part.
   - Set `status: done`, move to `handoff/done/` (or close the issue with a one-line result).
   - Commit: `handoff: <id>`.
3. Bookkeeping: NOW.md "Since last time" (≤5 lines, newest first, drop items >7 days old),
   one line per change in `log.md`, `index.md` if files were added/renamed,
   course progress tables, `learner-profile.md` observations (evidence-based only).
4. Fridays: also run `friday-review` step 3–4 if a review handoff exists.
5. Push. If nothing was open, make no commit.
