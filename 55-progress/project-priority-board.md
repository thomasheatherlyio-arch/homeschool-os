---
type: priority-board
status: active
date: 2026-11-22
updated: 2026-11-23
quadrant: "[[mind-mastery]]"
---
# Project & task priority board

A single board for every current project and task, ranked by **academic requirements vs. Shiloh's interests**. Built for Thomas (Headmaster) and Shiloh (Student-CEO). This note lives in `55-progress/` (P1), not in `10-system/`.

**As of:** 2026-11-23, morning (America/Chicago). Progress figures are only what is already in the vault or was read from the Google Drive workbooks that day. Never invent a mastery % or a completion number. Interest ratings are blank until Shiloh fills them; every Priority score that uses a stand-in is marked **p** (provisional). Shiloh rated **The Civ at 3.5** on 2026-11-22 (Priority **6.0**, no longer provisional).

Related: [[hs-readiness]] · [[NOW]] · [[khan-dashboard]] · [[khan-priority-plan]] · [[03-academic-tracker-tx-compliance|Doc 03]] · [[01-holistic-quadrants-the-circle|The Circle]] · [Drive course folder](https://drive.google.com/drive/folders/1vSc39UBWnl5g7kXUPfIDG4wpgWrX56kY)

---

## 1. Weighting model (proposed — Dad + Shiloh may adjust)

The **60 / 40 split** is a proposed default: it puts more weight on **P1 (high-school readiness)** while still leaving Shiloh a real voice. It is not locked. Change the multipliers, the component caps, or any row's weights in the worksheet below; then recompute.

### Academic-side components

| Component | Code | How it's scored |
|---|---|---|
| Academic weight | **W** | **5** = Texas-required subject (Reading, Spelling & Grammar, Mathematics, Good Citizenship). **4** = standard subject (Science, History / Social Studies, Health & PE) *or* an executive-function / readiness gate. **2** = elective course. When a row serves more than one subject, use the highest honest W and name both subjects. |
| Readiness urgency | **U** | **3** = no baseline in a required subject, a readiness gate is blocked, *and/or* a deadline is this week. **2** = a required or standard subject in the current family priority (science, reading, grammar), a mid-course deadline, or a P1 open loop this month. **1** = ongoing or queued, no immediate blocker. |
| Progress gap | **G** | When a real mastery % exists: **G = (100 − mastery%) / 20** (so 0% → 5.0, 100% → 0). If a course is explicitly **not started**, treat mastery as 0% and G = 5.0. If there is no mastery figure, **G = 0** and the Progress cell stays **—** (do not invent a gap). |

### Interest-side

| Component | Code | How it's scored |
|---|---|---|
| Interest | **I** | Shiloh's own **1–5** rating (1 = low pull, 5 = high pull). Leave the Interest cell blank until he rates it. For a provisional Priority only, treat a blank I as **3** and mark the score **p**. |

### Formula

Normalize each side to a 0–10 scale so the 60 / 40 mix is meaningful (raw W+U+G tops out at 13; raw I tops out at 5):

```
Academic-side (0–10)  = 10 × (W + U + G) / 13
Interest-side  (0–10)  = 10 × I / 5
Priority               = 0.6 × Academic-side + 0.4 × Interest-side
```

With the provisional stand-in I = 3, Interest-side = 6.0, so:

```
Priority (provisional) = 0.6 × Academic-side + 2.4
```

Worked example (Khan MS biology, 19% mastery, I blank → 3): W = 4, U = 2, G = (100 − 19) / 20 = 4.05. Academic-side = 10 × (4 + 2 + 4.05) / 13 = 7.7. Priority = 0.6 × 7.7 + 2.4 = **7.0p**.

---

## 2. Master table

Interest is blank on purpose — **Shiloh rates** (1–5). Priority uses I = 3 and is marked **p** until he does. Academic score is the 0–10 Academic-side. Full W / U / G values are in [§5](#5-scoring-worksheet).

### Diagnostics & readiness gates (P1)

| Name | Type | Doc 03 subject | Quadrant | Source | Status | Progress | Academic | Interest | Priority | Next action (15–25 min) | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Reading baseline diagnostic | diagnostic | Reading (required) | [[mind-mastery]] | [[diagnostics]] · [Packet](https://docs.google.com/document/d/1NrJRYScCkqkICP8mVyCzotw7tmZnSPBZ/edit) · [Rubric](https://docs.google.com/document/d/1JHxHgM0xud28LUfg10H3agxflvS_tD2ALwLSZYoU668/edit) | not started | — | 6.2 |  | 6.1p | Dad frames it out loud (not a test), then Shiloh starts Reading Tier 1 only | Dad |
| Writing (Spelling & Grammar) baseline | diagnostic | Spelling & Grammar (required) | [[mind-mastery]] | same packet / rubric | not started (queued after Reading) | — | 6.2 |  | 6.1p | Do not start this week; one subject per sitting. Next week: Writing Tier 1 | Dad |
| Mathematics baseline | diagnostic | Mathematics (required) | [[mind-mastery]] | same packet / rubric | not started (queued after Writing) | — | 6.2 |  | 6.1p | Hold until after Writing. Then Math Tier 1 only | Dad |
| Confirm Fall 2027 9th-grade start + L3 targets | admin | readiness gate | [[systems-self-command]] | [[hs-readiness]] | pending Dad | — | 4.6 |  | 5.2p | Dad writes the decision in the hs-readiness log (proposed targets already listed) | Dad |
| Gate 2: system holds for 3 weeks | admin | Executive function / study skills | [[systems-self-command]] | [[hs-readiness]] · [[NOW]] | week of 2026-11-23 not yet under way | missions –/5 · daily notes –/5 · Friday review – | 4.6 |  | 5.2p | Write today's 1–3 line daily note, then tick it toward the "3 daily notes" mission | Shiloh |

The Drive [Assessment(s) for Shioh](https://drive.google.com/drive/folders/1nOOiVRPT0FU0nmHW-6wA4qPawSA4e0m2) folder is the source for the three baselines (packet + rubric). It is not a separate project. Science / History / Good Citizenship diagnostics stay queued per the rubric (Health & PE and executive function are not one-sitting tests).

### Khan Academy

Figures from the 2026-11-22 sync ([[khan-dashboard]]); still **pending** Dad's check in [[verifications]].

| Name | Type | Doc 03 subject | Quadrant | Source | Status | Progress | Academic | Interest | Priority | Next action (15–25 min) | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 6th grade reading, grammar, and vocab | Khan | Reading + Spelling & Grammar (required) | [[mind-mastery]] | [[khan-grade-6-ela]] | deferred | no mastery (93 skills, all unfamiliar) | 8.5 |  | 7.5p | Hold — Shiloh asked 2026-11-23 not to go below 7th grade. Confirm with Dad at Friday review | Shiloh |
| MS biology | Khan | Science (standard) | [[mind-mastery]] | [[khan-ms-biology]] | in progress | 19% mastery | 7.7 |  | 7.0p | Open MS biology and do one skill in the lowest unfinished unit | Shiloh |
| MS Earth and space science | Khan | Science (standard) | [[mind-mastery]] | [[khan-ms-earth-space]] | in progress | 26% mastery | 7.5 |  | 6.9p | After biology has a foothold, resume the lowest unfinished Earth/space unit (one skill) | Shiloh |
| MS physics | Khan | Science (standard) | [[mind-mastery]] | [[khan-ms-physics]] | in progress | 35% mastery | 7.1 |  | 6.7p | Same rule: one skill in the lowest unfinished unit, not all three sciences in one day | Shiloh |
| 6th grade math (TX TEKS) | Khan | Mathematics (required) | [[mind-mastery]] | [[khan-grade-6-math-tx]] | in progress | 70% mastery (challenge 73%); weakest unit Algebraic representations 13% | 6.5 |  | 6.3p | One practice set in Algebraic representations of two-variable relationships | Shiloh |
| 7th grade math (TX TEKS) | Khan | Mathematics (required) | [[mind-mastery]] | [[khan-grade-7-math-tx]] | in progress | 78% mastery | 6.2 |  | 6.1p | Continue the next unfinished 7th-grade skill (after the 6th-grade weak unit, if doing math today) | Shiloh |
| 8th grade math (TX TEKS) | Khan | Mathematics (required) | [[mind-mastery]] | [[khan-grade-8-math-tx]] · [[khan-priority-plan]] | in progress | 55% mastery (20/34/18/9/17 of 98; challenge not taken; 371 min, 93 activity-log rows). Keep-warm units 1, 7, 8, 10 | 7.1 |  | 6.7p | One keep-warm skill in unit 1, 7, 8, or 10 (15–20 min) | Shiloh |
| 7th grade reading | Khan | Reading (required) | [[mind-mastery]] | [[khan-grade-7-reading]] | log only | — (22 min, 7 rows; no mastery %) | 6.2 |  | 6.1p | Start this week's 4 × 25 min (requested 2026-11-23; confirm Friday). Use unit tests to test out of easy units | Shiloh |
| 8th grade reading, grammar, and vocab | Khan | Reading + Spelling & Grammar (required) | [[mind-mastery]] | [[khan-grade-8-ela]] | log only | — (194 min, 53 rows; no mastery %) | 5.4 |  | 5.6p | After 7th grade reading. Log a mastery % at the next sync if Khan shows one | Shiloh |
| Constitution 101 | Khan | Good Citizenship (required); History / Social Studies | [[mind-mastery]] | [[khan-constitution-101]] · pairs with [[civ-course]] | in progress | 90% mastery; three 2026-11-16–18 quizzes/unit tests pending evidence | 5.0 |  | 5.4p | Start the next unit after Elections and Voting Rights (one lesson or quiz) | Shiloh |
| 7th grade science (TX TEKS) | Khan | Science (standard) | [[mind-mastery]] | [[khan-grade-7-science-tx]] | log only | — (125 min, 32 rows; no mastery %) | 4.6 |  | 5.2p | Prefer the MS science courses (which have mastery %) until this one shows a figure | Shiloh |
| 8th grade science (TX TEKS) | Khan | Science (standard) | [[mind-mastery]] | [[khan-grade-8-science-tx]] | log only | — (194 min, 80 rows; no mastery %) | 4.6 |  | 5.2p | Same as 7th science: record mastery at the next sync; don't start a fourth science track this week | Shiloh |

Art history is listed on the Khan account with no mastery or minutes; it is not scored here. A "6th math" (non-TX) log (33 min) and a US history log (0 min, 1 row) are snapshot-only, not separate board rows.

### Courses & playbook

| Name | Type | Doc 03 subject | Quadrant | Source | Status | Progress | Academic | Interest | Priority | Next action (15–25 min) | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| The Civ (Civ VI + history/civics) | course | Good Citizenship (required); History / Social Studies | [[mind-mastery]] | [[civ-course]] · [[campaign-1-log]] | active (approved 2026-11-22); Unit 0 not started | units done: 0. Three pending Constitution 101 evidence rows are already on the course Progress table | 5.4 | 3.5 | **6.0** | Read Unit 0 ("how to actually win") for 20 minutes; no campaign start until that is done | Shiloh |
| Kitchen / Restaurant "Opening Night" (Solara) | course | elective (also routes Math, Health, Science) | [[venture-craft]] | [[kitchen-course]] · [Drive 6-week workbook](https://docs.google.com/document/d/1ab5eOf1uveBT24ALLFAfcEvowDb0bnU98-SQVK6PSPc/edit) | vault: not started. Drive workbook: in progress | Weeks 1–2 largely filled (concept, competition, draft menu, TX food-handler notes). Week 3 sourcing table blank; recipe test written. Weeks 4–6, all three videos, and the final reflection are blank. Stretch food-handler certificate unchecked | 3.1 |  | 4.2p | Fill the Week 3 Session 1 sourcing plan for three menu ingredients in the Drive workbook | Shiloh |
| The Gym (Client Zero to Coach) | course | Health & PE (standard); elective | [[body-discipline]] | [[gym-course]] · [Drive 6-week workbook](https://docs.google.com/document/d/12niSuskFmSAs0LBHIjtBq-gWFCTYh_4tPYEw_jL3HMs/edit) | not started | vault Progress empty; Drive Course Info blank; no boxes checked | 3.8 |  | 4.7p | With Dad, fill the Course Info box on the workbook and read the Week 1 intro only | Shiloh |
| The Panel (electrician / engineer) | course | elective (also routes Science, Math) | [[venture-craft]] | [[panel-course]] · [Drive 12-week workbook](https://docs.google.com/document/d/1ISCEZ2OnpdPqb3_A0BcEMno98NyKB9cYjff1UnLOcgw/edit) | not started | vault Progress empty; Drive header blank; materials checklist unchecked | 2.3 |  | 3.8p | With Dad, review the materials checklist (no purchases). Decide later whether this is the elective beside Civ | Shiloh |
| The Forge (AI projects) | course | elective | [[venture-craft]] | [[forge-course]] | not started | vault Progress empty | 2.3 |  | 3.8p | Read Getting Started (15 min) and note one question for Dad before any AI tool account is created | Shiloh |
| Venture playbook | project | elective | [[venture-craft]] | [[shiloh-playbook]] | active (Phase 0) | 2026-10-05: playbook created; superpowers interview named as the start. No later log line | 2.3 |  | 3.8p | 20-minute superpowers interview: three things friends ask him for, and one he'd do for free | Shiloh |
| The Hoops (AAU tryout prep) | course | Health & PE hours TBD (pending Dad) | [[body-discipline]] | [[hoops-course]] · [[basketball]] | draft-pending-approval | 10-week plan drafted 2026-11-23; no training-log entries in the vault. Academic / Priority not scored (no invented numbers) | — |  | — | Waiting on Dad ([[20261123-hoops-course]]); practice with Jahari can continue either way | Shiloh + Thomas |
| Homeschool OS venture | project | elective | [[venture-craft]] | [[shiloh-hq-venture-dashboard]] · [[shiloh-hq-venture-brief]] · [[playbooks-index]] | draft | Notes, playbooks, and Phase 1 kickoff filed 2026-11-24; starts only after approval. Academic / Priority not scored | — |  | — | Waiting on Dad ([[20261124-venture-shiloh-hq-product]]) | Shiloh + Thomas |
| HQ Dashboard (v2 Command Center) | project | system | [[systems-self-command]] | `70-dashboard/` · [[dashboard-product-spec]] · [[co-build-guide]] | approved in proposal YAML, not built | Design, mockup, and co-build guide are in the vault. This cleanup did not change `decision:`. Academic / Priority not scored | — |  | — | Shiloh co-builds the local app with Dad / DaD ([[20261124-learning-dashboard]]) | Thomas + Shiloh |

### Book reports (Reading)

| Name | Type | Doc 03 subject | Quadrant | Source | Status | Progress | Academic | Interest | Priority | Next action (15–25 min) | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Book report — *The Book of Elsewhere* | project | Reading (required) | [[mind-mastery]] | [Drive: book report nm 2](https://docs.google.com/document/d/1nXqTqwXgiqSLI8QnOOA_7I41Dbom5SVErhcNwKUjR8c/edit) | log + synthesis complete; presentation pipeline open | Entries 1–8 dated 2026-09-14 through 2026-09-28 (160 pp running total). Final Synthesis filled (he rated the book 8/10). All pipeline boxes (NotebookLM deck, Zoom presentation, evidence filing, Study Shelves) still unchecked | 5.4 |  | 5.6p | Review the Final Synthesis and jot five slide titles. NotebookLM deck has to be generated on Dad's 18+ account, with Shiloh directing | Shiloh |
| Book report log — Karu_Mar (081926) | project | Reading (required) | [[mind-mastery]] | [Drive: Karu_Mar log](https://docs.google.com/document/d/1su9g8Y7quf_-rhhzlgw_zWNIxmZ5lvtBrnqh1_zZZsc/edit) | blank template | Title, dates, entries, and synthesis are all empty | 4.6 |  | 5.2p | With Dad, decide: is this the next book, or should the blank log be archived? Don't start a second book until the *Elsewhere* pipeline is moving | Shiloh |

### This week's missions & admin (from [[NOW]])

| Name | Type | Doc 03 subject | Quadrant | Source | Status | Progress | Academic | Interest | Priority | Next action (15–25 min) | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Set up the PC with Dad | admin | executive function / system | [[systems-self-command]] | [[START-HERE]] · [[NOW]] | done (ticked in [[NOW]] 2026-11-24) | setup missions for the PC, first COLT chat, and Knight seat are ticked | 4.6 |  | 5.2p | None for this mission. Remaining weekly missions: 3 daily notes, and pick the next course | Shiloh + Thomas |
| Write 3 daily notes | admin | Executive function / study skills | [[systems-self-command]] | [[NOW]] · `40-journal/daily/` | open (this week's mission) | –/3 this week (week starts 2026-11-23) | 4.6 |  | 5.2p | Write today's 1–3 line daily note (calendar icon, or Ctrl+P → Open today's daily note) | Shiloh |
| Pick the next course (Kitchen / Gym / Panel / Forge) | admin | elective | [[systems-self-command]] | [[NOW]] | open | Civ is already active. Kitchen's Drive workbook is mid-course. The mission box is still unchecked | 3.1 |  | 4.2p | After rating Interest below, circle one elective to run *beside* Civ + Khan — not four at once | Shiloh |
| First chat with COLT / rename if you want | admin | — | [[systems-self-command]] | [[NOW]] · [[persona]] | done (ticked in [[NOW]] 2026-11-24) | first session has happened; rename is still optional | 2.3 |  | 3.8p | Rename COLT only if Shiloh wants a new name | Shiloh |
| Seat one open Knight | admin | — | [[spirit-character]] | [[NOW]] · `60-companions/knights/` | done — [[basketball]] seated 2026-11-23 | Hoops mentor file is in place; other seats stay open | 2.3 |  | 3.8p | None for this mission. Other Knight seats can wait | Shiloh |
| Friday Khan sync (weekly cadence) | admin | readiness support | [[mind-mastery]] | [[khan-dashboard]] · [[NOW]] | scheduled: Friday evening, first run 2026-11-27, ~6 PM Central, so Dad can review over the weekend | first sync already done 2026-11-22 | 3.8 |  | 4.7p | No action until Friday. Then tell COLT "Khan sync" if the automatic run hasn't landed | Dad |
| Daily / weekly schedule (draft) | admin | Executive function / study skills | [[systems-self-command]] | [[shiloh-schedule]] | draft; times proposed | no logged time yet; calendar mirror waits on approval | 4.6 |  | 5.2p | Shiloh and Dad pick one weekday on the draft and change any two times that feel wrong | Dad |

### Done this session (kept here so the board is complete)

| Name | Type | Source | Status | Progress | Priority | Next action | Owner |
|---|---|---|---|---|---|---|---|
| The Civ course proposal | admin | [[20261122-civ-course]] | approved and applied 2026-11-22 | course is active | — (done) | none | Dad |
| Khan Academy connection proposal | admin | [[20261122-khan-academy-connection]] | approved and applied 2026-11-22 | first sync complete; evidence pending | — (done) | none | Dad |
| Meta Bind decision drop-down proposal | admin | [[20261122-obsidian-meta-bind]] | approved and applied 2026-11-22 | plugin installed; restart Obsidian if the drop-down isn't visible | — (done) | Restart Obsidian once, if needed | Dad |
| Khan ELA + science priority plan | admin | [[20261122-khan-priority-plan]] · [[khan-priority-plan]] | proposal file reads `approved`; ELA order change requested 2026-11-23 | approved minutes unchanged; Shiloh asked to start at 7th grade ELA (6th deferred). Confirm at Friday review | — (minutes in effect; course order pending Friday) | Confirm the 7th-grade ELA start at Friday review; Shiloh's first ELA block this week is 7th grade reading | Dad |

A fourth proposal, [[20261122-khan-priority-plan]] (weekly ELA / science / math keep-warm cadence in [[khan-priority-plan]]), currently reads `decision: approved`. It is not a closed setup item — it is the living Khan priority plan that this board should follow once Dad and Shiloh are working from it.

---

## 3. Top 5 this week

Sorted by **provisional Priority** (I = 3) except where Shiloh has already rated Interest. These are not five things to finish in one week. Doc 03 says build the system first and right-size the load.

| Rank | Item | Priority | Why it scored here | Do this week? |
|---|---|---|---|---|
| 1 | Khan MS biology | **7.0p** | Standard Science, lowest mastery among the three MS science courses (19%), and science is a stated priority | **Yes — Shiloh.** One science only to start (biology). |
| 2 | Khan MS Earth and space science | **6.9p** | Same Science priority, 26% mastery | Queue behind biology unless energy is high. |
| 3 | Khan MS physics | **6.7p** | Same Science priority, 35% mastery | Queue behind biology. |
| 4 | Khan 8th grade math (TX) | **6.7p** | Required Math at 55% mastery (G = 2.25). Ties physics on academic-side. Keep-warm units 1, 7, 8, 10 in [[khan-priority-plan]] | Yes, as keep-warm only (one 15–20 min skill), not a third new track. |
| 5 | Khan 6th grade math (TX) | **6.3p** | Required Math at 70% mastery; weakest unit Algebraic representations 13% | Only if a math block is already in the day; 7th/8th keep-warm is the planned math cadence. |

**Held out of this week's Top 5:** Khan 6th ELA is **deferred** (Shiloh asked 2026-11-23 not to go below 7th grade; U dropped from 3 to 1; Priority now **7.5p**). It would still rank first on score because it is not started (G = 5.0), but it is not this week's ELA action until Dad confirms or changes that request on Friday.

**Just below the cut, and still this week's P1 for Dad:** the Reading baseline diagnostic (**6.1p**). It scores under the Khan rows only because it has no mastery figure yet — that missing number is the reason to give it. [[NOW]] already schedules it **this week** (Writing and Math on the next two weeks; one subject per sitting). Dad should run Reading before science and ELA get stacked on top of an unmeasured baseline. **Khan 7th grade reading** is also **6.1p** (U raised to 3 as this week's requested ELA start; still no mastery figure). It is this week's ELA action (4 × 25 min) pending Friday confirm, even though the missing mastery % keeps it out of the Top 5 cut. **The Civ** is also just below the cut at **6.0** (Shiloh's Interest 3.5; no longer provisional).

**Recommended focus for the week of 2026-11-23** (score + [[NOW]] + the right-size rule): (1) Reading baseline — Dad, (2) Khan 7th grade reading — 4 × 25 min, using unit tests to test out of easy units (requested 2026-11-23; confirm Friday), (3) Khan MS biology — one skill, (4) daily note toward Gate 2, (5) either Civ Unit 0 or the *Book of Elsewhere* slide-title list, not both if the day is already full. 8th-grade math keep-warm can replace (5) if the approved [[khan-priority-plan]] minute cadence is the one you're following.

---

## 4. Interest-driven view

Shiloh rated **The Civ at 3.5** on 2026-11-22. Other Interest cells are still blank, so this view does **not** invent numbers for them. It lists places where a **known choice or already-started interest** already overlaps a Doc 03 requirement or standard subject. Once more Interest cells are filled, re-sort this section by I, and highlight rows where I ≥ 4 and W ≥ 4.

| Overlap | Why it counts as interest + requirement | Academic hook | Next honest step |
|---|---|---|---|
| [[civ-course]] + [[khan-constitution-101]] | Shiloh asked to learn history and civics through Civ VI and rated The Civ Interest **3.5** (Priority **6.0**). Constitution 101 is at 90% with three pending quizzes/unit tests this past week | Good Citizenship (required) + History / Social Studies | Unit 0 of Civ, then keep Constitution 101 moving |
| Kitchen / Solara Opening Night | He chose the culinary course and has already named the restaurant, drafted a menu, scouted competitors, and written a recipe-test note in the Drive workbook | Elective, with real Math (costing), Health, and Science routes once Weeks 5–6 are done | Week 3 sourcing plan (the next blank section) |
| *The Book of Elsewhere* report | He finished the reading log and synthesis and rated the book 8/10. The presentation pipeline is the remaining Reading evidence | Reading (required) | Five slide titles; deck on Dad's NotebookLM account |
| [[gym-course]] | Chosen fitness / training interest; also the natural Health & PE vehicle (alongside Jahari and basketball) | Health & PE (standard) | Fill the workbook Course Info box when this elective is the one he picks |
| [[shiloh-playbook]] | Chosen entrepreneurship interest; Phase 0 (superpowers) is the named start | Elective — Venture & Craft | The 20-minute interview |
| [[panel-course]] / [[forge-course]] | Both were chosen as courses; neither workbook nor vault Progress has been started | Electives | Don't open both. Use "Pick the next course" after Interest is rated |

---

## 5. Scoring worksheet

I_used = 3 (provisional) on every open row except **The Civ**, which uses Shiloh's rating I = 3.5 (2026-11-22). G_note records whether a real mastery figure was used.

| Item | W | U | G | G note | Academic-side | Priority (p) |
|---|---|---|---|---|---|---|
| Khan 6th ELA | 5 | 1 | 5.00 | deferred 2026-11-23 (not started; 93 unfamiliar skills). U dropped to 1 (queued, not this week's course) | 8.5 | 7.5p |
| Khan MS biology | 4 | 2 | 4.05 | (100 − 19) / 20 | 7.7 | 7.0p |
| Khan MS Earth and space | 4 | 2 | 3.70 | (100 − 26) / 20 | 7.5 | 6.9p |
| Khan MS physics | 4 | 2 | 3.25 | (100 − 35) / 20 | 7.1 | 6.7p |
| Khan 6th math (TX) | 5 | 2 | 1.50 | (100 − 70) / 20 | 6.5 | 6.3p |
| Khan 7th math (TX) | 5 | 2 | 1.10 | (100 − 78) / 20 | 6.2 | 6.1p |
| Reading baseline | 5 | 3 | 0 | no mastery data; this week's blocked gate (U = 3) | 6.2 | 6.1p |
| Writing baseline | 5 | 3 | 0 | no mastery data; gate blocked, queued after Reading | 6.2 | 6.1p |
| Math baseline | 5 | 3 | 0 | no mastery data; gate blocked, queued after Writing | 6.2 | 6.1p |
| Khan 8th math (TX) | 5 | 2 | 2.25 | (100 − 55) / 20 | 7.1 | 6.7p |
| Khan 7th reading | 5 | 3 | 0 | minutes only; U raised to 3 as this week's requested ELA start (pending Friday confirm) | 6.2 | 6.1p |
| Khan 8th ELA | 5 | 2 | 0 | minutes only | 5.4 | 5.6p |
| The Civ | 5 | 2 | 0 | units done = 0; no course mastery %; I = 3.5 (rated) | 5.4 | **6.0** |
| *The Book of Elsewhere* | 5 | 2 | 0 | qualitative: log/synthesis done, pipeline open | 5.4 | 5.6p |
| Constitution 101 | 5 | 1 | 0.50 | (100 − 90) / 20 | 5.0 | 5.4p |
| Confirm 9th-grade start | 4 | 2 | 0 | — | 4.6 | 5.2p |
| Draft daily / weekly schedule | 4 | 2 | 0 | draft only; no logged time | 4.6 | 5.2p |
| Gate 2: system holds | 4 | 2 | 0 | — | 4.6 | 5.2p |
| PC setup | 4 | 2 | 0 | — | 4.6 | 5.2p |
| Write 3 daily notes | 4 | 2 | 0 | — | 4.6 | 5.2p |
| Karu_Mar book log | 5 | 1 | 0 | blank template | 4.6 | 5.2p |
| Khan 7th science (TX) | 4 | 2 | 0 | minutes only | 4.6 | 5.2p |
| Khan 8th science (TX) | 4 | 2 | 0 | minutes only | 4.6 | 5.2p |
| The Gym | 4 | 1 | 0 | not started; W = 4 as the Health & PE vehicle | 3.8 | 4.7p |
| Friday Khan sync | 4 | 1 | 0 | cadence only | 3.8 | 4.7p |
| Kitchen / Restaurant | 2 | 2 | 0 | Drive workbook mid-course; W = 2 as an elective | 3.1 | 4.2p |
| Pick the next course | 2 | 2 | 0 | — | 3.1 | 4.2p |
| The Panel | 2 | 1 | 0 | not started | 2.3 | 3.8p |
| The Forge | 2 | 1 | 0 | not started | 2.3 | 3.8p |
| Venture playbook | 2 | 1 | 0 | Phase 0 only | 2.3 | 3.8p |
| First chat with COLT | 2 | 1 | 0 | — | 2.3 | 3.8p |
| Seat one Knight | 2 | 1 | 0 | — | 2.3 | 3.8p |

Gym uses **W = 4** because Doc 15 is the designated Health & PE course, not only an elective. Kitchen, Panel, Forge, and the Venture playbook stay **W = 2** (electives that can *support* other subjects). If Dad wants Kitchen treated as a Health vehicle too, raise its W and recompute.

---

## 6. Interest ratings needed from Shiloh

Please put a **1–5** in the Interest column for each row you actually care about (skip the Done section). A rating of 3 is only a stand-in; it should not linger. **Already rated:** The Civ = 3.5 (2026-11-22), Priority **6.0**.

Highest-leverage ratings first (they can change the Top 5 once I is real):

- Khan 7th reading; MS biology; Earth and space; physics
- 6th / 7th / 8th math; Constitution 101
- Kitchen / Solara; The Gym; The Panel; The Forge; Venture playbook
- *The Book of Elsewhere* follow-through; the Karu_Mar log (or a "0 / not this book" note)
- Daily notes / weekly system (Gate 2), and seating a Knight

The three baselines and "confirm 9th-grade start" can stay unrated — those are Dad-owned gates, not interest projects.

After ratings are in, recompute Priority with the real I (drop the **p**), and refresh [§4](#4-interest-driven-view).

---

## 7. How to update this board

1. Shiloh fills Interest (1–5). Dad and Shiloh may edit W, U, or the 0.6 / 0.4 multipliers if the model feels wrong — note the change and the date here.
2. After each Friday **Khan sync**, update Progress and G from [[khan-dashboard]] only. No guessed percentages.
3. When a Drive workbook section is filled, update that row's Status / Progress in words (e.g. "Week 3 sourcing done") — still no fake %.
4. When Dad verifies evidence, do not mark work complete here until [[verifications]] says so. Pending stays pending.
5. Re-sort [§3](#3-top-5-this-week) on Friday for the weekend review, and again on Monday if the plan changes.

---

## 8. Later option: Dataview or Bases

This board is plain Markdown tables so it works with the plugins already in the vault (Obsidian Git, Meta Bind). **Dataview is not installed**, and new plugins need Dad's sign-off. A future version could put each row in a note (or a Base) and let Dataview sort Top 5 and Interest-driven views automatically. That would be its own proposal; do not install anything for this board.
