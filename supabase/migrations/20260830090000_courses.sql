-- Milestone 3: a reusable Course/CourseUnit model for the Kitchen/Gym/Panel-
-- style structured multi-week courses (Docs 14-16), per the kickoff prompt's
-- data model — not hardcoded to these three, just seeded with one real
-- course (Doc 14, The Kitchen) to prove the shape against real content.

-- ---------------------------------------------------------------------------
-- courses — a reusable template. Not student-specific; course_unit_progress
-- below is where per-student tracking lives.
-- ---------------------------------------------------------------------------
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  primary_quadrant_id text references quadrants (id) on delete restrict,
  -- Informational tags (e.g. 'Mathematics', 'Science') pulled from each
  -- course doc's "Texas Curriculum Tie-In" section. Not FK'd to the
  -- subjects table — descriptive metadata, not something queried/joined
  -- against yet. Revisit as a real join if that changes.
  subjects_covered text[],
  status text not null check (status in ('active', 'archived')) default 'active',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- course_units — ordered units (or weeks, for a week-structured course like
-- Doc 16's Panel) within a course. unit_number is the display/sort order.
-- video_assignment is nullable: the base 8-unit course structures (Kitchen,
-- Gym) don't have one per unit; their separate 6-week "addendum" variants
-- (e.g. Doc 14 §13a's "Opening Night") do, but that's a different structured
-- variant not modeled by this migration's seed data.
-- ---------------------------------------------------------------------------
create table course_units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  unit_number integer not null,
  title text not null,
  teaching_notes text,
  deliverable text,
  video_assignment text,
  is_capstone boolean not null default false,
  created_at timestamptz not null default now(),
  unique (course_id, unit_number)
);

create index course_units_course_id_idx on course_units (course_id);

-- ---------------------------------------------------------------------------
-- course_unit_progress — per-student status on a unit. A course/unit is a
-- shared template; this is the only student-specific row.
-- ---------------------------------------------------------------------------
create table course_unit_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  course_unit_id uuid not null references course_units (id) on delete cascade,
  status text not null check (status in ('not_started', 'in_progress', 'complete')) default 'not_started',
  completed_on date,
  evidence_link text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, course_unit_id)
);

create index course_unit_progress_student_idx on course_unit_progress (student_id);

create trigger course_unit_progress_set_updated_at
  before update on course_unit_progress
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
--
-- courses/course_units are curriculum content, same write pattern as
-- subjects/quadrants: any family member reads, only a parent writes. Adding
-- a brand-new course today happens via a migration (like this one's seed
-- below), not a UI — deliberately deferred; see DECISIONS.md.
-- course_unit_progress follows the missions/evidence pattern: a parent or
-- the row's own student can create/update; deletes are parent-only.
-- ---------------------------------------------------------------------------
alter table courses enable row level security;
alter table course_units enable row level security;
alter table course_unit_progress enable row level security;

create policy "courses_select" on courses
  for select to authenticated
  using (is_family_member());

create policy "courses_write_parent" on courses
  for all to authenticated
  using (is_parent())
  with check (is_parent());

create policy "course_units_select" on course_units
  for select to authenticated
  using (is_family_member());

create policy "course_units_write_parent" on course_units
  for all to authenticated
  using (is_parent())
  with check (is_parent());

create policy "course_unit_progress_select" on course_unit_progress
  for select to authenticated
  using (is_family_member());

create policy "course_unit_progress_insert" on course_unit_progress
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "course_unit_progress_update" on course_unit_progress
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "course_unit_progress_delete_parent" on course_unit_progress
  for delete to authenticated
  using (is_parent());

-- ---------------------------------------------------------------------------
-- Seed: The Kitchen (Doc 14) — 8 units + capstone, from Doc 14 §4.
-- ---------------------------------------------------------------------------
with new_course as (
  insert into courses (title, description, primary_quadrant_id, subjects_covered)
  values (
    'The Kitchen',
    'Culinary Studio, Menu Design & Food Systems — kitchen fundamentals through a capstone Menu Night. Anchored in Venture & Craft, pulling hard into Mind & Mastery.',
    'venture_craft',
    array['Mathematics', 'Reading', 'Spelling & Grammar', 'Good Citizenship', 'Science', 'Health & PE', 'History/Social Studies', 'Executive Function']
  )
  returning id
)
insert into course_units (course_id, unit_number, title, teaching_notes, deliverable, is_capstone)
select new_course.id, u.unit_number, u.title, u.teaching_notes, u.deliverable, u.is_capstone
from new_course, (values
  (1, 'Kitchen Fundamentals & Food Safety', 'Knife skills, stove/oven safety, sanitation, mise en place.', 'A self-built safety checklist + a dish cooked start-to-finish.', false),
  (2, 'Kitchen Math & Measurement', 'Scaling, unit conversion, ratios.', 'A conversion worksheet + a recipe actually cooked at a new scale.', false),
  (3, 'Food Science & Nutrition', 'Maillard reaction, emulsification, fermentation, macros.', 'A mini-experiment write-up + a nutrition breakdown of one meal.', false),
  (4, 'The Food Ecosystem', 'Supply chains: farm to distributor to store/market to plate.', 'A research report tracing 2-3 ingredients to their source.', false),
  (5, 'Sourcing Ingredients', 'Grocery vs. farmers market vs. CSA, budgeting a real grocery run.', 'A real sourcing trip, receipts, and a reflection.', false),
  (6, 'Menu Design & Recipe Development', 'A coherent 3-course menu; recipe testing and iteration.', 'A finished written menu.', false),
  (7, 'Food Costing, Pricing & Running a Kitchen Like a Business', 'Cost-per-plate math, target food-cost percentage.', 'A costed-out version of the Unit 6 menu.', false),
  (8, 'Cuisine, Culture & Culinary History', 'One cuisine''s origin and evolution.', 'A short research writeup or presentation.', false),
  (9, 'Capstone -- Menu Night', 'Plan, source, and cook a full multi-course menu solo for the family.', 'A completed Menu Night; optional stretch goal is a real small pop-up dinner priced like a business.', true)
) as u(unit_number, title, teaching_notes, deliverable, is_capstone);
