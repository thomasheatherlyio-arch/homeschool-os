---
type: setup
status: active
date: 2026-11-22
quadrant: "[[systems-self-command]]"
---
# Start here: Shiloh's PC and accounts

Part A is Dad alone (~30 min). Part B is together (~60 min). Part C is Shiloh's every day.
Accounts in v1: **GitHub · Grok · Obsidian.** No Claude account for Shiloh (see A4).

## Part A: Dad, before setup day
- [ ] **A1. Windows:** run Windows Update. Make Shiloh a **Standard** (not admin) user; keep the admin
      login yourself. Optional: Microsoft Family Safety for screen time and web filtering.
- [ ] **A2. Install as admin** (so Shiloh can't uninstall or swap tools; Toolshed rule, Doc 08):
  - **Git for Windows** (git-scm.com). Obsidian Git needs it; GitHub Desktop's built-in git isn't enough.
    Defaults are fine; keep "Git Credential Manager" checked.
  - **GitHub Desktop** (desktop.github.com)
  - **Obsidian** (obsidian.md)
- [ ] **A3. Email:** Shiloh needs his own email address for GitHub and Grok (you keep the password recovery).
- [ ] **A4. Claude: no account for Shiloh.** Claude's consumer terms are 18+. Claude only runs the
      nightly job on Dad's account; Shiloh never needs to sign in to it.
- [ ] **A5. Your Grok "HQ Headmaster" project** (P1), per [[grok-setup]] §3b.

## Part B: together, setup day
**B1. GitHub**
- [ ] Shiloh signs up at github.com with his email. Username: not his full name.
- [ ] Settings → Emails → turn on "Keep my email address private" (commits use a noreply address).
- [ ] Settings → Password and authentication → add a **passkey** (Windows Hello) or authenticator app.
      Dad saves the recovery codes.
- [ ] Dad invites him to `homeschool-os` (Settings → Collaborators, role **Write**). Shiloh accepts.

**B2. Get the HQ onto the PC**
- [ ] GitHub Desktop → sign in → File → Options → Git: name = first name, email = the GitHub noreply address.
- [ ] File → Clone repository → `homeschool-os` → `Documents\Shiloh HQ`.
- [ ] Current branch → **`post-grok`**. (`main` is the old web app. Never work there; pushing to it redeploys the old site.)

**B3. Obsidian**
- [ ] Open folder as vault → `Documents\Shiloh HQ` → Trust author.
- [ ] Settings → Community plugins → turn on → Browse → **Obsidian Git** → Install → Enable.
- [ ] Obsidian Git settings: Pull on startup = on · Auto commit-and-sync interval = 10 min.
- [ ] **Test the sync:** Ctrl+P → "Open today's daily note" → write one line → Ctrl+P →
      "Git: Commit and sync". Check the note shows up on github.com (branch post-grok).
      First time, a browser window asks him to sign in to GitHub; that's Git Credential Manager.
- [ ] Open [[HOME]], then `HQ-map.canvas`, then the graph (Ctrl+G). The five big dots are his Circle.

**B4. Grok (COLT)**
- [ ] Grok account with his **real birth date** (14). xAI requires parental consent for 13–17; you give it.
- [ ] Settings: Companions off, adult/"unhinged" modes off, training on chats off (if offered).
- [ ] Memory: off for the project, *or* show him what it remembers and how to delete it ([[grok-setup]] §4).
- [ ] Connectors → GitHub → sign in as **Shiloh's** GitHub → allow **only** `homeschool-os`.
- [ ] Create project **"Shiloh HQ"**, paste the instructions from [[grok-setup]] §2, upload `AGENTS.md`
      and `persona.md`.
- [ ] Test: "COLT, morning." It should name this week's missions from [[NOW]]. If it can't read
      `post-grok`, tell Claude to make post-grok the default branch.

**B5. First loop (the next 24 hours)**
- [ ] Evening: "COLT, wrap up" → paste the HANDOFF into a new note in `handoff/inbox/` → Commit and sync.
- [ ] Next morning: "COLT, morning" should mention Claude's overnight update ("Since last time").
- [ ] This week: Reading baseline with Dad (P1, [[hs-readiness]]).

## Part C: Shiloh, every day
| When | What you do |
|---|---|
| Morning | "COLT, morning" → do the first move it suggests |
| Working | "teach me <course> unit N" · "hey <mentor>" |
| Finished something | "I finished <thing>", then show Dad the proof. It counts once he checks it |
| End of day | "COLT, wrap up" → paste any HANDOFF into `handoff/inbox/` → Ctrl+P → "Git: Commit and sync" |
| Friday | "weekly review", then show Dad |

## Good to know
- **What's private:** just talking with COLT (feelings, friends, worries) is never written down.
  Finished work, quizzes and missions *are* tracked. That's your evidence.
- You decide your mentor seats and COLT's name. Rule changes go through Dad.
- "Merge conflict" or a red Git error? Don't fix it alone. Stop and get Dad.
- Later (not v1): iPhone.

Next: [[NOW]] · [[index]] · [[AGENTS]]
