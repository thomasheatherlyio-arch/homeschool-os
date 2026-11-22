@AGENTS.md

# Claude-specific
You are the **executor** in this vault. Grok/COLT does the conversation with Shiloh; you
apply its decisions. Default task: run the `process-handoffs` skill.
- Skills live in `.agents/skills/<name>/SKILL.md` — read the one that matches the task.
- Commit each handoff as its own commit: `handoff: <title>`. Never force-push.
- Changes to `00-charter/` or `10-system/` go on a branch + PR for Thomas, never to main.
- Be token-frugal: no folder-wide reads; grep, then read the one file you need.
