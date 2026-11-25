---
type: guide
status: active
date: 2026-11-24
quadrant: "[[systems-self-command]]"
---
# Shiloh HQ Product & Software Build Process

Lightweight 8-stage workflow for anything built in Shiloh HQ (internal tools and Venture products). Skill: `.agents/skills/product-dev/SKILL.md`.

## Stages & Owners
1. **Idea** — Shiloh or Dad (bot coaches scorecard)
2. **One-Page Brief** — Shiloh (`templates/product-brief.md`)
3. **Proposal Gate** — Dad sets `decision: approved` in `proposals/` (COLT drafts)
4. **Build Spec** — Specialist bot drafts (`templates/build-spec.md`); Dad reviews; Shiloh reads
5. **Build** — Bot / cloud agent in a **separate repo** (`C:\Users\shilo\Projects\<slug>`); Shiloh co-builds/tests
6. **Review & Demo** — Shiloh reviews PR + tests clean fixture; Dad runs PII/secret scan (`rg`) + signs off
7. **Release** — `templates/release-note.md` + SemVer (`v0.x.y` -> `v1.0.0`); COLT updates [[index]] and [[log]]
8. **Friday Retro** — Shiloh + COLT (`templates/product-retro.md`); pending evidence in `50-evidence/` for [[verifications]]

## Key Boundaries
- **Code stays out of the vault:** Never put source code, `package.json`, or `node_modules/` inside `Shiloh HQ`. Vault holds docs only (`products/<slug>/` and `70-dashboard/` docs).
- **Backlog:** Track work on one Vault Kanban (`45-tasks/` / dashboard Board), linking GitHub PRs — no duplicate GitHub Projects board.
- **Single-writer COLT:** Specialist bots stage notes in `/workspace/handoffs/<bot>/` on the box and message COLT via `SendToAgent`; code goes via branch/PR in the product repo.
- **Minor privacy:** Real names stay in `Shiloh HQ`. Anything public uses only a Dad-approved persona ([[playbook-persona-creation]]) and Thomas's adult accounts.
- **Hard locks:** Never edit `00-charter/`, `55-progress/verifications.md`, or `10-system/` without approval. Vault stays Git-backed only (no Google Drive sync).