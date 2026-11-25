---
name: product-dev
description: Manage the product and software build process for any Shiloh HQ app, tool, or Venture product from idea to shipped. Use when Shiloh or Dad says "build product", "new product", "product dev", "build spec", "release note", or "product retro", or when a specialist bot hands off a build.
---
# Product & Software Development Skill

1. **When to use:** Starting a new tool, app, or Venture product; writing a product brief or build spec; reviewing a code PR; shipping a release; running a product retro; or receiving a build handoff from a specialist bot (DaD, NeckFlicks, Macho, etc.). For detailed rules see [[product-dev-process]].
2. **Read first:** [[AGENTS]], [[NOW]], and the product's folder in `products/<slug>/` (or `20-courses/venture/shiloh-hq-product/` for the Homeschool OS venture). Never scan the whole vault.

## Stages and Owners
1. **Idea & Problem Check** — Owner: Shiloh or Dad (Specialist bot coaches via [[playbook-idea-research-scorecard]]).
2. **One-Page Brief** — Owner: Shiloh with COLT/Macho coaching (`templates/product-brief.md` -> `products/<slug>/brief.md`). Max 3 MVP features + explicit cuts.
3. **Proposal Gate** — Owner: Dad (COLT drafts `proposals/YYYYMMDD-<slug>.md`; **only Dad** sets `decision: approved` in YAML). Nothing is built, installed, synced, or published before `decision: approved`.
4. **Build Spec & Slice Plan** — Owner: Specialist bot drafts, Dad reviews, Shiloh reads (`templates/build-spec.md` -> `products/<slug>/build-spec.md`). Names separate repo, 25–50 min slices, installs (Toolshed rule), and guards.
5. **Build in Separate Repo** — Owner: Specialist bot / Cursor cloud agent writes code in `C:\Users\shilo\Projects\<slug>` and its own GitHub repo (`feat/<slice>` branch -> PR). Shiloh co-builds or tests locally on sanitized fixture data.
6. **Review, Guard Check & Demo** — Owner: Shiloh reviews the PR summary, tests locally, and posts a 2-line review comment; Dad runs PII/secret scan (`rg`) and signs off merges touching permissions, installs, or public copy.
7. **Release & Rollout** — Owner: Dad approves any external release, domain, or account; Specialist bot prepares `templates/release-note.md`; COLT updates vault docs, [[index]], and [[log]]. SemVer: `v0.x.y` internal -> `v1.0.0` stable.
8. **Friday Retro & Evidence** — Owner: Shiloh + COLT (`templates/product-retro.md`, aligned with [[playbook-metrics-and-retros]] and Friday review). File pending evidence in `50-evidence/` for Dad to verify.

## Step-by-Step Instructions
- **Backlog:** Track product tasks in a single Vault Kanban (`45-tasks/` or the product's vault board, linking GitHub PR numbers) — never split Shiloh across a separate GitHub Projects board.
- **Templates:** Copy from `templates/product-brief.md`, `templates/build-spec.md`, `templates/release-note.md`, and `templates/product-retro.md` into `products/<slug>/` (or the active Venture product folder).
- **Review loop:** Before accepting any build slice or PR, verify the Definition of Done: matches approved spec, guard/unit tests pass, Shiloh ran a local fixture test, `rg` PII/secret scan is clean, and Dad approved if public or P1.

## Boundaries (Non-Negotiable)
- **No code in the vault:** Source code, `package.json`, `.env`, and `node_modules/` never live inside `Shiloh HQ`. Use `C:\Users\shilo\Projects\<slug>` and a separate GitHub repo.
- **Proposal gate:** Never start builds, installs (Toolshed), Drive syncs, publishing, selling, or external accounts without Dad's `decision: approved` in `proposals/`.
- **Minor-privacy persona rule:** Real names stay inside the vault. Outside the vault (public repos, demos, Product Hunt, socials), use only the Dad-approved persona ([[playbook-persona-creation]]) and Thomas's adult accounts — zero real name, face, voice, school, city, or personal email.
- **Single-writer COLT & Handoff Protocol:** Specialist bots never write directly into `Shiloh HQ`. Bots stage Markdown in `/workspace/handoffs/<bot>/` on the box and notify COLT via `SendToAgent`; bots push code only to the separate product repo PR and send a release note + test checklist to COLT. COLT validates frontmatter/links, writes vault notes, runs `scripts/lint_vault.py`, and appends `log.md`.
- **Protected files:** Never touch `00-charter/` or `55-progress/verifications.md`, never set `verified: yes` or `decision:`, and never edit `10-system/` without an approved proposal.