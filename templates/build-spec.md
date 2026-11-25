---
type: build-spec
slug: <slug>
status: draft
date: {{date}}
repo: <github-owner>/<slug>
local_path: C:\Users\shilo\Projects\<slug>
quadrant: "[[systems-self-command]]"
---
# Build Spec — {{title}}

## 1. Stack & Environment
- **Runtime / UI / Storage:** 
- **Local dev target:** `127.0.0.1` against sanitized fixture data first (never live personal data before guard tests pass).
- **New installs needed (Toolshed gate — Dad required):** None / list here.

## 2. Permission & Privacy Boundaries
- Vault stays source of truth (or read-only input); no code or `node_modules/` in `Shiloh HQ`.
- Agents never write `verified`, `decision`, `00-charter/`, or `55-progress/verifications.md`.
- Zero PII or secrets in repo (`rg` scan required before merge).

## 3. Build Slices (25–50 min each)
- **Slice 1:** 
- **Slice 2:** 
- **Slice 3:** 

## 4. Definition of Done
- [ ] Matches approved spec slice (no unapproved scope)
- [ ] Unit and permission-guard tests pass
- [ ] Shiloh reviewed PR + tested locally on clean fixture data
- [ ] `rg` PII/secret scan clean + Dad signed off