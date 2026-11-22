---
type: setup
updated: 2026-11-22
---
# Running COLT in Grok — setup (Thomas does this once)

## 1. Connector
Grok → Connectors → **GitHub** → authorize **only** `thomasheatherlyio-arch/homeschool-os`.
Test: ask Grok *"Read AGENTS.md from homeschool-os on branch post-grok and summarize the routing table."*
- If it can't read a non-default branch → make `post-grok` the default branch (GitHub → Settings → Branches).
- Ask it to *"create an issue labeled for-claude titled 'test'"*. If that works, handoffs can be
  issues. If not, use the paste fallback (§5).

## 2. Grok Project ("Shiloh HQ")
Create a Project/Workspace, and paste this as its custom instructions:

```
You are COLT, Shiloh's learning companion (persona: 60-companions/colt/persona.md).
Source of truth: GitHub repo thomasheatherlyio-arch/homeschool-os, branch post-grok.
Every conversation: read AGENTS.md and NOW.md first. Then follow AGENTS.md's Routing table:
read exactly the one skill file it names, then only the one doc/section that skill names.
Never load whole folders or whole courses.
You do the thinking, talking and tutoring. You never edit the vault directly. When something
should change, end your reply with a HANDOFF block in the format of handoff/TEMPLATE.md
(≤15 lines) — or create a GitHub issue labeled for-claude if you can.
Never put "just talking" content (feelings, friends, worries) in a handoff.
Safety concerns: tell Shiloh plainly this must go to his dad, and help him do it.
```

Upload to the Project (so it's available even if the connector hiccups):
`AGENTS.md`, `60-companions/colt/persona.md`. Keep them in sync when they change.

## 3. Sunday Automation — "Strategy brief"
Grok → Automations → New → weekly, **Sunday 6:00 pm**, in the Shiloh HQ project:

```
Run the strategy-brief skill: read .agents/skills/strategy-brief/SKILL.md from
homeschool-os (branch post-grok) and follow it. Output the proposed handoff. If you can
create GitHub issues, file it as an issue labeled for-claude titled "strategy brief <date>".
```
If Automations can't use the connector, the brief arrives as a Grok notification — Shiloh pastes
it into `handoff/inbox/` during Monday planning.

## 4. Safety & privacy settings (review with Shiloh)
- Turn off Companions and any adult/"unhinged" modes; keep the account's age set correctly
  (xAI: 13–17 need parental consent).
- **Memory:** Grok memory can retain "just talking" moments, which breaks COLT's privacy promise
  unless Shiloh knows. Either turn memory off for this project, or tell Shiloh plainly what
  Grok remembers and show him how to view/delete it.
- Opt out of training on chats if the setting is available.

## 5. Paste fallback (no connector writes)
Copy the HANDOFF block → Obsidian → new note in `handoff/inbox/` named `YYYYMMDD-slug.md` →
Ctrl+P → "Git: Commit and sync". Claude's 8 pm run picks it up.

## Daily shortcuts for Shiloh
- "COLT, morning" · "COLT, wrap up" · "plan my week" · "teach me <course> unit N" ·
  "hey <mentor>" · "I finished <thing>"
