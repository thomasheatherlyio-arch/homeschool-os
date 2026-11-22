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

## The accounts (as set up 2026-11-22)
| What | Account | Notes |
|---|---|---|
| Windows | Shiloh's own account `shilo` (admin) | No Standard-user switch. Backstop: Grok Build asks before commands ([[grok-setup]] §4) + the AGENTS.md rule |
| Email | `shilohthegood@gmail.com` | Used for GitHub (and Grok). Dad keeps the recovery |
| GitHub | `hs-shiloh` | Needs **Write** on `homeschool-os` (B1) |
| Git on the PC | `Shiloh` / `359997595+hs-shiloh@users.noreply.github.com` | His private noreply address, so his email never shows in commits |
| Grok | Shiloh's Grok account | Signs in to Grok Build (B4) |
| Dad's side | Dad's Chief of Staff (Grok Bot, named COLT) | Read-only, reports to Dad only ([[grok-setup]] §7) |

## Part A: Dad, before setup day
- [ ] **A1. Windows:** run Windows Update. Shiloh stays on his own Windows account (`shilo`, admin).
      The backstop is Grok Build set to ask before running commands plus the AGENTS.md rule.
      Optional: Microsoft Family Safety.
- [x] **A2. Install:** **Git for Windows**, **Obsidian**, and **Grok Build** 1.0.92 ([[grok-setup]] §2;
      user install, no admin needed). Done 2026-11-22.
- [x] **A3. Email:** `shilohthegood@gmail.com` for GitHub and Grok (you keep the recovery).
- [ ] **A4. Plan check:** confirm Shiloh's Grok plan includes Grok Build ([[grok-setup]] §1).
- [ ] **A5. No Claude account for Shiloh.** Not part of v1 (and Claude's consumer terms are 18+).

## Part B: together, setup day
**B1. GitHub (backup only)**
- [x] GitHub account **`hs-shiloh`** made with `shilohthegood@gmail.com`.
- [ ] In his GitHub Settings → Emails: check **"Keep my email address private"** (optional: "Block
      command line pushes that expose my email"). Add a passkey (Windows Hello); Dad keeps the recovery codes.
- [ ] Dad invites **`hs-shiloh`** to `homeschool-os` (Settings → Collaborators, **Write**). He accepts.
      (Not confirmed yet. Until then, backups push with whatever GitHub login Git Credential Manager has saved on the PC.)

**B2. Put the vault on the PC** (done 2026-11-22)
- [x] Git identity set to `Shiloh` / `359997595+hs-shiloh@users.noreply.github.com`.
- [x] Vault cloned to `Documents\Shiloh HQ` (branch `post-grok`). To rebuild on a new PC:
```
git config --global user.name "Shiloh"
git config --global user.email "359997595+hs-shiloh@users.noreply.github.com"
git clone -b post-grok https://github.com/thomasheatherlyio-arch/homeschool-os "$HOME\Documents\Shiloh HQ"
```
A browser window asks him to sign in to GitHub once (Git Credential Manager). That's it for git.

**B3. Obsidian**
- [x] Vault `Documents\Shiloh HQ` added to Obsidian.
- [ ] If Obsidian asks, click **Trust author and enable plugins**.
- [x] **Obsidian Git** ships with the vault (`.obsidian/plugins/obsidian-git`). If it's off: Settings →
      Community plugins → turn off Restricted mode → switch Obsidian Git on.
      (Its settings are already in the vault: pull on open, back up every 10 min.)
- [x] Backup test: a line in today's daily note reached github.com (2026-11-22).
- [ ] Obsidian opens on [[HOME]] (the Today screen, pinned) with [[NOW]] beside it. Then try
      `HQ-map.canvas` and the graph (Ctrl+G).

**B4. COLT (Grok Build)**
- [ ] Double-click **COLT** on the desktop and sign in with **Shiloh's** Grok account (real birth date;
      Dad gives consent). When it asks to **trust this folder**, say yes: that's how it loads AGENTS.md.
- [x] **COLT** desktop shortcut made (points to `scripts\COLT.cmd`, [[grok-setup]] §3).
- [x] Grok Build set to ask before running commands ([[grok-setup]] §4).
- [ ] Dad's check prompt first ([[grok-setup]] §3b), then: "COLT, morning." It should name this week's missions from [[NOW]].

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
- Your Windows account is an admin, so you're part of the safety net: if COLT asks to run a command
  or install something, say no and get Dad.
- Red Git error or "merge conflict" in Obsidian? Don't fix it alone. Get Dad.

Next: [[NOW]] · [[index]] · [[AGENTS]]
