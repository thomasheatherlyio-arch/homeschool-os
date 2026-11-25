---
type: guide
status: approved-in-chat
date: 2026-11-24
updated: 2026-11-24
quadrant: "[[venture-craft]]"
author: DaD (Headmaster Grok Bot, at Thomas's request)
proposal: "[[20261124-learning-dashboard]]"
---
# Co-build guide: HQ Dashboard

This is your build book, Shiloh. You and an AI helper (COLT, or chat in VS Code once Dad sets it up) will build the dashboard together, in short sittings. Dad reviews the code and anything that touches privacy or verification.

Product: [[dashboard-product-spec]]. Architecture: [[dashboard-build-plan]]. Agent rules: [[dashboard-agent-contract]]. Clickable preview (sample data only): `70-dashboard/dashboard-mockup.html`.

Nothing in this guide is already built. **Do not install new programs without Dad at the computer** (Doc 08 Toolshed). Session 0 is written so you can do it as early as **Wednesday 2026-11-25**.

## What is already true (checked 2026-11-24)
- **Node.js is already installed.** `node -v` printed `v24.18.1` (LTS, codename Krypton). `npm` is `12.0.2`. You do **not** need to install Node again.
- **Git is already installed** (`git version 2.56.1.windows.1`).
- **VS Code is not installed** (not in PATH, and not in the usual Program Files folders). Session 0 installs it with Dad.
- The folder `C:\Users\shilo\Projects\` does not exist yet. You will create it.

## How to run a session
1. Pick one session below. Set a 25–50 minute timer (the dashboard's own idea: start, then stop).
2. Open this guide and the mockup. Tell your AI helper: "We're on Session N of [[co-build-guide]]. Don't skip ahead. Don't touch `verifications.md` or any `decision:` field."
3. Work the steps in order. If you get stuck, use "I'm stuck" the way the dashboard will: name the step, paste the error, ask for a hint first.
4. Stop at the **Done when** list, even if you want to keep going. If you're in flow, one extra 10 minutes is fine. Then file evidence (see each session).
5. The app lives **outside** the vault. Never `npm install` inside `Documents\Shiloh HQ`.

## Why the project folder is outside the vault
Use **`C:\Users\shilo\Projects\hq-dashboard`**, not a folder inside Shiloh HQ.

- The app will grow a `node_modules` folder with thousands of files. Obsidian Git backs up the vault every 10 minutes. You do not want that.
- COLT is asked not to scan the whole vault. A giant JS project inside it would get in the way.
- The vault stays the *data*. The app is the *tool*. Two repos, two jobs.

## Rules that never change
- Markdown in the vault is the source of truth.
- Evidence is born `verified: pending`. Only Dad's PIN-unlocked session can verify. You and COLT never set `verified` or `decision`.
- No leaderboards, no shame streaks, no XP paywall. Schoolwork is never locked behind a level.
- If you are not sure whether to install something, stop and ask Dad.

## Task lines for [[NOW]] (for COLT or Dad to add)
These are ready to paste as missions or open loops. **This guide does not edit NOW.md.**

- [ ] Dashboard Session 0: confirm Node, install VS Code with Dad, create `C:\Users\shilo\Projects\hq-dashboard`
- [ ] Dashboard Session 1: scaffold the Vite + React app and open a "Good morning, Shiloh" page
- [ ] Dashboard Session 2: build the vault reader (missions from NOW.md, no writes yet)
- [ ] Dashboard Session 3: build My Day (3 quests, XP bar, path, COLT mascot, weekly ring)
- [ ] Dashboard Session 4: build the focus timer (ring, pause, Done / Partly / Stuck)
- [ ] Dashboard Session 5: check-off, pending evidence, and a short celebration
- [ ] Dashboard Session 6: daily notes and the Stuck button
- [ ] Dashboard Session 7: Shiloh's Board — kanban (Now / Next / Later), new task, due dates, priority
- [ ] Dashboard Session 8: Dad's Headmaster view with PIN-only verify
- [ ] Dashboard Session 9: `hq` CLI + MCP tools + guard tests
- [ ] Dashboard Session 10 (v1): Skill-up 1 lesson — projects and subitems
- [ ] Dashboard Session 11 (v1): Skill-up 2–3 — table view and the weekly planning ritual
- [ ] Dashboard Session 12 (v1): Skill-up 4–6 — timeline, dependencies, automations, your dashboard

---

## Session 0 — Set up the workbench (25–40 min)
**Do this tomorrow if you can.** Dad should sit with you for the VS Code install. Node is already done.

**Goal:** Prove the tools work and create the project folder. No app code yet.

**You'll learn:** How to check a tool is installed, what a project folder is, why this one lives outside the vault, and how to open a folder in VS Code.

**Steps:**
1. Open **PowerShell**. Type `node -v` and press Enter. You should see `v24.18.1` (or another v24). Type `npm -v`. Type `git --version`. If any of those fail, stop and get Dad — do not download installers on your own.
2. With Dad, install **Visual Studio Code** from the official site: [https://code.visualstudio.com](https://code.visualstudio.com). Use the User Installer, check the "Add to PATH" box, finish, then **close and reopen PowerShell**. Type `code --version`. You should see a version number. (This is a new program, so Dad stays for the install.)
3. Still in PowerShell, create the folder (copy these lines as a block):

```powershell
New-Item -ItemType Directory -Force -Path C:\Users\shilo\Projects\hq-dashboard | Out-Null
Set-Location C:\Users\shilo\Projects\hq-dashboard
git init
Set-Content -Encoding utf8 README.md @"
# HQ Dashboard
Local app for Shiloh HQ. Data lives in the vault. This folder is the tool.
"@
git add README.md
git commit -m "Start HQ Dashboard repo"
```

4. Open it: `code C:\Users\shilo\Projects\hq-dashboard`
5. Double-check you are **not** inside `Documents\Shiloh HQ`. In VS Code, the top of the Explorer should say `hq-dashboard`.

**Done when:**
- [ ] `node -v` and `npm -v` work in a new PowerShell window
- [ ] `code --version` works
- [ ] `C:\Users\shilo\Projects\hq-dashboard` exists, has a `README.md`, and has a `.git` folder
- [ ] VS Code is open to that folder, not to the vault

**Evidence to file:** A short daily-note line under **Did:** ("Session 0: Node v24 already there; installed VS Code with Dad; created hq-dashboard outside the vault"). Optional: a screenshot of VS Code with the folder open and the `node -v` output. Status stays **pending** until Dad looks.

**If this is all you do tomorrow, that's a complete win.**

---

## Session 1 — Scaffold the app (40–50 min)
**Goal:** A dev server you can open in the browser, showing a Quiet Charter "Good morning, Shiloh" page.

**You'll learn:** What `npm` packages are, what Vite and React do, and how to start and stop a local server.

**Steps:**
1. In VS Code, open a terminal (Terminal → New Terminal). Make sure the prompt path ends in `hq-dashboard`.
2. With your AI helper, scaffold a Vite + React + TypeScript app **in this folder** (not a subfolder with a different name, if you can help it). Install only what [[dashboard-build-plan]] lists for the UI: Vite, React, TypeScript.
3. Add the Quiet Charter colors as CSS variables from [[17-command-center-ui-build-brief|Doc 17]] (or copy them from the mockup). Use system fonts for now (Georgia + Segoe UI is fine until you self-host Lora and Public Sans).
4. Replace the starter page with a simple header: the date, "Good morning, Shiloh", and a subtitle "My Day — coming next."
5. Run `npm run dev`. Open the local URL (usually `http://localhost:5173`). Confirm it loads **on this computer only**.
6. Add a `.gitignore` that includes `node_modules/` and `dist/`. Commit.

**Done when:**
- [ ] The browser shows your page, not the Vite default
- [ ] The page uses parchment colors, not a bright default theme
- [ ] `npm run dev` starts and stops cleanly
- [ ] `node_modules` is not inside the vault

**Evidence:** Screenshot of the browser page. Note the Session 1 sitting in the daily note.

---

## Session 2 — Read the vault (40–50 min)
**Goal:** A tiny program that *reads* `NOW.md` and prints this week's missions. No writes yet.

**You'll learn:** How a file path works on Windows, how frontmatter and Markdown checklists look to a program, and why we read first and write later.

**Steps:**
1. Create a `learners.json` (or a `.env` you do not commit) that points at `C:\Users\shilo\Documents\Shiloh HQ`. Never hard-code secrets; a local path is fine.
2. In `packages/core` or a simple `src/vault` folder, write a function that reads `NOW.md` as UTF-8 and returns the mission lines (`- [ ]` / `- [x]`) under `## This week's missions`.
3. Use a **copy** or fixture for tests if you can (a sanitized `NOW.md`, not live writes). If you test against the real vault, **read only**.
4. Show the missions on the page as a plain list. Missing data shows as "—" — never invent a number.
5. Do not write to the vault in this session. Do not create `45-tasks/` or `.hq/` yet (that's the default, but wait until the first write session and mention it in the daily note).

**Done when:**
- [ ] The page lists the real missions from `NOW.md`
- [ ] A refresh after you tick a mission by hand in Obsidian (optional, with Dad) would show the change, or you can explain how it would
- [ ] There is still no write code

**Evidence:** Screenshot of the missions list next to Obsidian. Daily-note line.

---

## Session 3 — My Day (45–50 min)
**Goal:** The morning home: energy check-in, 3 daily quests (one suggested), XP bar, weekly ring with grace, a path strip, and a small COLT mascot.

**You'll learn:** How to turn rules into a suggestion (score, then a "why" line), and how to lay out a screen from the mockup.

**Steps:**
1. Open `dashboard-mockup.html` and match **My Day** — not pixel-perfect, but the same pieces.
2. Build `suggestNext(energy, minutes)` from spec §8. Show the top 3 as quest cards. The first one gets the big Start button. Each card has a first move and an XP label.
3. Add an XP bar and level (you can start at 0 XP; sample numbers are fine if labeled SAMPLE).
4. Add the weekly ring: filled days, empty days, one grace slot. Copy must never say "you broke a streak."
5. Draw the current path (4–6 unit nodes: certified / claimed / current / locked). Use Constitution 101 / 7th ELA as sample if live unit names are still thin.
6. Add a simple COLT mascot (SVG, not a random image from the internet) and one line: "Pick one quest. I'll sit with you."

**Done when:**
- [ ] You can change energy or block length and the 3 quests resort
- [ ] Each quest has a why-line and a first move
- [ ] The weekly ring and path are visible
- [ ] Start is not wired to a real timer yet (that's Session 4) — a `console.log` is enough

**Evidence:** Screenshot of My Day. Daily-note line.

---

## Session 4 — Focus timer (40–50 min)
**Goal:** Full-screen focus: a shrinking ring, the task name, the first move, a parking lot, pause, and end-now. At zero (or end-now): Done / Partly / Stuck.

**You'll learn:** How time works in a web page (`Date.now()`, don't trust `setInterval` alone), and how a focus mode hides everything else.

**Steps:**
1. Start on a quest's Start button. Duration is 15, 20, 25, or 50 minutes (or the card's estimate, capped by the block).
2. Draw a ring that shrinks. Store the start time so a refresh doesn't wipe the timer.
3. Add Pause, a parking-lot text box (not saved as a journal feeling — it's a scratch pad; if you persist it, put it under the task log, not in "just talking").
4. On finish, show the three outcomes. Don't write to the vault yet; keep the result in memory and show it on screen.

**Done when:**
- [ ] You can start, pause, and finish a short test (use a 15-second "demo speed" button, like the mockup)
- [ ] The three outcomes appear
- [ ] Refresh mid-timer does not reset to a full block

**Evidence:** Screenshot of the running timer and of the outcome buttons. Daily-note line.

---

## Session 5 — Check-off, evidence, celebration (45–50 min)
**Goal:** Done asks for proof, writes a **pending** evidence note, ticks a NOW mission when it matches, awards claimed XP, and plays a short celebration. Partly logs minutes only. Stuck goes to a flag (wired fully in Session 6).

**You'll learn:** Exact, small file edits; why evidence is born pending; and how a celebration can be honest without becoming a slot machine.

**Steps:**
1. Before any write, confirm the path is under `50-evidence/2026-Q4/` and that `verified: pending` is hard-coded (ignore any input that says `yes`).
2. Create the note from [[evidence]]. Unique filename (vault lint cares).
3. If the task is a weekly mission, flip only that `- [ ]` to `- [x]` in `NOW.md`. If the line changed under you, stop and fail safely — don't rewrite the file.
4. Add a short celebration: a check burst, an XP pop, a COLT line ("Nice. It's pending for Dad."). No confetti storm, no auto-start of the next quest.
5. This is the first session that may create `.hq/` (event log + progress) and, if you need a task note, `45-tasks/`. That's the **default** Dad hasn't formally boxed yet — mention it in the daily note and in your evidence. Don't create them "just in case" if you can store the first write as evidence + NOW only.

**Done when:**
- [ ] Doing a quest end-to-end leaves a new pending evidence note
- [ ] `verified:` in that note is `pending`
- [ ] A matching mission in NOW is ticked (or you logged why it wasn't)
- [ ] The celebration runs once and returns you to My Day

**Evidence:** Link the new evidence note. Daily-note line. Leave it pending for Dad.

---

## Session 6 — Notes and Stuck (25–40 min)
**Goal:** Did / Learned / Stuck on / Tomorrow's first move write to today's daily note. The Stuck button flags a task without treating it as a failure.

**You'll learn:** How to append to a section without deleting what was already there, and how to create a daily note from [[daily]] if it is missing.

**Steps:**
1. If `40-journal/daily/YYYY-MM-DD.md` doesn't exist, create it from the template. Fill the date. Don't overwrite a note that's already there.
2. Append, don't replace, the four prompts.
3. Stuck on a task: set a stuck flag on the task (or a line in its log), show it to Dad later, and offer "Ask COLT" as a next step (a message is enough; a real handoff can wait).

**Done when:**
- [ ] Saving the four boxes updates the daily note
- [ ] Running it twice doesn't wipe the first save
- [ ] A stuck flag appears on My Day or the Board

**Evidence:** The daily note itself is the evidence. Keep `verified: pending` if you also file a formal evidence note.

---

## Session 7 — Your Board, kanban (45–50 min)
**Goal:** A Monday.com-style board that is **yours**: Now / Next / Later, New task, due date, priority, drag or move-up / move-down. This is Skill-up 0 (always on).

**You'll learn:** What a kanban board is, why "Now" should stay small, and how the same task can appear as a quest on My Day and as a card on the Board.

**Steps:**
1. Add a **Board** tab. Match the mockup's kanban: three lanes, cards with due date, estimate, priority, and a start button.
2. New task: title, lane, due, estimate, first move. Save it (to `45-tasks/` if you're using the default, or to a local list wired for Session 2's reader).
3. You can pin up to 2 cards. You cannot edit academic weight W.
4. Show a **Skill-up** strip at the top. Lesson 1 ("Break it down") is available to start; 2–6 are visible but locked. Clicking a locked view says "Start the 8-minute lesson to unlock" — not "reach Level 8." You don't have to build the lessons this session.
5. My Day stays the morning default. The Board is where you manage the work.

**Done when:**
- [ ] You can add a task and move it between lanes
- [ ] Due dates and priority show on the card
- [ ] The Skill-up strip is visible
- [ ] A task you add can also show up as a "something else" quest (or you have a written note for how it will)

**Evidence:** Screenshot of your board with at least one real task you created. Daily-note line.

---

## Session 8 — Dad's Headmaster view (40–50 min)
**Goal:** An oversight board (groups: Needs verify, Pending proposals, Open loops, This week). Verify works **only** after a PIN unlock, writes one row to [[verifications]], sets `verified: yes` on that evidence note, and awards the Certified seal + bonus XP.

**You'll learn:** The difference between a claimed done and a certified done, and why a program has to enforce that — not a prompt.

**Steps:**
1. Build the board from real pending evidence and proposal titles (read-only for proposals; never write `decision:`).
2. Parent mode is locked on load. A PIN prompt unlocks it for 15 minutes. For development, a local PIN stored **outside the vault** (for example `%APPDATA%\hq\`) is fine. Dad sets the real PIN later. Never commit a PIN to git.
3. Verify is disabled until unlock. After unlock, Verify appends one table row and updates only that evidence note's `verified` / `verified_by` / `verified_on`.
4. Add a test that a fake "agent" caller cannot verify. The test must fail the write, not just hide the button.
5. The top strip is "On track for Fall 2027?" from [[hs-readiness]]. XP is a faint engagement note, not a gate.

**Done when:**
- [ ] Locked mode cannot verify
- [ ] Unlocked mode writes a verification row on a **test** evidence file first (a fixture), then, with Dad watching, you may point it at a real pending note
- [ ] An automated test shows an agent principal is rejected
- [ ] You never commit the PIN

**Evidence:** Screenshot of the locked board and of the test output. If you verified a real note, Dad already has the row. If you only used a fixture, say so.

---

## Session 9 — Agent tools and the guard (45–50 min)
**Goal:** The same actions work from a command line and (if you get there) MCP: `today`, `tasks`, `start`, `stop`, `done`, `note`, `progress`, `suggest`. The guard blocks `verified` and `decision` for every non-parent principal.

**You'll learn:** What an API is (one core, several doors), and why the lock lives in the core, not in the screen.

**Steps:**
1. Build an `hq` command that prints JSON (`hq progress --json`, `hq suggest --energy ok --minutes 25 --json`).
2. Reuse the exact functions the UI uses. No second copy of the write logic.
3. Add guard tests: agent tries to set `verified: yes` → 403 and a `guard.denied` event; agent tries `verify_evidence` → rejected; parent session on a fixture → allowed.
4. If time: a stdio MCP entry that exposes the same tools. If not, write a "what's left" note and stop.

**Done when:**
- [ ] `hq suggest --json` returns 3 quests with why-lines
- [ ] The guard tests pass
- [ ] You can explain (in the daily note) who is allowed to verify

**Evidence:** Paste the test output into an evidence note (pending). Daily-note line. This is a real MVP checkpoint: a morning on My Day, a card on your Board, and a blocked fake verify.

---

## Later sessions (v1 Skill-ups) — after the MVP is in daily use

### Session 10 — Skill-up 1: Break it down (40–50 min)
**Goal:** A Brilliant-style 8-minute lesson, then projects and subitems on the Board.

**You'll learn:** How to slice a project into tasks, and each task into a next action.

**Steps:** Write the lesson as 5–8 short interactive steps, ending with a practice on a real item (for example, "Pick the next course" → three subitems). Unlock New project, group-by-project, and subitem progress on cards. Vault workstreams (The Civ, Khan ELA) appear as projects you don't have to recreate.

**Done when:** The lesson can be finished (and only finished by you, not by COLT). One project has at least two tasks, one task has a subitem. Locked views still say "start the lesson," not "level up."

**Evidence:** Screenshot of the board grouped by project. Daily-note line.

### Session 11 — Skill-up 2 and 3: Table + the weekly ritual (45–50 min)
**Goal:** A table view (Name, Status, Priority, Due, Estimate, Project) with sort/filter, a calendar, a 15-minute Monday plan, and a 10-minute Friday self-review.

**You'll learn:** When a table beats a kanban, how to estimate, and how to plan a week without overloading Now.

**Steps:** Two short lessons. Monday plan writes a day-plan and can fill [[NOW]] missions (with your confirm). Friday self-review walks done / partly / not done, carries work forward without shame, and is ready to show Dad at the joint review.

**Done when:** You have run one Monday plan and one self-review on real tasks. The table sorts by due date.

**Evidence:** Screenshot of the table and of the Monday plan. Weekly or daily note.

### Session 12 — Skill-up 4–6: Timeline, automations, your dashboard (45–50 min)
**Goal:** Timeline / Gantt, dependencies, two quiet automations, and your dashboard (tasks moved, on-time %, minutes, claimed vs certified).

**You'll learn:** "This can't start until that is done," when a rule helps, and which numbers matter.

**Steps:** Lessons 4–6 can be one sitting if they're short, or split. Automations allowed in v1: "when due tomorrow, move to Now" and "when status is done, ask for proof." No shame pings, no streak threats. Your dashboard does not replace Dad's P1 gates.

**Done when:** Two tasks have a dependency that the timeline shows. One automation has fired once (or a dry-run log shows it would). Your dashboard shows claimed vs certified correctly.

**Evidence:** Screenshots of the timeline and of your dashboard. Daily-note line.

---

## If you get stuck
- Stay on the current session. Don't "just install one more thing."
- Copy the exact error. Ask COLT for a hint, then an explanation, not a full rewrite of your file.
- Still stuck after two tries: stop, write it under **Stuck on** in the daily note, and pick it up next sitting. That's how the dashboard itself will work.

## After a sitting (bookkeeping)
You don't have to do vault-wide bookkeeping — COLT can help — but do leave: a daily-note line, evidence when the session says to, and a commit in `C:\Users\shilo\Projects\hq-dashboard` with a plain message ("Session 3: My Day quests and path").
