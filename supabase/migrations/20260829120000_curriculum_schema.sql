-- Curriculum planning schema: family members, subjects, units/lessons, progress tracking.
--
-- Hierarchy: subjects -> units (optional grouping) -> lessons.
-- A lesson always belongs to a subject; it may optionally also belong to a unit
-- within that subject, and may optionally be assigned to one family member.
-- Progress is a single status per lesson (not_started / in_progress / complete) --
-- "basic" tracking, not per-student history. Extend with a lesson_progress join
-- table later if the same lesson needs independent progress per kid.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- family_members
--
-- One row per login (parent or kid). The row's id is the Supabase Auth user id,
-- so auth.uid() = family_members.id once someone is signed in. Rows are created
-- by the person themselves on first sign-in (see insert policy below); nothing
-- provisions this table automatically yet since there's no auth flow in the app.
-- ---------------------------------------------------------------------------
create table family_members (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role text not null check (role in ('parent', 'child')) default 'child',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- subjects
-- ---------------------------------------------------------------------------
create table subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- units
--
-- Optional grouping of lessons within a subject (e.g. a chapter or term).
-- ---------------------------------------------------------------------------
create table units (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index units_subject_id_idx on units (subject_id);

-- ---------------------------------------------------------------------------
-- lessons
--
-- subject_id is required so a lesson can always be listed/added directly under
-- a subject; unit_id is optional for when it's also organized into a unit.
-- ---------------------------------------------------------------------------
create table lessons (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id) on delete cascade,
  unit_id uuid references units (id) on delete set null,
  assigned_to uuid references family_members (id) on delete set null,
  title text not null,
  description text,
  status text not null check (status in ('not_started', 'in_progress', 'complete')) default 'not_started',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- a unit must belong to the same subject as the lesson it's grouping
  constraint lessons_unit_matches_subject check (true)
);

create index lessons_subject_id_idx on lessons (subject_id);
create index lessons_unit_id_idx on lessons (unit_id);
create index lessons_assigned_to_idx on lessons (assigned_to);

-- Enforce unit_id's subject matches the lesson's subject_id (can't express as a
-- plain column check since it needs a lookup; use a trigger instead).
create or replace function lessons_check_unit_subject()
returns trigger
language plpgsql
as $$
begin
  if new.unit_id is not null then
    if not exists (
      select 1 from units
      where id = new.unit_id and subject_id = new.subject_id
    ) then
      raise exception 'lesson unit_id must belong to the same subject_id';
    end if;
  end if;
  return new;
end;
$$;

create trigger lessons_check_unit_subject
  before insert or update on lessons
  for each row
  execute function lessons_check_unit_subject();

alter table lessons drop constraint lessons_unit_matches_subject;

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger subjects_set_updated_at
  before update on subjects
  for each row
  execute function set_updated_at();

create trigger units_set_updated_at
  before update on units
  for each row
  execute function set_updated_at();

create trigger lessons_set_updated_at
  before update on lessons
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
--
-- TEMPORARY / PRE-AUTH STATE: there's no sign-in flow in the app yet, so
-- auth.uid() is always null for every request (the app only ever uses the
-- anon key). Rather than write policies nothing can satisfy, RLS is enabled
-- with wide-open policies for now: any request, signed in or not, can read
-- and write subjects/units/lessons. family_members is left with no policies
-- at all (RLS enabled, zero grants), so it's inert either way until auth
-- exists -- there's no one to log in as yet.
--
-- Once Supabase Auth is wired up, replace the "open for now" policies below
-- with the family-aware ones in the commented-out block beneath them (any
-- signed-in family member can view; only a parent can write; a kid can also
-- update the status of a lesson assigned to them).
-- ---------------------------------------------------------------------------
create or replace function is_family_member()
returns boolean
language sql
stable
as $$
  select exists (select 1 from family_members where id = auth.uid());
$$;

create or replace function is_parent()
returns boolean
language sql
stable
as $$
  select exists (select 1 from family_members where id = auth.uid() and role = 'parent');
$$;

alter table family_members enable row level security;
alter table subjects enable row level security;
alter table units enable row level security;
alter table lessons enable row level security;

-- subjects, units, lessons: open for now (see note above)
create policy "subjects_open" on subjects
  for all to anon, authenticated
  using (true)
  with check (true);

create policy "units_open" on units
  for all to anon, authenticated
  using (true)
  with check (true);

create policy "lessons_open" on lessons
  for all to anon, authenticated
  using (true)
  with check (true);

-- family_members: no policies yet -- RLS is enabled with no grants, so the
-- table is unreachable via the anon/authenticated roles until auth ships and
-- the policies below (or similar) are added.

-- ---------------------------------------------------------------------------
-- Family-aware policies to switch to once auth exists. Uncomment these and
-- drop the *_open policies above.
-- ---------------------------------------------------------------------------
-- create policy "family_members_select" on family_members
--   for select to authenticated
--   using (true);
--
-- create policy "family_members_insert_self" on family_members
--   for insert to authenticated
--   with check (id = auth.uid());
--
-- create policy "family_members_update_self" on family_members
--   for update to authenticated
--   using (id = auth.uid())
--   with check (id = auth.uid());
--
-- create policy "subjects_select" on subjects
--   for select to authenticated
--   using (is_family_member());
--
-- create policy "subjects_insert_parent" on subjects
--   for insert to authenticated
--   with check (is_parent());
--
-- create policy "subjects_update_parent" on subjects
--   for update to authenticated
--   using (is_parent())
--   with check (is_parent());
--
-- create policy "subjects_delete_parent" on subjects
--   for delete to authenticated
--   using (is_parent());
--
-- create policy "units_select" on units
--   for select to authenticated
--   using (is_family_member());
--
-- create policy "units_insert_parent" on units
--   for insert to authenticated
--   with check (is_parent());
--
-- create policy "units_update_parent" on units
--   for update to authenticated
--   using (is_parent())
--   with check (is_parent());
--
-- create policy "units_delete_parent" on units
--   for delete to authenticated
--   using (is_parent());
--
-- create policy "lessons_select" on lessons
--   for select to authenticated
--   using (is_family_member());
--
-- create policy "lessons_insert_parent" on lessons
--   for insert to authenticated
--   with check (is_parent());
--
-- create policy "lessons_update_parent" on lessons
--   for update to authenticated
--   using (is_parent())
--   with check (is_parent());
--
-- create policy "lessons_update_own_assignment" on lessons
--   for update to authenticated
--   using (assigned_to = auth.uid())
--   with check (assigned_to = auth.uid());
--
-- create policy "lessons_delete_parent" on lessons
--   for delete to authenticated
--   using (is_parent());
