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

## 2. Install (PowerShell on Shiloh's PC, no admin needed)
```
irm https://x.ai/cli/install.ps1 | iex
grok --version
```
Use the native Windows installer, not WSL. It installs to `%USERPROFILE%\.grok\bin` and adds that to
his PATH. **Done 2026-11-22: Grok 1.0.92.** Still to do: double-click COLT (below), sign in with
**Shiloh's** Grok account, and say yes when it asks to **trust this folder** (without trust it does
not load `AGENTS.md`).

## 3. The COLT shortcut
**Done 2026-11-22:** `COLT` on the desktop (`OneDrive\Desktop\COLT.lnk`, since his Desktop is in
OneDrive) runs `scripts\COLT.cmd` with the vault as the working folder. COLT.cmd finds
`%USERPROFILE%\.grok\bin\grok.exe` (or `grok` on PATH), so it loads `AGENTS.md` automatically.
To remake it: right-click `scripts\COLT.cmd` → Send to → Desktop (create shortcut) → rename it **COLT**.
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
4. **Every day after:** just `COLT, morning` and `COLT, wrap up`. Fridays: `weekly review`. A Grok Bot routine also runs the Khan sync automatically Friday ~6 PM so Dad can review the weekend.

## 4. Permissions (important)
Grok Build is an agent: it can edit files and run commands. Shiloh uses his own Windows account,
which is an admin, so the backstop is **Grok Build set to ask before running commands** plus the
AGENTS.md rule (no commands except `git status` / `git pull`). **Done 2026-11-22** in
`%USERPROFILE%\.grok\config.toml` (on the PC, not in the vault):
```
[ui]
permission_mode = "ask"          # ask before commands (and edits outside the allow list)
[permission]
allow = ["Edit(./**)", "Bash(git status)", "Bash(git pull)"]   # edits inside the vault are fine
deny  = ["Read(**/private/**)", "Edit(**/private/**)", "Edit(**/55-progress/verifications.md)",
         "Edit(**/00-charter/**)", "Edit(~/.grok/**)"]           # hard blocks, even if approved
```
Don't switch it to auto-review or always-approve (Shift+Tab, `/always-approve`) on his PC. Check with
`grok inspect` in the vault: Permissions should say 8 loaded. Tell Shiloh: if COLT asks to run a
command or install something, say no and get Dad.

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
- From your own devices: **Dad's Chief of Staff**, your Grok Bot (also named **COLT**, Dad's side).
  It's read-only and reports only to you. (Not the same as Shiloh's open "Chief of Staff" Knight seat,
  [[systems-chief-of-staff]].) Shiloh's COLT also runs as a Grok Bot with a Friday ~6 PM Khan-sync
  routine so you can review the weekend; that bot is not this read-only Chief of Staff. Seed prompt:
  ```
  You are COLT, Thomas's Chief of Staff for Shiloh's homeschool (Shiloh HQ, v1). You work for
  Thomas (Dad, Headmaster, legal administrator of record in Texas), not for Shiloh (14).

  Source of truth: GitHub repo thomasheatherlyio-arch/homeschool-os, branch post-grok. Read
  AGENTS.md, NOW.md and 55-progress/hs-readiness.md first, then only the one file a task needs.
  Never scan the whole repo. Never read private/.

  P1: help Thomas track and verify Shiloh's progress toward high school. Always separate verified
  work (in 55-progress/verifications.md) from pending or claimed work. Never call pending work done,
  and never edit verifications.md or 00-charter/.

  Your jobs:
  1. Saturday 8am: run the parent-report skill (.agents/skills/parent-report/SKILL.md) and send me
     the weekly report: missions done, evidence waiting for my verification, readiness gaps, and
     open loops marked "needs Thomas".
  2. When I ask "what needs me": list pending verifications, proposals in proposals/ waiting on a
     decision, and overdue items in NOW.md.
  3. Track the baseline diagnostics (Reading, then Writing, then Math) and remind me when one is due.
  4. Flag anything that looks off: missions stuck 2+ weeks, no daily notes for 3+ days, or gaps in
     the Git backup (no commits on post-grok for 2+ days).

  Read-only by default. Don't message Shiloh, don't change files, and don't commit anything unless
  I explicitly ask.
  ```
- Alternative (no Grok Bot): a Grok app project with the GitHub connector on the same repo and
  branch, read-only, with the seed prompt above and a Saturday 8:00 am Automation.
- Your verdicts go in `55-progress/verifications.md`: type them in Obsidian on his PC, or edit the file
  on github.com (it syncs down within 10 minutes). COLT never edits that file.

## Later (not v1)
iPhone: the Grok app (read-only via the GitHub connector) or a mobile git app + Obsidian.
