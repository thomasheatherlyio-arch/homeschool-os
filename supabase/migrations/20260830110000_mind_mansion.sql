-- The Mind Mansion (Doc 08): five rooms map 1:1 to the existing `quadrants`
-- table, so no separate "rooms" lookup — a room is just a quadrant_id here.
-- Books/Videos/Practices/Tools/Gallery are each their own table (distinct
-- fields and status vocabularies per Doc 08, not worth forcing into one
-- polymorphic table), and — unlike Doc 02's mentors or Docs 14-16's courses,
-- which are shared family rosters/curricula — these are explicitly personal
-- ("Shiloh's own memory palace"), so every table here is student_id-scoped,
-- matching the missions/evidence_log_entries pattern rather than the
-- mentors/courses one.
--
-- No seed data: unlike the Kitchen course seed (a student-independent shared
-- template, safe to seed at migration time), Mansion items are per-student
-- and there's no guarantee a student's family_members row exists yet when
-- this migration runs. Doc 08 itself frames empty shelves as the correct
-- starting state ("Shelves start empty by design... not a failure") — so
-- this is the right call, not just a shortcut around a timing problem.

-- ---------------------------------------------------------------------------
-- mansion_books — The Study Shelves (Doc 08 §3).
-- ---------------------------------------------------------------------------
create table mansion_books (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  quadrant_id text references quadrants (id) on delete set null,
  title text not null,
  author text,
  status text not null check (status in ('recommended', 'reading', 'finished', 'shelved')) default 'recommended',
  recommended_by text,
  why text,
  take text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mansion_books_student_idx on mansion_books (student_id);

-- ---------------------------------------------------------------------------
-- mansion_videos — The Screening Room (Doc 08 §5).
-- ---------------------------------------------------------------------------
create table mansion_videos (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  quadrant_id text references quadrants (id) on delete set null,
  title text not null,
  creator text,
  type text,
  status text not null check (status in ('recommended', 'watching', 'finished', 'shelved')) default 'recommended',
  recommended_by text,
  why text,
  take text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mansion_videos_student_idx on mansion_videos (student_id);

-- ---------------------------------------------------------------------------
-- mansion_practices — The Practice Room (Doc 08 §6): recurring habits, not a
-- backlog. A practice can genuinely span multiple rooms (doc's own example:
-- a breathing exercise before basketball touches both Training Hall and
-- Chapel) — quadrant_id here is only the primary one, same simplification
-- used for mentors' primary quadrant.
-- ---------------------------------------------------------------------------
create table mansion_practices (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  quadrant_id text references quadrants (id) on delete set null,
  name text not null,
  practice_type text,
  frequency text,
  status text not null check (status in ('starting', 'active', 'paused')) default 'starting',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mansion_practices_student_idx on mansion_practices (student_id);

-- ---------------------------------------------------------------------------
-- mansion_tools — The Toolshed (Doc 08 §7): apps/platforms. Doc 08 is
-- explicit that setup needs Thomas's sign-off even when Shiloh proposes the
-- tool, since these usually involve an account, personal info, or real
-- money — signed_off_by/at capture that separately from `status`, so a tool
-- can sit at status='active' in real use while still recording who actually
-- signed off on setting it up.
-- ---------------------------------------------------------------------------
create table mansion_tools (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  quadrant_id text references quadrants (id) on delete set null,
  name text not null,
  category text,
  purpose text,
  status text not null check (status in ('candidate', 'setting_up', 'active', 'paused_retired')) default 'candidate',
  notes text,
  signed_off_by uuid references family_members (id) on delete set null,
  signed_off_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mansion_tools_student_idx on mansion_tools (student_id);

-- ---------------------------------------------------------------------------
-- gallery_items — The Gallery (Doc 08 §8): every finished project/video/
-- assignment, Shiloh's actual portfolio. Flagged in Doc 08 as one of the two
-- most important read surfaces in the whole system, alongside the Doc 03
-- evidence log.
-- ---------------------------------------------------------------------------
create table gallery_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  quadrant_id text references quadrants (id) on delete set null,
  date_finished date not null default current_date,
  title text not null,
  type text,
  related_to text,
  where_it_lives text,
  take text,
  created_at timestamptz not null default now()
);

create index gallery_items_student_idx on gallery_items (student_id, date_finished desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers (reuses set_updated_at() from the curriculum migration)
-- ---------------------------------------------------------------------------
create trigger mansion_books_set_updated_at
  before update on mansion_books
  for each row
  execute function set_updated_at();

create trigger mansion_videos_set_updated_at
  before update on mansion_videos
  for each row
  execute function set_updated_at();

create trigger mansion_practices_set_updated_at
  before update on mansion_practices
  for each row
  execute function set_updated_at();

create trigger mansion_tools_set_updated_at
  before update on mansion_tools
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
--
-- Books/Videos/Practices/Gallery: the standard parent-or-own-student pattern
-- (missions/evidence_log_entries). Tools is the one exception, matching
-- mentors: Doc 08 §7 and Doc 02 both explicitly give Shiloh standing
-- authority to *propose* something (a mentor seat, a tool) without needing
-- Thomas's sign-off first to add the candidate row — the sign-off gate for
-- Tools specifically is the separate signed_off_by/at columns above, not the
-- insert/update RLS. Deletes are parent-only everywhere, consistent with
-- this schema's evidence-preservation pattern.
-- ---------------------------------------------------------------------------
alter table mansion_books enable row level security;
alter table mansion_videos enable row level security;
alter table mansion_practices enable row level security;
alter table mansion_tools enable row level security;
alter table gallery_items enable row level security;

create policy "mansion_books_select" on mansion_books
  for select to authenticated
  using (is_family_member());

create policy "mansion_books_insert" on mansion_books
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "mansion_books_update" on mansion_books
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "mansion_books_delete_parent" on mansion_books
  for delete to authenticated
  using (is_parent());

create policy "mansion_videos_select" on mansion_videos
  for select to authenticated
  using (is_family_member());

create policy "mansion_videos_insert" on mansion_videos
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "mansion_videos_update" on mansion_videos
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "mansion_videos_delete_parent" on mansion_videos
  for delete to authenticated
  using (is_parent());

create policy "mansion_practices_select" on mansion_practices
  for select to authenticated
  using (is_family_member());

create policy "mansion_practices_insert" on mansion_practices
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "mansion_practices_update" on mansion_practices
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "mansion_practices_delete_parent" on mansion_practices
  for delete to authenticated
  using (is_parent());

create policy "mansion_tools_select" on mansion_tools
  for select to authenticated
  using (is_family_member());

create policy "mansion_tools_insert" on mansion_tools
  for insert to authenticated
  with check (is_family_member());

create policy "mansion_tools_update" on mansion_tools
  for update to authenticated
  using (is_family_member())
  with check (is_family_member());

create policy "mansion_tools_delete_parent" on mansion_tools
  for delete to authenticated
  using (is_parent());

create policy "gallery_items_select" on gallery_items
  for select to authenticated
  using (is_family_member());

create policy "gallery_items_insert" on gallery_items
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "gallery_items_update" on gallery_items
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "gallery_items_delete_parent" on gallery_items
  for delete to authenticated
  using (is_parent());
