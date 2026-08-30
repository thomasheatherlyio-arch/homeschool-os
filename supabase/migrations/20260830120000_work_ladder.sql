-- The Work Ladder (Doc 13): Rung 0 (Home Job) and Rung 1 (First Paid Job —
-- HTeaO). The Home Job Contract itself (Doc 13 §2.5) isn't a new table — it
-- reuses the existing `contracts` table from Milestone 2 (Doc 13 explicitly
-- models it "on the Founding Agreement," the same literal-contracts pattern
-- `contracts` already covers). Doc 13 §3.4's readiness checklist isn't
-- stored either — it's explicitly meant to be "evidence-based, pulled
-- straight from the Home Job Log," so it's computed in the UI from
-- home_job_log_entries, not a separate table to keep in sync.

-- ---------------------------------------------------------------------------
-- home_job — the Doc 13 §2.1 job description. One row per student, written
-- once and updated occasionally (not append-only like `visions` — Doc 13 is
-- explicit that vague, frequently-relitigated standards are the actual
-- failure mode, so this is meant to be settled and left stable).
-- ---------------------------------------------------------------------------
create table home_job (
  student_id uuid primary key references family_members (id) on delete cascade,
  job_title text,
  core_duties text,
  standard_of_done text,
  schedule text,
  updated_at timestamptz not null default now()
);

create trigger home_job_set_updated_at
  before update on home_job
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- extras_menu_items — Doc 13 §2.2: above-and-baseline paid tasks, priced
-- before the work starts.
-- ---------------------------------------------------------------------------
create table extras_menu_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  task text not null,
  price numeric(10, 2),
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index extras_menu_items_student_idx on extras_menu_items (student_id);

-- ---------------------------------------------------------------------------
-- home_job_log_entries — Doc 13 §4.1, weekly. duties_met is a tri-state
-- (not just yes/no) since a real week is often partial, not binary.
-- ---------------------------------------------------------------------------
create table home_job_log_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  week_of date not null,
  duties_met text not null check (duties_met in ('yes', 'partial', 'no')),
  extras_completed text,
  pay_earned numeric(10, 2),
  misses_consequence text,
  notes text,
  created_at timestamptz not null default now(),
  unique (student_id, week_of)
);

create index home_job_log_entries_student_idx on home_job_log_entries (student_id, week_of desc);

-- ---------------------------------------------------------------------------
-- hteao_log_entries — Doc 13 §4.2: contacts, progress, and (once hired)
-- shifts with the specific HTeaO contact.
-- ---------------------------------------------------------------------------
create table hteao_log_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  occurred_on date not null default current_date,
  entry_type text not null check (entry_type in ('conversation', 'application', 'interview', 'shift')),
  what_happened text not null,
  result_next_step text,
  created_at timestamptz not null default now()
);

create index hteao_log_entries_student_idx on hteao_log_entries (student_id, occurred_on desc);

-- ---------------------------------------------------------------------------
-- RLS — the standard parent-or-own-student pattern used throughout this
-- schema (missions/evidence_log_entries). Deletes are parent-only.
-- ---------------------------------------------------------------------------
alter table home_job enable row level security;
alter table extras_menu_items enable row level security;
alter table home_job_log_entries enable row level security;
alter table hteao_log_entries enable row level security;

create policy "home_job_select" on home_job
  for select to authenticated
  using (is_family_member());

create policy "home_job_insert" on home_job
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "home_job_update" on home_job
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "home_job_delete_parent" on home_job
  for delete to authenticated
  using (is_parent());

create policy "extras_menu_items_select" on extras_menu_items
  for select to authenticated
  using (is_family_member());

create policy "extras_menu_items_insert" on extras_menu_items
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "extras_menu_items_update" on extras_menu_items
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "extras_menu_items_delete_parent" on extras_menu_items
  for delete to authenticated
  using (is_parent());

create policy "home_job_log_entries_select" on home_job_log_entries
  for select to authenticated
  using (is_family_member());

create policy "home_job_log_entries_insert" on home_job_log_entries
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "home_job_log_entries_update" on home_job_log_entries
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "home_job_log_entries_delete_parent" on home_job_log_entries
  for delete to authenticated
  using (is_parent());

create policy "hteao_log_entries_select" on hteao_log_entries
  for select to authenticated
  using (is_family_member());

create policy "hteao_log_entries_insert" on hteao_log_entries
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "hteao_log_entries_update" on hteao_log_entries
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "hteao_log_entries_delete_parent" on hteao_log_entries
  for delete to authenticated
  using (is_parent());
