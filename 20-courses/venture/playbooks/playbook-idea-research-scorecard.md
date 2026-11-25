---
type: playbook
status: active
date: 2026-11-24
quadrant: "[[venture-craft]]"
---
# Playbook 1: Idea Research & Venture Scorecard

Linked to: [[playbooks-index]] | [[shiloh-playbook]] | [[shiloh-hq-venture-brief]]

## Purpose
Prevent wasting weeks building something nobody wants. Force every idea through quick competitor research and a weighted 100-point rubric before spending time or money.

## When to Use
- Before starting any new venture or major product pivot.
- Whenever Shiloh has 2–3 competing ideas and needs to pick one winner.

## Step-by-Step Instructions (Coach-Don't-Do)
1. **Define the One-Liner (Shiloh writes)**: *"[Specific buyer] struggles with [specific painful problem], so we give them [specific product] to get [measurable outcome]."*
2. **Competitor & Alternative Scan (30 mins)**: Find 3–5 existing solutions (direct competitors AND "do nothing / spreadsheets"). Record price, what buyers love, and top 1-star complaints.
3. **Market Reality Check**: Verify there are enough reachable buyers in the US and that buyers already spend money on adjacent tools.
4. **Score the Idea Independently**: Shiloh scores each criterion 1–5 (1 = weak/unproven, 5 = strong/proven), multiplies by the weight, and writes a 1-sentence *evidence reason* for every score. No evidence = cap score at 3.
5. **Dad Challenge**: Thomas tries to poke holes in the two highest scores.
6. **Apply Decision Threshold**:
   - **75–100 (GO)**: Move to [[playbook-customer-discovery-validation]] and submit proposal.
   - **60–74 (REVISE / TEST)**: Do NOT build yet; run a 48-hour <$25 test on the weakest criterion first.
   - **<60 (KILL / PARK)**: Archive with lessons learned; pick another idea.

## Weighted Venture Scorecard Rubric (100 Points Max)
*Formula: `(Score 1–5 / 5) * Weight` = Weighted Points*

| Criterion | Weight | What 5/5 Looks Like | What 1/5 Looks Like |
| :--- | :--- | :--- | :--- |
| **1. Problem Urgency** | 20 | Hair-on-fire pain; families complain about it weekly | "Nice to have" vitamin nobody searches for |
| **2. Buyer & Willingness to Pay** | 20 | Clear buyer with card in hand (parents/businesses); existing $20–$100+ comps | Selling to broke teens with no proven paid comps |
| **3. Unfair Advantage / Founder Fit** | 15 | We already built/use it ourselves; authentic story nobody can copy | Generic AI wrapper anyone can clone in an hour |
| **4. Speed to <$25 MVP** | 15 | Shippable in 1–2 weekends for <$25 | Needs months of coding, hardware, or regulatory approval |
| **5. Distribution & Story Potential** | 15 | Clear niche communities + viral/founder-story hook (PH, X, YouTube) | No obvious place buyers hang out; boring story |
| **6. Learning Value & Teen Safety** | 15 | Teaches high-leverage skills; zero COPPA/safety red flags | High legal/safety risk or zero educational stretch |

---

## Filled Example: Scoring Shiloh HQ -> "Homeschool OS"
*Scored by Shiloh & reviewed by Thomas on 2026-11-24:*

| Criterion | Weight | Raw (1–5) | Weighted | Evidence & Honest Risk Note |
| :--- | :--- | :--- | :--- | :--- |
| **1. Problem Urgency** | 20 | 4.0 | 16.0 | 3.4M+ US homeschool students ([NHERI](https://nheri.org/how-many-homeschool-students-are-there-in-the-united-states/)); parents routinely struggle with teen independence & tool sprawl. *Risk*: Some parents prefer paper planners. |
| **2. Buyer & Willingness to Pay** | 20 | 4.0 | 16.0 | Buyer is US homeschool parent (18+); families already pay $30–$150+ for Notion templates, planners, and AI tutors. *Risk*: Must prove Obsidian isn't "too nerdy" for mainstream parents. |
| **3. Unfair Advantage / Founder Fit** | 15 | 5.0 | 15.0 | We literally run our daily homeschool on it (15 skills, Khan sync, Examiner, COLT, HTML dashboard). Authentic 14yo + Dad co-founders. |
| **4. Speed to <$25 MVP** | 15 | 4.0 | 12.0 | Core system already exists! Needs sanitization + a 1-weekend interactive web demo/setup wizard for PH eligibility (<$15 domain). |
| **5. Distribution & Story Potential** | 15 | 4.0 | 12.0 | Strong dad + teen-Student-CEO hook for PH, X, YouTube & homeschool groups, told via Thomas + an approved public persona. *Risk*: PH/LinkedIn are 16+, so Dad is the named maker; the real teen stays off the brand. |
| **6. Learning Value & Teen Safety** | 15 | 3.0 | 9.0 | Massive learning across code, sales, finance, law. *Deduction*: Requires strict PII/Texas stripping & privacy gate so Shiloh stays safe online. |
| **TOTAL SCORE** | **100** | — | **80.0 / 100** | **VERDICT: GO (>=75)** -> Proceed to [[playbook-customer-discovery-validation]]. |

**Top 3 Assumptions We Must Test Next**:
1. Will non-developer homeschool parents install and use an Obsidian + AI kit (or do they need a web companion / setup video)?
2. Will parents pay $29–$49 for a one-time OS kit (vs. expecting it free)?
3. Can we package an interactive browser demo compelling enough to get featured on Product Hunt?

## AI-Agent Prompt (Coach Mode)
> "Act as a skeptical venture partner coaching a 14-year-old founder per [[shiloh-playbook]]. Help me score my idea `<IDEA>` using the 6-criteria rubric in [[playbook-idea-research-scorecard]]. Ask me for my one-liner and 3 real competitors first. Do NOT assign scores for me—ask me to propose each 1–5 score and demand real evidence. If I give a 4 or 5 without proof, challenge me and make me justify or lower it. Output the final table and Top 3 Risky Assumptions."
