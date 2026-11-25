---
type: playbook
status: active
date: 2026-11-24
quadrant: "[[venture-craft]]"
---
# Playbook 6: Legal, IP, Privacy & Teen-Founder Setup

Linked to: [[playbooks-index]] | [[playbook-persona-creation]] | [[shiloh-hq-product-hunt-launch-notes]] | [[shiloh-playbook]]

> **Educational Disclaimer**: This playbook is educational study material for the Venture course—**not legal or tax advice**. Before forming an entity, signing contracts, or scaling sales, Thomas should consult a qualified business attorney and CPA in your state.

## Purpose
Keep a 14-year-old co-founder legally protected, compliant with US minor/contract/privacy laws, and clean on intellectual property when selling digital products.

## When to Use
- Before taking your first dollar (Phase 4) and whenever launching a new product line.

## Key US Rules & Decisions (With Sources)

### 1. Minors & Contracts (Why Dad Signs)
- Under US state law, contracts signed by minors (<18) are generally **voidable** by the minor (the doctrine of *disaffirmance*), which is why Stripe, Gumroad payouts, banks, and B2B buyers require an adult ([Legal.com](https://legal.com/edu/business/can-you-get-an-llc-under-18)).
- **Rule**: Shiloh never signs vendor, processor, or customer contracts personally; **Thomas (18+)** is the contracting party / Representative.

### 2. Business Entity Options (Parent-Led)
- **Option A — MVP Start (Parent Sole Proprietorship / DBA)**: Fast, low-cost way for Thomas to test <$500 in initial sales while tracking clean P&L; no liability shield.
- **Option B — Scale / Liability Shield (Manager-Managed LLC)**: Thomas forms a **manager-managed LLC** and serves as the adult Manager (signing binding LLC contracts, opening the business bank account, managing Stripe/Gumroad), while Shiloh can hold an ownership interest if desired (often via UTMA or family structure per state law—[TaxShark](https://taxsharkinc.com/can-a-child-be-an-llc-member/), [Terms.law](https://terms.law/LLC-Minors/minors-as-llc-members-guide.html)).
- **Tax Lesson (Earned Income vs. Kiddie Tax)**: Passive profit distributions to a minor can trigger "Kiddie Tax" above IRS unearned-income thresholds, whereas reasonable compensation paid for *actual work performed* (coding, documentation, design) is earned income ([Able Finance](https://able-finance.com/business-law/minor-business-ownership-legal-capacity/), [TaxShark](https://taxsharkinc.com/can-a-child-be-an-llc-member/)). Keep a real work log!

### 3. COPPA & Student Privacy (Critical for a Homeschool Product!)
- **The Rule**: Under **COPPA** ([16 CFR Part 312](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312); amended FTC Rule effective June 23, 2025 / compliance April 22, 2026 per [Federal Register](https://www.govinfo.gov/content/pkg/FR-2025-04-22/html/2025-05904.htm)), online services directed to or knowingly collecting personal information from **children under 13** must provide direct notice and obtain **verifiable parental consent**.
- **Our Clean Architecture**:
  1. **Buyer = Parent (18+)**: Checkout, marketing emails, and support accounts are strictly for parents/guardians (18+), never children under 13.
  2. **Local-First Product**: Because the Obsidian vault runs locally on the family's own PC, **we collect zero student data on our servers**.
  3. **Web Demo Rule**: Any interactive Product Hunt web demo must run **client-side in the browser with sample data** and collect **zero personal data** (no student names, ages, or emails inside the demo).

### 4. Selling Obsidian Templates (IP & EULA)
- **Allowed**: Per [Obsidian's License Overview](https://obsidian.md/license), Obsidian is free for commercial use and **you retain 100% ownership of all content you create in Obsidian**. You do **not** need an Obsidian Commercial license to sell your own vault templates.
- **Forbidden**: Never bundle or redistribute the Obsidian software binary, installer, or Obsidian's own proprietary app text/assets.
- **Your EULA**: Ship a plain-English `LICENSE.md` inside the kit stating: (a) 1 purchase = 1 household family license (personal/homeschool use), (b) buyers may customize for their family, (c) no reselling, redistributing, or publishing the kit as their own template.

### 5. Website Terms, Privacy Policy & Trademarks
- Publish clear **Terms of Sale** (refund window—e.g., 14-day no-questions refund for digital kits, "educational productivity tool, not accredited schooling or legal advice") and a **Privacy Policy** (what Gumroad/email tools collect; zero under-13 collection).
- **Trademark the product / brand name (and the approved persona handle if it will be used as a brand), not a personal name.** Run a free [USPTO Trademark Search](https://tmsearch.uspto.gov/) on the product name and persona handle before locking them. Do not file or brand around Shiloh's legal name. The persona is a **brand asset** owned and controlled by Thomas / the parent entity—not a legal person, not a contracting party, and not an account holder on Stripe, Gumroad, or Product Hunt ([[playbook-persona-creation]]).

## Pre-Sale Legal Readiness Checklist
- [ ] Thomas selected MVP entity path (Parent Sole Prop vs. LLC) & consulted CPA/attorney as needed
- [ ] All checkout/newsletter copy explicitly targets **parents/educators (18+)**
- [ ] Interactive web demo collects **zero PII** (runs local sample data only)
- [ ] `LICENSE.md` (Vault EULA) included; zero Obsidian software binaries bundled
- [ ] Refund policy, Terms of Sale, and Privacy Policy linked on checkout & footer
- [ ] USPTO trademark search completed on the **product/brand name and persona handle**, not a personal name
- [ ] Public legal pages and checkout copy use Thomas / the business + the approved persona only (no real teen identity)

## AI-Agent Prompt (Coach Mode)
> "You are an entrepreneurship educator explaining US business, IP, and privacy concepts to a teen founder and his dad (clearly noting you are NOT a lawyer). Walk us through [[playbook-legal-setup]] for `<PRODUCT>`: quiz me on why minors can't bind contracts, why we trademark the product/persona brand name rather than a personal name, help me check our product design against COPPA under-13 rules, and review our draft `LICENSE.md` EULA for clarity so Thomas can approve or send to an attorney."
