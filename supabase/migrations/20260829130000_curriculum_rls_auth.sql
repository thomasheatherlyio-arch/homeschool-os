-- Switch curriculum RLS from the open (pre-auth) policies to the family-aware
-- ones, now that Supabase Auth sign-in exists (see src/app/login,
-- src/app/auth/callback, src/proxy.ts). Any signed-in family member can view
-- subjects/units/lessons; only a parent can create/edit/delete them; a kid
-- can additionally update the status of a lesson assigned to them.
--
-- Only one person signs in for now, and they're provisioned as 'parent' on
-- first sign-in (src/app/auth/callback/route.ts), so in practice this is
-- currently equivalent to "requires being signed in as that one account."

drop policy if exists "subjects_open" on subjects;
drop policy if exists "units_open" on units;
drop policy if exists "lessons_open" on lessons;

create policy "family_members_select" on family_members
  for select to authenticated
  using (true);

create policy "family_members_insert_self" on family_members
  for insert to authenticated
  with check (id = auth.uid());

create policy "family_members_update_self" on family_members
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "subjects_select" on subjects
  for select to authenticated
  using (is_family_member());

create policy "subjects_insert_parent" on subjects
  for insert to authenticated
  with check (is_parent());

create policy "subjects_update_parent" on subjects
  for update to authenticated
  using (is_parent())
  with check (is_parent());

create policy "subjects_delete_parent" on subjects
  for delete to authenticated
  using (is_parent());

create policy "units_select" on units
  for select to authenticated
  using (is_family_member());

create policy "units_insert_parent" on units
  for insert to authenticated
  with check (is_parent());

create policy "units_update_parent" on units
  for update to authenticated
  using (is_parent())
  with check (is_parent());

create policy "units_delete_parent" on units
  for delete to authenticated
  using (is_parent());

create policy "lessons_select" on lessons
  for select to authenticated
  using (is_family_member());

create policy "lessons_insert_parent" on lessons
  for insert to authenticated
  with check (is_parent());

create policy "lessons_update_parent" on lessons
  for update to authenticated
  using (is_parent())
  with check (is_parent());

create policy "lessons_update_own_assignment" on lessons
  for update to authenticated
  using (assigned_to = auth.uid())
  with check (assigned_to = auth.uid());

create policy "lessons_delete_parent" on lessons
  for delete to authenticated
  using (is_parent());
