---
type: plan
status: draft
date: 2026-11-24
quadrant: "[[venture-craft]]"
---
# Venture Brief: Homeschool OS (Productizing Shiloh HQ)

Linked to: [[shiloh-hq-venture-dashboard]] | [[shiloh-hq-venture-roadmap]] | [[playbook-persona-creation]] | [[shiloh-playbook]]

## 1. The Problem
US homeschool parents (3.4M+ K–12 students in 2024–2025 per [NHERI](https://nheri.org/how-many-homeschool-students-are-there-in-the-united-states/), still growing in 2025–2026 per [Johns Hopkins](https://education.jhu.edu/edpolicy/policy-research-initiatives/homeschool-hub/homeschool-growth-2025-2026/)) want their teens to become self-directed learners without losing academic accountability. Today they juggle scattered tools—Khan Academy, Google Calendar, spreadsheets, PDFs, and generic AI chats that just hand students the answer instead of coaching them.

## 2. Our Solution (What We Already Built Internally)
**Homeschool OS** (working internal name: *Shiloh HQ*) turns a local-first Obsidian vault + AI agent workspace (`AGENTS.md` + Grok Build / Cursor) into a structured Student-CEO operating system:
- **15 Agentic Skills**: `daily-checkin`, `monday-plan`, `friday-review`, `tutor-session`, `khan-sync`, `khan-coach`, `status-update`, `readiness-exam`, `talk-to-knight`, `log-evidence`, `wiki-ingest`, `parent-report`, `verify-evidence`, `run-diagnostic`, `quarterly-review`.
- **Socratic AI Coach Persona**: Guides and quizzes instead of doing the student's work.
- **60/40 Priority Board & Status Tracker**: Balances core academics (60%) and self-directed craft/interests (40%), paired with a local HTML Command Center dashboard.
- **Readiness Examiner & Parent Verification Loop**: Standards-aligned diagnostic exam banks (generalized from TEKS for all 50 states), Google Calendar rhythm, and a `proposals/` parent-approval workflow.

> **Sanitization Rule**: Anything shipped outside our family MUST strip all personal details (full names, Texas/TEKS-specific personal records, family calendar, and private logs) and ship with sample/neutral demo data. The public brand uses only the approved [[playbook-persona-creation|persona]]—never Shiloh's real name, face, location, school, or personal accounts.

## 3. Target Customers (US Homeschool Segments)
1. **Primary Beachhead — Tech-Forward Middle/High School Homeschool Families (Grades 6–12)**: Parents who already use Notion/Obsidian, Khan Academy, or AI tools and want a structured independence system for their 11–17-year-old.
2. **Secondary — Father/Parent-Coached "Builder" Families**: Entrepreneurial/STEM homeschool dads and moms looking for project-based learning (Forge/Venture style) + clean parent oversight.
3. **Future — Homeschool Co-ops & Micro-Schools**: Small groups (5–30 families) wanting a shared operating template + diagnostic tracker.

## 4. Product Concept Options (Laddered Offer)
| Tier | Offer | Price Hypothesis | Product Hunt Fit |
| :--- | :--- | :--- | :--- |
| **Free Lead Magnet / Interactive Demo** | **Live Web Readiness & Command Center Demo + "Lite" Starter Vault** (interactive HTML/web preview + free starter skills) | $0 | **Essential for PH**: PH does not feature static templates/courses alone; a live interactive web tool/setup wizard makes it feature-eligible. |
| **Core Digital Product (MVP)** | **Homeschool OS Pro Kit**: Sanitized Obsidian Vault + `AGENTS.md` + all 15 Skills + HTML Dashboard + Setup Wizard + 5-min Video Walkthrough | $39–$49 one-time (Founding price $29) | Main checkout CTA via Thomas's Gumroad/Stripe. |
| **High-Touch Upsell** | **Guided Family Onboarding ("Headmaster Setup")**: 45-min parent+student setup call led by Thomas (persona-branded materials or faceless screen demo only) to configure courses, calendar, and AI routing | $149–$199 | Validates willingness-to-pay & feeds real customer insights back into the OS. |

## 5. Public Cofounder Persona
A **persona** is a separate public builder identity—the handle, look, and on-brand voice the audience meets—so the teen cofounder can ship and tell the story without putting a real child's identity on the brand. Inside the vault we still say "Shiloh" and "Thomas"; outside it, only the approved persona (and Thomas, where an adult legal identity is required) appears. Create and maintain it with [[playbook-persona-creation]].

**Proposed public-identity rules** (count only when Dad sets `decision:` on [[20261124-venture-shiloh-hq-product]]):
- **Handle / display name**: Shiloh proposes 3 options; Dad approves one. It must not be the real name or a clue to school, city, or personal accounts.
- **No personal details in the brand**: no real name, face, location, school, or personal accounts. Default public language is "a homeschooled teen Student-CEO," not exact age, unless Dad signs off.
- **Visual & voice**: illustrated avatar, character, or fully faceless screen + captions. No real face and no voice-identifying audio unless Dad signs off case by case (Dad may narrate instead).
- **Accounts**: brand email and socials are created in the product/persona name and **held by Dad**. The persona is not a legal account holder and does not get Product Hunt, Stripe, or other 16+/18+ logins.

## 6. Founder Story Angle
**"Built with a homeschooled teen Student-CEO, led publicly by Dad."**
Most edtech is built by adults guessing what teens will actually open every morning. Homeschool OS was built *inside* a real homeschool by a dad and a teen Student-CEO who wanted an AI Chief of Staff plus a real dashboard—not naggy checklists.
- **Public posture**: Thomas is the named adult cofounder, Maker, and account holder. The teen cofounder appears only as the approved persona in copy, avatar/faceless demos, and Dad-signed-off content. Never use Shiloh's real name, face, location, school, or personal accounts in the brand.

## 7. Venture Goals & Measurable Milestones
1. **First Sale**: Close 1 paying non-family US homeschool customer within 8 weeks of proposal approval (Milestone: 5 pre-orders or $150 gross revenue).
2. **Product Hunt Feature**: Ship a live interactive companion + Homeschool OS Pro Kit on Product Hunt via Thomas's account, aiming for Homepage Feature + >=50 genuine comments/feedback threads.
3. **Founder/Influencer Flywheel**: Publish 8 weekly build-in-public updates (Thomas + approved persona) and grow a 250+ parent/builder email & X audience without exposing Shiloh's identity or breaking the 60/40 school balance.

## 8. Shiloh's Learning Objectives by Phase
- **Discover & Validate**: Separate "cool to me" from "painful enough for a parent to pay for" using structured scoring and unbiased interviews.
- **Prototype & Ship**: Refactor personal messy tools into clean, documented, zero-PII software someone else can install in <15 minutes.
- **Brand, Finance & Law**: Understand unit economics, pricing psychology, copyright/EULAs, COPPA, and why minors partner with adults on contracts/accounts.
- **Market & Sell**: Learn ethical persuasion, storytelling without hype, handling real customer feedback, and running honest weekly metric retros.
