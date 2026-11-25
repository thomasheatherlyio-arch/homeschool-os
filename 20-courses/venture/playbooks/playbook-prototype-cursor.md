---
type: playbook
status: active
date: 2026-11-24
quadrant: "[[venture-craft]]"
---
# Playbook 3: Prototype Building with Cursor ( & Grok Build)

Linked to: [[playbooks-index]] | [[shiloh-hq-product-hunt-launch-notes]] | [[shiloh-playbook]]

## Purpose
Turn a personal working setup (like Shiloh HQ) into a clean, zero-PII, 15-minute-installable MVP + live interactive web demo using Cursor—without bloating scope or leaking family data.

## When to Use
- After validation passes in [[playbook-customer-discovery-validation]].
- Whenever building a new digital product, interactive demo, or companion web tool.

## Step-by-Step Instructions
1. **Lock the 1-Weekend MVP Scope**: Write a 1-page spec with **max 3 core features**. Everything else goes into `v2-backlog.md`.
   - *For Homeschool OS*: (a) Sanitized Obsidian Starter Vault (`AGENTS.md` + 15 generalized skills + sample student "Alex"), (b) 1-click Local HTML Dashboard + Interactive Web Demo/Setup Wizard (critical for Product Hunt featuring!), (c) 5-minute Quickstart README.
2. **Create a Clean Repo (Zero Personal History)**:
   - NEVER push your live family vault to a public or product repo! Start a **brand-new repo** (`homeschool-os-starter`) so git history contains zero personal logs, names, Texas/TEKS-specific student records, Google Calendar IDs, or API keys.
3. **Strip & Generalize (Mandatory Sanitization Checklist)**:
   - Replace real names (`Shiloh`, `Thomas`, `COLT` if private, real cities/schools) with generic placeholders (`Alex`, `Parent`, `ChiefOfStaff`).
   - Generalize Texas/TEKS-specific exam banks into customizable US Standards templates (or clearly label as customizable sample banks).
   - Remove all `.env`, tokens, OAuth JSONs, calendar IDs, and personal email addresses; add strict `.gitignore`.
4. **Build in Cursor Using the Spec -> Slice -> Verify Loop**:
   - Work one small slice at a time (e.g., first the sanitized `AGENTS.md`, then the sample dashboard, then the web interactive preview).
   - After every AI edit, **Shiloh runs the app/vault himself** in a clean test folder to prove it works for a stranger.
5. **15-Minute Stranger Test (With 2 Beta Families)**:
   - Watch a beta parent/teen unzip and follow the Quickstart on a fresh machine without you touching the keyboard. Fix every place they get stuck.
6. **Privacy & Dad Sign-Off Gate (Mandatory)**:
   - Run `rg` / secret scan across the entire repo; Thomas reviews the git diff and live demo URL before publishing or sharing externally.

## Pre-Ship Repo & Sanitization Checklist
- [ ] Brand-new repo (no personal family git history)
- [ ] Zero real names, faces, school names, cities, or family calendar links
- [ ] Zero `.env`, API keys, OAuth tokens, or personal emails (`rg` verified)
- [ ] Clean sample data (`Alex / Sample Family`) pre-loaded so dashboard looks great on first open
- [ ] Interactive browser demo works without login/signup (for Product Hunt visitors)
- [ ] Fresh-machine 15-minute install test passed by a beta tester
- [ ] **Thomas sign-off recorded**

## AI-Agent Prompt (Coach Mode)
> "You are my Senior Engineering Mentor in Cursor per [[shiloh-playbook]]. Help me scope and build `<MVP>` in small slices. Before writing code, ask me to define the 3 MVP features and what I'm explicitly cutting. After each slice, give me a manual test checklist so I verify it myself on a clean folder. Never include real personal names, Texas/calendar specifics, or secrets—flag any PII you spot immediately."
