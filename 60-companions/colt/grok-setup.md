---
type: setup
updated: 2026-11-22
---
# Running COLT in Grok Build (Thomas sets this up once)

v1 is simple: **one AI (Grok Build) on Shiloh's PC, opened in the vault, reading and writing notes
directly.** No Claude, no handoffs. Obsidian shows every change instantly; Obsidian Git backs the
folder up to GitHub every 10 minutes (no tokens), which is how Thomas sees progress from his devices.

## 1. Check first (on x.ai)
- Which Grok plan includes **Grok Build** (launch page says SuperGrok / X Premium+; some guides say a
  free tier exists now). Pick the plan for Shiloh's account.
- That Grok Build allows a 13–17 account with parental consent.

## 2. Install (Dad, admin PowerShell on Shiloh's PC)
```
irm https://x.ai/cli/install.ps1 | iex
grok --version
```
Use the native Windows installer, not WSL. Then open a normal (non-admin) terminal as Shiloh, `cd` into
`Documents\Shiloh HQ`, run `grok`, and sign in with **Shiloh's** Grok account.

## 3. The COLT shortcut
Right-click `scripts\COLT.cmd` → Send to → Desktop (create shortcut) → rename it **COLT**.
Double-clicking it opens Grok Build in the vault folder, so it loads `AGENTS.md` automatically.
Check it worked: ask *"What does AGENTS.md say your job is?"* It should say COLT and P1.

## 3b. First prompts (in this order)
No long seed prompt is needed: Grok Build loads `AGENTS.md` by itself every time COLT opens.
1. **Dad, right after install (Shiloh not needed):**
   `Read only AGENTS.md and NOW.md. In 5 lines tell me: who you are, the P1 goal, which files you may never edit, and this week's missions. Don't change any files.`
   Pass = it says COLT, P1, names `verifications.md` and `00-charter/`, lists the missions, edits nothing.
   Fail (it reads lots of files or edits something) → stop and fix before Shiloh uses it.
2. **Together, setup day (Shiloh types):**
   `COLT, this is our first session. Introduce yourself in 3 sentences, ask me if I want to give you a new name, then do my morning check-in.`
3. **Dad, the same week, without Shiloh:** `baseline diagnostic reading`. Print the packet; give it on paper.
4. **Every day after:** just `COLT, morning` and `COLT, wrap up`. Fridays: `weekly review`.

## 4. Permissions (important)
Grok Build is an agent: it can edit files and run commands. Set it to **ask before running any
command**. File edits inside the vault are fine. Tell Shiloh: if COLT asks to run a command or
install something, say no and get Dad (AGENTS.md already forbids it; this is the backstop).
Keep Shiloh's Windows account a Standard user.

## 5. Keep tokens low
- COLT only loads `AGENTS.md` + `NOW.md` by default; the rules forbid scanning the vault.
- Tutoring builds a short **lesson card** per unit the first time (`20-courses/<course>/cards/`),
  so the same unit is cheap next time.
- Start a **new session** each time (close and reopen COLT) instead of one endless chat.
  Long sessions re-send the whole conversation.

## 6. Safety & privacy (review with Shiloh)
- Account age set correctly; adult modes off; opt out of training on chats if offered.
- "Just talking" is never written to the vault (AGENTS.md). Grok's own account history may still keep
  chats. Show Shiloh where that lives and how to delete it.

## 7. Thomas's view (P1)
- On Shiloh's PC: open COLT and say **"Dad report"**, **"verify evidence"**, **"baseline diagnostic math"**.
- From your own devices (optional): a Grok app project with the GitHub connector on
  `thomasheatherlyio-arch/homeschool-os` (branch `post-grok`), read-only. Instructions:
  ```
  You are the Headmaster's assistant for Shiloh's homeschool. Read AGENTS.md, NOW.md and
  55-progress/hs-readiness.md from homeschool-os (branch post-grok), then follow the parent-report
  skill. Always separate verified from pending work. You talk to Thomas, not Shiloh.
  ```
  Optional Automation: Saturday 8:00 am, *"Run the parent-report skill"*.
- Your verdicts go in `55-progress/verifications.md`: type them in Obsidian on his PC, or edit the file
  on github.com (it syncs down within 10 minutes). COLT never edits that file.

## Later (not v1)
iPhone: the Grok app (read-only via the GitHub connector) or a mobile git app + Obsidian.
