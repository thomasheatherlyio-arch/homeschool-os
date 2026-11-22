---
type: decision-draft
status: superseded
date: 2026-11-22
---
# Agent architecture review — Grok (strategy) + Claude (execution)

> **Superseded 2026-11-22 (later the same day):** v1 is now Grok Build only, writing the vault directly; no Claude. See DECISIONS.md. Kept for history.
>
> Earlier: **Implemented 2026-11-22.** All 13 gaps were fixed (courses became `sections/` files rather than `units/`;
> the nightly Claude routine is live; Circle hubs, HOME and HQ-map.canvas added). Open: verify (a) and (b) below in Grok.

## What the research says (Nov 2026)

1. **Two different Groks.** *Grok app* (grok.com / mobile): Projects (aka Workspaces) hold files,
   chats and custom instructions; Connectors (built-in GitHub + custom MCP); Automations
   (scheduled runs; renamed from Tasks, July 2026). *Grok Build* (CLI): reads `AGENTS.md`
   root→cwd, `.grok/rules/`, `.grok/skills/<name>/SKILL.md`, and also `CLAUDE.md`,
   `.claude/rules/`, Claude skills. Shiloh will use the **app**, which does **not** auto-load
   skills — routing has to be explicit.
2. **Routing table pattern** (Ar9av/obsidian-wiki, 3.8k★): an always-on rules file maps
   "user says X" → "read skill Y". Cheap, tool-agnostic, works in a chat app that can only
   read files by path.
3. **Index + log pattern** (Karpathy LLM Wiki, obsidian-wiki): `index.md` (catalog) and
   `log.md` (append-only activity) updated after every operation; "compile, don't retrieve" —
   update existing pages instead of appending duplicates.
4. **Learner memory** (HKUDS/DeepTutor, 61k★): a tutor works because it keeps a persistent
   model of the learner (levels, gaps, what works), not because it has more content.
5. **Planner → executor handoffs**: write the plan to a file, executor runs against it; the
   main failure mode is ambiguous state, so handoffs need ids, status and acceptance criteria.
6. **Skill hygiene** (awesome-grok-build): frontmatter `name` + `description` on every skill,
   CI that validates skills; `grok inspect` lists what Grok Build loaded.

## Gaps in shiloh-hq today → fixes

| # | Gap | Fix | Effort |
|---|---|---|---|
| 1 | No intent → skill routing; Grok app can't discover `.agents/skills/` | Routing table in AGENTS.md with full paths | S |
| 2 | Only Claude-readable skill path | Add `.claude/skills` → `.agents/skills` link (Claude Code + Grok Build both read it) | S |
| 3 | No learner model | `60-companions/colt/learner-profile.md` (levels from Doc 09, interests, what works). Evidence-based only; never "just talking" | M |
| 4 | Courses are monoliths (Gym = 51 kB) — a tutoring turn loads the whole thing | Split each course into `course.md` (overview + progress) + `units/unit-NN.md` | M |
| 5 | Knights live in one doc — no per-mentor persona to switch to | `60-companions/knights/<name>.md`, one per seat; routing: "Hey <name>" loads that file | M |
| 6 | No Claude → Grok channel | NOW.md gets "Since last time" (Claude writes) + "Questions for COLT" | S |
| 7 | Handoffs lack id/status | Front matter: `id`, `status: open/done/blocked`, `touches:`, `done_when` | S |
| 8 | No index/log | `index.md` (vault catalog) + `log.md` (append-only; Thomas's audit trail) | S |
| 9 | No decision log in the vault | Port `DECISIONS.md` from homeschool-os; first entry = vault-first v1 | S |
| 10 | Doc 05 (roadmap) + Doc 17 (UI brief) describe the parked web app | Amend Doc 05 via PR; mark Doc 17 `status: parked` | S |
| 11 | Duplicate numbers 09/10 break `Doc 09` links | Rename to 09a/09b, 10a/10b and relink | S |
| 12 | Grok memory may retain "just talking" moments | Thomas reviews Grok memory settings with Shiloh; say so in persona | S |
| 13 | No validation | GitHub Action: skill frontmatter, broken wikilinks, AGENTS.md ≤ 150 lines | M |

## Role split

| | Grok (COLT) — strategy & thinking | Claude — execution |
|---|---|---|
| Talks to | Shiloh | nobody (Thomas on request) |
| Reads | AGENTS.md, NOW.md, one skill, one unit | handoffs, then whatever the handoff touches |
| Writes | handoffs only | everything else (PRs for charter/system) |
| Cost model | Grok subscription (flat) | Thomas's Claude plan, one batched run per day |

## Sync routine

```
 Sun 6pm   GROK Automation "Strategy brief"  → reads log.md + evidence + learner-profile
           → proposes next week (focus quadrant, 5 missions, next course units) as a handoff
 Mon AM    SHILOH + COLT  monday-plan  → accepts/edits the brief → handoff
 Daily AM  SHILOH: "COLT, morning"  → reads NOW.md, picks today's first move (no writes)
 Daily PM  SHILOH: "COLT, wrap up"  → daily note + handoffs for anything finished
 Daily 8pm CLAUDE routine  process-handoffs → NOW.md "Since last time", log.md, evidence, commit
 Fri       SHILOH + COLT  friday-review → handoff;  CLAUDE writes weekly note + "For Dad"
 Monthly   CLAUDE  wiki-lint + learner-profile refresh (from evidence only)
 Quarterly CLAUDE  quarterly-review draft → THOMAS signs off
```

**To verify before relying on it:** (a) can a Grok Automation use the GitHub connector? If not,
the Sunday brief arrives as a Grok notification and Shiloh pastes it into `handoff/inbox/`.
(b) Can the GitHub connector create issues/files? If not, every handoff is a paste + Obsidian Git
sync — still fine, just manual.
