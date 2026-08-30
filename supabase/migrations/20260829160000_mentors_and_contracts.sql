-- Milestone 2: Mentor Session Log and Open Contracts (Doc 04 §2's remaining
-- two dashboard sections), backed by Doc 02's Knights/Squires roster and
-- Doc 00 §7 / Doc 04 §3's reusable contract pattern.

-- ---------------------------------------------------------------------------
-- mentors — the Doc 02 roster. A Knight owns a quadrant broadly; a Squire
-- teaches one narrow topic within a quadrant. quadrant_id is each mentor's
-- *primary* quadrant (nullable — a Squire's slot menu entry might not have
-- one picked yet) and is only a default; a dual-seat mentor like Jahari
-- (basketball + zen) logs sessions tagged with whichever quadrant that
-- specific session was actually about — see mentor_sessions.quadrant_id
-- below, which is the authoritative per-session tag, not this column
-- (Doc 02: "sessions can be logged separately... even though they're the
-- same mentor").
-- ---------------------------------------------------------------------------
create table mentors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text not null check (tier in ('knight', 'squire')),
  persona_type text not null check (persona_type in ('ai_persona', 'irl')),
  quadrant_id text references quadrants (id) on delete set null,
  status text not null check (status in ('candidate', 'active', 'retired')) default 'active',
  notes text,
  created_at timestamptz not null default now()
);

create index mentors_quadrant_id_idx on mentors (quadrant_id);

-- ---------------------------------------------------------------------------
-- mentor_sessions — Doc 02's session log: what was discussed, what changed
-- as a result. Doc 02 is explicit that a session with no resulting action is
-- "a nice chat, not evidence" — resulting_action is nullable (not every
-- session produces one) but the UI should make it easy to fill in.
-- ---------------------------------------------------------------------------
create table mentor_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  mentor_id uuid not null references mentors (id) on delete cascade,
  quadrant_id text not null references quadrants (id) on delete restrict,
  occurred_on date not null default current_date,
  notes text not null,
  resulting_action text,
  created_at timestamptz not null default now()
);

create index mentor_sessions_student_idx on mentor_sessions (student_id, occurred_on);

-- ---------------------------------------------------------------------------
-- contracts — the reusable Doc 00 §7 / Doc 04 §3 pattern: what Shiloh
-- commits to, what Thomas provides, what "done" looks like, a review point.
-- Reused across the Founding Charter, the Home Job, and every course's
-- small-bet contract, per the kickoff prompt's data model.
-- ---------------------------------------------------------------------------
create table contracts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  title text not null,
  student_commitment text not null,
  provider_commitment text not null,
  definition_of_done text not null,
  review_date date,
  status text not null check (status in ('active', 'completed')) default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contracts_student_status_idx on contracts (student_id, status);

create trigger contracts_set_updated_at
  before update on contracts
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table mentors enable row level security;
alter table mentor_sessions enable row level security;
alter table contracts enable row level security;

-- mentors: unlike subjects/quadrants, Doc 02 explicitly gives Shiloh
-- standing authority to add, swap, or drop a mentor seat without needing
-- Thomas's sign-off first — so any family member (not just a parent) can
-- create/edit the roster. Deletes stay parent-only, matching this schema's
-- general pattern of not letting history be casually erased.
create policy "mentors_select" on mentors
  for select to authenticated
  using (is_family_member());

create policy "mentors_insert" on mentors
  for insert to authenticated
  with check (is_family_member());

create policy "mentors_update" on mentors
  for update to authenticated
  using (is_family_member())
  with check (is_family_member());

create policy "mentors_delete_parent" on mentors
  for delete to authenticated
  using (is_parent());

-- mentor_sessions: same pattern as missions/evidence_log_entries — any
-- family member can view; a parent or the session's own student can
-- create/update; deletes are parent-only.
create policy "mentor_sessions_select" on mentor_sessions
  for select to authenticated
  using (is_family_member());

create policy "mentor_sessions_insert" on mentor_sessions
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "mentor_sessions_update" on mentor_sessions
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "mentor_sessions_delete_parent" on mentor_sessions
  for delete to authenticated
  using (is_parent());

-- contracts: same pattern.
create policy "contracts_select" on contracts
  for select to authenticated
  using (is_family_member());

create policy "contracts_insert" on contracts
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "contracts_update" on contracts
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "contracts_delete_parent" on contracts
  for delete to authenticated
  using (is_parent());
