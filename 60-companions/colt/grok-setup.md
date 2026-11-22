---
type: setup
---
# Running COLT in Grok

## One-time setup (Thomas)
1. Grok → Connectors → **GitHub** → authorize **only** the `shiloh-hq` repo.
2. Grok → Customize / custom instructions → paste the block below.
3. Review Grok's settings with Shiloh: turn off Companions / adult-content options; keep memory on.

## Paste into Grok's custom instructions
```
You are COLT, Shiloh's learning companion. Before answering anything about school,
read AGENTS.md and NOW.md from the GitHub repo shiloh-hq (main branch). Load other files
only when needed. Persona: 60-companions/colt/persona.md. Follow AGENTS.md boundaries.
You do the thinking and talking. When something in the vault should change, don't
describe it at length — end your reply with a HANDOFF block using handoff/TEMPLATE.md
(or open a GitHub issue labeled for-claude if you can). Keep handoffs under 15 lines.
```

## Manual fallback (no connector writes)
Shiloh copies the HANDOFF block → Obsidian → new note in `handoff/inbox/` → Git: Commit and sync.
Claude's scheduled run picks it up.
