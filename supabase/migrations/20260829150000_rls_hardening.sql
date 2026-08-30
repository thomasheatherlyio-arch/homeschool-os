-- Hardening pass on the auth/RLS work in the two prior migrations, per a
-- code review of that work. Each section below names the bug it closes.

-- ---------------------------------------------------------------------------
-- is_family_member() / is_parent(): make them SECURITY DEFINER.
--
-- Required before family_members' own SELECT policy (below) can reference
-- either function: as SECURITY INVOKER (the prior default), each function's
-- internal `select ... from family_members` would itself be subject to
-- family_members' RLS policy — which, once that policy calls the same
-- function, recurses infinitely ("infinite recursion detected in policy for
-- relation family_members"). SECURITY DEFINER makes the function's internal
-- lookup run as its owner (bypassing RLS on family_members entirely for that
-- one lookup), breaking the cycle. This is safe: the function only ever
-- looks up the *calling* user's own row (`where id = auth.uid()`), so
-- bypassing RLS here can't leak anyone else's data.
-- `set search_path` pins name resolution to prevent search-path hijacking,
-- the standard hardening for any SECURITY DEFINER function.
create or replace function is_family_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from family_members where id = auth.uid());
$$;

create or replace function is_parent()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from family_members where id = auth.uid() and role = 'parent');
$$;

-- ---------------------------------------------------------------------------
-- family_members: role-escalation fixes.
--
-- The prior insert/update policies only checked `id = auth.uid()`, with no
-- constraint on `role` at all — meaning any authenticated Supabase account
-- (no invite required to obtain a session; signInWithOtp allows sign-up)
-- could insert itself as role='parent' directly via the client, bypassing
-- the invite check that only exists in application code
-- (src/app/auth/callback/route.ts). Likewise an already-provisioned child
-- could update their own row to role='parent'. Neither required going
-- through the app's UI or the callback route at all.
-- ---------------------------------------------------------------------------
drop policy if exists "family_members_insert_self" on family_members;
create policy "family_members_insert_invited" on family_members
  for insert to authenticated
  with check (
    id = auth.uid()
    and exists (
      select 1 from invites
      where invites.email = lower(auth.email())
      and invites.role = role
    )
  );

drop policy if exists "family_members_update_self" on family_members;
create policy "family_members_update" on family_members
  for update to authenticated
  using (is_parent() or id = auth.uid())
  with check (
    is_parent()
    or (
      id = auth.uid()
      and role = (select role from family_members where id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- family_members: SELECT was `using (true)` — readable by *any* authenticated
-- Supabase account (again, no invite needed to obtain a session), not just
-- actual family members. Tightened to real family members, plus your own row
-- always (needed so a not-yet-provisioned user's own lookup in the callback
-- route still resolves to "no row" cleanly rather than being blocked outright).
-- ---------------------------------------------------------------------------
drop policy if exists "family_members_select" on family_members;
create policy "family_members_select" on family_members
  for select to authenticated
  using (is_family_member() or id = auth.uid());

-- ---------------------------------------------------------------------------
-- invites: case-insensitive self-visibility, and let a self-provisioning
-- user delete their own consumed invite.
--
-- invites.email is always stored lowercased (src/app/family/actions.ts,
-- src/app/auth/callback/route.ts), but this policy compared against
-- auth.email() with no lowercasing — fragile if the JWT ever preserves the
-- case a user typed at sign-in. And the only delete policy required
-- is_parent(), so a newly-provisioned *child*'s own best-effort invite
-- cleanup (callback route, "so the invite doesn't linger") silently failed
-- under RLS every time — the exact common case, not an edge case.
-- ---------------------------------------------------------------------------
drop policy if exists "invites_select_self_or_parent" on invites;
create policy "invites_select_self_or_parent" on invites
  for select to authenticated
  using (email = lower(auth.email()) or is_parent());

create policy "invites_delete_self" on invites
  for delete to authenticated
  using (email = lower(auth.email()));
