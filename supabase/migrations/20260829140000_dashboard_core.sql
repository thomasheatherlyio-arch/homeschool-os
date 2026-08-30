-- Milestone 1: the Circle (Doc 01), weekly Missions and the Evidence Log (Doc 03/04),
-- plus an invite mechanism so a second family member (Shiloh) can get his own login
-- instead of everyone auto-provisioning as parent.

-- ---------------------------------------------------------------------------
-- quadrants — the five fixed slices of Doc 01's Circle. A lookup table, not
-- something the app creates rows in during normal use, but kept as a real
-- table (not a check-constraint enum) since Doc 01 §3 allows adding/renaming
-- slices later, and every other table below references it by id.
-- ---------------------------------------------------------------------------
create table quadrants (
  id text primary key,
  name text not null,
  emoji text,
  description text,
  sort_order integer not null default 0
);

insert into quadrants (id, name, emoji, description, sort_order) values
  ('mind_mastery', 'Mind & Mastery', '🧠', 'Academics', 1),
  ('body_discipline', 'Body & Discipline', '💪', 'Health, fitness, sports', 2),
  ('venture_craft', 'Venture & Craft', '🚀', 'Entrepreneurship & making', 3),
  ('spirit_character', 'Spirit & Character', '🕊️', 'Spirituality, ethics, zen practice', 4),
  ('systems_self_command', 'Systems & Self-Command', '🗂️', 'Executive function & life skills', 5);

-- ---------------------------------------------------------------------------
-- quadrant_scores — the weekly 0-10 fill score per quadrant per student
-- (Doc 01 §2 / Doc 04 §1 Friday review). week_of is the Monday of that week,
-- so scores group and sort naturally.
-- ---------------------------------------------------------------------------
create table quadrant_scores (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  quadrant_id text not null references quadrants (id) on delete cascade,
  week_of date not null,
  score smallint not null check (score between 0 and 10),
  notes text,
  created_at timestamptz not null default now(),
  unique (student_id, quadrant_id, week_of)
);

create index quadrant_scores_student_week_idx on quadrant_scores (student_id, week_of);

-- ---------------------------------------------------------------------------
-- missions — the week's 3-5 items (Doc 04 §1 Monday planning).
-- ---------------------------------------------------------------------------
create table missions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  quadrant_id text not null references quadrants (id) on delete restrict,
  week_of date not null,
  title text not null,
  done_looks_like text,
  status text not null check (status in ('not_started', 'in_progress', 'done', 'partial', 'not_done')) default 'not_started',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index missions_student_week_idx on missions (student_id, week_of);

create trigger missions_set_updated_at
  before update on missions
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- evidence_log_entries — the Doc 03 legal record / Doc 04 Evidence Inbox.
-- subject_id is an optional link into the existing curriculum tables (a
-- Mind & Mastery entry can point at a real subject); mission_id is an
-- optional link back to the mission that produced the evidence.
-- ---------------------------------------------------------------------------
create table evidence_log_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  quadrant_id text not null references quadrants (id) on delete restrict,
  subject_id uuid references subjects (id) on delete set null,
  mission_id uuid references missions (id) on delete set null,
  occurred_on date not null default current_date,
  description text not null,
  evidence_type text,
  link text,
  reviewer_id uuid references family_members (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index evidence_log_entries_student_idx on evidence_log_entries (student_id, occurred_on);

-- ---------------------------------------------------------------------------
-- invites — lets a parent provision a second family member's login instead
-- of everyone who signs in auto-becoming a parent (see
-- src/app/auth/callback/route.ts: the very first-ever sign-in still bootstraps
-- as parent with no invite needed; every sign-in after that must match a row
-- here or gets turned away).
-- ---------------------------------------------------------------------------
create table invites (
  email text primary key,
  name text not null,
  role text not null check (role in ('parent', 'child')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table quadrants enable row level security;
alter table quadrant_scores enable row level security;
alter table missions enable row level security;
alter table evidence_log_entries enable row level security;
alter table invites enable row level security;

-- quadrants: everyone can read; only a parent can manage the slice list.
create policy "quadrants_select" on quadrants
  for select to authenticated
  using (is_family_member());

create policy "quadrants_write_parent" on quadrants
  for all to authenticated
  using (is_parent())
  with check (is_parent());

-- quadrant_scores / missions / evidence_log_entries: any family member can
-- view. A parent can manage any row; a student can create/update their own
-- (Doc 00 §4 — Shiloh owns his weekly plan and runs his own dashboard).
-- Deletes are parent-only, so the evidence trail isn't casually erasable
-- (Doc 00 Principle 3 — evidence over assertion).
create policy "quadrant_scores_select" on quadrant_scores
  for select to authenticated
  using (is_family_member());

create policy "quadrant_scores_insert" on quadrant_scores
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "quadrant_scores_update" on quadrant_scores
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "quadrant_scores_delete_parent" on quadrant_scores
  for delete to authenticated
  using (is_parent());

create policy "missions_select" on missions
  for select to authenticated
  using (is_family_member());

create policy "missions_insert" on missions
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "missions_update" on missions
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "missions_delete_parent" on missions
  for delete to authenticated
  using (is_parent());

create policy "evidence_log_entries_select" on evidence_log_entries
  for select to authenticated
  using (is_family_member());

create policy "evidence_log_entries_insert" on evidence_log_entries
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "evidence_log_entries_update" on evidence_log_entries
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "evidence_log_entries_delete_parent" on evidence_log_entries
  for delete to authenticated
  using (is_parent());

-- invites: a signing-in user can look up their own pending invite (by email,
-- before they have a family_members row at all); a parent can see and manage
-- every invite.
create policy "invites_select_self_or_parent" on invites
  for select to authenticated
  using (email = auth.email() or is_parent());

create policy "invites_write_parent" on invites
  for all to authenticated
  using (is_parent())
  with check (is_parent());
