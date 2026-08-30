-- North Star (Doc 07): the slower-cadence life-planning system layered on
-- top of the weekly Mission rhythm. Per Doc 07 and the kickoff prompt, most
-- of this is loosely-structured narrative, not something to force into rigid
-- rows and columns — three small, mostly-free-text tables, not a big schema.

-- ---------------------------------------------------------------------------
-- visions — the Horizon Ladder (Doc 07 §4): 50/30/10/5/3-year visions, 1-year
-- goals, quarterly objectives, monthly targets. Weekly Missions is the
-- existing `missions` table (Doc 04 picks up there); "Today's Next Action"
-- isn't modeled — it's a single next physical action decided in the moment,
-- not something worth a stored row.
--
-- Append-only by design, not update-in-place: Doc 07 explicitly expects
-- these to be "revisited and rewritten often" (§7 cadence), and Doc 00
-- Principle 3 (evidence over assertion) argues for keeping the trail rather
-- than overwriting it — "current" for a horizon is just its latest row.
-- ---------------------------------------------------------------------------
create table visions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  horizon text not null check (horizon in (
    '50yr', '30yr', '10yr', '5yr', '3yr', '1yr_goals', 'quarterly_objective', 'monthly_target'
  )),
  body text not null,
  created_at timestamptz not null default now()
);

create index visions_student_horizon_idx on visions (student_id, horizon, created_at desc);

-- ---------------------------------------------------------------------------
-- interest_ledger_entries — Doc 07 §3's Five Audits (Energy, Flow,
-- Admiration, Problem, Feedback) and the small bets they turn into. `result`
-- is deliberately free text ("confirmed" / "ruled out" / "unclear, try
-- again" per Doc 07 §3 and Doc 10 §6's matching pattern) rather than a rigid
-- enum — Doc 07 §6 says this doesn't need to be formal.
-- ---------------------------------------------------------------------------
create table interest_ledger_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  occurred_on date not null default current_date,
  audit_type text not null check (audit_type in ('energy', 'flow', 'admiration', 'problem', 'feedback')),
  description text not null,
  became_small_bet boolean not null default false,
  result text,
  created_at timestamptz not null default now()
);

create index interest_ledger_entries_student_idx on interest_ledger_entries (student_id, occurred_on desc);

-- ---------------------------------------------------------------------------
-- fork_log_entries — Doc 07 §5's real decision points, tagged reversible
-- ("two-way door") or hard-to-reverse ("one-way door").
-- ---------------------------------------------------------------------------
create table fork_log_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references family_members (id) on delete cascade,
  occurred_on date not null default current_date,
  decision_point text not null,
  door_type text not null check (door_type in ('two_way', 'one_way')),
  decision text not null,
  reasoning text,
  created_at timestamptz not null default now()
);

create index fork_log_entries_student_idx on fork_log_entries (student_id, occurred_on desc);

-- ---------------------------------------------------------------------------
-- RLS — same parent-or-own-student pattern as missions/evidence_log_entries.
-- Doc 07 §1 says the vision itself is Shiloh's to write (Thomas reviews and
-- asks questions, not co-authors), but that's a norm about how the system is
-- meant to be used, not a hard access boundary worth enforcing in the
-- database — a parent being technically able to add a vision entry doesn't
-- contradict Shiloh remaining free to write his own, and keeping the pattern
-- consistent with every other table here is simpler than a one-off asymmetric
-- rule.
-- ---------------------------------------------------------------------------
alter table visions enable row level security;
alter table interest_ledger_entries enable row level security;
alter table fork_log_entries enable row level security;

create policy "visions_select" on visions
  for select to authenticated
  using (is_family_member());

create policy "visions_insert" on visions
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "visions_delete_parent" on visions
  for delete to authenticated
  using (is_parent());

create policy "interest_ledger_entries_select" on interest_ledger_entries
  for select to authenticated
  using (is_family_member());

create policy "interest_ledger_entries_insert" on interest_ledger_entries
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "interest_ledger_entries_update" on interest_ledger_entries
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "interest_ledger_entries_delete_parent" on interest_ledger_entries
  for delete to authenticated
  using (is_parent());

create policy "fork_log_entries_select" on fork_log_entries
  for select to authenticated
  using (is_family_member());

create policy "fork_log_entries_insert" on fork_log_entries
  for insert to authenticated
  with check (is_parent() or student_id = auth.uid());

create policy "fork_log_entries_update" on fork_log_entries
  for update to authenticated
  using (is_parent() or student_id = auth.uid())
  with check (is_parent() or student_id = auth.uid());

create policy "fork_log_entries_delete_parent" on fork_log_entries
  for delete to authenticated
  using (is_parent());
