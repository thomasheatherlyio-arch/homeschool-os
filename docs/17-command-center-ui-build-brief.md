# Shiloh Command Center — Build Brief for Claude Code

## What this is

A private, single-family web app for running Shiloh's (age 14) homeschool. The core screen is a "command center" dashboard where Shiloh sees and manages his semester: multiple subjects and projects at once, each with tasks, status, and generated deliverables.

Two kinds of "project" share one underlying model:

- **Ongoing subjects** — a curriculum unit (e.g. an Algebra unit) with a task checklist and evidence, worked on over weeks.
- **Background-processing pipeline jobs** — e.g. submit a YouTube link, and a pipeline turns it into a report, a slide deck, a written quiz, and a quiz video. This runs through `pending → processing → ready` (or `failed`) and its deliverables appear once done. Future project types will follow this same shape (some input → background processing → tracked deliverables), so the data model and UI should stay generic — not hardcoded to the YouTube case.

## Scope for this pass

**UI shell with mock/static data only.** No real database, no auth, no real YouTube-processing backend — that comes later, once the interface itself is right. Everything below should be navigable and visually complete, backed by an in-memory or local JSON mock dataset.

## Suggested stack

**Next.js (App Router) + TypeScript + Tailwind CSS.** Reasoning: file-based routing maps directly onto the IA below, Tailwind can encode the design tokens as CSS variables + utility classes with no extra tooling, and it's easy to extend later with real data fetching (Server Actions / Route Handlers) without a rewrite. No UI kit is required — the component list below is small and specific; shadcn/ui is fine to lean on for raw primitives (button, input) if useful, but the visual language is custom, not a stock theme. This is a reasonable default — swap it if you have a stack preference.

## Design reference

The visual direction ("Quiet Charter" — warm neutral background, serif headings, flat hairline-bordered cards, no gradients or drop shadows, small 3px corner radii) was worked out and approved as a multi-screen mockup. It's described in full below so this brief is self-contained; if you want the visual reference too, ask Thomas for the design canvas link or a couple of screenshots.

## Design tokens

Fonts, loaded via Google Fonts: **Lora** (weights 500/600) for headings and section labels, **Public Sans** (weights 400–600) for body text and UI chrome. Never Inter/Roboto/Arial — this is a deliberate, distinctive pairing.

Colors (as CSS custom properties, oklch):

```css
--bg: oklch(97% 0.014 80);        /* page background, warm parchment */
--surface: oklch(99% 0.008 80);   /* card background */
--border: oklch(87% 0.014 75);    /* hairline borders */
--text: oklch(24% 0.018 75);
--muted: oklch(50% 0.02 75);
--faint: oklch(63% 0.018 75);

/* quadrant colors — used consistently everywhere a quadrant appears */
--mind: oklch(52% 0.11 245);      /* 🧠 Mind & Mastery */
--bodyq: oklch(52% 0.1 165);      /* 💪 Body & Discipline */
--venture: oklch(56% 0.15 50);    /* 🚀 Venture & Craft */
--spirit: oklch(52% 0.1 305);     /* 🕊️ Spirit & Character */
--systems: oklch(45% 0.035 60);   /* 🗂️ Systems & Self-Command */

/* tinted backgrounds for status pills, one per quadrant hue as needed */
--mind-bg: oklch(93% 0.03 245);
--venture-bg: oklch(93% 0.045 50);
--bodyq-bg: oklch(93% 0.03 165);
--neutral-bg: oklch(94% 0.012 75);
```

Component conventions:

- **Cards**: `1px solid var(--border)`, `border-radius: 3px`, `background: var(--surface)`. No shadows, no gradients, no colored left-border accents.
- **Status pills**: small rounded-rect (`border-radius: 3px`), colored text on a tinted background matching the status's meaning (neutral gray = In Progress / Not Started, `--bodyq` tones = Ready/positive, `--venture` tones = Needs Attention).
- **Quadrant tags**: an 8px colored dot + small-caps label in the quadrant's color. This is the only place quadrant color appears as a UI accent — never as a card border.
- **Icons**: inline SVG only, stroke-based, ~1.8px stroke, 16–26px depending on context. Never emoji, never filled glyph icons.
- **Spacing rhythm**: page padding ~36–44px; section gap ~26–28px; card padding 16–22px; tight internal gaps 8–14px.
- **Buttons**: a filled dark "primary" button (`background: var(--text)`, white label) for the one main action per screen (Start quiz, Submit); everything else is a small text "link" button in `--mind` with a trailing chevron icon — most actions on this app are links, not buttons.

## Data model

```ts
type Quadrant = 'mind' | 'body' | 'venture' | 'spirit' | 'systems';

type ProjectType = 'subject' | 'pipeline' | 'ongoing'; // 'ongoing' = HTeaO-style, no task list, just a running subtitle
type ProjectStatus = 'not_started' | 'in_progress' | 'processing' | 'ready' | 'needs_attention' | 'failed' | 'done';

interface Task {
  id: string;
  label: string;
  done: boolean;
}

interface Deliverable {
  kind: 'report' | 'deck' | 'quiz' | 'video' | 'document';
  title: string;
  meta?: string;       // "5 questions · ~10 min", "8 slides"
  href?: string;
}

interface PipelineStage {
  label: string;
  done: boolean;
}

interface Project {
  id: string;
  title: string;
  quadrants: Quadrant[];       // usually 1, sometimes 2 (e.g. a book project)
  type: ProjectType;
  status: ProjectStatus;
  progressPct?: number;        // for subject/ongoing types
  subtitle?: string;           // e.g. "3 shifts logged this week"
  tasks?: Task[];              // subject type
  deliverables?: Deliverable[]; // pipeline type, once ready
  pipelineStages?: PipelineStage[]; // pipeline type
  sourceUrl?: string;          // pipeline type, e.g. the YouTube link
  lastActivityAt: string;      // ISO date
  dueAt?: string;               // ISO date, optional
}

interface Mission {
  id: string;
  label: string;
  quadrant: Quadrant;
  done: boolean;
}

interface CircleScore {
  quadrant: Quadrant;
  score: number; // 0–10
}
```

## Routes / IA

Two levels deep, max — everything is one click from the home view, and every deeper screen has one click back to it.

```
/                     Command Center (home)
/projects/new         Submission form → creates a Project (status 'processing') → redirects to /projects/[id]
/projects/[id]        Project detail — ONE route, rendered differently by status/type (see below)
/gallery               Stub route for now — finished-work archive, empty state only
/circle                Stub route for now — quadrant history, empty state only
```

Important: **`/projects/[id]` is a single route with conditional rendering**, not three separate pages. The "Processing" and "Ready" states from the submission flow are just that same detail page rendered for a project whose `status` is `'processing'` or `'ready'` — don't build separate flow pages for them. Render logic:

- `status === 'processing'` → centered progress card: spinner, headline, a short stage checklist, a thin progress bar. No deliverables yet.
- `status === 'ready' && type === 'pipeline'` → pipeline stepper (all stages checked) + a 4-up deliverables grid (Report, Slide deck, Quiz, Quiz video). If the user arrives here right after processing finished (e.g. via a "just finished" flag passed on redirect, cleared after first view), show a one-line green confirmation banner above the header; otherwise just the plain Ready state.
- `type === 'subject' || type === 'ongoing'` → task checklist (or just the subtitle line for `'ongoing'`) + progress bar + an evidence-captured card, no deliverables grid.

## Screens to build

**1. Command Center (`/`)** — top to bottom:
- Top bar: date + "Command Center" heading on the left; a small card on the right holding a compact 5-spoke radial SVG (one line per quadrant from center, length ∝ score/10, quadrant-colored, round linecap) plus the average score.
- "Needs you" strip: up to 3 flat cards, shown only when non-empty (no empty-state placeholder) — each a quadrant tag, one line of context, a small metric, and a link-style action ("Start", "Open", "Check in").
- "This week's missions": a row of up to 5 compact chips, each a done/not-done circular icon, the mission label, and its quadrant dot + name.
- "Active projects": section label + a status note ("Grouped by status"), then a responsive grid of `ProjectCard`s (3 columns at desktop width). Sort/group by status — In Progress and Ready first, Needs Attention surfaced, Not Started last; completed projects don't appear here at all (they'd live in `/gallery`).

**2. Project detail (`/projects/[id]`)** — a back link to Command Center, then a header (quadrant tag(s) + type label, title, status pill), then the status-specific body described in the IA section above, then an "Activity" log card (timestamped one-line events, most recent first) at the bottom for pipeline-type projects.

**3. Submission form (`/projects/new`)** — back link, "New project" eyebrow + headline, then a single card: a YouTube URL input with helper text explaining what gets generated, a quadrant picker (pill-style single-select, quadrant-colored when selected), an optional title field, and a primary "Submit" button that creates the project and redirects into `/projects/[id]`.

## Components to build

`TopBar`, `CircleWidget` (SVG radial), `AttentionStrip` / `AttentionCard`, `MissionsRow` / `MissionChip`, `ProjectGrid` / `ProjectCard`, `StatusPill`, `QuadrantTag`, `ProgressBar`, `PipelineStepper`, `DeliverableCard`, `TaskRow`, `EvidenceCard`, `SubmitForm`, `BackLink`, `PrimaryButton`, `LinkButton`.

## Mock data seed

Use this so the shell looks like the approved mockups out of the box:

```ts
export const mockProjects: Project[] = [
  {
    id: 'algebra-unit-3',
    title: 'Algebra I — Unit 3: Linear Equations',
    quadrants: ['mind'],
    type: 'subject',
    status: 'in_progress',
    progressPct: 65,
    tasks: [
      { id: 't1', label: 'Watch lesson 3.1 — slope-intercept form', done: true },
      { id: 't2', label: 'Practice set 3.1 (12/12 correct)', done: true },
      { id: 't3', label: 'Watch lesson 3.2 — point-slope form', done: true },
      { id: 't4', label: 'Practice set 3.2 (7 of 12 so far)', done: false },
      { id: 't5', label: 'Unit 3 quiz', done: false },
    ],
    lastActivityAt: '2026-08-25',
  },
  {
    id: 'compound-interest-video',
    title: 'Video → Quiz: "How Compound Interest Works"',
    quadrants: ['mind'],
    type: 'pipeline',
    status: 'ready',
    sourceUrl: 'https://youtube.com/watch?v=…',
    pipelineStages: [
      { label: 'Submitted', done: true },
      { label: 'Transcript pulled', done: true },
      { label: 'Report drafted', done: true },
      { label: 'Quiz + deck built', done: true },
      { label: 'Ready', done: true },
    ],
    deliverables: [
      { kind: 'report', title: 'Report', meta: '1 page · key takeaways' },
      { kind: 'deck', title: 'Slide deck', meta: '8 slides' },
      { kind: 'quiz', title: 'Quiz', meta: '5 questions · ~10 min' },
      { kind: 'video', title: 'Quiz video', meta: '4 min · walks the quiz' },
    ],
    lastActivityAt: '2026-08-24',
  },
  {
    id: 'karu-mar-book-review',
    title: 'Karu Mar — Book Review Pipeline',
    quadrants: ['mind', 'venture'],
    type: 'subject',
    status: 'in_progress',
    progressPct: 40,
    subtitle: 'Reading log → deck → recording',
    lastActivityAt: '2026-08-23',
  },
  {
    id: 'hteao-first-job',
    title: 'HTeaO — First Paid Job',
    quadrants: ['venture'],
    type: 'ongoing',
    status: 'in_progress',
    subtitle: '3 shifts logged this week',
    lastActivityAt: '2026-08-25',
  },
  {
    id: 'the-gym-course',
    title: 'The Gym — Fitness Science Course',
    quadrants: ['body'],
    type: 'subject',
    status: 'in_progress',
    progressPct: 55,
    lastActivityAt: '2026-08-24',
  },
  {
    id: 'the-panel-course',
    title: 'The Panel — Electrical Course',
    quadrants: ['venture'],
    type: 'subject',
    status: 'needs_attention',
    subtitle: 'No activity in 6 days',
    lastActivityAt: '2026-08-19',
  },
];

export const mockMissions: Mission[] = [
  { id: 'm1', label: 'Finish Unit 3 practice set', quadrant: 'mind', done: true },
  { id: 'm2', label: 'HTeaO shift + tip log', quadrant: 'venture', done: true },
  { id: 'm3', label: 'Leg day + stretch routine', quadrant: 'body', done: false },
  { id: 'm4', label: 'Zen session with Jahari', quadrant: 'spirit', done: false },
  { id: 'm5', label: 'Weekly planning review', quadrant: 'systems', done: false },
];

export const mockCircle: CircleScore[] = [
  { quadrant: 'mind', score: 7 },
  { quadrant: 'body', score: 6 },
  { quadrant: 'venture', score: 8 },
  { quadrant: 'spirit', score: 4 },
  { quadrant: 'systems', score: 5 },
];
```

## Explicitly out of scope this pass — flag these back rather than deciding silently

- **Auth / multi-user.** Thomas (Headmaster) occasionally checks in, Shiloh (Student-CEO) uses it daily — no login flow or role distinction has been designed yet.
- **The real YouTube-processing backend.** The pipeline states are UI-only here; the actual transcript/report/deck/quiz generation is a separate system to design later.
- **Persistence.** In-memory or a local JSON file is fine for this pass — no database has been chosen.
- **Gallery and Circle full views.** Only stub routes with an empty state — not designed yet.
- **Mobile/responsive layout.** This pass is desktop-first (used at a desk during schoolwork); don't assume phone parity without checking.

## Acceptance criteria for this pass

- All three routes above are implemented and reachable via real navigation (not just static images).
- Visual language matches the tokens and component conventions above.
- Backed by the mock data — no external calls, no backend.
- Runs locally with `npm run dev`.
