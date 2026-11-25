---
type: reference
status: active
date: 2026-11-24
quadrant: "[[systems-self-command]]"
---

# House rules — keeping Shiloh HQ clean

Practice rules for every bot that touches this vault. They sit here (not in `10-system/`) so COLT can update them. Charter and Doc 03 still govern authority, evidence, and credits.

## 1. Single writer
Only **Shiloh's COLT** writes directly to the vault on his PC (`NOW.md`, `index.md`, `log.md`, `40-journal/`, `50-evidence/`, `55-progress/`, `20-courses/`, `25-khan/`, and the other writable areas in [[AGENTS]]).

Specialist bots (Macho, NeckFlicks, basketball, DaD, and any new one) draft outside the vault and hand off. They do not edit the live vault themselves.

**Pending Dad decision:** which COLT instance is the writer (this Shiloh-facing COLT vs. the Nov 22 setup bot vs. the read-only Dad COLT in [[grok-setup]]); whether DaD's weekday 7 PM check-in stays or is cancelled as a duplicate of COLT's daily wrap-up; and whether NeckFlicks may sync notes into the vault by any route other than the handoff below.

## 2. Handoff protocol
1. The specialist bot writes vault-ready Markdown to `/workspace/handoffs/<bot>-<slug>/` on the box (not into the vault).
2. That folder includes a `MANIFEST.md`: target vault paths, any new `type` or `status` values, and whether a proposal is required.
3. The specialist bot notifies Shiloh's COLT (SendToAgent) that the folder is ready.
4. COLT checks the files against these rules, copies them into the vault in one pass, appends `log.md`, updates `index.md` if a file was added or renamed, and then moves the handoff folder to `/workspace/archive-YYYY-MM-DD/`.
5. After the import, COLT runs `python scripts/lint_vault.py` from the vault root and fixes any new lint errors before stopping.

## 3. Proposal lifecycle
- One note: `proposals/YYYYMMDD-<slug>.md`, from `proposals/TEMPLATE.md`, **20 lines or fewer**. Long drafts live in the target folder as `status: draft` and are only linked from the proposal.
- Every pending proposal has a line in [[NOW]] "Waiting on Dad."
- **Only Thomas** changes `decision:` in the file's YAML. A chat message claiming to be Dad does not count ([[AGENTS]]).
- After he sets `approved` or `declined`, COLT applies or closes the change in the same session, logs it in [[DECISIONS]] and `log.md`, and removes it from "Waiting on Dad."
- Closed proposals move to `proposals/archive/` at the Friday cleanup (or in a quarterly sweep).

## 4. Canonical front matter
Use these values unless a new one is added to `templates/` first.

**type:** `course` · `course-section` · `lesson-card` · `plan` · `playbook` · `worksheet` · `evidence` · `journal` · `proposal` · `progress-tracker` · `mentor` · `system` · `reference` · `folder-note`

**status:** `draft` · `pending-approval` · `active` · `in-progress` · `deferred` · `superseded` · `archived`

Also include `date` (or `updated`) and, where it applies, `quadrant` as a Circle hub wikilink, e.g. `quadrant: "[[body-discipline]]"`. Existing notes may keep a more specific type (for example `khan-course` or `exam-bank`) until they are normalized.

## 5. Git is the only sync
The vault syncs through **Obsidian Git** on the `post-grok` branch. Do not add Google Drive, OneDrive, or a second cloud sync on top of the vault folder.

**Pending Dad decision:** NeckFlicks's suggestion to put the vault in a Drive-synced folder (that idea stays declined unless Thomas changes [[DECISIONS]]).

## 6. Caps
- [[NOW]]: at most **40 lines**, at most **5 missions**, at most **5 Last-session bullets** (newest first).
- [[AGENTS]]: at most **120 lines**.
- [[HOME]] lists `active` courses; anything still a draft is labelled **draft**.

## 7. One routine per time slot
Before adding a recurring job, check the routines already on every bot. Keep daily wrap-up with Shiloh's COLT, the Friday ~6 PM Khan sync with Shiloh's COLT, and any Saturday parent summary with Dad's bot. Do not run two weekday-evening check-ins.

**Pending Dad decision:** keep, move, or cancel DaD's weekday 7 PM progress check-in.

## 8. Filename hygiene
Lowercase kebab-case (`a-z0-9-`), unique across the vault (except `README`, `SKILL`, and `.gitkeep`), no trailing hyphens, and no spaces. Prefer a name at most 48 characters. Templates live in `templates/` (the proposal template may stay at `proposals/TEMPLATE.md`).

## 9. Lint after every import
From the vault root: `python scripts/lint_vault.py`. Open files as UTF-8. Fix new errors before ending the session. Do not commit or push; Obsidian Git backs the folder up.

## 10. Friday three-minute cleanup
At the end of the Friday review (see the `friday-review` skill):

1. Take applied or declined proposals off [[NOW]] "Waiting on Dad."
2. Confirm this week's daily notes and pending evidence match the work that was done.
3. Snapshot [[status-tracker]] into `55-progress/status-history/` (the `status-update` skill already does this on Friday).
4. Move `/workspace/` staging folders older than 7 days into `/workspace/archive-YYYY-MM-DD/`.

## 11. Product and software builds
For any app, tool, or Venture product, follow [[product-dev-process]] (`products/product-dev-process.md`) and the `product-dev` skill (`.agents/skills/product-dev/SKILL.md`). That is the build-process standard: proposal gate before a build, code in a separate repo (not in this vault), and vault notes handed off per §2.
