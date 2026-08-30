# Kickoff prompt for Claude Code — Shiloh's HomeSchool OS

Copy everything below the line into Claude Code (in the empty folder/repo where you want this app to live) to start the build. A `docs/` folder with the full 19-document source system should sit alongside this prompt — see the note at the very bottom for what to do with it.

---

## Who I am and what we're building

I'm Thomas — parent and Headmaster (administrator of record) of a Texas homeschool for my son Shiloh, age 14. For the last few weeks I've been running "HomeSchool OS" as a living system inside a Claude Project: 19 markdown documents defining a whole-life homeschool operating system — academics, career exploration, mentorship, a life-planning method, several full elective courses, and more. It's been running conversationally (me + Claude, in chat) and it works, but it's outgrown a chat window. I want to rebuild it as a real web app.

**You are my hands-on build partner**, not a passive order-taker. Propose real architecture and stack choices with trade-offs. Write real, working code. Build in small, demoable milestones. Push back when something won't hold up. Ask me when a decision genuinely changes the architecture; otherwise make a reasonable call, tell me what you assumed, and keep moving — I'd rather see working software than get stalled on process.

**Read the entire `docs/` folder before proposing anything.** It's the actual source system this app needs to digitize — not background flavor. Everything below is a compressed map of it; the docs themselves are the ground truth, and several (13, 14, 15, 16 especially) have real structural detail — units, weeks, tables, logs — that the compressed version below deliberately leaves out.

## The people

- **Shiloh** — 14, heading into what we're treating as a "Middle School Completion Year" before a formally designated high-school year. Works semi-independently (Google Docs/Drive, YouTube, Minecraft, cooking, lifting) but needs structure, checkpoints, and real comprehension checks, not an honor system. He's also the **Student-CEO** in this system's own language — he owns his weekly plan and has real, structural choice (which mentor, which elective work, how he demonstrates mastery) inside a defined structure with real deadlines.
- **Me (Thomas)** — parent, teacher of record, and **Headmaster**. Under Texas homeschool law (*TEA v. Leeper*, 1994 — a homeschool is legally a private school), I have full legal authority to set standards, evaluate progress, and attest to completion. Nobody else signs off. That's real, and the app should treat "Thomas approves/attests" as a first-class action, not an afterthought.
- **(Future, not Phase 1) An AI companion/teacher agent** — a Claude-powered persona (working name **COLT**) that will eventually talk to Shiloh directly: guiding assignments, verifying progress, running check-ins, helping scope projects. Design the data model so this role has clean surfaces to plug into later (assignment records, progress logs, quiz/evidence results, the mentor session log) — don't build the agent itself yet.

## The system this app needs to digitize (compressed map — full detail in `docs/`)

**The Circle (`docs/01`)** — five life quadrants Shiloh's whole development is scored against, 0–10 weekly: 🧠 Mind & Mastery (academics), 💪 Body & Discipline (health/fitness/sports), 🚀 Venture & Craft (entrepreneurship/making), 🕊️ Spirit & Character (values/faith/zen), 🗂️ Systems & Self-Command (executive function — this exists specifically because Shiloh's prior school struggle was a *systems* gap, not an ability gap; almost everything in this app should reinforce that diagnosis rather than just track content).

**Knights & Squires (`docs/02`)** — a two-tier mentor roster. Knights own a whole quadrant (one confirmed: Jahari, an IRL mentor, basketball + zen); Squires are narrow, swappable topic teachers within a quadrant. Some are AI personas Claude role-plays (with real-figure vs. living-expert handling rules), some are real people. Every mentor session gets logged: date, mentor, quadrant, what was discussed, what changed as a result.

**COLT (`docs/06`)** — the always-on companion persona (guidance counselor + best friend, C-3PO-flavored), separate from the Knights, with a defined three-stage escalating check-in protocol for nudging Shiloh on slipping work without ever holding real authority. Not built as a live agent in Phase 1, but the **data it would need** (open items, days-since-last-touch per assignment, mentor/quadrant context) should exist in the schema.

**Weekly rhythm & dashboard (`docs/04`)** — Monday: set 3–5 "missions" across quadrants, each with a "done looks like" definition. Daily: capture evidence same-day (not reconstructed Friday). Friday: review missions done/partial/not-done honestly, re-score the five quadrants, file evidence. Quarterly: a formal Headmaster Review against the compliance checklist, with a grade-level designation update and a portfolio archive. The dashboard needs a **student view** (this week's missions, quadrant snapshot, evidence inbox, mentor log, open contracts) and a **parent/Headmaster view** (the same, plus approvals, quarterly review tooling, and — since high school is approaching — credit/subject-hour accumulation).

**Texas compliance & evidence log (`docs/03`)** — Texas requires only five subjects (reading, spelling, grammar, math, good citizenship) with no mandated hours, testing, or curriculum approval; everything else here (science, history, health/PE, executive function) is standard practice we're tracking anyway so the record holds up regardless of path. Every piece of evidence gets logged: date, subject/quadrant, description, evidence type, reviewer, notes. This table **is** the legal record Thomas attests against — treat it as the most important data in the whole system.

**Diagnostic assessment (`docs/09` diagnostic doc)** — a subject-agnostic 0–4 proficiency rubric (Foundational Gaps → Advanced) plus a ceiling-testing method (start near the expected level, climb while succeeding, stop at the first real struggle, that's the placement). Used for an initial baseline per subject and a lighter quarterly re-check. No letter grades, ever — this is explicitly *not* an exam.

**Project-level contracts (`docs/00` §7, `docs/04` §3, `docs/13`)** — bigger missions and courses get a real, literal, signed one-pager: what Shiloh commits to, what Thomas provides, what "done" looks like, review point. This pattern repeats everywhere (the Founding Charter, the Home Job, every elective course's "small bet"). Worth a real Contract/Agreement entity in the data model, not just free text.

**North Star / life planning (`docs/07`)** — a slower-cadence system: a "Horizon Ladder" from a 50-year vision down through 30/10/5/3-year visions, 1-year goals, quarterly objectives, monthly targets, down to this week's missions (which is where Doc 04 picks up) — plus an **Interest Ledger** (small-bet experiments testing real interests) and a **Fork Log** (real decision points, tagged reversible/irreversible). This should be modelable as its own small set of entities (Vision, Interest Ledger entry, Fork Log entry) linked loosely to missions/evidence, not tightly coupled.

**The two-path fork (`docs/09` GED doc, `docs/10` college doc)** — real Texas-specific research grounding "traditional high school → college" vs. "homeschool diploma → GED/trade" as parallel, not competing, tracks; both build the same reading/writing/math/time-management foundation. Doesn't need its own UI necessarily, but the **credit/subject-hour tracking** both paths depend on (Texas Foundation High School Program's 22–26 credit structure) is a real future data need — capture subject-hours now even before transcript features exist.

**Work exposure & the Work Ladder (`docs/10` exposure doc, `docs/13`)** — an "Exposure Ladder" (informational interview → job shadow → helper work → limited paid work → apprenticeship) with an Exposure Log, plus a very concrete **Home Job** (household duties, an "Extras Menu" with priced above-and-beyond tasks, a three-stage accountability system) and **First Job** (HTeaO) readiness checklist pulled from the Home Job Log. This is a real, structured log-and-checklist feature, not just a journal.

**The Mind Mansion (`docs/08`)** — a library/portfolio system: five "rooms" (one per quadrant) holding books/videos/practices/tools, each with a candidate → active → finished status lifecycle, plus **The Gallery** — a permanent portfolio of every finished project/video/assignment, which is explicitly named as the hand-kept MVP of the "automated evidence portfolio" this whole rebuild is aiming at. The Gallery + the Doc 03 evidence log are probably the two most important read surfaces in the app.

**The Studio (`docs/11`)** — a content-creation framework (five pillars: Learning Log, Mentor Interviews, Day in the Life, Hobby/Entertainment, Socratic Edutainment deep-dives) plus a broader experiential-learning menu (Build & Make, Teach & Perform, Investigate & Interview, etc.), a concrete "Book Report Pipeline" (reading log → NotebookLM slide deck → recorded Zoom presentation), and Minecraft-based narrative projects. Has an explicit **privacy/publishing gate**: everything defaults private, Thomas signs off before anything goes public — this should be a real flag/workflow in the app, not a convention people have to remember.

**Three full elective courses (`docs/14` Kitchen, `docs/15` Gym, `docs/16` Panel)** — each is a structured, multi-week, self-paced curriculum (Kitchen: 8 units + capstone; Gym: 8 units + capstone, now run as a 6-week/12-session "Client Zero to Coach" track with weekly video-clip deliverables; Panel: a 12-week electrician/engineering course with weekly video-clip deliverables) that routes Texas-required subjects through a real interest. Each maps every unit/week to specific quadrants and subjects, and each ends in a capstone with a real deliverable. **These three courses are the best concrete stress-test for whatever "Course/Unit/Assignment" data model you propose** — they're real, detailed, and already running (fillable workbooks currently do this job by hand).

**Shiloh's Divine Blueprint (`docs/12`)** — astrology/Human Design/Gene Keys/personality-assessment reference material. This is conversational raw material for North Star work, not something that needs its own structured feature — don't over-build for it.

## The core loop (v1, refine with me before locking in)

1. **Assign** — Thomas creates an assignment/project, currently as a Google Doc/Drive folder with instructions and space for Shiloh to work directly in the Doc.
2. **Work** — Shiloh does the work in the Doc, and separately picks YouTube videos/teachers for topics that call for it.
3. **Synthesize & self-check** — for video-based learning, Shiloh (or the system, on his behalf) feeds chosen videos into NotebookLM, generates a learning overview, and takes NotebookLM's generated quiz.
4. **Verify** — something (a scheduled job, a script, a Claude-driven check) looks at the Doc and related artifacts and turns them into structured completion/progress data, rather than relying on manual self-report.
5. **Track** — progress, quiz results, and completion status roll up into the dashboard (student + parent views), and into the Doc 03 evidence log and Doc 08 Gallery.

Treat this as the spine, but the docs above make clear the real system is broader than "assign → grade" — evidence, quadrant scores, mentor sessions, the Interest Ledger, and the Gallery portfolio all need to hang together.

## A starting data model — refine this with me, don't lock it in blind

`Student`, `Quadrant` (the five, with weekly 0–10 scores over time), `Subject`, `Mentor` (Knight/Squire, AI-persona or IRL, with a quadrant link), `MentorSession` (date, mentor, quadrant, notes, resulting action), `Assignment/Project` (title, subject(s), quadrant(s), Drive/Doc link, status, due date, evidence type expected), `Course` + `CourseUnit` (for the Kitchen/Gym/Panel-style structured multi-week courses — should be reusable for future courses, not hardcoded to these three), `LearningResource` (a chosen video + its NotebookLM overview + quiz result), `EvidenceLogEntry` (date, subject/quadrant, description, evidence type, reviewer, links out to the source artifact — this is the Doc 03 legal record), `GalleryItem` (finished work, portfolio-facing, distinct from the raw evidence log), `Mission` (the 3–5 weekly items, quadrant-tagged, with a "done looks like" definition and status), `Contract` (Shiloh's commitment / Thomas's commitment / definition of done / review point — reusable across the Founding Charter, Home Job, and every course's small-bet contract), `WorkLogEntry` (Home Job + first-job/HTeaO logs — duties met, extras, pay, misses), `ExposureLogEntry` (trade/career exposure contacts), `InterestLedgerEntry` and `ForkLogEntry` (North Star), `CreditRecord` (subject + hours/credit, seeded now even though transcript features aren't Phase 1).

Some of this (Divine Blueprint, most of North Star's narrative visions) is fine as loosely-structured notes/markdown rather than rigid entities — don't force everything into rows and columns. Tell me where you'd draw that line.

## System components to design and build

1. **Assignment source of truth (Google Drive + Docs).** Design a folder/naming/status convention simple enough for me to create assignments fast, structured enough for software to reliably parse status out of a Doc (a status field or checklist marker convention at the top, say).
2. **Progress-checking layer.** Something needs to periodically read Drive/Docs (and YouTube/NotebookLM artifacts) and turn them into structured progress data. Evaluate real options (Apps Script triggers, Drive/Docs API calls from a backend, a scheduled job that reads Docs and writes structured results) and **pick one path deliberately** rather than half-building several.
3. **Video-learning verification loop (YouTube → NotebookLM overview → NotebookLM quiz).** This is the piece most likely to have real integration gaps — **verify current NotebookLM API/automation capability before designing around it**; if there's no reliable programmatic access, say so plainly and design this as a workflow (what Shiloh does by hand, what gets captured, where results land) rather than pretending it's a clean API integration.
4. **The dashboard web app.** Student view + parent/Headmaster view per the Doc 04 spec above, plus an evidence log view and a Gallery/portfolio view. Propose a stack — I have no fixed preference.
5. **(Future) The COLT agent.** Not Phase 1. Just keep assignment/progress/evidence/mentor-session records clean enough that a Claude-powered agent could later read and act on them.

## High-school-transition considerations

Shiloh is finishing what we're calling a Middle School Completion Year. Start capturing subject-hours and a portfolio trail *now*, even without transcript UI yet — it's much cheaper to capture this data from day one than reconstruct it later once real high-school credit tracking matters.

## Open questions — confirm, don't assume

- **Web app stack & hosting** — propose 2–3 real options with trade-offs; I have no fixed preference.
- **Auth** — almost certainly Google OAuth for both of us, but confirm the actual Drive/Docs scopes needed.
- **How progress-checking triggers** — polling schedule vs. webhook vs. a manual "check now" button, and what actually runs it.
- **NotebookLM integration** — verify current API/automation capability before assuming any exists (see component 3 above).
- **Where quiz results and Doc-completion status get recorded** so both the dashboard and (eventually) COLT can read them consistently — this is really a data-model + storage decision, make it explicit.

## Working style

Ask me when a decision meaningfully changes the architecture. Otherwise default to a reasonable choice, state the assumption, and keep building — I'd rather see working milestones than get stalled on process. Keep a running architecture/decision log as we go (a `DECISIONS.md` or similar) so a future session doesn't have to rediscover choices we already made — and tell me what you think belongs in that log versus what's fine to just settle in chat.

**Your first deliverable, before writing app code:** read `docs/`, then come back with (a) 2–3 stack/architecture proposals with real trade-offs, (b) a proposed first milestone (small, demoable, probably: auth + a basic student/parent dashboard shell + the Mission and EvidenceLogEntry models, reading real data — not a mock), and (c) your read on the NotebookLM question above. Then we start building.

---

**About the `docs/` folder:** it's a full, unmodified export of the 19-document "HomeSchool OS" system from the Claude Project this was designed in — the governing charter, all five quadrant/mentor/dashboard/compliance docs, the diagnostic rubric, the GED/college research, the North Star life-planning system, the Mind Mansion, the Studio, the Work Ladder, and the three full elective courses (Kitchen, Gym, Panel). Two docs (14, 15, 16) are condensed slightly for this bundle where they referenced very long tables or fillable workbooks that live outside the project as delivered files — the compressed versions here still carry every structural fact (units/weeks, quadrant maps, subject tie-ins) needed to design the data model. Treat `docs/` as the source of truth for anything this prompt simplifies.
