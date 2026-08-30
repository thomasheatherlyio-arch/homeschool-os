import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type FamilyMember = {
  id: string
  name: string
  role: 'parent' | 'child'
}

// Actions are reachable directly via POST, not just through a page's UI, so
// every action re-checks the session itself rather than trusting that only a
// signed-in user could have rendered the form. See the Next.js Server
// Actions security guidance.
export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return { supabase, user }
}

// Same as requireUser, but also loads the caller's family_members row (name,
// role) — most pages/actions need this to know who's asking, not just that
// someone is signed in.
export async function requireFamilyMember() {
  const { supabase, user } = await requireUser()

  const { data: member } = await supabase
    .from('family_members')
    .select('id, name, role')
    .eq('id', user.id)
    .maybeSingle<FamilyMember>()

  if (!member) redirect('/login?error=Account+not+set+up+yet')

  return { supabase, user, member }
}

export async function requireParent() {
  const ctx = await requireFamilyMember()
  if (ctx.member.role !== 'parent') redirect('/dashboard')
  return ctx
}

// Guards against an open redirect: a `next` value must be a same-origin,
// in-app path (starts with a single `/`, not `//` which browsers treat as
// protocol-relative to an attacker-controlled host) or it's discarded in
// favor of the fallback. Used anywhere a `next` query param feeds a
// redirect — /login's forms and /auth/callback both funnel through this
// rather than trusting the raw query string.
export function safeRedirectPath(next: string | null | undefined, fallback = '/dashboard'): string {
  if (!next) return fallback
  if (!next.startsWith('/') || next.startsWith('//')) return fallback
  return next
}

// Milestone 1 has exactly one student in practice, so "which student's
// dashboard" resolves to: yourself if you're the child, otherwise the first
// child family member on record. Once a second kid exists this needs a real
// student switcher — noted here so that's not a surprise later.
export async function resolveTargetStudentId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  member: FamilyMember
): Promise<string | null> {
  if (member.role === 'child') return member.id

  const { data } = await supabase
    .from('family_members')
    .select('id')
    .eq('role', 'child')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle<{ id: string }>()

  return data?.id ?? null
}

// The Monday of the current week, as a YYYY-MM-DD date string, in the
// server's local time. Good enough for a 2-user personal app; if the server
// and Thomas's timezone ever disagree near midnight, a mission could land in
// the wrong week — worth revisiting with a stored timezone preference if that
// ever actually happens.
export function currentWeekMonday(): string {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday)
  return monday.toISOString().slice(0, 10)
}
