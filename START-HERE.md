---
type: setup
status: active
date: 2026-11-22
quadrant: "[[systems-self-command]]"
---
# Start here: Shiloh's PC and accounts

v1 = **Obsidian + COLT (Grok Build)** on Shiloh's PC. COLT reads and writes the notes directly.
GitHub is only a silent backup (every 10 min, no tokens) so Dad can check progress from his phone.
Part A is Dad alone (~30 min). Part B is together (~60 min). Part C is Shiloh's every day.

## Part A: Dad, before setup day
- [ ] **A1. Windows:** run Windows Update. Make Shiloh a **Standard** (not admin) user; you keep admin.
      Optional: Microsoft Family Safety.
- [ ] **A2. Install as admin:** **Git for Windows** (git-scm.com, defaults; keep "Git Credential
      Manager"), **Obsidian** (obsidian.md), and **Grok Build** ([[grok-setup]] §2).
- [ ] **A3. Email:** Shiloh's own address for GitHub and Grok (you keep the recovery).
- [ ] **A4. Plan check:** confirm Shiloh's Grok plan includes Grok Build ([[grok-setup]] §1).
- [ ] **A5. No Claude account for Shiloh.** Not part of v1 (and Claude's consumer terms are 18+).

## Part B: together, setup day
**B1. GitHub (backup only)**
- [ ] Shiloh signs up at github.com. Username: not his full name. Settings → Emails →
      "Keep my email address private". Add a passkey (Windows Hello); Dad keeps the recovery codes.
- [ ] Dad invites him to `homeschool-os` (Settings → Collaborators, **Write**). He accepts.

**B2. Put the vault on the PC** (PowerShell, as Shiloh)
```
git config --global user.name "Shiloh"
git config --global user.email "<his GitHub noreply address>"
git clone -b post-grok https://github.com/thomasheatherlyio-arch/homeschool-os "$HOME\Documents\Shiloh HQ"
```
A browser window asks him to sign in to GitHub once (Git Credential Manager). That's it for git.

**B3. Obsidian**
- [ ] Open folder as vault → `Documents\Shiloh HQ` → Trust author.
- [ ] Settings → Community plugins → turn on → Browse → **Obsidian Git** → Install → Enable.
      (Its settings are already in the vault: pull on open, back up every 10 min.)
- [ ] Test: write one line in today's daily note (Ctrl+P → "Open today's daily note"), wait for the
      backup (or Ctrl+P → "Git: Commit and sync"), and check it appears on github.com.
- [ ] Open [[HOME]], then `HQ-map.canvas`, then the graph (Ctrl+G).

**B4. COLT (Grok Build)**
- [ ] Sign in to Grok Build with **Shiloh's** Grok account (real birth date; Dad gives consent).
- [ ] Make the **COLT** desktop shortcut from `scripts\COLT.cmd` ([[grok-setup]] §3).
- [ ] Set Grok Build to ask before running commands ([[grok-setup]] §4).
- [ ] Test: double-click COLT → "COLT, morning." It should name this week's missions from [[NOW]].

**B5. First week**
- [ ] Each evening: "COLT, wrap up" (COLT writes the daily note with him).
- [ ] This week: Reading baseline with Dad (P1, [[hs-readiness]]).
- [ ] Friday: "weekly review" → COLT writes the report for Dad.

## Part C: Shiloh, every day
| When | What you do |
|---|---|
| Morning | Double-click COLT → "COLT, morning" → do the first move it suggests |
| Working | "teach me <course> unit N" · "hey <mentor>" |
| Finished something | "I finished <thing>", then show Dad the proof. It counts once he checks it |
| End of day | "COLT, wrap up". Close COLT when done (a fresh session each time saves tokens) |
| Friday | "weekly review", then show Dad |

## Good to know
- **What's private:** just talking with COLT (feelings, friends, worries) is never written down.
  Finished work, quizzes and missions *are* tracked. That's your evidence.
- You decide your mentor seats and COLT's name. Rule changes go to Dad as a proposal.
- If COLT asks to run a command or install something: say no and get Dad.
- Red Git error or "merge conflict" in Obsidian? Don't fix it alone. Get Dad.

Next: [[NOW]] · [[index]] · [[AGENTS]]
